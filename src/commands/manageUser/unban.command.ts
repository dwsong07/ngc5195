import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user")
        .addStringOption((option) =>
            option
                .setName("user_id")
                .setDescription("The user's id")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("reason")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "BAN_MEMBERS"))) return;

            const user = interaction.options.getString("user_id");
            const reason = interaction.options.getString("reason")!;

            const unbannedUser = await interaction.guild?.members
                .unban(user!, reason)
                .catch(() => interaction.reply("That user id doesn't exist"));

            if (!unbannedUser) return;

            interaction.reply(`**${unbannedUser.tag}** has been unbanned.`);
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
