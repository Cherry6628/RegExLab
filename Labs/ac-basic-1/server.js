import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: "lab-secret",
        resave: false,
        saveUninitialized: true,
    }),
);
const users = {
    attacker: { password: "attacker123", role: "user", userId: 123414 },
    admin: { password: "AdminPass123!", role: "admin", userId: 123415 },
};
const notes = {
    123414: {
        "Note 1": ["This is default text - Lorem Ipsum"],
        "Weekend Party": ["I went to Party", "Had a great fun"],
    },
    123415: {
        Credentials: [
            "Account Username: admin",
            "Account Password: AdminPass123!",
        ],
    },
};
const baseScript = `<script>const __base = window.location.pathname.split("/").slice(0,-1).join("/");</script>`;
app.get("/", (req, res) => {
    res.send(
        "<script>window.location.href=window.location.pathname+'/login'</script>",
    );
});
app.get("/session-status", (req, res) => {
    if (!req.session.user) return res.json({ user: null });
    const user = users[req.session.user];
    res.json({
        user: req.session.user,
        role: user.role,
        userId: user.userId,
    });
});
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});
app.get("/login", (req, res) => {
    res.send(`<!doctype html>
<html>
<head>
<title>User IDOR Lab — Login</title>
<style>
body { font-family: Arial; background:#f0f2f5; display:flex; justify-content:center; align-items:center; height:100vh; }
.card { background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); width:320px; display:flex; flex-direction:column; gap:12px; }
input, button { padding:10px; border-radius:6px; border:1px solid #ccc; }
button { background:#1877f2; color:white; border:none; cursor:pointer; }
button:hover { background:#166fe0; }
</style>
</head>
<body>
${baseScript}
<div class="card">
<h2>Login</h2>
<input id="username" placeholder="Username">
<input id="password" type="password" placeholder="Password">
<button onclick="login()">Login</button>
<small>attacker / attacker123</small>
</div>
<script>
async function login() {
    await fetch(__base + "/logout", { method: "POST" });
    const r = await fetch(__base + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    });
    if (r.ok) window.location.href = __base + "/dashboard";
    else alert("Invalid credentials");
}
</script>
</body>
</html>`);
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (!user || user.password !== password)
        return res.status(401).json({ error: "Invalid credentials" });
    req.session.user = username;
    res.json({ success: true });
});
app.get("/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect(req.baseUrl + "/login");
    res.send(`<!doctype html>
<html>
<head>
<title>User IDOR Lab — Dashboard</title>
<style>
body { font-family: Arial; background:#f0f2f5; padding:40px; }
.container { max-width:600px; margin:auto; display:flex; flex-direction:column; gap:20px; }
.note-view { background:#fff; padding:20px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
#solved { display:none; padding:15px; background:#e6ffed; border:1px solid #34c759; border-radius:10px; }
</style>
</head>
<body>
${baseScript}
<div class="container">
<h2>User Notes</h2>
<div id="notes"></div>
<div id="solved">🎉 Lab Solved! You accessed admin data.</div>
</div>
<script>
(async () => {
    const status = await fetch(__base + "/session-status").then(r => r.json());
    if (!status.user) {
        window.location.href = __base + "/login";
        return;
    }
    loadNotes(status.userId);
})();
async function loadNotes(userId) {
    const r = await fetch(__base + "/api/user-notes?userId=" + userId);
    const data = await r.json();
    if (data.error) return alert(data.error);
    const container = document.getElementById("notes");
    Object.entries(data).forEach(([title, lines]) => {
        const div = document.createElement("div");
        div.className = "note-view";
        div.innerHTML = "<h3>" + title + "</h3><p>" + lines.join("<br>") + "</p>";
        container.appendChild(div);
    });
    if (data["Credentials"]) {
        document.getElementById("solved").style.display = "block";
    }
}
</script>
</body>
</html>`);
});
app.get("/api/user-notes", (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ error: "Unauthorized" });
    const userId = parseInt(req.query.userId);
    const userNotes = notes[userId];
    if (!userNotes) return res.status(404).json({ error: "Not found" });
    res.json(userNotes);
});
app.listen(3000, () => {
    console.log("ac-basic-1 running on port 3000");
});
