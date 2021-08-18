import {
    CommandInteraction,
    GuildMember,
    PermissionResolvable,
} from "discord.js";

export default async function (
    interaction: CommandInteraction,
    permission: PermissionResolvable
) {
    if (interaction.channel?.type === "DM") {
        interaction.reply("You can't use this command in DM Channel..");
        return false;
    }

    if (!(interaction.member as GuildMember).permissions.has(permission)) {
        interaction.reply("You don't have a permission to run this command!");
        return false;
    }

    return true;
}
