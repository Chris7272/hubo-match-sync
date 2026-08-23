import fs from "fs/promises";
import { chromium } from "playwright";

export async function downloadPage(url, outputFile) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  });

  console.log(`Opening ${url}`);

  const response = await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  console.log(`HTTP status: ${response?.status()}`);
  console.log(`Final URL: ${page.url()}`);
  console.log(`Page title: ${await page.title()}`);

  await page.waitForTimeout(3000);

  const html = await page.content();

  console.log(`HTML size: ${html.length}`);
  console.log(`HTML preview: ${html.substring(0, 500)}`);

  await fs.mkdir("data", { recursive: true });
  await fs.writeFile(outputFile, html);

  console.log(`Saved ${outputFile}`);

  await browser.close();

  return html;
}
