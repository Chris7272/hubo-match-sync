import { downloadPage } from "./download.js";
import { parseLiga } from "./parse-liga.js";

const url =
"https://www.clubee.com/handballbelgium/liga-heren-1-982065v4/leagues/18707/seasons/220";

await downloadPage(
    url,
    "data/liga.html"
);

await parseLiga(
    "data/liga.html",
    "data/liga.json"
);

console.log("Finished.");
