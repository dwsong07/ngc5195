import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";
import { getTotalWarn, warnUser } from "./util";

export default {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("유저를 경고 해제합니다.")
        .addUserOption((option) =>
            option.setName("유저").setDescription("유저").setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("경고_해제_수")
                .setDescription("경고 해제 수")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("사유").setDescription("사유")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "BAN_MEMBERS"))) return;

            const user = interaction.options.getUser("유저")!;
            let count = interaction.options.getInteger("경고_해제_수")!;
            const reason = interaction.options.getString("사유") ?? undefined;

            if (count <= 0) return interaction.reply("자연수로 입력해주세요");

            const beforeTotalWarn = await getTotalWarn(
                interaction.client.db,
                user.id,
                interaction.guild?.id as string
            );

            // if count > beforeTotal, the afterTotal will be negative
            // to prevent negative total
            //  make count the beforeTotal if count > beforeTotal
            count = Math.min(beforeTotalWarn, count);

            await warnUser(
                interaction.client.db,
                user.id,
                -count,
                interaction.guild?.id as string,
                reason
            );

            const afterTotal = beforeTotalWarn - count;

            interaction.reply(
                `${userMention(
                    user.id
                )}님을 경고 해제 했습니다. 총 경고 수: ${afterTotal}`
            );
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
