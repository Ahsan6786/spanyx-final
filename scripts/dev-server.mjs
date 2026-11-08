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
    // Port is either not in use or lsof returned 1
  }
  return [];
}

async function start() {
  console.log('\n[Spanyx Dev Server] Initializing process guardian...');

  // 1. Check PID lockfile
  if (fs.existsSync(PID_FILE)) {
    try {
      const existingPid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
      if (existingPid && !isNaN(existingPid)) {
        let isRunning = false;
        try {
          // kill(pid, 0) checks if process exists without sending a signal
          process.kill(existingPid, 0);
          isRunning = true;
        } catch {
          isRunning = false;
        }

        if (isRunning && existingPid !== process.pid) {
          console.warn(`[Spanyx Dev Server] Detected existing active dev process (PID ${existingPid}). Terminating to prevent concurrent .next corruption...`);
          try {
            process.kill(existingPid, 'SIGTERM');
            // Give it 1 second to exit
            await new Promise((r) => setTimeout(r, 1000));
          } catch (err) {
            console.error(`[Spanyx Dev Server] Failed to terminate existing process ${existingPid}:`, err.message);
          }
        }
      }
    } catch {
      // Stale or corrupted pidfile
    }
    try {
      fs.unlinkSync(PID_FILE);
    } catch {}
  }

  // 2. Strict Port Availability Check (Port 9001)
  const isAvailable = await checkPortAvailability(PORT);
  if (!isAvailable) {
    const occupyingPids = getProcessOnPort(PORT);
    if (occupyingPids.length > 0) {
      console.warn(`[Spanyx Dev Server] Port ${PORT} is currently occupied by PID(s): ${occupyingPids.join(', ')}.`);
      console.log(`[Spanyx Dev Server] Attempting safe shutdown of stale processes on port ${PORT}...`);
      for (const p of occupyingPids) {
        try {
          process.kill(p, 'SIGTERM');
        } catch {}
      }
      await new Promise((r) => setTimeout(r, 600));

      for (const p of occupyingPids) {
        try {
          process.kill(p, 0); // check if alive
          process.kill(p, 'SIGKILL'); // force kill if still lingering
        } catch {}
      }
      await new Promise((r) => setTimeout(r, 600));

      const recheck = await checkPortAvailability(PORT);
      if (!recheck) {
        console.error(`\n[CRITICAL ERROR] Port ${PORT} could not be freed.`);
        console.error(`Strict requirement: Development server must run exclusively on port ${PORT}.`);
        console.error(`Automatic silent port-switching is disabled to prevent cache corruption.`);
        console.error(`Please stop the process using port ${PORT} manually: kill -9 ${occupyingPids.join(' ')}\n`);
        process.exit(1);
      }
    } else {
      console.error(`\n[CRITICAL ERROR] Port ${PORT} is unavailable.`);
      console.error(`Please verify network port permissions and ensure port ${PORT} is open.\n`);
      process.exit(1);
    }
  }

  // 3. Write our PID to lockfile
  fs.writeFileSync(PID_FILE, String(process.pid));

  const cleanup = () => {
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
  process.on('exit', cleanup);

  console.log(`[Spanyx Dev Server] Port ${PORT} verified free. Launching Next.js on http://localhost:${PORT}...`);

  // 4. Launch Next.js dev server explicitly bound to port 9001
  const nextBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'next');
  const child = spawn(nextBin, ['dev', '-p', String(PORT)], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: String(PORT),
    },
  });

  child.on('close', (code) => {
    cleanup();
    process.exit(code || 0);
  });
}

start().catch((err) => {
  console.error('[Spanyx Dev Server] Fatal initialization error:', err);
  process.exit(1);
});
