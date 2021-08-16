import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("유저를 밴 해제합니다.")
        .addStringOption((option) =>
            option
                .setName("유저_아이디")
                .setDescription("유저 아이디")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("사유").setDescription("사유")
        ),
    async execute(interaction) {
        try {
            if (interaction.channel?.type === "DM")
                interaction.reply("DM 채널에서는 사용할 수 없습니다.");

            if (
                !(interaction.member as GuildMember).permissions.has(
                    "BAN_MEMBERS"
                )
            )
                return interaction.reply("권한이 없습니다.");

            const user = interaction.options.getString("유저_아이디");
            const reason = interaction.options.getString("사유")!;

            const unbannedUser = await interaction.guild?.members
                .unban(user!, reason)
                .catch(() =>
                    interaction.reply("존재하지 않는 유저 아이디입니다.")
                );

            if (!unbannedUser) return;

            interaction.reply(`${userMention(user!)}님을 밴 해제했습니다.`);
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
