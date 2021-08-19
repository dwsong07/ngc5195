import { SlashCommandBuilder } from "@discordjs/builders";
import { NewsChannel, TextChannel, GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("rm")
        .setDescription("Kill messages")
        .addIntegerOption((option) =>
            option
                .setName("num")
                .setDescription("how many you will kill")
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "MANAGE_MESSAGES"))) return;

            const num = interaction.options.getInteger("num")!;
            if (num <= 0) return interaction.reply("wtf?");

            const { size } = await (
                interaction.channel! as TextChannel | NewsChannel
            ).bulkDelete(num);

            interaction.reply(`Killed ${size} messages`);
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
