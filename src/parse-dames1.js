import { downloadPage } from "./download.js";
import { parseClubee } from "./parse-clubee.js";

const url =
  "https://www.clubee.com/handballbelgium/first-division-f--982002v4/leagues/18704/seasons/220";

await downloadPage(
  url,
  "data/dames1.html"
);

await parseClubee(
    "data/dames1.html",
    "data/dames1.json",
    "Dames 1"
);

console.log("Finished.");
