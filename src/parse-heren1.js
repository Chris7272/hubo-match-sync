import { downloadPage } from "./download.js";
import { parseLiga } from "./clubee.js";

const url =
  "https://www.clubee.com/handballbelgium/first-division-m--982001v4/leagues/18702/seasons/220";

await downloadPage(
  url,
  "data/heren1.html"
);

await parseLiga(
  "data/heren1.html",
  "data/heren1.json"
);
