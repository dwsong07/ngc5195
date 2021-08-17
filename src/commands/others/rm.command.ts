import { SlashCommandBuilder } from "@discordjs/builders";
import { NewsChannel, TextChannel, GuildMember } from "discord.js";
import { Command } from "../../types";

export default {
    data: new SlashCommandBuilder()
        .setName("rm")
        .setDescription("메세지 대량학살")
        .addIntegerOption((option) =>
            option
                .setName("수")
                .setDescription("지울 메세지 개수")
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            if (
                !(interaction.member as GuildMember).permissions.has(
                    "MANAGE_MESSAGES"
                )
            )
                return interaction.reply("권한이 없습니다.");

            const num = interaction.options.getInteger("수")!;
            if (num <= 0) return interaction.reply("자연수..");

            const { size } = await (
                interaction.channel! as TextChannel | NewsChannel
            ).bulkDelete(num);

            interaction.reply(`${size}개의 메세지를 삭제했습니다.`);
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
