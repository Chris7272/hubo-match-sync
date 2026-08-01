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
const heren1 = await readJson("data/heren1.json");
const dames1 = await readJson("data/dames1.json");
const j18 = await readJson("data/j18.json");
const shl = await readJson("data/shl.json");

// Alles samenvoegen
const activities = [
    ...liga,
    ...heren1,
    ...dames1,
    ...j18,
    ...shl
];

// Chronologisch sorteren
activities.sort((a, b) => new Date(a.date) - new Date(b.date));

// Resultaat
const output = {
    generated: new Date().toISOString(),
    count: activities.length,
    activities
};

// Wegschrijven
await fs.writeFile(
    "data/activities.json",
    JSON.stringify(output, null, 2),
    "utf8"
);

console.log(`Written data/activities.json (${activities.length} activities)`);
