import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
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

// encodes < > only — quotes NOT encoded, so attribute breakout works
function partialEncode(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

app.get("/search", (req, res) => {
    const q = partialEncode(req.query.q || "");
    const base = req.baseUrl;
    res.send(`<!doctype html>
<html>
<head>
    <title>Aran360 — Search</title>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Product Search</h1>
            <p class="subtitle">Search our catalog below</p>
        </div>
        <div class="card">
            <form action="${base}/search" method="GET" class="search-form">
                <input type="text" name="q" value="${q}" placeholder="Search products..." class="input" autocomplete="off"/>
                <button type="submit" class="btn">Search</button>
            </form>
            ${q ? `<p class="result-text">You searched for: ${q}</p><div class="no-results">No products found.</div>` : ""}
        </div>
        <div id="solved-banner" class="solved-banner">
            <p>🎉 Lab Solved! XSS executed successfully.</p>
        </div>
    </div>
    <script>
        const __base = "${base}";
        const __triggerCompletion = async () => {
            try {
                await fetch(window.location.pathname + "/xss-fired");
                const r = await fetch(window.location.pathname + "/complete", { method: "POST" });
                if (r.ok) {
                    await fetch("/lab/complete", { method: "POST" });
                    document.getElementById("solved-banner").style.display = "block";
                }
            } catch(e) {}
        };
        const __realAlert = window.alert.bind(window);
        window.alert = function(msg) { __realAlert(msg); __triggerCompletion(); };
        const __realConfirm = window.confirm.bind(window);
        window.confirm = function(msg) { __realConfirm(msg); __triggerCompletion(); };
        const __realPrint = window.print.bind(window);
        window.print = function() { __realPrint(); __triggerCompletion(); };
    </script>
</body>
</html>`);
});

app.get("/", (req, res) => res.redirect(req.baseUrl + "/search"));
app.listen(3000, () => console.log("xss-reflected-2 running"));
