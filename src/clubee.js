import fs from "fs/promises";

const url =
  "https://www.clubee.com/handballbelgium/liga-heren-1-982065v4/leagues/18707/seasons/220";

console.log("Downloading:", url);

const response = await fetch(url);

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const html = await response.text();

console.log(`Downloaded ${html.length} characters`);

await fs.mkdir("data", { recursive: true });

await fs.writeFile("data/liga.html", html);

console.log("Saved to data/liga.html");
