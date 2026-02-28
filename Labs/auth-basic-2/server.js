// app.js — intentionally vulnerable lab (harder variant)
// Run: node app.js
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import crypto from "crypto";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: randomUUID(),
    resave: false,
    saveUninitialized: true,
  }),
);

const expiry = 6e4;

function generateOTP() {
  return String(Date.now()).slice(-4);
}

const users = {
  attacker: {
    password: "attacker123",
    otp: null,
    expiry: null,
    role: "user",
    email: "attacker@example.com",
  },
  alice: {
    password: "alicepw",
    otp: null,
    expiry: null,
    role: "user",
    email: "alice@example.com",
  },
  admin: {
    password: "E9evWPfHGuyDer0bONKivhrDQ3IvXXdy",
    otp: null,
    expiry: null,
    role: "admin",
    email: "admin@example.com",
  },
};
const endpoints = ['dashboard', 'session-status', 'logout', 'login', 'inbox', '2fa', 'complete', 'switch-user', 'request-reset', 'reset-password']
const __base = `const __base = window.location.pathname`+endpoints.map(b=>`.replace(/\\/${b}$/, "")`).join("");
function renderInboxHTML(username, otp) {
  return `<!doctype html><html>
<head><title>Inbox</title></head>
<body>
  <h2>Inbox for ${username}</h2>
  <p>OTP: <strong>${otp}</strong></p>
  <p>Note: This OTP Expires in `+(expiry/1000)+` seconds.</p>
</body></html>`;
}

app.get("/", (req, res) => {
  const returnTo = req.query.returnTo || "/login";
  res.send(`<script>window.location.href='window.location.pathname+${returnTo}'</script>`);
});

app.get("/session-status", (req, res) => {
  res.json({
    tmpUser: req.session.tmpUser || null,
    user: req.session.user || null,
    sid: req.sessionID,
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get("/login", (req, res) => {
  res.send(`<!doctype html><html>
<head><title>Login</title></head>
<body>
  <h2>Login</h2>
  <input id="username" placeholder="Username"/>
  <input id="password" type="password" placeholder="Password"/>
  <button onclick="doLogin()">Login</button>
  <script>`+__base+`
    async function doLogin() {
      const r = await fetch(__base+'/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          username: document.getElementById('username').value,
          password: document.getElementById('password').value,
          // attacker can add returnTo to trigger open redirect on success
          returnTo: new URLSearchParams(window.location.search).get('returnTo') || undefined
        })
      });
      if (r.ok) window.location.href = '/2fa';
      else alert('Invalid credentials');
    }
  </script>
</body></html>`);
});

app.post("/login", (req, res) => {
  const { username, password, returnTo } = req.body;
  const user = users[username];
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.tmpUser = username;

  const tokenPayload = JSON.stringify({ u: username, t: Date.now() });
  const weakSig = crypto.createHmac("sha1", "weak-key").update(tokenPayload).digest("hex");
  const token = Buffer.from(tokenPayload).toString("base64") + "." + weakSig;
  res.cookie("lab_token", token);

  if (returnTo) return res.status(200).json({ ok: true, redirect: returnTo });
  res.json({ success: true });
});

app.get("/inbox", (req, res) => {
  if (!req.session?.tmpUser) return res.redirect("/login");
  const username = req.session.tmpUser;
  users[username].otp = generateOTP();
  users[username].expiry = Date.now() + expiry;
  const otp = users[username].otp;

  res.send(renderInboxHTML(username, otp));
});

app.get("/2fa", (req, res) => {
  if (!req.session?.tmpUser) return res.redirect("/login");
  res.send(`<!doctype html><html>
<head><title>2FA</title></head>
<body>
  <h2>Two-Factor</h2>
  <input id="otp" placeholder="OTP"/>
  <input id="username" placeholder="Username (optional)"/>
  <button onclick="verify()">Verify</button>
  <script>`+__base+`
    async function verify() {
      const r = await fetch(__base+'/2fa', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          username: document.getElementById('username').value,
          otp: document.getElementById('otp').value
        })
      });
      if (r.ok) window.location.href = '/dashboard';
      else alert('Invalid OTP');
    }
  </script>
</body></html>`);
});

app.post("/2fa", (req, res) => {
  const { username, otp } = req.body;
  const realUser = req.session?.tmpUser;

  if (!realUser) return res.status(401).json({ error: "Unauthorized" });

  if (users[realUser].otp !== otp || users[realUser].expiry < Date.now())
    return res.status(401).json({ error: "Invalid OTP" });

  const promoted = username && username.length ? username : realUser;

  req.session.user = promoted;
  req.session.tmpUser = promoted;

  res.json({ success: true });
});

app.get("/dashboard", (req, res) => {
  if (!req.session?.tmpUser) return res.redirect("/login");
  const username = req.session.tmpUser;
  const user = users[username];
  res.send(`<!doctype html><html>
<head><title>Dashboard</title></head>
<body>
  <h2>Dashboard</h2>
  <p>Logged in as: <strong>${username}</strong></p>
  <p>Role: <strong>${user.role}</strong></p>
  ${user.role === "admin" ? `<div id="admin">ADMIN PANEL — sensitive actions</div><button onclick="completeLab()">Mark Lab Complete</button>` : `<p>No admin access</p>`}
  <script>`+__base+`
    async function completeLab() {
      const r = await fetch(__base+'/complete', { method: 'POST' });
      if (r.ok) {
        await fetch('/lab/complete', { method: 'POST' }).catch(()=>{});
        alert('Lab marked complete');
      } else {
        alert('Not admin');
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

app.get("/switch-user", (req, res) => {
  const target = req.query.u;
  if (target && users[target]) {
    req.session.tmpUser = target;
    return res.json({ switched: target });
  }
  res.status(400).json({ error: "Bad request" });
});

const resetTokens = {};
app.get("/request-reset", (req, res) => {
  const username = req.query.u;
  if (!username || !users[username]) return res.status(404).json({ error: "User not found" });
  const token = Buffer.from(username + ":" + Date.now()).toString("base64");
  resetTokens[token] = username;
  res.json({ token, resetUrl: `/reset-password?token=${encodeURIComponent(token)}` });
});
app.get("/reset-password", (req, res) => {
  const token = req.query.token;
  const username = resetTokens[token];
  if (!username) return res.status(400).send("Invalid token");
  users[username].password = "resetme";
  delete resetTokens[token];
  res.send(`Password for ${username} reset to 'resetme'`);
});


app.listen(3000, () => console.log("auth-harder-lab running on port 3000"));
