import express from "express";
import cookieParser from "cookie-parser";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./data/db.db");
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`INSERT OR IGNORE INTO comments (id, author, content) VALUES
        (1, 'alice', 'Great post! Really helpful.'),
        (2, 'bob', 'Thanks for sharing this.')`);
});

app.get("/xss-fired", (req, res) => {
    res.cookie("lab_solved", "true", { httpOnly: true, sameSite: "Strict" });
    res.json({ status: "ok" });
});

app.post("/complete", (req, res) => {
    if (req.cookies?.lab_solved !== "true") {
        return res.status(403).json({ error: "Lab not solved yet" });
    }
    res.json({ status: "completed" });
});

app.get("/api/comments", (req, res) => {
    db.all("SELECT * FROM comments ORDER BY created_at ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(rows);
    });
});

app.post("/api/comment", (req, res) => {
    const { author, content } = req.body;
    if (!author || !content) return res.status(400).json({ error: "Missing fields" });
    db.run("INSERT INTO comments (author, content) VALUES (?, ?)", [author, content], function(err) {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ status: "saved", id: this.lastID });
    });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(3000, () => console.log("xss-stored-1 running"));
