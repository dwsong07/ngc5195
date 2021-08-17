import { SlashCommandBuilder, time } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../types";

export default {
    data: new SlashCommandBuilder()
        .setName("warn_history")
        .setDescription("경고 히스토리를 봅니다.")
        .addUserOption((option) =>
            option.setName("유저").setDescription("유저")
        ),
    async execute(interaction) {
        try {
            if (interaction.channel?.type === "DM")
                return interaction.reply("DM 채널에서는 사용할 수 없습니다.");

            const user =
                interaction.options.getUser("유저") ?? interaction.user;

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
                .setTitle(`${user.tag}님의 경고 히스토리`)
                .setDescription(`총 경고 수: ${totalWarn}`)
                .addFields(
                    warned.map((item) => ({
                        name: `${time(new Date(item.timestamp * 1000))}`,
                        value: `${
                            item.count > 0
                                ? "**경고** 수: "
                                : "**경고 해제** 수: "
                        } ${Math.abs(item.count)}\n사유: ${
                            item.reason || "(없음)"
                        }`,
                    }))
                );

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
