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
}
