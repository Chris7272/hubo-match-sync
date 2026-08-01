import { downloadPage } from "./download.js";
import { parseClubee } from "./parse-clubee.js";

const url =
  "https://www.clubee.com/handballbelgium/u18-m--982070v4/leagues/18738/seasons/220";

await downloadPage(
  url,
  "data/j18.html"
);

await parseClubee(
    "data/j18.html",
    "data/j18.json",
    "J18"
);

console.log("Finished.");
