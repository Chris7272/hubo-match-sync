import { download } from "./download.js";
import { parseLiga } from "./clubee.js";

const url =
  "https://www.clubee.com/handballbelgium/u18-m--982070v4/leagues/18738/seasons/220";

await download(
  url,
  "data/j18.html"
);

await parseLiga(
  "data/j18.html",
  "data/j18.json"
);
