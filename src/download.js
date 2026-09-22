import fs from "fs/promises";
import { chromium } from "playwright";

export async function downloadPage(url, outputFile) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/139.0.0.0 Safari/537.36",
  });

  console.log(`Opening ${url}`);

  let html = "";
  let successful = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`Attempt ${attempt}/3`);

    try {
      await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60000,
      });

      await page.waitForTimeout(3000);

      html = await page.content();

      const hasGames =
        html.includes('\\"games\\":[{') ||
        html.includes('"games":[{');

      console.log(`HTML size: ${html.length}`);
      console.log(`Games data present: ${hasGames}`);

      if (hasGames) {
        successful = true;
        break;
      }

      if (attempt < 3) {
        console.log("No games data found. Retrying...");
        await page.waitForTimeout(3000);
      }
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt === 3) {
        await browser.close();
        throw error;
      }
    }
  }

  if (!successful) {
    await browser.close();

    throw new Error(
      `Clubee did not return game data after 3 attempts for ${url}`
    );
  }

  await fs.mkdir("data", { recursive: true });
  await fs.writeFile(outputFile, html);

  console.log(`Saved ${outputFile}`);

  await browser.close();

  return html;
}
