import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function partialEncode(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

app.get("/search", (req, res) => {
    const q = partialEncode(req.query.q || "");
    res.send(`
        <!doctype html><html>
        <head><title>Aran360 — Search</title><link rel="stylesheet" href="/style.css"></head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔍 Product Search</h1>
                    <p class="subtitle">Search our catalog below</p>
                </div>
                <div class="card">
                    <form action="/search" method="GET" class="search-form">
                        <input type="text" name="q" value="${q}" placeholder="Search products..." class="input" autocomplete="off"/>
                        <button type="submit" class="btn">Search</button>
                    </form>
                    ${q ? `<p class="result-text">You searched for: ${q}</p><div class="no-results">No products found.</div>` : ""}
                </div>
            </div>
        </body></html>
    `);
});

app.get("/", (req, res) => res.redirect("/search"));
app.listen(3000, () => console.log("xss-reflected-2 running"));
