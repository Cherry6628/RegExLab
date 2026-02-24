import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/search", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(3000, () => console.log("xss-dom-2 running"));
