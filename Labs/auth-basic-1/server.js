import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "lab-secret",
    resave: false,
    saveUninitialized: true,
  })
);

/* ========================
   Fake Database
======================== */

const users = {
  attacker: {
    password: "attacker123",
    otp: generateOTP(),
    role: "user",
    otpAttempts: 0,
  },
  admin: {
    password: "AdminPass123!",
    otp: generateOTP(),
    role: "admin",
    otpAttempts: 0,
  },
};

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

setInterval(() => {
  for (const u in users) {
    users[u].otp = generateOTP();
    users[u].otpAttempts = 0;
  }
}, 120000);

/* ========================
   Entry
======================== */

app.get("/", (req, res) => {
  res.redirect(req.baseUrl + "/login");
});

/* ========================
   LOGIN
======================== */

app.get("/login", (req, res) => {
  res.send(`
  <h2>Login</h2>

  <input id="username" placeholder="Username"/><br/><br/>
  <input id="password" type="password" placeholder="Password"/><br/><br/>
  <button onclick="doLogin()">Login</button>

  <script>
    const base = window.location.pathname;

    async function doLogin() {
      const r = await fetch(base + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: document.getElementById("username").value,
          password: document.getElementById("password").value
        })
      });

      if (r.redirected) {
        window.location.href = r.url;
      } else {
        alert("Invalid credentials");
      }
    }
  </script>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 🚨 Vulnerability: client-controlled identity
  res.cookie("account", username);

  res.redirect(req.baseUrl + "/2fa");
});

/* ========================
   2FA
======================== */

app.get("/2fa", (req, res) => {
  if (!req.cookies.account) {
    return res.redirect(req.baseUrl + "/login");
  }

  res.send(`
  <h2>Two-Factor Authentication</h2>

  <input id="otp" placeholder="4-digit OTP"/><br/><br/>
  <button onclick="verifyOTP()">Verify</button>

  <script>
    const base = window.location.pathname;

    async function verifyOTP() {
      const r = await fetch(base + "/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: document.getElementById("otp").value
        })
      });

      if (r.redirected) {
        window.location.href = r.url;
      } else {
        alert("Invalid OTP");
      }
    }
  </script>
  `);
});

app.post("/2fa", (req, res) => {
  const username = req.cookies.account;
  const user = users[username];

  if (!user) {
    return res.status(400).json({ error: "Invalid account context" });
  }

  if (user.otpAttempts >= 3) {
    return res.status(403).json({ error: "Too many attempts" });
  }

  if (req.body.otp === user.otp) {
    req.session.user = username;
    return res.redirect(req.baseUrl + "/dashboard");
  }

  user.otpAttempts++;
  res.status(401).json({ error: "Invalid OTP" });
});

/* ========================
   DASHBOARD
======================== */

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect(req.baseUrl + "/login");
  }

  const user = users[req.session.user];

  if (user.role === "admin") {
    res.cookie("lab_solved", "true", {
      httpOnly: true,
      sameSite: "Strict",
    });
  }

  res.send(`
  <h2>Dashboard</h2>
  <p>User: ${req.session.user}</p>
  <p>Role: ${user.role}</p>
  ${user.role === "admin" ? "<h3>🚩 Admin Access Achieved</h3>" : ""}

  <button onclick="completeLab()">Complete Lab</button>

  <script>
    async function completeLab() {
      const r = await fetch("/lab/complete", { method: "POST" });

      if (r.ok) {
        alert("Lab Completed");
      } else {
        alert("Not solved yet");
      }
    }
  </script>
  `);
});

/* ======================== */

app.listen(3000, () =>
  console.log("auth-basic-1 running")
);