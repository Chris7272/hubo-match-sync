import fs from "fs/promises";
import { chromium } from "playwright";

const url =
  "https://www.clubee.com/handballbelgium/liga-heren-1-982065v4/leagues/18707/seasons/220";

console.log("Launching browser...");

const browser = await chromium.launch({
  headless: true
});

const page = await browser.newPage();

console.log("Opening page...");
await page.goto(url, {
  waitUntil: "networkidle",
  timeout: 60000
});

console.log("Waiting 3 seconds...");
await page.waitForTimeout(3000);

const html = await page.content();

await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/liga.html", html);

console.log(`Saved ${html.length} characters`);

await browser.close();
