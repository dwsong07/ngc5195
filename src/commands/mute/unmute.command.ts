import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../types";
import permission from "../permission";
import unmute from "./util";

export default {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Unmute a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("user").setRequired(true)
        ),
    async execute(interaction) {
        try {
            if (!(await permission(interaction, "MANAGE_ROLES"))) return;

            const member = interaction.options.getMember(
                "user"
            )! as GuildMember;

            if (
                !(await unmute(
                    interaction.client.db,
                    member,
                    interaction.guild?.id as string
                ))
            )
                return interaction.reply("The user isn't muted.");

            interaction.reply(`${userMention(member.id)} has been unmuted.`);
        } catch (err) {
            console.error(err);
            interaction.reply("Error occurred!");
        }
    },
} as Command;
