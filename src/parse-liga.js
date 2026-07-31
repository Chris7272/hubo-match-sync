import fs from "fs/promises";

function unescapeJson(text) {
  return text
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\\//g, "/");
}

export async function parseLiga(htmlFile, outputFile) {

  const html = await fs.readFile(htmlFile, "utf8");

  const games = [];

  const regex =
    /\{"team1":\{[\s\S]*?"venue_name":"(.*?)"[\s\S]*?"venue_city":"(.*?)"[\s\S]*?"id":(\d+)[\s\S]*?\}/g;

  let match;

  while ((match = regex.exec(html)) !== null) {

    const start = match.index;

    let depth = 0;
    let end = start;

    for (; end < html.length; end++) {

      if (html[end] === "{") depth++;
      if (html[end] === "}") depth--;

      if (depth === 0) {
        end++;
        break;
      }

    }

    try {

      const object = JSON.parse(
        unescapeJson(
          html.substring(start, end)
        )
      );

      games.push({

        id: object.id,

        date: object.start_date,

        home: object.team1?.name,

        away: object.team2?.name,

        venue: object.venue_name,

        address: object.venue_address,

        city: object.venue_city,

        zip: object.venue_zip,

        gameDay: object.game_day,

        competition: object.competition?.name,

        phase: object.phase?.name,

        cancelled: object.cancelled

      });

    } catch (e) {

      // skip

    }

  }

  console.log(`Found ${games.length} games`);

  await fs.writeFile(
    outputFile,
    JSON.stringify(games, null, 2)
  );

}
