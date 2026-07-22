import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();
await page.waitForURL(/\/(tables|$)/, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(500);

await page.goto('http://localhost:5173/tables/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: '/private/tmp/claude-501/-Users-dymitrsnigurenko-Innowise/5734fa17-5eaa-43a7-9e3b-25d81bfd7f22/scratchpad/shot5.png', fullPage: true });

await browser.close();
