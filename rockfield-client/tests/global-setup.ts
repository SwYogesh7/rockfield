import type { FullConfig } from '@playwright/test';

// Health check: make sure the server on the test port is actually this app.
//
// Playwright runs globalSetup after its webServer step, i.e. after it has either started the dev
// server or decided to reuse whatever is already listening on the port (reuseExistingServer).
// Without this check, any other process answering on that port would be reused silently and the
// tests would fail in confusing ways. Here we fail fast with a clear message instead.
const HEALTH_PATH = '/shop';
const EXPECTED_TITLE = 'Shop All | Rockfield Footwear';
const TIMEOUT_MS = 60_000; // the first request to a cold dev server compiles the page

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) throw new Error('Health check: no baseURL configured in playwright.config.ts');
  const url = new URL(HEALTH_PATH, baseURL).toString();

  let status: number;
  let html: string;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    status = res.status;
    html = await res.text();
  } catch (error) {
    throw new Error(`Health check failed: could not load ${url} (${(error as Error).message})`);
  }

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
  if (status !== 200 || !title?.includes(EXPECTED_TITLE)) {
    throw new Error(
      [
        `Health check failed: ${url} does not look like the Rockfield app.`,
        `  Expected: HTTP 200 with a <title> containing "${EXPECTED_TITLE}"`,
        `  Got:      HTTP ${status}, <title> ${title ? JSON.stringify(title) : '(none)'}`,
        `Another process is probably using port ${new URL(baseURL).port}. ` +
          'Stop it, or change PORT in playwright.config.ts.',
      ].join('\n')
    );
  }
}
