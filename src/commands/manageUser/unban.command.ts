import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";

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
            if (!(await permission(interaction, "BAN_MEMBERS"))) return;

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
