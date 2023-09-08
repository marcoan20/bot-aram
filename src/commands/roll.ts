import { CommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as fs from 'node:fs';
import { items } from "../data/items";
import { champions } from "../data/champions";
import { speels } from "../data/speels";
import puppeteer from 'puppeteer'

export const data = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Escolhe um campeão aleatório e mostra a build/runas trolls')
    .toJSON()

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox',], executablePath: '/usr/bin/chromium-browser' });
    const page = await browser.newPage();

    page.setViewport({ width: 1280, height: 720 });
    await page.goto('https://www.ultimate-bravery.net/Classic');
    await page.evaluate(() => {
        localStorage.setItem('classic_options', '{"map":12,"level":400,"roles":[0,1,2,3,4],"language":"en","champions":[266,103,84,166,12,32,34,1,523,22,136,268,432,200,53,63,201,51,164,69,31,42,122,131,119,36,245,60,28,81,9,114,105,3,41,86,150,79,104,887,120,74,420,39,427,40,59,24,126,202,222,145,429,43,30,38,55,10,141,85,121,203,240,96,897,7,64,89,876,127,236,117,99,54,90,57,11,902,21,62,82,25,950,267,75,111,518,76,895,56,20,2,61,516,80,78,555,246,133,497,33,421,526,888,58,107,92,68,13,360,113,235,147,875,35,98,102,27,14,15,72,37,16,50,517,134,223,163,91,44,17,412,18,48,23,4,29,77,6,110,67,45,161,711,254,234,112,8,106,19,498,101,5,157,777,83,350,154,238,221,115,26,142,143]}');
    });
    await page.goto('https://www.ultimate-bravery.net/Classic');
    await page.waitForSelector('.ub-items');

    await page.screenshot({
        path: `./${interaction.user.username}${Date.now}.png`,
        clip: { x: 0, y: 190, width: 700, height: 500 }
    });

    await interaction.editReply({content:interaction.user.toString(), files: [`./${interaction.user.username}${Date.now}.png`] });

    await browser.close();

    fs.unlink(`./${interaction.user.username}${Date.now}.png`, (err) => {
        if (err) {
            console.error(err)
            return
        }
    });

}

function roll() {
    let bootsAllowed = true;
    let randomSpeels: string[] = [];
    const randomItems: string[] = [];

    const randomChampion = champions[Math.floor(Math.random() * champions.length)];
    if (randomChampion == "Cassiopeia") bootsAllowed = false;


    while (randomSpeels.length <= 1) {
        const speel = speels[Math.floor(Math.random() * speels.length)];
        if (!randomSpeels.includes(speel)) {
            randomSpeels.push(speel);
        }
    }

    const numberOfItems = bootsAllowed ? 4 : 5;
    randomItems.push(items.boots[Math.floor(Math.random() * items.boots.length)]);
    randomItems.push(items.mythicItems[Math.floor(Math.random() * items.mythicItems.length)]);
    while (randomItems.length <= numberOfItems) {
        const randomIndex = Math.floor(Math.random() * items.legendaryItems.length);
        const item = items.legendaryItems[randomIndex];
        if (!randomItems.includes(item)) {
            randomItems.push(item);
        }
    }
    return {
        randomSpeels,
        randomChampion,
        randomItems,
    }
}

