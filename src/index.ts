import { Client, Intents } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import commands from "./commands";
import { token } from "../config.json";
import Button from "./components/Button";
import SelectMenu from "./components/SelectMenu";
import { dbInit } from "./db";
import muteInterval from "./muteInterval";
import roleSelector from "./roleSelector";

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ["MESSAGE", "USER", "REACTION"],
});

console.log(process.env.NODE_ENV);

client.once("ready", async () => {
    console.log("The bot is ready!");

    client.commands = commands;
    await registerSlashCommands();

    // Components init
    Button.init(client);
    SelectMenu.init(client);

    // DB Init
    const db = await dbInit();
    client.db = db;

    // Mute Interval
    muteInterval(client);

    client.user?.setActivity("어딘가에서 일하는 중");
});

async function registerSlashCommands() {
    try {
        console.log("Register slash commands");

        const rest = new REST({ version: "9" }).setToken(token);
        const clientId = client.application?.id ?? "";

        const commandDatas = commands.map((command) => command.data);

        if (process.env.NODE_ENV === "production") {
            await rest.put(Routes.applicationCommands(clientId), {
                body: commandDatas,
            });
        } else {
            for (const guild of client.guilds.cache) {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guild[0]),
                    { body: commandDatas }
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        if (!client.commands.has(interaction.commandName)) return;

        await client.commands
            .get(interaction.commandName)
            ?.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply("에러 났어요!");
    }
});

client.on("messageReactionAdd", (reaction, user) => {
    roleSelector(reaction, user, true);
});

client.on("messageReactionRemove", (reaction, user) => {
    roleSelector(reaction, user, false);
});

client.login(token);
