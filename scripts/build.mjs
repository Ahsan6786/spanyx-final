#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 9001;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DEV_PID_FILE = path.join(DATA_DIR, '.dev-server.pid');
const BUILD_PID_FILE = path.join(DATA_DIR, '.build.pid');
const NEXT_DIR = path.join(ROOT_DIR, '.next');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getProcessOnPort(port) {
  if (process.env.VERCEL || process.env.CI) {
    return [];
  }
  try {
    const out = execSync(`lsof -ti :${port} -sTCP:LISTEN`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (out) {
      return out.split('\n').map((pid) => parseInt(pid, 10)).filter(Boolean);
    }
  } catch {
    // Port is free or lsof not available
  }
  return [];
}

async function stopRunningDevServer() {
  const pids = getProcessOnPort(PORT);
  if (pids.length > 0) {
    console.warn(`\n[Spanyx Build Guardian] Active server detected on port ${PORT} (PID: ${pids.join(', ')}).`);
    console.warn('[Spanyx Build Guardian] Gracefully terminating dev processes to prevent .next chunk collision...');
    for (const pid of pids) {
      try {
        process.kill(pid, 'SIGTERM');
      } catch {}
    }
    await new Promise((r) => setTimeout(r, 800));

    // Force kill if any remaining
    const remaining = getProcessOnPort(PORT);
    for (const pid of remaining) {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {}
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  if (fs.existsSync(DEV_PID_FILE)) {
    try {
      const devPid = parseInt(fs.readFileSync(DEV_PID_FILE, 'utf8').trim(), 10);
      if (devPid && !isNaN(devPid)) {
        try {
          process.kill(devPid, 'SIGTERM');
        } catch {}
      }
      fs.unlinkSync(DEV_PID_FILE);
    } catch {}
  }
}

async function main() {
  console.log('\n[Spanyx Build Guardian] Preparing production build...');

  // 1. Ensure dev server is not concurrently accessing .next
  await stopRunningDevServer();

  // 2. Set build lock
  fs.writeFileSync(BUILD_PID_FILE, String(process.pid));

  const cleanup = () => {
    try {
      if (fs.existsSync(BUILD_PID_FILE)) {
        fs.unlinkSync(BUILD_PID_FILE);
      }
    } catch {}
  };

  process.on('SIGINT', () => {
    cleanup();
    process.exit(1);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(1);
  });
  process.on('exit', cleanup);

  // 3. Clean .next directory
  if (fs.existsSync(NEXT_DIR)) {
    console.log('[Spanyx Build Guardian] Safely removing previous build artifacts (.next)...');
    try {
      fs.rmSync(NEXT_DIR, { recursive: true, force: true });
    } catch (err) {
      console.warn('[Spanyx Build Guardian] Warning removing .next:', err.message);
    }
  }

  // 4. Launch next build
  const nextBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'next');
  console.log('[Spanyx Build Guardian] Executing Next.js production build...\n');

  const child = spawn('npx', ['next', 'build'], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  child.on('close', (code) => {
    cleanup();
    if (code === 0) {
      console.log('\n[Spanyx Build Guardian] Production build succeeded cleanly.');
    } else {
      console.error(`\n[Spanyx Build Guardian] Production build exited with code ${code}.`);
    }
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error('[Spanyx Build Guardian] Fatal error:', err);
  try {
    if (fs.existsSync(BUILD_PID_FILE)) fs.unlinkSync(BUILD_PID_FILE);
  } catch {}
  process.exit(1);
});

