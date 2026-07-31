import fs from "fs/promises";

const html = await fs.readFile("data/liga.html", "utf8");

console.log("HTML size:", html.length);

const searches = [
  '"games":',
  '"games"',
  'games',
  '__NEXT_DATA__',
  '__next_f',
  'Sporthal Vordensteyn',
  'venue_name',
  'start_date'
];

for (const s of searches) {
  console.log(`${s}:`, html.indexOf(s));
}import fs from "fs/promises";

const html = await fs.readFile("data/liga.html", "utf8");

console.log("HTML size:", html.length);

const pos = html.indexOf('"games":');

console.log("games found:", pos);

if (pos === -1) {
  throw new Error("games not found");
}

console.log(html.substring(pos, pos + 500));
