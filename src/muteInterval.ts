import { Client } from "discord.js";
import unmute from "./commands/mute/util";

export default function (client: Client) {
    setInterval(async () => {
        try {
            const muted = await client.db.all(
                "SELECT user_id, server_id, expire_time FROM muted"
            );

            muted.forEach(async (item) => {
                // compare with unix time
                if (
                    Math.floor(new Date().getTime() / 1000) >= item.expire_time
                ) {
                    const user = await client.guilds?.cache
                        .get(item.server_id)
                        ?.members.fetch(item.user_id);

                    if (!user) {
                        throw Error("Server not found!");
                    }

                    await unmute(client.db, user, item.server_id);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }, 10 * 1000); // 10 sec
}
