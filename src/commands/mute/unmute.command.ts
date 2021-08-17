import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import unmute from "./util";

export default {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("유저를 뮤트 해제합니다.")
        .addUserOption((option) =>
            option.setName("유저").setDescription("유저").setRequired(true)
        ),
    async execute(interaction) {
        try {
            if (interaction.channel?.type === "DM")
                return interaction.reply("DM 채널에서는 사용할 수 없습니다.");

            if (
                !(interaction.member as GuildMember).permissions.has(
                    "MANAGE_ROLES"
                )
            )
                return interaction.reply("권한이 없습니다.");

            const member = interaction.options.getMember(
                "유저"
            )! as GuildMember;

            if (
                !(await unmute(
                    interaction.client.db,
                    member,
                    interaction.guild?.id as string
                ))
            )
                return interaction.reply("뮤트되어 있지 않습니다.");

            interaction.reply(
                `${userMention(member.id)}님을 뮤트 해제 했습니다.`
            );
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
