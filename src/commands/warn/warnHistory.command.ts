import { SlashCommandBuilder, time } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../types";

export default {
    data: new SlashCommandBuilder()
        .setName("warn_history")
        .setDescription("Get warn history")
        .addUserOption((option) =>
            option.setName("user").setDescription("user")
        ),
    async execute(interaction) {
        try {
            if (interaction.channel?.type === "DM")
                return interaction.reply(
                    "You can't use this command in DM channel"
                );

            const user =
                interaction.options.getUser("user") ?? interaction.user;

            const warned = await interaction.client.db.all(
                "SELECT count, timestamp, reason FROM warned WHERE user_id = ? AND server_id = ?",
                user.id,
                interaction.guild?.id as string
            );

            const totalWarn = warned.reduce(
                (prev, curr) => prev + curr.count,
                0
            );

            const embed = new MessageEmbed()
                .setTitle(`${user.tag}'s warn history`)
                .setDescription(`total: ${totalWarn}`)
                .addFields(
                    warned.map((item) => ({
                        name: `${time(item.timestamp)}`,
                        value: `${
                            item.count > 0
                                ? "**warn** num: "
                                : "**unwarn** num: "
                        } ${Math.abs(item.count)}\nreason: ${
                            item.reason || "(none)"
                        }`,
                    }))
                );

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
