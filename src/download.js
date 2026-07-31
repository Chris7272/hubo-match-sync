import fs from "fs/promises";
import { chromium } from "playwright";

export async function downloadPage(url, outputFile) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  console.log(`Opening ${url}`);

  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  await page.waitForTimeout(3000);

  const html = await page.content();

  await fs.mkdir("data", { recursive: true });
  await fs.writeFile(outputFile, html);

  console.log(`Saved ${outputFile}`);
  console.log(`HTML size: ${html.length}`);

  await browser.close();

  return html;
}
