import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const outputDir = 'docs/images';
const baseUrl = 'http://127.0.0.1:4200';

await mkdir(outputDir, { recursive: true });

const server = spawn(npmCommand, ['run', 'start'], {
  stdio: 'inherit',
  shell: isWindows,
  detached: !isWindows,
});

try {
  await waitForServer(baseUrl);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${baseUrl}/login`);
  await page.screenshot({ path: `${outputDir}/login.png`, fullPage: true });
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('heading', { name: 'Commercial operations dashboard' }).waitFor();
  await page.screenshot({ path: `${outputDir}/dashboard-desktop.png`, fullPage: true });
  await page.getByRole('link', { name: /Customers/ }).click();
  await page.screenshot({ path: `${outputDir}/customers-list.png`, fullPage: true });
  await page.getByRole('link', { name: /Profile/ }).click();
  await page.getByLabel('Theme').selectOption('dark');
  await page.screenshot({ path: `${outputDir}/profile-dark.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/`);
  await page.screenshot({ path: `${outputDir}/mobile-dashboard.png`, fullPage: true });
  await browser.close();
} finally {
  await stopServer(server.pid);
}

async function waitForServer(url) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 120_000) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function stopServer(pid) {
  if (!pid) return Promise.resolve();
  if (isWindows) {
    return Promise.race([
      new Promise((resolve) => {
        const child = spawn('taskkill.exe', ['/PID', String(pid), '/T', '/F'], {
          stdio: 'ignore',
          shell: true,
          windowsHide: true,
        });
        child.on('exit', () => resolve());
      }),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
  }
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    // Server already stopped.
  }
  return Promise.resolve();
}
