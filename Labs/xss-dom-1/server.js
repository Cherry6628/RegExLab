import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/search", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(3000, () => console.log("xss-dom-1 running"));
