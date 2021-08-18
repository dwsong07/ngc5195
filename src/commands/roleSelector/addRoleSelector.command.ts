import { SlashCommandBuilder } from "@discordjs/builders";
import { Role } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("add_role_selector")
        .setDescription("Add role selector")
        .addStringOption((option) =>
            option
                .setName("message_id")
                .setDescription("Message Id")
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option.setName("role").setDescription("Role").setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("emoji")
                .setDescription("Emoji to react")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("is_one_time")
                .setDescription(
                    "if you want it not to remove role when you unreact"
                )
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "MANAGE_ROLES"))) return;

            const messageId = interaction.options.getString("message_id")!;
            const role = interaction.options.getRole("role")! as Role;
            const emoji = interaction.options.getString("emoji")!;
            const isOneTime =
                interaction.options.getBoolean("is_one_time") ?? false;

            const message = await interaction.channel?.messages
                .fetch(messageId)
                .catch(() => {
                    interaction.reply("Wrong message id..");
                });

            if (!message) return;

            const roleSelectorTable = await interaction.client.db.all(
                "SELECT id FROM role_selector WHERE msg_id = ? AND emoji_id = ?",
                messageId,
                emoji
            );

            if (roleSelectorTable.length) {
                return interaction.reply("That roleSelector already exists!");
            }

            const reaction = await message?.react(emoji).catch(() => {
                interaction.reply("Seems like the emoji is not valid");
            });

            if (!reaction) return;

            await interaction.client.db.run(
                "INSERT INTO role_selector(msg_id, emoji_id, role_id, is_one_time, guild_id) VALUES(?, ?, ?, ?, ?)",
                message?.id,
                emoji,
                role.id,
                isOneTime,
                interaction.guild?.id
            );

            interaction.reply("The roleSelector is added!");
        } catch (err) {
            console.error(err);
            interaction.reply("Error occured!");
        }
    },
} as Command;
