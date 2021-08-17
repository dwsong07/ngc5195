import { Database } from "sqlite";

export async function warnUser(
    db: Database,
    userId: string,
    count: number,
    serverId: string,
    reason?: string
) {
    await db.run(
        "INSERT INTO warned(user_id, count, reason, server_id, timestamp) VALUES(?, ?, ?, ?, strftime('%s', 'now'))",
        userId,
        count,
        reason,
        serverId
    );
}

export async function getTotalWarn(
    db: Database,
    userId: string,
    serverId: string
): Promise<number> {
    const result = await db.all(
        "SELECT sum(count) FROM warned WHERE user_id = ? AND server_id = ?",
        userId,
        serverId
    );

    return result[0]["sum(count)"];
}
