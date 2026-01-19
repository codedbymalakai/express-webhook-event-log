import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const DB_PATH = "./data/app.db"
const SCHEMA_PATH = path.join(process.cwd(), "schema.sql")

export const db = new Database(DB_PATH)

export function initDb() {
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);
  console.log("✅ Database ready");
}