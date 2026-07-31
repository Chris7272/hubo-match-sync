import fs from "fs/promises";

async function readJson(file) {
    try {
        const text = await fs.readFile(file, "utf8");
        return JSON.parse(text);
    } catch {
        console.warn(`${file} niet gevonden, wordt overgeslagen.`);
        return [];
    }
}

const liga = await readJson("data/liga.json");
const shl = await readJson("data/shl.json");

// Alles samenvoegen
const activities = [
    ...liga,
    ...shl
];

// Chronologisch sorteren
activities.sort((a, b) => new Date(a.date) - new Date(b.date));

// Wegschrijven
await fs.writeFile(
    "data/activities.json",
    JSON.stringify(activities, null, 2),
    "utf8"
);

console.log(`Written data/activities.json (${activities.length} activities)`);
