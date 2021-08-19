import { SlashCommandBuilder, time, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import ms from "ms";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("mute a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("user").setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("ex) 10m, 2h, 7d")
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "MANAGE_ROLES"))) return;

            const member = interaction.options.getMember(
                "user"
            )! as GuildMember;
            const timeInput = interaction.options.getString("time")!;

            if (isNaN(ms(timeInput)))
                return interaction.reply("The time you inputed isn't valid.");

            const ids = await interaction.client.db.all(
                "SELECT user_id FROM muted WHERE user_id = ? AND server_id = ?",
                member.id,
                interaction.guild?.id
            );

            if (ids.length)
                return interaction.reply("The user is already muted.");

            const mutedRole = interaction.guild?.roles.cache.find(
                (role) => role.name === "Muted"
            );

            if (!mutedRole)
                return interaction.reply("I can't find Muted role!");

            member.roles.add(mutedRole.id);

            const expireTime = new Date();
            expireTime.setMilliseconds(
                expireTime.getMilliseconds() + ms(timeInput)
            );
            const expireUnixTime = Math.floor(expireTime.getTime() / 1000);

            await interaction.client.db.run(
                "INSERT INTO muted(user_id, expire_time, server_id, timestamp) VALUES(?, ?, ?, strftime('%s','now'))",
                member.id,
                expireUnixTime,
                interaction.guild?.id
            );

            interaction.reply(
                `${userMention(member.id)} has been muted. (until ${time(
                    expireUnixTime
                )})`
            );
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
