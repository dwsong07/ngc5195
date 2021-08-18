import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("사용자를 킥합니다.")
        .addUserOption((option) =>
            option.setName("유저").setDescription("유저").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("사유").setDescription("사유")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "KICK_MEMBERS"))) return;

            const user = interaction.options.getUser("유저");
            const reason = interaction.options.getString("사유")!;

            await interaction.guild?.members.kick(user!, reason);
            interaction.reply(`${userMention(user!.id)}님을 킥했습니다.`);
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
