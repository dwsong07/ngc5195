import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { Command } from "../../types";
import { GuildMember } from "discord.js";
import { getTotalWarn, warnUser } from "./util";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("user").setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("warn_num")
                .setDescription("warn num")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("reason")
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "BAN_MEMBERS"))) return;

            const user = interaction.options.getUser("user")!;
            const count = interaction.options.getInteger("warn_num")!;
            const reason = interaction.options.getString("reason") ?? undefined;

            if (count <= 0) return interaction.reply("wtf?");

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
                    reason: "get 10 warns",
                });

                return interaction.reply(
                    `Total warn count gets over 10 so ${userMention(
                        user.id
                    )} has been banned.`
                );
            }

            interaction.reply(
                `${userMention(
                    user.id
                )} has been warned. total warn count: ${totalWarn}`
            );
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
