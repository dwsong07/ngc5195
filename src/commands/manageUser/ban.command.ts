import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("사용자를 밴합니다.")
        .addUserOption((option) =>
            option.setName("유저").setDescription("유저").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("사유").setDescription("사유")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "BAN_MEMBERS"))) return;

            const user = interaction.options.getUser("유저");
            const reason = interaction.options.getString("사유")!;

            await interaction.guild?.members.ban(user!, { reason });
            interaction.reply(`${userMention(user!.id)}님을 밴했습니다.`);
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
