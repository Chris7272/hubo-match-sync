import fs from "fs/promises";

const html = await fs.readFile("data/liga.html", "utf8");

console.log("HTML size:", html.length);

const pos = html.indexOf('"games":');

console.log("games found:", pos);

if (pos === -1) {
  throw new Error("games not found");
}

console.log(html.substring(pos, pos + 500));
