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

// Geef JavaScript nog even tijd
await page.waitForTimeout(3000);

// Bewaar de volledige HTML
const html = await page.content();

await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/liga.html", html);

console.log("HTML saved.");
console.log("HTML size:", html.length);

const searches = [
  '"games":',
  '"games"',
  "games",
  "__NEXT_DATA__",
  "__next_f",
  "Sporthal Vordensteyn",
  "venue_name",
  "start_date",
];

console.log("\n===== SEARCH RESULTS =====");

for (const s of searches) {
  console.log(`${s}: ${html.indexOf(s)}`);
}

await browser.close();
