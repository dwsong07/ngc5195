import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("ls_role_selector")
        .setDescription("List all roleSelector you've made"),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "MANAGE_ROLES"))) return;

            const table = await interaction.client.db.all(
                "SELECT * FROM role_selector WHERE guild_id=?",
                interaction.guild?.id
            );

            const embed = new MessageEmbed()
                .setTitle("roleSelector List")
                .addFields(
                    table.map(({ msg_id, emoji_id, role_id, is_one_time }) => ({
                        name: `${msg_id}, ${emoji_id}`,
                        value: `<@&${role_id}> ${is_one_time && "(원타임)"}`,
                    }))
                )
                .setFooter(
                    interaction.user.tag,
                    interaction.user.displayAvatarURL()
                )
                .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
