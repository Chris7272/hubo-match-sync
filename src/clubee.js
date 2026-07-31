import fs from "fs/promises";
import { chromium } from "playwright";

const url =
  "https://www.clubee.com/handballbelgium/liga-heren-1-982065v4/leagues/18707/seasons/220";

const browser = await chromium.launch({
  headless: true,
});

const page = await browser.newPage();

console.log("Opening:", url);

await page.goto(url, {
  waitUntil: "networkidle",
  timeout: 60000,
});

// Wacht nog even zodat alle JavaScript uitgevoerd is
await page.waitForTimeout(3000);

// Haal de volledige HTML op
const html = await page.content();

// Maak de data-map aan
await fs.mkdir("data", { recursive: true });

// Bewaar de HTML
await fs.writeFile("data/liga.html", html);

console.log("HTML saved.");
console.log("HTML size:", html.length);

// Zoek naar venue_name
const pos = html.indexOf("venue_name");

console.log("\n===== VENUE POSITION =====");
console.log("venue_name found at:", pos);

if (pos === -1) {
  console.log("venue_name not found.");
} else {
  const start = Math.max(0, pos - 1000);
  const end = Math.min(html.length, pos + 7000);

  console.log("\n===== CONTEXT AROUND venue_name =====\n");
  console.log(html.substring(start, end));
}

await browser.close();
