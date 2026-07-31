import fs from "fs/promises";

const url =
  "https://www.clubee.com/handballbelgium/liga-heren-1-982065v4/leagues/18707/seasons/220";

console.log("Downloading...");

const response = await fetch(url);
const html = await response.text();

await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/liga.html", html);

const start = html.indexOf('"games":[');

console.log("games found at:", start);

if (start === -1) {
  throw new Error("games array not found");
}

console.log("SUCCESS!");
