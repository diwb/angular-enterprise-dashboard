import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const npxCommand = isWindows ? 'npx.cmd' : 'npx';
const portUrl = 'http://127.0.0.1:4200';
const playwrightArgs = ['playwright', 'test', ...process.argv.slice(2)];

const server = spawn(npmCommand, ['run', 'start'], {
  stdio: 'inherit',
  shell: isWindows,
  detached: !isWindows,
});

let exitCode = 1;

try {
  await waitForServer(portUrl);
  exitCode = await run(npxCommand, playwrightArgs);
} finally {
  await stopServer(server.pid);
}

process.exit(exitCode);

async function waitForServer(url) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 120_000) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Keep polling until Angular dev server is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: isWindows });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

function stopServer(pid) {
  if (!pid) return Promise.resolve();
  if (isWindows) {
    return run('taskkill.exe', ['/PID', String(pid), '/T', '/F']).catch(() => undefined);
  }

  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    // Server already stopped.
  }
  return Promise.resolve();
}
