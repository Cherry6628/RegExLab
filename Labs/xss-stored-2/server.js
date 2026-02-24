import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./data/db.db");
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        website TEXT,
        bio TEXT
    )`);
    db.run(`INSERT OR IGNORE INTO users (id, username, website, bio) VALUES
        (1, 'alice', 'https://alice.dev', 'Security researcher'),
        (2, 'bob', 'https://bob.io', 'Full stack developer')
    `);
});

app.get("/api/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(rows);
    });
});

app.post("/api/profile", (req, res) => {
    const { username, website, bio } = req.body;
    if (!username) return res.status(400).json({ error: "Missing username" });
    const safeWebsite = (website || "").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    db.run(
        "INSERT INTO users (username, website, bio) VALUES (?, ?, ?)",
        [username, safeWebsite, bio || ""],
        function (err) {
            if (err) return res.status(500).json({ error: "DB error" });
            res.json({ status: "saved", id: this.lastID });
        }
    );
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(3000, () => console.log("xss-stored-2 running"));
