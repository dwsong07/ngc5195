import {
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";

export default async function (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    add: boolean
) {
    try {
        if (reaction.partial) await reaction.fetch();
        if (user.partial) await user.fetch();

        const db = reaction.message.client.db;
        const roleSelector = await db.all(
            "SELECT * FROM role_selector WHERE msg_id = ? AND emoji_id = ?",
            reaction.message.id,
            reaction.emoji.toString()
        );

        if (!roleSelector.length) return;

        const guildMember = reaction.message.guild?.members.cache.find(
            (member) => member.id === user.id
        );

        // assume roleFilterd.length === 1 becuase emoji_id is unique
        const roleId = roleSelector[0].role_id;

        if (add) {
            await guildMember?.roles.add(roleId);
        } else {
            if (roleSelector[0].is_one_time === 1) return;

            await guildMember?.roles.remove(roleId);
        }
    } catch (err) {
        return console.error(err);
    }
}
