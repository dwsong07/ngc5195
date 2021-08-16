import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let db: Database | undefined;

export async function dbInit() {
    try {
        db = await open({
            filename: path.join(__dirname, "../data.db"),
            driver: sqlite3.cached.Database,
        });
        console.log("SQLite Initialized");
        return db;
    } catch (err) {
        console.error(err);
        return process.exit(1);
    }
}
