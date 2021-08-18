import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("rm_role_selector")
        .setDescription("Remove roleSelector")
        .addStringOption((option) =>
            option
                .setName("message_id")
                .setDescription("Message Id to remove")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("emoji")
                .setDescription("Emoji to remove")
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "MANAGE_ROLES"))) return;

            const messageId = interaction.options.getString("message_id")!;
            const emoji = interaction.options.getString("emoji")!;

            await interaction.client.db.run(
                "DELETE FROM role_selector WHERE msg_id = ? AND emoji_id = ?",
                messageId,
                emoji
            );

            interaction.reply("The roleSelector is removed!");
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
