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

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

const users = {
    attacker: { password: "attacker123", otp: generateOTP(), role: "user" },
    admin: {
        password: "E9evWPfHGuyDer0bONKivhrDQ3IvXXdy",
        otp: generateOTP(),
        role: "admin",
    },
};

setInterval(() => {
    for (const u in users) users[u].otp = generateOTP();
}, 3e4);

app.get("/", (req, res) => res.send("<script>window.location.href=window.location.pathname+'/login'</script>"));

app.get("/session-status", (req, res) => {
    res.json({
        tmpUser: req.session.tmpUser || null,
        user: req.session.user || null,
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get("/login", (req, res) => {
    res.send(`<!doctype html><html>
<head><title>Aran360 — Login</title><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:Arial,sans-serif; background:#f0f2f5; display:flex; justify-content:center; align-items:center; min-height:100vh; }
.card { background:#fff; border-radius:10px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.1); width:360px; display:flex; flex-direction:column; gap:16px; }
h2 { color:#1a1a2e; }
input { padding:10px 14px; border:1px solid #ccc; border-radius:8px; font-size:14px; outline:none; width:100%; }
input:focus { border-color:#1877f2; }
button { padding:10px; background:#1877f2; color:#fff; border:none; border-radius:8px; font-size:14px; cursor:pointer; }
button:hover { background:#166fe0; }
.hint { font-size:12px; color:#888; }
</style></head>
<body>
<div class="card">
    <h2>Login</h2>
    <input id="username" placeholder="Username" autocomplete="off"/>
    <input id="password" type="password" placeholder="Password"/>
    <button onclick="doLogin()">Login</button>
    <p class="hint">Login as admin to access the admin panel.</p>
</div>
<script>
console.log(window.location.pathname)
const __base = window.location.pathname.replace(/\\/dashboard$/, "").replace(/\\/login/,"").replace(/\\/session-status/,"").replace(/\\/logout/,"").replace(/\\/inbox/,"").replace(/\\/2fa/,"").replace(/\\/complete/,"");
console.log(__base);
fetch(__base + "/logout", { method: "POST" });

async function doLogin() {
    const r = await fetch(__base + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    });
    if (r.ok) {
        window.location.href = __base + "/2fa";
    } else {
        alert("Invalid credentials");
    }
}
</script>
</body></html>`);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.tmpUser = username;
    res.json({ success: true });
});

app.get("/inbox", (req, res) => {
    if (!req.session.tmpUser) return res.redirect(req.baseUrl + "/login");

    const username = req.session.tmpUser;
    const otp = users[username].otp;
    res.send(`<!doctype html><html>
<head><title>Aran360 — Inbox</title><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:Arial,sans-serif; background:#f0f2f5; display:flex; justify-content:center; align-items:center; min-height:100vh; }
.card { background:#fff; border-radius:10px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.1); width:420px; display:flex; flex-direction:column; gap:16px; }
h2 { color:#1a1a2e; }
.email-item { border:1px solid #eee; border-radius:8px; padding:16px; background:#f9f9f9; }
.email-from { font-size:12px; color:#888; margin-bottom:6px; }
.email-subject { font-size:15px; font-weight:bold; color:#1a1a2e; margin-bottom:8px; }
.email-body { font-size:14px; color:#333; line-height:1.6; }
.otp-code { font-size:28px; font-weight:bold; letter-spacing:8px; color:#1877f2; text-align:center; padding:16px; background:#f0f6ff; border-radius:8px; margin-top:8px; }
</style></head>
<body>
<div class="card">
    <h2>📬 Inbox</h2>
    <div class="email-item">
        <p class="email-from">From: no-reply@aran360.com</p>
        <p class="email-subject">Your One-Time Password</p>
        <div class="email-body">
            <p>Hi ${username},</p>
            <p>Use the OTP below to complete your login. It expires in 30 seconds</p>
            <div class="otp-code">${otp}</div>
            <p style="margin-top:12px;font-size:12px;color:#888;">If you did not request this, please ignore this email.</p>
        </div>
    </div>
</div>
</body></html>`);
});

app.get("/2fa", (req, res) => {
    if (!req.session.tmpUser) return res.redirect(req.baseUrl + "/login");

    res.send(`<!doctype html><html>
<head><title>Aran360 — 2FA</title><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:Arial,sans-serif; background:#f0f2f5; display:flex; justify-content:center; align-items:center; min-height:100vh; }
.card { background:#fff; border-radius:10px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.1); width:360px; display:flex; flex-direction:column; gap:16px; }
h2 { color:#1a1a2e; }
p { font-size:14px; color:#555; }
a { color:#1877f2; }
input { padding:10px 14px; border:1px solid #ccc; border-radius:8px; font-size:14px; outline:none; width:100%; }
input:focus { border-color:#1877f2; }
button { padding:10px; background:#1877f2; color:#fff; border:none; border-radius:8px; font-size:14px; cursor:pointer; }
button:hover { background:#166fe0; }
</style></head>
<body>
<div class="card">
    <h2>Two-Factor Authentication</h2>
    <p>An OTP has been sent to your registered email. <a id="inbox-link" target="_blank" href="#">Check Inbox</a></p>
    <input id="otp" placeholder="Enter OTP"/>
    <button onclick="verifyOTP()">Verify</button>
</div>
<script>
const __base = window.location.pathname.replace(/\\/dashboard$/, "").replace(/\\/login/,"").replace(/\\/session-status/,"").replace(/\\/logout/,"").replace(/\\/inbox/,"").replace(/\\/2fa/,"").replace(/\\/complete/,"");
document.getElementById("inbox-link").href = __base + "/inbox";

(async () => {
    const s = await fetch(__base + "/session-status").then(r => r.json());
    if (s.user) window.location.href = __base + "/dashboard";
    else if (!s.tmpUser) window.location.href = __base + "/login";
})();

async function verifyOTP() {
    const r = await fetch(__base + "/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "${req.session.tmpUser}",
            otp: document.getElementById("otp").value
        })
    });
    if (r.ok) {
        window.location.href = __base + "/dashboard";
    } else {
        alert("Invalid OTP");
    }
}
</script>
</body></html>`);
});

// app.post("/2fa", (req, res) => {
//     const { username, otp } = req.body;
//     const realUser = username;

//     if (!req.session.tmpUser) return res.status(401).json({ error: "Unauthorized" });

//     if (users[realUser].otp !== otp) {
//         return res.status(401).json({ error: "Invalid OTP" });
//     }

//     req.session.user = realUser;
//     req.session.tmpUser = realUser;
//     res.json({ success: true });
// });

app.post("/2fa", (req, res) => {
    const { username, otp } = req.body;
    const realUser = req.session.tmpUser;

    if (!realUser) return res.status(401).json({ error: "Unauthorized" });

    if (users[realUser].otp !== otp)
        return res.status(401).json({ error: "Invalid OTP" });

    req.session.user = username;
    req.session.tmpUser = username;
    res.json({ success: true });
});
app.get("/dashboard", (req, res) => {
    if (!req.session.tmpUser) return res.redirect(req.baseUrl + "/login");

    const username = req.session.tmpUser;
    const user = users[username];
    res.send(`<!doctype html><html>
<head><title>Aran360 — Dashboard</title><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:Arial,sans-serif; background:#f0f2f5; display:flex; justify-content:center; align-items:center; min-height:100vh; }
.card { background:#fff; border-radius:10px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.1); width:420px; display:flex; flex-direction:column; gap:16px; }
h2 { color:#1a1a2e; }
p { font-size:14px; color:#555; }
.admin-box { background:#fff3cd; border:1px solid #ffc107; border-radius:8px; padding:16px; }
.admin-box h3 { color:#856404; margin-bottom:8px; }
.admin-box p { color:#856404; }
button { padding:10px 20px; background:#1877f2; color:#fff; border:none; border-radius:8px; font-size:14px; cursor:pointer; align-self:flex-start; }
button:hover { background:#166fe0; }
#solved { background:#e6ffed; border:1px solid #34c759; border-radius:8px; padding:16px; display:none; }
#solved p { color:#1a7f37; font-weight:bold; }
</style></head>
<body>
<div class="card">
    <h2>Dashboard</h2>
    <p>Logged in as: <strong>${username}</strong></p>
    <p>Role: <strong>${user.role}</strong></p>
    ${
        user.role === "admin"
            ? `
    <div class="admin-box">
        <h3>🔐 Admin Panel</h3>
        <p>You have full administrative access.</p>
    </div>
    <button onclick="completeLab()">Mark Lab Complete</button>
    `
            : `<p>You do not have admin access.</p>`
    }
    <div id="solved">
        <p>🎉 Lab Solved! You bypassed 2FA successfully.</p>
    </div>
</div>
<script>
const __base = window.location.pathname.replace(/\\/dashboard$/, "").replace(/\\/login/,"").replace(/\\/session-status/,"").replace(/\\/logout/,"").replace(/\\/inbox/,"").replace(/\\/2fa/,"").replace(/\\/complete/,"");

(async () => {
    const s = await fetch(__base + "/session-status").then(r => r.json());
    if (!s.tmpUser) window.location.href = __base + "/login";
})();

async function completeLab() {
    const r = await fetch(__base + "/complete", { method: "POST" });
    if (r.ok) {
        await fetch("/lab/complete", { method: "POST" });
        document.getElementById("solved").style.display = "block";
    } else {
        alert("Not solved yet — make sure you are logged in as admin.");
    }
}
</script>
</body></html>`);
});

app.post("/complete", (req, res) => {
    if (!req.session.tmpUser || users[req.session.tmpUser].role !== "admin")
        return res.status(403).json({ error: "Not solved" });

    res.json({ status: "ok" });
});

app.listen(3000, () => console.log("auth-basic-1 running on port 3000"));
