import { use, useState } from "react";
import Quiz from "./Quiz";

export default function QuizContainer() {
    let quiz = [
        {
            headline: "1. DOM-based XSS Vulnerability",
            describe:
                "User input is directly inserted into the DOM without sanitization.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "element.textContent = userInput;",
                "element.innerHTML = userInput;",
                "element.setAttribute('class', userInput);",
                "console.log(userInput);",
            ],
        },
        {
            headline: "2. Reflected XSS in URL Parameter",
            describe:
                "Data from URL parameters is written directly into the page.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "const name = new URLSearchParams(window.location.search).get('name');",
                "document.getElementById('output').innerHTML = name;",
                "document.getElementById('output').textContent = name;",
                "encodeURIComponent(name);",
            ],
        },
        {
            headline: "3. SQL Injection — Login Bypass",
            describe:
                "A login form passes user input directly into a SQL query.",
            question: "Which input would bypass authentication?",
            isCode: false,
            language: "sql",
            options: [
                "admin' --",
                "admin",
                "' OR '1'='2",
                "SELECT * FROM users;",
            ],
        },
        {
            headline: "4. Blind SQL Injection — Conditional Response",
            describe:
                "The application shows 'Welcome back' only when the query returns true.",
            question: "Which payload confirms a blind SQLi vulnerability?",
            isCode: false,
            language: "sql",
            options: [
                "' AND 1=1 --",
                "' UNION SELECT null --",
                "' DROP TABLE users --",
                "admin'#",
            ],
        },
        {
            headline: "5. Access Control — Role Parameter",
            describe:
                "A user intercepts their request and sees role=user in the parameters.",
            question: "What is the correct attack to escalate privilege?",
            isCode: false,
            language: "http",
            options: [
                "Change role=user to role=admin in the request",
                "Change the session cookie value",
                "Send a second request with a different username",
                "Add an Authorization header",
            ],
        },
        {
            headline: "6. Username Enumeration",
            describe:
                "A login form returns different messages for wrong username vs wrong password.",
            question: "What does 'Invalid password' response reveal?",
            isCode: false,
            language: "http",
            options: [
                "The username exists in the system",
                "The password is too short",
                "The account is locked",
                "Nothing useful",
            ],
        },
        {
            headline: "7. 2FA Bypass",
            describe:
                "After entering valid credentials, the app redirects to /2fa for OTP verification.",
            question: "How can an attacker bypass 2FA?",
            isCode: false,
            language: "http",
            options: [
                "Navigate directly to /dashboard after login, skipping /2fa",
                "Brute force the OTP",
                "Intercept and modify the OTP request",
                "Use a different browser",
            ],
        },
        {
            headline: "8. Path Traversal",
            describe:
                "An application serves files based on a filename parameter.",
            question: "Which payload attempts to read /etc/passwd?",
            isCode: false,
            language: "http",
            options: [
                "?file=../../../etc/passwd",
                "?file=etc/passwd",
                "?file=/root/passwd",
                "?file=passwd.txt",
            ],
        },
        {
            headline: "9. IDOR Vulnerability",
            describe: "An API endpoint returns user data at /api/user?id=123.",
            question: "What is the IDOR attack?",
            isCode: false,
            language: "http",
            options: [
                "Change id=123 to id=124 to access another user's data",
                "Send a request without the id parameter",
                "Add an admin=true parameter",
                "Use a different HTTP method",
            ],
        },
        {
            headline: "10. XSS — Safe vs Unsafe",
            describe: "A developer wants to display a username on the page.",
            question: "Which approach is safe?",
            isCode: false,
            language: "javascript",
            options: [
                "element.textContent = username;",
                "element.innerHTML = username;",
                "document.write(username);",
                "eval('element.text = ' + username);",
            ],
        },

        // ─── WITH CODE ─────────────────────────────────────────
        {
            headline: "11. Stored XSS from Database",
            describe: "A Node.js server renders user comments from a database.",
            question: "Which line introduces a stored XSS vulnerability?",
            isCode: true,
            language: "javascript",
            code: `app.get('/comments', (req, res) => {
    const comments = db.getComments();       // line 1
    const safe = comments.map(escape);       // line 2
    res.send('<p>' + comments[0] + '</p>');  // line 3
    res.json(comments);                      // line 4
});`,
            options: [
                "Line 1 — db.getComments()",
                "Line 2 — comments.map(escape)",
                "Line 3 — res.send with unsanitized comments[0]",
                "Line 4 — res.json(comments)",
            ],
        },
        {
            headline: "12. SQL Injection in Search",
            describe:
                "A product search feature builds a query using user input.",
            question: "Which line is vulnerable to SQL injection?",
            isCode: true,
            language: "javascript",
            code: `app.get('/search', (req, res) => {
    const q = req.query.q;                                      // line 1
    const safe = db.prepare('SELECT * FROM p WHERE name=?');    // line 2
    const query = 'SELECT * FROM p WHERE name=' + q;           // line 3
    const result = db.run(safe, [q]);                           // line 4
});`,
            options: [
                "Line 1 — req.query.q",
                "Line 2 — db.prepare with placeholder",
                "Line 3 — string concatenation in query",
                "Line 4 — db.run with parameterized query",
            ],
        },
        {
            headline: "13. Insecure Direct Object Reference",
            describe: "An Express endpoint returns user profile data.",
            question: "Which line has the IDOR vulnerability?",
            isCode: true,
            language: "javascript",
            code: `app.get('/profile', (req, res) => {
    const userId = req.query.id;                     // line 1
    const session = req.session.userId;              // line 2
    if (userId !== session) return res.status(403);  // line 3
    const user = db.getUserById(userId);             // line 4
    res.json(user);                                  // line 5
});`,
            options: [
                "Line 1 — req.query.id",
                "Line 2 — req.session.userId",
                "This code is secure — line 3 checks the session",
                "Line 4 — db.getUserById",
            ],
        },
        {
            headline: "14. Password Reset — Host Header Poisoning",
            describe:
                "A server builds a password reset link using request headers.",
            question: "Which line is vulnerable to Host header poisoning?",
            isCode: true,
            language: "javascript",
            code: `app.post('/reset', (req, res) => {
    const email = req.body.email;                           // line 1
    const token = crypto.randomBytes(32).toString('hex');   // line 2
    const host = req.headers['host'];                       // line 3
    const link = 'https://' + host + '/reset?token=' + token; // line 4
    sendEmail(email, link);                                 // line 5
});`,
            options: [
                "Line 1 — req.body.email",
                "Line 2 — crypto.randomBytes",
                "Line 3 — trusting req.headers['host']",
                "Line 4 — building the link",
            ],
        },
        {
            headline: "15. Path Traversal in File Download",
            describe:
                "A file download endpoint serves files from a uploads directory.",
            question: "Which line introduces the path traversal vulnerability?",
            isCode: true,
            language: "javascript",
            code: `app.get('/download', (req, res) => {
    const filename = req.query.file;                        // line 1
    const safe = path.basename(filename);                   // line 2
    const filePath = path.join(__dirname, 'uploads', filename); // line 3
    const safePath = path.join(__dirname, 'uploads', safe); // line 4
    res.sendFile(filePath);                                 // line 5
});`,
            options: [
                "Line 1 — req.query.file",
                "Line 2 — path.basename(filename)",
                "Line 3 + Line 5 — joining and serving unsanitized filename",
                "Line 4 — path.join with safe",
            ],
        },
        {
            headline: "16. Brute Force — Missing Rate Limit",
            describe: "A login endpoint handles POST requests.",
            question: "What is missing that allows brute force attacks?",
            isCode: true,
            language: "javascript",
            code: `app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.getUser(username);
    if (!user) return res.status(401).json({ message: 'Invalid username' });
    if (user.password !== hash(password)) return res.status(401).json({ message: 'Invalid password' });
    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
});`,
            options: [
                "No rate limiting or lockout mechanism after failed attempts",
                "Password is not hashed correctly",
                "Session is not being set",
                "Username is exposed in the response",
            ],
        },
        {
            headline: "17. eval() with User Input",
            describe: "A calculator feature evaluates user expressions.",
            question: "What is the risk with this code?",
            isCode: true,
            language: "javascript",
            code: `app.post('/calculate', (req, res) => {
    const expr = req.body.expression;
    const result = eval(expr);
    res.json({ result });
});`,
            options: [
                "eval() executes arbitrary JS — attacker can run any server-side code",
                "The result is not sanitized before sending",
                "req.body is not validated for type",
                "No authentication check on the endpoint",
            ],
        },
        {
            headline: "18. Second-Order SQL Injection",
            describe:
                "A user registers with a crafted username, then changes their password.",
            question: "Which query is vulnerable to second-order injection?",
            isCode: true,
            language: "javascript",
            code: `// Registration — safe
db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash(password)]);

// Password change — uses stored username unsafely
const user = db.getUser(session.userId);
const query = "UPDATE users SET password='" + hash(newPassword) + "' WHERE username='" + user.username + "'";
db.run(query);`,
            options: [
                "The INSERT at registration — it uses placeholders",
                "The UPDATE query — it concatenates the stored username directly",
                "db.getUser — it fetches from session",
                "hash(newPassword) — hashing is insecure",
            ],
        },
        {
            headline: "19. JWT Role Tampering",
            describe: "An app uses JWT tokens for authorization.",
            question: "What is the vulnerability in this verification?",
            isCode: true,
            language: "javascript",
            code: `app.get('/admin', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.decode(token);          // not jwt.verify()
    if (decoded.role === 'admin') {
        res.json({ secret: 'admin data' });
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
});`,
            options: [
                "jwt.decode() does not verify the signature — anyone can forge the token",
                "The role check should use === strictly",
                "Authorization header is not checked for existence",
                "res.json leaks too much data",
            ],
        },
        {
            headline: "20. robots.txt Information Disclosure",
            describe: "A site's robots.txt contains the following.",
            question: "What security issue does this reveal?",
            isCode: true,
            language: "http",
            code: `User-agent: *
Disallow: /admin
Disallow: /internal-api
Disallow: /backup
Allow: /`,
            options: [
                "It reveals sensitive paths that attackers can directly target",
                "robots.txt should not have an Allow directive",
                "User-agent: * is insecure",
                "There is no security issue — robots.txt is harmless",
            ],
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    function incrementQuestion() {
        setCurrentQuestion(currentQuestion + 1);
    }
    return (
        <Quiz
            {...quiz[currentQuestion]}
            next={incrementQuestion}
            quizId={Math.floor(Math.random() * 10000)}
        />
    );
}
