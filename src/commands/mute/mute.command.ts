import { SlashCommandBuilder, time, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import ms from "ms";
import { Command } from "../../types";
import permission from "../permission";

export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("유저를 뮤트합니다.")
        .addUserOption((option) =>
            option.setName("유저").setDescription("유저").setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("시간")
                .setDescription("10m, 2h, 7d처럼")
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "MANAGE_ROLES"))) return;

            const member = interaction.options.getMember(
                "유저"
            )! as GuildMember;
            const timeInput = interaction.options.getString("시간")!;

            if (isNaN(ms(timeInput)))
                return interaction.reply("시간을 다시 입력해주세요");

            const ids = await interaction.client.db.all(
                "SELECT user_id FROM muted WHERE user_id = ? AND server_id = ?",
                member.id,
                interaction.guild?.id
            );

            if (ids.length) return interaction.reply("이미 뮤트되어 있습니다.");

            const mutedRole = interaction.guild?.roles.cache.find(
                (role) => role.name === "Muted"
            );

            if (!mutedRole) return interaction.reply("Muted 역할이 없어요!");

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
                `${userMention(member.id)}님을 뮤트했습니다. (${time(
                    expireUnixTime
                )}까지)`
            );
        } catch (err) {
            console.error(err);
            interaction.reply("에러 났어요!");
        }
    },
} as Command;
