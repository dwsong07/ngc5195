import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";
import { getTotalWarn, warnUser } from "./util";

export default {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Unwarn a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("user").setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("unwarn_num")
                .setDescription("unwarn num")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("reason")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "BAN_MEMBERS"))) return;

            const user = interaction.options.getUser("user")!;
            let count = interaction.options.getInteger("unwarn_num")!;
            const reason = interaction.options.getString("reason") ?? undefined;

            if (count <= 0) return interaction.reply("wtf?");

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
                )} has been unwarned. total warn count: ${afterTotal}`
            );
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
