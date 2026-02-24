import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const db = new sqlite3.Database("./db.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL
    )
  `);
});

app.post("/api/message", (req, res) => {
  const { content } = req.body;
  db.run("INSERT INTO messages (content) VALUES (?)", [content]);
  res.json({ status: "saved" });
});

app.get("/api/messages", (req, res) => {
  db.all("SELECT * FROM messages", [], (err, rows) => {
    res.json(rows);
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
