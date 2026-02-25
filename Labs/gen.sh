#!/bin/bash
set -e

echo "======================================="
echo "Creating all XSS labs..."
echo "======================================="

# ─────────────────────────────────────────
# SHARED HELPERS
# ─────────────────────────────────────────

make_base() {
    local DIR=$1
    local NAME=$2
    local HAS_SQLITE=${3:-false}

    mkdir -p "$DIR/public"

    cat > "$DIR/.dockerignore" << 'EOF'
node_modules
npm-debug.log
EOF

    cat > "$DIR/Dockerfile" << EOF
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
$([ "$HAS_SQLITE" = "true" ] && echo "RUN mkdir -p data")
EXPOSE 3000
CMD ["node", "server.js"]
EOF

    if [ "$HAS_SQLITE" = "true" ]; then
        cat > "$DIR/package.json" << EOF
{
  "name": "$NAME",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.18.2",
    "cookie-parser": "^1.4.6",
    "sqlite3": "^5.1.6"
  }
}
EOF
    else
        cat > "$DIR/package.json" << EOF
{
  "name": "$NAME",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.18.2",
    "cookie-parser": "^1.4.6"
  }
}
EOF
    fi
}

make_css() {
    local DIR=$1
    cat > "$DIR/public/style.css" << 'EOF'
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: Arial, sans-serif;
    background: #f0f2f5;
    display: flex;
    justify-content: center;
    padding: 60px 20px;
    min-height: 100vh;
}
.container {
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.header { text-align: center; }
.header h1 { font-size: 28px; color: #1a1a2e; margin-bottom: 6px; }
.subtitle { color: #666; font-size: 14px; }
.card {
    background: #fff;
    border-radius: 10px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.card h2 { font-size: 20px; color: #1a1a2e; margin-bottom: 6px; }
.card h3 { font-size: 16px; color: #1a1a2e; margin-bottom: 16px; }
.meta { font-size: 13px; color: #888; margin-bottom: 12px; }
.body-text { font-size: 15px; color: #333; line-height: 1.6; }
.search-form { display: flex; gap: 10px; margin-bottom: 24px; }
.input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 15px;
    outline: none;
    transition: border 0.2s;
    width: 100%;
}
.input:focus { border-color: #1877f2; }
.textarea {
    padding: 10px 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    outline: none;
    transition: border 0.2s;
    min-height: 100px;
    resize: vertical;
    width: 100%;
}
.textarea:focus { border-color: #1877f2; }
.btn {
    padding: 10px 24px;
    background: #1877f2;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
    align-self: flex-end;
}
.btn:hover { background: #166fe0; }
.result-text { font-size: 14px; color: #555; margin-bottom: 12px; }
.no-results { color: #999; font-size: 14px; text-align: center; padding: 20px 0; }
.comments-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.comment-item {
    padding: 12px;
    border-radius: 8px;
    background: #f9f9f9;
    border: 1px solid #eee;
}
.comment-author { font-size: 13px; font-weight: bold; color: #1877f2; margin-bottom: 4px; }
.comment-content { font-size: 14px; color: #333; margin-bottom: 4px; }
.comment-time { font-size: 11px; color: #aaa; }
.form-group { display: flex; flex-direction: column; gap: 12px; }
.profile-link {
    display: inline-block;
    margin-top: 8px;
    color: #1877f2;
    font-size: 14px;
    text-decoration: none;
}
.profile-link:hover { text-decoration: underline; }
.solved-banner {
    background: #e6ffed;
    border: 1px solid #34c759;
    border-radius: 10px;
    padding: 16px 24px;
    display: none;
}
.solved-banner p { color: #1a7f37; font-weight: bold; font-size: 16px; }
EOF
}

# ═══════════════════════════════════════════════════════════
# LAB 1 — xss-reflected-1
# Reflected XSS into HTML context with nothing encoded
# ═══════════════════════════════════════════════════════════
echo "--- Creating xss-reflected-1..."
make_base "xss-reflected-1" "xss-reflected-1" "false"
make_css "xss-reflected-1"

cat > "xss-reflected-1/server.js" << 'EOF'
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

app.get("/search", (req, res) => {
    const q = req.query.q || "";
    res.send(`<!doctype html>
<html>
<head>
    <title>Aran360 — Search</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Product Search</h1>
            <p class="subtitle">Search our catalog below</p>
        </div>
        <div class="card">
            <div class="search-form">
                <input type="text" id="searchInput" placeholder="Search products..." class="input" autocomplete="off" value="${q}"/>
                <button type="button" onclick="doSearch()" class="btn">Search</button>
            </div>
            ${q ? `<p class="result-text">You searched for: ${q}</p><div class="no-results">No products found.</div>` : ""}
        </div>
        <div id="solved-banner" class="solved-banner">
            <p>🎉 Lab Solved! XSS executed successfully.</p>
        </div>
    </div>
    <script>
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

        function doSearch() {
            const q = document.getElementById("searchInput").value;
            window.location.href = window.location.pathname + "?q=" + encodeURIComponent(q);
        }

        document.getElementById("searchInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") doSearch();
        });
    </script>    <script>
  const basePath = window.location.pathname.split("?")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = basePath + "/style.css";
  document.head.appendChild(link);
</script>
</body>
</html>`);
});

app.get("/", (req, res) => {
    const fullPath = req.originalUrl || req.url;
    const basePath = fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;
    res.redirect(basePath + "/search");
});
app.listen(3000, () => console.log("xss-reflected-1 running"));
EOF

# ═══════════════════════════════════════════════════════════
# LAB 2 — xss-reflected-2
# Reflected XSS into attribute with angle brackets HTML encoded
# ═══════════════════════════════════════════════════════════
echo "--- Creating xss-reflected-2..."
make_base "xss-reflected-2" "xss-reflected-2" "false"
make_css "xss-reflected-2"

cat > "xss-reflected-2/server.js" << 'EOF'
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
app.use("/", express.static(path.join(__dirname, "public")));

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
function partialEncode(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

app.get("/", (req, res) => {
    const q = partialEncode(req.query.q || "");
    res.send(`<!doctype html>
<html>
<head>
    <title>Aran360 — Search</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Product Search</h1>
            <p class="subtitle">Search our catalog below</p>
        </div>
        <div class="card">
            <div class="search-form">
                <input type="text" id="searchInput" value="${q}" placeholder="Search products..." class="input" autocomplete="off"/>
                <button type="button" onclick="doSearch()" class="btn">Search</button>
            </div>
            ${q ? `<p class="result-text">You searched for: ${q}</p><div class="no-results">No products found.</div>` : ""}
        </div>
        <div id="solved-banner" class="solved-banner">
            <p>🎉 Lab Solved! XSS executed successfully.</p>
        </div>
    </div>
    <script>
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

        function doSearch() {
            const q = document.getElementById("searchInput").value;
            window.location.href = window.location.pathname + "?q=" + encodeURIComponent(q);
        }

        document.getElementById("searchInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") doSearch();
        });
    </script>    <script>
  const basePath = window.location.pathname.split("?")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = basePath + "/style.css";
  document.head.appendChild(link);
</script>
</body>
</html>`);
});

app.listen(3000, () => console.log("xss-reflected-2 running"));
EOF

# ═══════════════════════════════════════════════════════════
# LAB 3 — xss-stored-1
# Stored XSS into HTML context with nothing encoded
# ═══════════════════════════════════════════════════════════
echo "--- Creating xss-stored-1..."
make_base "xss-stored-1" "xss-stored-1" "true"
make_css "xss-stored-1"

cat > "xss-stored-1/server.js" << 'EOF'
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
EOF

cat > "xss-stored-1/public/index.html" << 'EOF'
<!doctype html>
<html>
<head>
    <title>Aran360 — Blog</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Aran360 Blog</h1>
            <p class="subtitle">Read and leave comments below</p>
        </div>
        <div class="card">
            <h2>Understanding Web Security</h2>
            <p class="meta">Posted by <strong>admin</strong> · 2 hours ago</p>
            <p class="body-text">
                Web security is a critical aspect of modern software development.
                Always validate and sanitize user input before processing or displaying it.
            </p>
        </div>
        <div class="card">
            <h3>Comments</h3>
            <ul id="comments-list" class="comments-list"></ul>
        </div>
        <div id="solved-banner" class="solved-banner">
            <p>🎉 Lab Solved! XSS executed successfully.</p>
        </div>
        <div class="card form-group">
            <h3>Leave a Comment</h3>
            <input id="author" type="text" placeholder="Your name" class="input" autocomplete="off"/>
            <textarea id="content" placeholder="Write your comment..." class="textarea"></textarea>
            <button onclick="postComment()" class="btn">Post Comment</button>
        </div>
    </div>
    <script>
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

        async function loadComments() {
            const res = await fetch(window.location.pathname + "/api/comments");
            const comments = await res.json();
            const list = document.getElementById("comments-list");
            list.innerHTML = "";
            comments.forEach(c => {
                const li = document.createElement("li");
                li.className = "comment-item";
                li.innerHTML = `
                    <div class="comment-author">${c.author}</div>
                    <div class="comment-content">${c.content}</div>
                    <div class="comment-time">${c.created_at}</div>
                `;
                list.appendChild(li);
            });
        }

        async function postComment() {
            const author = document.getElementById("author").value.trim();
            const content = document.getElementById("content").value.trim();
            if (!author || !content) return alert("Please fill in all fields.");
            await fetch(window.location.pathname + "/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ author, content })
            });
            document.getElementById("content").value = "";
            loadComments();
        }

        loadComments();
    </script>    <script>
  const basePath = window.location.pathname.split("?")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = basePath + "/style.css";
  document.head.appendChild(link);
</script>
</body>
</html>
EOF

# ═══════════════════════════════════════════════════════════
# LAB 4 — xss-stored-2
# Stored XSS into anchor href attribute with quotes encoded
# ═══════════════════════════════════════════════════════════
echo "--- Creating xss-stored-2..."
make_base "xss-stored-2" "xss-stored-2" "true"
make_css "xss-stored-2"

cat > "xss-stored-2/server.js" << 'EOF'
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
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        website TEXT,
        bio TEXT
    )`);
    db.run(`INSERT OR IGNORE INTO users (id, username, website, bio) VALUES
        (1, 'alice', 'https://alice.dev', 'Security researcher'),
        (2, 'bob', 'https://bob.io', 'Full stack developer')`);
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

app.get("/api/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(rows);
    });
});

// encodes quotes but NOT javascript: protocol
app.post("/api/profile", (req, res) => {
    const { username, website, bio } = req.body;
    if (!username) return res.status(400).json({ error: "Missing username" });
    const safeWebsite = (website || "").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    db.run(
        "INSERT INTO users (username, website, bio) VALUES (?, ?, ?)",
        [username, safeWebsite, bio || ""],
        function(err) {
            if (err) return res.status(500).json({ error: "DB error" });
            res.json({ status: "saved", id: this.lastID });
        }
    );
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(3000, () => console.log("xss-stored-2 running"));
EOF

cat > "xss-stored-2/public/index.html" << 'EOF'
<!doctype html>
<html>
<head>
    <title>Aran360 — Community</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👥 Aran360 Community</h1>
            <p class="subtitle">Members and their websites</p>
        </div>
        <div class="card">
            <h3>Members</h3>
            <ul id="users-list" class="comments-list"></ul>
        </div>
        <div id="solved-banner" class="solved-banner">
            <p>🎉 Lab Solved! XSS executed successfully.</p>
        </div>
        <div class="card form-group">
            <h3>Join the Community</h3>
            <input id="username" type="text" placeholder="Username" class="input" autocomplete="off"/>
            <input id="website" type="text" placeholder="Your website URL" class="input" autocomplete="off"/>
            <textarea id="bio" placeholder="Short bio..." class="textarea"></textarea>
            <button onclick="saveProfile()" class="btn">Save Profile</button>
        </div>
    </div>
    <script>
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

        async function loadUsers() {
            const res = await fetch(window.location.pathname + "/api/users");
            const users = await res.json();
            const list = document.getElementById("users-list");
            list.innerHTML = "";
            users.forEach(u => {
                const li = document.createElement("li");
                li.className = "comment-item";
                li.innerHTML = `
                    <div class="comment-author">${u.username}</div>
                    <div class="comment-content">${u.bio}</div>
                    <a class="profile-link" href="${u.website}">Visit website</a>
                `;
                list.appendChild(li);
            });
        }

        async function saveProfile() {
            const username = document.getElementById("username").value.trim();
            const website = document.getElementById("website").value.trim();
            const bio = document.getElementById("bio").value.trim();
            if (!username) return alert("Username is required.");
            await fetch(window.location.pathname + "/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, website, bio })
            });
            document.getElementById("username").value = "";
            document.getElementById("website").value = "";
            document.getElementById("bio").value = "";
            loadUsers();
        }

        loadUsers();
    </script>    <script>
  const basePath = window.location.pathname.split("?")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = basePath + "/style.css";
  document.head.appendChild(link);
</script>
</body>
</html>
EOF

# ═══════════════════════════════════════════════════════════
# LAB 5 — xss-dom-1
# DOM XSS in document.write sink using source location.search
# ═══════════════════════════════════════════════════════════
echo "--- Creating xss-dom-1..."
make_base "xss-dom-1" "xss-dom-1" "false"
make_css "xss-dom-1"

cat > "xss-dom-1/server.js" << 'EOF'
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
EOF

cat > "xss-dom-1/public/index.html" << 'EOF'
<!doctype html>
<html>
<head>
    <title>Aran360 — Search</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Product Search</h1>
            <p class="subtitle">Search our catalog below</p>
        </div>
        <div class="card">
            <div class="search-form">
                <input type="text" id="q" placeholder="Search products..." class="input" autocomplete="off"/>
                <button class="btn" onclick="doSearch()">Search</button>
            </div>
            <div id="results"></div>
        </div>
        <div id="solved-banner" class="solved-banner">
            <p>🎉 Lab Solved! XSS executed successfully.</p>
        </div>
    </div>
    <script>
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

        function doSearch() {
            const q = document.getElementById("q").value;
            window.location.search = "?q=" + q;
        }

        document.getElementById("q").addEventListener("keypress", (e) => {
            if (e.key === "Enter") doSearch();
        });

        // vulnerability — document.write with raw location.search
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");
        if (q) {
            document.getElementById("q").value = q;
            document.write("<p class='result-text'>You searched for: " + q + "</p>");
            document.write("<div class='no-results'>No products found.</div>");
        }
    </script>    <script>
  const basePath = window.location.pathname.split("?")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = basePath + "/style.css";
  document.head.appendChild(link);
</script>
</body>
</html>
EOF

# ═══════════════════════════════════════════════════════════
# LAB 6 — xss-dom-2
# DOM XSS in innerHTML sink using source location.search
# ═══════════════════════════════════════════════════════════
echo "--- Creating xss-dom-2..."
make_base "xss-dom-2" "xss-dom-2" "false"
make_css "xss-dom-2"

cat > "xss-dom-2/server.js" << 'EOF'
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
app.listen(3000, () => console.log("xss-dom-2 running"));
EOF

cat > "xss-dom-2/public/index.html" << 'EOF'
<!doctype html>
<html>
<head>
    <title>Aran360 — Search</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Product Search</h1>
            <p class="subtitle">Search our catalog below</p>
        </div>
        <div class="card">
            <div class="search-form">
                <input type="text" id="q" placeholder="Search products..." class="input" autocomplete="off"/>
                <button class="btn" onclick="doSearch()">Search</button>
            </div>
            <div id="results"></div>
        </div>
        <div id="solved-banner" class="solved-banner">
            <p>🎉 Lab Solved! XSS executed successfully.</p>
        </div>
    </div>
    <script>
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

        function doSearch() {
            const q = document.getElementById("q").value;
            window.location.search = "?q=" + q;
        }

        document.getElementById("q").addEventListener("keypress", (e) => {
            if (e.key === "Enter") doSearch();
        });

        // vulnerability — innerHTML with raw location.search
        // <script> won't execute via innerHTML — must use <img src=x onerror=alert(1)>
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");
        if (q) {
            document.getElementById("q").value = q;
            document.getElementById("results").innerHTML =
                "<p class='result-text'>You searched for: " + q + "</p>" +
                "<div class='no-results'>No products found.</div>";
        }
    </script>    <script>
  const basePath = window.location.pathname.split("?")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = basePath + "/style.css";
  document.head.appendChild(link);
</script>
</body>
</html>
EOF

# ═══════════════════════════════════════════════════════════
# BUILD ALL
# ═══════════════════════════════════════════════════════════
echo ""
echo "======================================="
echo "Building all XSS lab images..."
echo "======================================="

for DIR in xss-reflected-1 xss-reflected-2 xss-stored-1 xss-stored-2 xss-dom-1 xss-dom-2; do
    echo "--- Building $DIR..."
    docker build -t "$DIR" "./$DIR"
    echo "--- Exporting $DIR.tar..."
    docker save -o "$DIR.tar" "$DIR"
done

rm ~/Educational/TradeShow/Aran360/BackEnd/src/main/webapp/WEB-INF/dockers/*.tar -f
cp *.tar ~/Educational/TradeShow/Aran360/BackEnd/src/main/webapp/WEB-INF/dockers/
echo ""
echo "======================================="
echo "Done. All XSS lab images built and exported."
echo "======================================="
