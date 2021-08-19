import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("user").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("reason")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "KICK_MEMBERS"))) return;

            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason")!;

            await interaction.guild?.members.kick(user!, reason);
            interaction.reply(`${userMention(user!.id)} has been kicked.`);
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
