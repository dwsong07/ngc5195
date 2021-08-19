import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("user").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("reason")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "BAN_MEMBERS"))) return;

            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason")!;

            await interaction.guild?.members.ban(user!, { reason });
            interaction.reply(`${userMention(user!.id)} has been banned.`);
        } catch (err) {
            console.error(err);
            interaction.reply("Error occured!");
        }
    },
} as Command;
