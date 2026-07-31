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

// Geef de pagina nog even tijd om volledig te renderen
await page.waitForTimeout(3000);

// Haal de volledige HTML op
const html = await page.content();

// Maak de data-map indien nodig
await fs.mkdir("data", { recursive: true });

// Bewaar de HTML
await fs.writeFile("data/liga.html", html);

console.log("HTML saved.");
console.log("HTML size:", html.length);

// Zoek naar het eerste voorkomen van "games"
const pos = html.indexOf("games");

console.log("\n===== GAMES POSITION =====");
console.log("games found at:", pos);

if (pos === -1) {
  console.log("The word 'games' was not found in the HTML.");
} else {
  console.log("\n===== CONTEXT AROUND 'games' =====\n");

  const start = Math.max(0, pos - 500);
  const end = Math.min(html.length, pos + 3000);

  console.log(html.substring(start, end));
}

await browser.close();
