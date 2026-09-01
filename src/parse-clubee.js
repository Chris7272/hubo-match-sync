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

function normalizeVenue(venue) {
    if (!venue) return "";

    const normalized = venue.trim().toLowerCase();

    if (normalized.includes("alverberg")) {
        return "Alverberg";
    }

    if (normalized.includes("eburons")) {
        return "Eburons Dome";
    }

    return venue.trim();
}

function normalizeDate(date) {
    if (!date) return "";

    /*
     * Clubee geeft voor de VHV-competities de lokale
     * Belgische wedstrijdtijd door met +00:00.
     *
     * Bijvoorbeeld:
     * 2026-09-12T20:15:00+00:00
     *
     * betekent hier 20:15 Belgische tijd, niet 22:15.
     *
     * We behouden daarom de kloktijd en bepalen de correcte
     * Belgische UTC-offset op basis van de wedstrijddatum.
     */

    const match = date.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );

    if (!match) {
        return date;
    }

    const [, year, month, day, hour, minute, second] = match;

    // Bepaal automatisch CET (+01:00) of CEST (+02:00)
    // voor de betreffende datum in België.
    const utcDate = new Date(
        Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
        )
    );

    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Brussels",
        timeZoneName: "longOffset",
    });

    const parts = formatter.formatToParts(utcDate);

    const timeZoneName = parts.find(
        part => part.type === "timeZoneName"
    );

    const offset =
        timeZoneName?.value?.replace("GMT", "") || "+01:00";

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
}

export async function parseClubee(htmlFile, outputFile, team) {

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

    console.log(`Found ${games.length} total games`);

    // Alleen HUBO-wedstrijden behouden
    const isHuboTeam = name =>
        name?.toLowerCase().includes("hubo");

    const huboGames = games.filter(g =>
        isHuboTeam(g.team1?.name) ||
        isHuboTeam(g.team2?.name)
    );

    console.log(`Found ${huboGames.length} HUBO games`);

    const result = huboGames.map(g => ({
        team,

        id: g.id,
        date: normalizeDate(g.start_date),
        gameDay: Number(g.game_day),

        home: g.team1?.name,
        away: g.team2?.name,

        venue: normalizeVenue(g.venue_name),
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
