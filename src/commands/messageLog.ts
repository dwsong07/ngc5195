import { Client, Guild, MessageEmbed, TextChannel, User } from "discord.js";

export default async function (client: Client) {
    function messageEventEmbed(author: User | null) {
        const embed = new MessageEmbed()
            .setAuthor(author?.tag as string, author?.displayAvatarURL())
            .setTimestamp();

        return embed;
    }

    const getLogChannel = (guild: Guild) =>
        guild.channels.cache.find(
            (channel) =>
                channel.type === "GUILD_TEXT" &&
                (channel as TextChannel).topic === "LOG_CHANNEL"
        ) as TextChannel;

    client.on("messageDelete", (msg) => {
        if (msg.channel.type === "DM") return;

        const logChannel = getLogChannel(msg.guild!);
        if (!logChannel) return;

        const embed = messageEventEmbed(msg.author).setDescription(
            `Someone deleted \`${msg.content}\` sent by <@${msg.author?.id}> in <#${msg.channel.id}>`
        );

        logChannel.send({ embeds: [embed] });
    });

    client.on("messageUpdate", (oldMsg, newMsg) => {
        if (oldMsg.channel.type === "DM") return;

        const logChannel = getLogChannel(newMsg.guild!);
        if (!logChannel) return;

        const embed = messageEventEmbed(oldMsg.author).setDescription(
            `Someone edited \`${oldMsg.content}\` to \`${newMsg.content}\` sent by <@${oldMsg.author?.id}> in <#${oldMsg.channel.id}>`
        );

        logChannel.send({ embeds: [embed] });
    });

    client.on("messageReactionRemove", async (reaction, user) => {
        if (reaction.message.channel.type === "DM") return;

        const logChannel = getLogChannel(reaction.message.guild!);
        if (!logChannel) return;

        try {
            if (user.partial) await user.fetch();
            const { content, author } = reaction.message;

            const embed = messageEventEmbed(user as User).setDescription(
                `<@${
                    user.id
                }> unreacted ${reaction.emoji.toString()} to \`${content}\` sent by <@${
                    author?.id
                }>`
            );

            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
        }
    });
}
