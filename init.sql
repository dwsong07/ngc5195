CREATE TABLE warned(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    count INTEGER NOT NULL,
    reason TEXT,
    server_id TEXT NOT NULL
);

CREATE TABLE muted(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    timestamp INTEGER NOT NULL,
    expire_time INTEGER,
    server_id TEXT NOT NULL
);

CREATE TABLE role_selector(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    msg_id TEXT NOT NULL,
    emoji_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    is_one_time NUMBER,
    guild_id TEXT NOT NULL
);