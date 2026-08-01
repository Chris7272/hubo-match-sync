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

export async function parseLiga(htmlFile, outputFile, team) {

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
        .replace(/\\\\/g, "\\");

    const games = JSON.parse(cleanJson);
 
    console.log("=== Eerste 10 wedstrijden ===");

games.slice(0, 10).forEach(g => {
    console.log(
        `${g.team1?.name}  -  ${g.team2?.name}`
    );
});

    console.log(`Found ${games.length} total games`);

    // Alleen HUBO-wedstrijden behouden
    const huboGames = games.filter(g =>
        g.team1?.name?.includes("HUBO Handbal") ||
        g.team2?.name?.includes("HUBO Handbal")
    );

    console.log(`Found ${huboGames.length} HUBO games`);

    const result = huboGames.map(g => ({
        team,

        id: g.id,
        date: g.start_date,
        gameDay: Number(g.game_day),

        home: g.team1?.name,
        away: g.team2?.name,

        venue: g.venue_name,
        address: g.venue_address,
        zip: g.venue_zip,
        city: g.venue_city,

        competition: g.competition?.name,
        phase: g.phase?.name,

        cancelled: g.cancelled
    }));

    // Sorteer op datum
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    await fs.writeFile(
        outputFile,
        JSON.stringify(result, null, 2),
        "utf8"
    );

    console.log(`Written ${outputFile}`);
}
