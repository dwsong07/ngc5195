import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { Command } from "../../types";
import { GuildMember } from "discord.js";
import { getTotalWarn, warnUser } from "./util";

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("유저를 경고합니다.")
        .addUserOption((option) =>
            option.setName("유저").setDescription("유저").setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("경고_수")
                .setDescription("경고 수")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("사유").setDescription("사유")
        ),
    async execute(interaction) {
        try {
            if (interaction.channel?.type === "DM")
                return interaction.reply("DM 채널에서는 사용할 수 없습니다.");

            if (
                !(interaction.member as GuildMember).permissions.has(
                    "BAN_MEMBERS"
                )
            )
                return interaction.reply("권한이 없습니다.");

            const user = interaction.options.getUser("유저")!;
            const count = interaction.options.getInteger("경고_수")!;
            const reason = interaction.options.getString("사유") ?? undefined;

            if (count <= 0) return interaction.reply("자연수로 입력하세요");

            await warnUser(
                interaction.client.db,
                user.id,
                count,
                interaction.guild?.id as string,
                reason
            );

            const totalWarn = await getTotalWarn(
                interaction.client.db,
                user.id,
                interaction.guild?.id as string
            );
            if (totalWarn >= 10) {
                await interaction.guild?.members.ban(user, {
                    reason: "경고 10개 이상",
                });

                return interaction.reply(
                    `총 경고 개수가 10개 이상이므로 ${userMention(
                        user.id
                    )}님을 밴했습니다.`
                );
            }

            interaction.reply(
                `${userMention(user.id)}님을 경고 했습니다. ${totalWarn}`
            );
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
