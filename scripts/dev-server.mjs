#!/usr/bin/env node

import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 9001;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PID_FILE = path.join(DATA_DIR, '.dev-server.pid');
const BUILD_PID_FILE = path.join(DATA_DIR, '.build.pid');
const NEXT_DIR = path.join(ROOT_DIR, '.next');
const BUILD_ID_FILE = path.join(NEXT_DIR, 'BUILD_ID');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function checkPortAvailability(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });
}

function getProcessOnPort(port) {
  try {
    const out = execSync(`lsof -ti :${port} -sTCP:LISTEN`, { encoding: 'utf8' }).trim();
    if (out) {
      return out.split('\n').map((pid) => parseInt(pid, 10)).filter(Boolean);
    }
  } catch {
    // Port is either not in use or lsof returned exit code 1
  }
  return [];
}

async function terminatePids(pids) {
  for (const p of pids) {
    try {
      process.kill(p, 'SIGTERM');
    } catch {}
  }
  await new Promise((r) => setTimeout(r, 600));

  for (const p of pids) {
    try {
      process.kill(p, 0); // check if alive
      process.kill(p, 'SIGKILL'); // force kill if still lingering
    } catch {}
  }
  await new Promise((r) => setTimeout(r, 400));
}

async function start() {
  console.log('\n[Spanyx Dev Server] Initializing process guardian...');

  // 1. Check if production build is currently executing
  if (fs.existsSync(BUILD_PID_FILE)) {
    try {
      const buildPid = parseInt(fs.readFileSync(BUILD_PID_FILE, 'utf8').trim(), 10);
      if (buildPid && !isNaN(buildPid)) {
        let buildRunning = false;
        try {
          process.kill(buildPid, 0);
          buildRunning = true;
        } catch {}
        if (buildRunning) {
          console.error(`\n[CRITICAL CONFLICT] A production build (PID ${buildPid}) is currently running.`);
          console.error('[Spanyx Dev Server] Concurrent development execution would corrupt .next chunk manifests.');
          console.error('Please wait for the build process to finish.\n');
          process.exit(1);
        }
      }
    } catch {}
    try {
      fs.unlinkSync(BUILD_PID_FILE);
    } catch {}
  }

  // 2. Check and clean existing dev PID lockfile
  if (fs.existsSync(PID_FILE)) {
    try {
      const existingPid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
      if (existingPid && !isNaN(existingPid) && existingPid !== process.pid) {
        let isRunning = false;
        try {
          process.kill(existingPid, 0);
          isRunning = true;
        } catch {}

        if (isRunning) {
          console.warn(`[Spanyx Dev Server] Detected existing dev process (PID ${existingPid}). Terminating...`);
          await terminatePids([existingPid]);
        }
      }
    } catch {}
    try {
      fs.unlinkSync(PID_FILE);
    } catch {}
  }

  // 3. Strict Port Availability Check (Port 9001)
  const isAvailable = await checkPortAvailability(PORT);
  if (!isAvailable) {
    const occupyingPids = getProcessOnPort(PORT);
    if (occupyingPids.length > 0) {
      console.warn(`[Spanyx Dev Server] Port ${PORT} is occupied by PID(s): ${occupyingPids.join(', ')}. Terminating...`);
      await terminatePids(occupyingPids);

      const recheck = await checkPortAvailability(PORT);
      if (!recheck) {
        console.error(`\n[CRITICAL ERROR] Port ${PORT} could not be freed.`);
        console.error(`Strict requirement: Development server must run exclusively on port ${PORT}.`);
        console.error(`Please stop the process manually: kill -9 ${occupyingPids.join(' ')}\n`);
        process.exit(1);
      }
    } else {
      console.error(`\n[CRITICAL ERROR] Port ${PORT} is unavailable.`);
      process.exit(1);
    }
  }

  // 4. PREVENT CHUNK DESYNCHRONIZATION:
  // If .next contains production artifacts (BUILD_ID exists), clean it to guarantee a pristine dev compiler state
  if (fs.existsSync(BUILD_ID_FILE)) {
    console.log('[Spanyx Dev Server] Detected production build artifacts (.next/BUILD_ID).');
    console.log('[Spanyx Dev Server] Resetting .next to pristine development state to eliminate missing chunk collisions (e.g. ./3897.js)...');
    try {
      fs.rmSync(NEXT_DIR, { recursive: true, force: true });
    } catch (err) {
      console.warn('[Spanyx Dev Server] Warning resetting .next:', err.message);
    }
  }

  // 5. Write current PID to lockfile
  fs.writeFileSync(PID_FILE, String(process.pid));

  let childProcess = null;

  const cleanup = () => {
    if (childProcess && childProcess.pid) {
      try {
        // Kill the process group to ensure worker threads / next-server processes terminate
        process.kill(-childProcess.pid, 'SIGTERM');
      } catch {
        try {
          process.kill(childProcess.pid, 'SIGTERM');
        } catch {}
      }
    }
    try {
      if (fs.existsSync(PID_FILE)) {
        fs.unlinkSync(PID_FILE);
      }
    } catch {}
  };

  process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });
  process.on('SIGHUP', () => {
    cleanup();
    process.exit(0);
  });
  process.on('exit', cleanup);

  console.log(`[Spanyx Dev Server] Port ${PORT} verified free. Launching Next.js on http://localhost:${PORT}...`);

  // 6. Launch Next.js dev server explicitly bound to port 9001
  const nextBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'next');
  childProcess = spawn(nextBin, ['dev', '-p', String(PORT)], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    detached: true,
    env: {
      ...process.env,
      PORT: String(PORT),
    },
  });

  childProcess.on('close', (code) => {
    cleanup();
    process.exit(code || 0);
  });
}

start().catch((err) => {
  console.error('[Spanyx Dev Server] Fatal initialization error:', err);
  process.exit(1);
});
