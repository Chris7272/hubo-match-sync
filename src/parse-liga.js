import fs from "fs/promises";

function extractArray(text, startPos) {
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = startPos; i < text.length; i++) {
        const c = text[i];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (c === "\\") {
            escaped = true;
            continue;
        }

        if (c === '"') {
            inString = !inString;
            continue;
        }

        if (inString) continue;

        if (c === "[") depth++;

        if (c === "]") {
            depth--;

            if (depth === 0) {
                return text.substring(startPos, i + 1);
            }
        }
    }

    throw new Error("Games array not closed.");
}

export async function parseLiga(htmlFile, outputFile) {

    const html = await fs.readFile(htmlFile, "utf8");

   const key = '\\"games\\":[';

    const pos = html.indexOf(key);

    if (pos === -1) {
        throw new Error("Games array not found.");
    }

    const arrayStart = pos + key.length - 1;

    const jsonArray = extractArray(html, arrayStart);

const cleanJson = jsonArray
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

const games = JSON.parse(cleanJson);

    console.log(`Found ${games.length} games`);

    const result = games.map(g => ({

        id: g.id,

        date: g.start_date,

        home: g.team1?.name,

        away: g.team2?.name,

        venue: g.venue_name,

        address: g.venue_address,

        zip: g.venue_zip,

        city: g.venue_city,

        gameDay: g.game_day,

        phase: g.phase?.name,

        competition: g.competition?.name,

        cancelled: g.cancelled

    }));

    await fs.writeFile(
        outputFile,
        JSON.stringify(result, null, 2)
    );

    console.log(`Written ${outputFile}`);

}
