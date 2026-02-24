package listener.configLoader;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import model.pojo.Quiz;
import service.utils.manager.DBService;

@WebListener
public class ParamsAndDBLoader implements ServletContextListener {
	private static final Properties allConfigs = new Properties();

	public static String JWT_SECRET, DB_URL, DB_USER, DB_PASS;
	// public static String EMAIL_DOMAIN, EMAIL_API_KEY;
	public static String EMAIL_ADDRESS, EMAIL_PASSWORD;
	public static String APP_NAME, FRONTEND_URL, BACKEND_URL, COOKIE_DOMAIN;

	public static final String TABLE_USERS = "users", TABLE_LOGIN_SESSIONS = "login_sessions",
			TABLE_PASSWORD_RESET = "password_reset", TABLE_LABS = "labs", TABLE_LEARNING_TOPICS = "learning_topics",
			TABLE_LAB_ATTEMPTS = "lab_attempts", TABLE_LEARNING_PROGRESS = "learning_progress",
			TABLE_QUIZZES = "quiz", TABLE_QUIZ_OPTIONS = "quiz_options";

	public static int JWT_EXPIRY;
	public static int MAX_SESSIONS_PER_USER;
	public static int PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_SALT_LENGTH;
	public static int LAB_TIMEOUT_SECONDS;
	public static int QUIZ_COUNT_PER_ATTEMPT;

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		ServletContext context = sce.getServletContext();

		loadFromWebResource(context, "/WEB-INF/secrets/params.env");
		loadFromWebResource(context, "/WEB-INF/secrets/secrets.env");
		Object[][] quizzes = {
				{
						"Cross Site Scripting (XSS)",
						"1. DOM-based XSS Vulnerability",
						"User input is directly inserted into the DOM without sanitization.",
						"Which line contains the vulnerability?",
						false, "javascript", null, 1,
						new String[] {
								"element.textContent = userInput;",
								"element.innerHTML = userInput;",
								"element.setAttribute('class', userInput);",
								"console.log(userInput);"
						}
				},
				{
						"Cross Site Scripting (XSS)",
						"2. Reflected XSS in URL Parameter",
						"Data from URL parameters is written directly into the page.",
						"Which line contains the vulnerability?",
						false, "javascript", null, 1,
						new String[] {
								"const name = new URLSearchParams(window.location.search).get('name');",
								"document.getElementById('output').innerHTML = name;",
								"document.getElementById('output').textContent = name;",
								"encodeURIComponent(name);"
						}
				},
				{
						"SQL Injection (SQLi)",
						"3. SQL Injection — Login Bypass",
						"A login form passes user input directly into a SQL query.",
						"Which input would bypass authentication?",
						false, "sql", null, 0,
						new String[] {
								"admin' --",
								"admin",
								"' OR '1'='2",
								"SELECT * FROM users;"
						}
				},
				{
						"SQL Injection (SQLi)",
						"4. Blind SQL Injection — Conditional Response",
						"The application shows 'Welcome back' only when the query returns true.",
						"Which payload confirms a blind SQLi vulnerability?",
						false, "sql", null, 0,
						new String[] {
								"' AND 1=1 --",
								"' UNION SELECT null --",
								"' DROP TABLE users --",
								"admin'#"
						}
				},
				{
						"Access Control",
						"5. Access Control — Role Parameter",
						"A user intercepts their request and sees role=user in the parameters.",
						"What is the correct attack to escalate privilege?",
						false, "http", null, 0,
						new String[] {
								"Change role=user to role=admin in the request",
								"Change the session cookie value",
								"Send a second request with a different username",
								"Add an Authorization header"
						}
				},
				{
						"Authentication",
						"6. Username Enumeration",
						"A login form returns different messages for wrong username vs wrong password.",
						"What does 'Invalid password' response reveal?",
						false, "http", null, 0,
						new String[] {
								"The username exists in the system",
								"The password is too short",
								"The account is locked",
								"Nothing useful"
						}
				},
				{
						"Authentication",
						"7. 2FA Bypass",
						"After entering valid credentials, the app redirects to /2fa for OTP verification.",
						"How can an attacker bypass 2FA?",
						false, "http", null, 0,
						new String[] {
								"Navigate directly to /dashboard after login, skipping /2fa",
								"Brute force the OTP",
								"Intercept and modify the OTP request",
								"Use a different browser"
						}
				},
				{
						"Path Traversal",
						"8. Path Traversal",
						"An application serves files based on a filename parameter.",
						"Which payload attempts to read /etc/passwd?",
						false, "http", null, 0,
						new String[] {
								"?file=../../../etc/passwd",
								"?file=etc/passwd",
								"?file=/root/passwd",
								"?file=passwd.txt"
						}
				},
				{
						"Access Control",
						"9. IDOR Vulnerability",
						"An API endpoint returns user data at /api/user?id=123.",
						"What is the IDOR attack?",
						false, "http", null, 0,
						new String[] {
								"Change id=123 to id=124 to access another user's data",
								"Send a request without the id parameter",
								"Add an admin=true parameter",
								"Use a different HTTP method"
						}
				},
				{
						"Cross Site Scripting (XSS)",
						"10. XSS — Safe vs Unsafe",
						"A developer wants to display a username on the page.",
						"Which approach is safe?",
						false, "javascript", null, 0,
						new String[] {
								"element.textContent = username;",
								"element.innerHTML = username;",
								"document.write(username);",
								"eval('element.text = ' + username);"
						}
				},

				{
						"Cross Site Scripting (XSS)",
						"11. Stored XSS from Database",
						"A Node.js server renders user comments from a database.",
						"Which line introduces a stored XSS vulnerability?",
						true, "javascript",
						"app.get('/comments', (req, res) => {\n    const comments = db.getComments();       // line 1\n    const safe = comments.map(escape);       // line 2\n    res.send('<p>' + comments[0] + '</p>');  // line 3\n    res.json(comments);                      // line 4\n});",
						2,
						new String[] {
								"Line 1 — db.getComments()",
								"Line 2 — comments.map(escape)",
								"Line 3 — res.send with unsanitized comments[0]",
								"Line 4 — res.json(comments)"
						}
				},
				{
						"SQL Injection (SQLi)",
						"12. SQL Injection in Search",
						"A product search feature builds a query using user input.",
						"Which line is vulnerable to SQL injection?",
						true, "javascript",
						"app.get('/search', (req, res) => {\n    const q = req.query.q;                                      // line 1\n    const safe = db.prepare('SELECT * FROM p WHERE name=?');    // line 2\n    const query = 'SELECT * FROM p WHERE name=' + q;           // line 3\n    const result = db.run(safe, [q]);                           // line 4\n});",
						2,
						new String[] {
								"Line 1 — req.query.q",
								"Line 2 — db.prepare with placeholder",
								"Line 3 — string concatenation in query",
								"Line 4 — db.run with parameterized query"
						}
				},
				{
						"Access Control",
						"13. Insecure Direct Object Reference",
						"An Express endpoint returns user profile data.",
						"Which line has the IDOR vulnerability?",
						true, "javascript",
						"app.get('/profile', (req, res) => {\n    const userId = req.query.id;                     // line 1\n    const session = req.session.userId;              // line 2\n    if (userId !== session) return res.status(403);  // line 3\n    const user = db.getUserById(userId);             // line 4\n    res.json(user);                                  // line 5\n});",
						2,
						new String[] {
								"Line 1 — req.query.id",
								"Line 2 — req.session.userId",
								"This code is secure — line 3 checks the session",
								"Line 4 — db.getUserById"
						}
				},
				{
						"Authentication",
						"14. Password Reset — Host Header Poisoning",
						"A server builds a password reset link using request headers.",
						"Which line is vulnerable to Host header poisoning?",
						true, "javascript",
						"app.post('/reset', (req, res) => {\n    const email = req.body.email;                           // line 1\n    const token = crypto.randomBytes(32).toString('hex');   // line 2\n    const host = req.headers['host'];                       // line 3\n    const link = 'https://' + host + '/reset?token=' + token; // line 4\n    sendEmail(email, link);                                 // line 5\n});",
						2,
						new String[] {
								"Line 1 — req.body.email",
								"Line 2 — crypto.randomBytes",
								"Line 3 — trusting req.headers['host']",
								"Line 4 — building the link"
						}
				},
				{
						"Path Traversal",
						"15. Path Traversal in File Download",
						"A file download endpoint serves files from an uploads directory.",
						"Which line introduces the path traversal vulnerability?",
						true, "javascript",
						"app.get('/download', (req, res) => {\n    const filename = req.query.file;                        // line 1\n    const safe = path.basename(filename);                   // line 2\n    const filePath = path.join(__dirname, 'uploads', filename); // line 3\n    const safePath = path.join(__dirname, 'uploads', safe); // line 4\n    res.sendFile(filePath);                                 // line 5\n});",
						2,
						new String[] {
								"Line 1 — req.query.file",
								"Line 2 — path.basename(filename)",
								"Line 3 + Line 5 — joining and serving unsanitized filename",
								"Line 4 — path.join with safe"
						}
				},
				{
						"Authentication",
						"16. Brute Force — Missing Rate Limit",
						"A login endpoint handles POST requests.",
						"What is missing that allows brute force attacks?",
						true, "javascript",
						"app.post('/login', (req, res) => {\n    const { username, password } = req.body;\n    const user = db.getUser(username);\n    if (!user) return res.status(401).json({ message: 'Invalid username' });\n    if (user.password !== hash(password)) return res.status(401).json({ message: 'Invalid password' });\n    req.session.userId = user.id;\n    res.json({ message: 'Login successful' });\n});",
						0,
						new String[] {
								"No rate limiting or lockout mechanism after failed attempts",
								"Password is not hashed correctly",
								"Session is not being set",
								"Username is exposed in the response"
						}
				},
				{
						"Cross Site Scripting (XSS)",
						"17. eval() with User Input",
						"A calculator feature evaluates user expressions.",
						"What is the risk with this code?",
						true, "javascript",
						"app.post('/calculate', (req, res) => {\n    const expr = req.body.expression;\n    const result = eval(expr);\n    res.json({ result });\n});",
						0,
						new String[] {
								"eval() executes arbitrary JS — attacker can run any server-side code",
								"The result is not sanitized before sending",
								"req.body is not validated for type",
								"No authentication check on the endpoint"
						}
				},
				{
						"SQL Injection (SQLi)",
						"18. Second-Order SQL Injection",
						"A user registers with a crafted username, then changes their password.",
						"Which query is vulnerable to second-order injection?",
						true, "javascript",
						"// Registration — safe\ndb.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash(password)]);\n\n// Password change — uses stored username unsafely\nconst user = db.getUser(session.userId);\nconst query = \"UPDATE users SET password='\" + hash(newPassword) + \"' WHERE username='\" + user.username + \"'\";\ndb.run(query);",
						1,
						new String[] {
								"The INSERT at registration — it uses placeholders",
								"The UPDATE query — it concatenates the stored username directly",
								"db.getUser — it fetches from session",
								"hash(newPassword) — hashing is insecure"
						}
				},
				{
						"Authentication",
						"19. JWT Role Tampering",
						"An app uses JWT tokens for authorization.",
						"What is the vulnerability in this verification?",
						true, "javascript",
						"app.get('/admin', (req, res) => {\n    const token = req.headers['authorization'].split(' ')[1];\n    const decoded = jwt.decode(token);          // not jwt.verify()\n    if (decoded.role === 'admin') {\n        res.json({ secret: 'admin data' });\n    } else {\n        res.status(403).json({ message: 'Forbidden' });\n    }\n});",
						0,
						new String[] {
								"jwt.decode() does not verify the signature — anyone can forge the token",
								"The role check should use === strictly",
								"Authorization header is not checked for existence",
								"res.json leaks too much data"
						}
				},
				{
						"Access Control",
						"20. robots.txt Information Disclosure",
						"A site's robots.txt contains the following entries.",
						"What security issue does this reveal?",
						true, "http",
						"User-agent: *\nDisallow: /admin\nDisallow: /internal-api\nDisallow: /backup\nAllow: /",
						0,
						new String[] {
								"It reveals sensitive paths that attackers can directly target",
								"robots.txt should not have an Allow directive",
								"User-agent: * is insecure",
								"There is no security issue — robots.txt is harmless"
						}
				}
		};
		String[][] labs = {
				{ "Cross Site Scripting (XSS)", "Reflected XSS into HTML context with nothing encoded",
						"stored-lab-image-lab" },
				{ "Cross Site Scripting (XSS)", "Reflected XSS into attribute with angle brackets HTML encoded",
						"xss-reflected-2" },
				{ "Cross Site Scripting (XSS)", "Stored XSS into HTML context with nothing encoded",
						"xss-stored-1" },
				{ "Cross Site Scripting (XSS)", "Stored XSS into anchor href attribute with quotes encoded",
						"xss-stored-2" },
				{ "Cross Site Scripting (XSS)", "DOM XSS in document.write sink using source location.search",
						"xss-dom-1" },
				{ "Cross Site Scripting (XSS)", "DOM XSS in innerHTML sink using source location.search",
						"xss-dom-2" },
				{ "Cross Site Scripting (XSS)", "Surprise Lab - XSS", "xss-surprise-1" },

				{ "SQL Injection (SQLi)",
						"SQL injection vulnerability in WHERE clause allowing retrieval of hidden data",
						"sqli-basic-1" },
				{ "SQL Injection (SQLi)", "SQL injection vulnerability allowing login bypass", "sqli-basic-2" },
				{ "SQL Injection (SQLi)", "SQL injection UNION attack determining number of columns returned",
						"sqli-union-1" },
				{ "SQL Injection (SQLi)", "SQL injection UNION attack retrieving data from other tables",
						"sqli-union-2" },
				{ "SQL Injection (SQLi)", "Blind SQL injection with conditional responses", "sqli-blind-1" },
				{ "SQL Injection (SQLi)", "Blind SQL injection with time delays and information retrieval",
						"sqli-blind-2" },
				{ "SQL Injection (SQLi)", "Surprise Lab - SQL Injection", "sqli-surprise-1" },

				{ "Access Control", "Unprotected admin functionality exposed in robots.txt", "ac-basic-1" },
				{ "Access Control", "User role controlled by request parameter", "ac-basic-2" },
				{ "Access Control", "Insecure direct object reference on user data endpoint", "ac-basic-3" },
				{ "Access Control", "Surprise Lab - Access Control", "ac-surprise-1" },

				{ "Authentication", "Username enumeration via different responses", "auth-basic-1" },
				{ "Authentication", "Password brute force protection bypass via account lockout", "auth-basic-2" },
				{ "Authentication", "2FA simple bypass via direct URL navigation", "auth-basic-3" },
				{ "Authentication", "Surprise Lab - Authentication", "auth-surprise-1" },
		};
		try {
			String temp;
			JWT_SECRET = getProperty("JWT_SECRET");
			temp = getProperty("JWT_EXPIRY");
			JWT_EXPIRY = (temp != null) ? Integer.parseInt(temp) : 3600;
			DB_URL = getProperty("DB_URL");
			DB_USER = getProperty("DB_USER");
			DB_PASS = getProperty("DB_PASS");
			// EMAIL_DOMAIN = getProperty("EMAIL_DOMAIN");
			// EMAIL_API_KEY = getProperty("EMAIL_API_KEY");
			EMAIL_ADDRESS = getProperty("EMAIL_ADDRESS");
			EMAIL_PASSWORD = getProperty("EMAIL_PASSWORD");
			APP_NAME = getProperty("APP_NAME");
			FRONTEND_URL = getProperty("FRONTEND_URL");
			BACKEND_URL = getProperty("BACKEND_URL");
			COOKIE_DOMAIN = getProperty("COOKIE_DOMAIN");
			temp = getProperty("MAX_SESSIONS_PER_USER");
			MAX_SESSIONS_PER_USER = (temp != null) ? Integer.parseInt(temp) : 2;
			temp = getProperty("PBKDF2_ITERATIONS");
			PBKDF2_ITERATIONS = (temp != null) ? Integer.parseInt(temp) : 10;
			temp = getProperty("PBKDF2_KEY_LENGTH");
			PBKDF2_KEY_LENGTH = (temp != null) ? Integer.parseInt(temp) : 256;
			temp = getProperty("LAB_TIMEOUT_SECONDS");
			LAB_TIMEOUT_SECONDS = (temp != null) ? Integer.parseInt(temp) : 1800;
			temp = getProperty("PBKDF2_SALT_LENGTH");
			PBKDF2_SALT_LENGTH = (temp != null) ? Integer.parseInt(temp) : 16;
			temp = getProperty("QUIZ_COUNT_PER_ATTEMPT");
			QUIZ_COUNT_PER_ATTEMPT = (temp != null) ? Integer.parseInt(temp) : 10;

			Connection con = DBService.getConnection();
			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_USERS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    username VARCHAR(100) UNIQUE NOT NULL,
					    email VARCHAR(254) UNIQUE NOT NULL,
					    password_hash VARCHAR(255) NOT NULL,
					    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
					)""");

			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_LOGIN_SESSIONS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    user_id INT NOT NULL,
					    nonce VARCHAR(255) UNIQUE NOT NULL,
					    user_agent TEXT,
					    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1440 MINUTE),
					    FOREIGN KEY (user_id) REFERENCES""" + " " + TABLE_USERS + """
					    (id) ON DELETE CASCADE
					)""");

			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_PASSWORD_RESET + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    user_id INT UNIQUE NOT NULL,
					    nonce VARCHAR(255) NOT NULL,
					    edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 15 MINUTE),
					    FOREIGN KEY (user_id) REFERENCES""" + " " + TABLE_USERS + """
					    (id) ON DELETE CASCADE
					)""");

			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_LEARNING_TOPICS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    topic VARCHAR(255) UNIQUE NOT NULL
					)""");
			con.createStatement().execute("INSERT IGNORE INTO " + TABLE_LEARNING_TOPICS + " (topic) VALUES " +
					"('Cross Site Scripting (XSS)')," +
					"('SQL Injection (SQLi)')," +
					"('Access Control')," +
					"('Authentication')," +
					"('Path Traversal')");
			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_LABS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    topic_id INT NOT NULL,
					    lab_name VARCHAR(512) UNIQUE NOT NULL,
					    image VARCHAR(512) NOT NULL,
					    FOREIGN KEY (topic_id) REFERENCES""" + " " + TABLE_LEARNING_TOPICS + """
					    (id) ON DELETE CASCADE
					)""");
			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_QUIZZES + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    topic_id INT NOT NULL,
					    headline VARCHAR(512) NOT NULL,
					    description TEXT NOT NULL,
					    question VARCHAR(512) NOT NULL,
					    is_code BOOLEAN DEFAULT FALSE,
					    language VARCHAR(50) DEFAULT 'javascript',
					    code TEXT NULL,
					    correct_index INT NOT NULL,
					    FOREIGN KEY (topic_id) REFERENCES""" + " " + TABLE_LEARNING_TOPICS + """
					    (id) ON DELETE CASCADE
					)""");
			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_QUIZ_OPTIONS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    quiz_id INT NOT NULL,
					    option_text TEXT NOT NULL,
					    option_order INT NOT NULL,
					    FOREIGN KEY (quiz_id) REFERENCES""" + " " + TABLE_QUIZZES + """
					    (id) ON DELETE CASCADE
					)""");
			String insertQuiz = "INSERT IGNORE INTO " + TABLE_QUIZZES +
					" (topic_id, headline, description, question, is_code, language, code, correct_index) " +
					" SELECT t.id, ?, ?, ?, ?, ?, ?, ? FROM " + TABLE_LEARNING_TOPICS + " t WHERE t.topic = ?";
			String insertOption = "INSERT IGNORE INTO " + TABLE_QUIZ_OPTIONS +
					" (quiz_id, option_text, option_order) VALUES (?, ?, ?)";
			java.sql.PreparedStatement qStmt = con.prepareStatement(insertQuiz,
					java.sql.Statement.RETURN_GENERATED_KEYS);
			java.sql.PreparedStatement oStmt = con.prepareStatement(insertOption);

			for (Object[] quiz : quizzes) {
				String topic = (String) quiz[0];
				String headline = (String) quiz[1];
				String description = (String) quiz[2];
				String question = (String) quiz[3];
				boolean isCode = (boolean) quiz[4];
				String language = (String) quiz[5];
				String code = (String) quiz[6];
				int correctIndex = (int) quiz[7];
				String[] options = (String[]) quiz[8];
				qStmt.setString(1, headline);
				qStmt.setString(2, description);
				qStmt.setString(3, question);
				qStmt.setBoolean(4, isCode);
				qStmt.setString(5, language);
				qStmt.setString(6, code);
				qStmt.setInt(7, correctIndex);
				qStmt.setString(8, topic);
				qStmt.executeUpdate();
				ResultSet keys = qStmt.getGeneratedKeys();
				if (keys.next()) {
					int quizId = keys.getInt(1);
					for (int i = 0; i < options.length; i++) {
						oStmt.setInt(1, quizId);
						oStmt.setString(2, options[i]);
						oStmt.setInt(3, i);
						oStmt.executeUpdate();
					}
				}
			}
			qStmt.close();
			oStmt.close();

			PreparedStatement labStmt = con.prepareStatement(
					"INSERT IGNORE INTO " + TABLE_LABS + " (topic_id, lab_name, image) SELECT t.id, ?, ? FROM "
							+ TABLE_LEARNING_TOPICS + " t WHERE t.topic = ?");
			for (String[] lab : labs) {
				labStmt.setString(1, lab[1]);
				labStmt.setString(2, lab[2]);
				labStmt.setString(3, lab[0]);
				labStmt.executeUpdate();
			}

			labStmt.close();
			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_LAB_ATTEMPTS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    user_id INT NOT NULL,
					    lab_id INT NOT NULL,
					    status ENUM('Completed', 'Attempted') NOT NULL,
					    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					    completed_at TIMESTAMP NULL DEFAULT NULL,
					    UNIQUE (user_id, lab_id),
					    FOREIGN KEY (user_id) REFERENCES""" + " " + TABLE_USERS + """
					(id) ON DELETE CASCADE,
					FOREIGN KEY (lab_id) REFERENCES""" + " " + TABLE_LABS + """
					    (id) ON DELETE CASCADE
					)""");
			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_LEARNING_PROGRESS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    user_id INT UNIQUE NOT NULL,
					    topic_url VARCHAR(255) NOT NULL,
					    page_id VARCHAR(255) NOT NULL,
					    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					    FOREIGN KEY (user_id) REFERENCES""" + " " + TABLE_USERS + """
					    (id) ON DELETE CASCADE
					)""");
		} catch (Exception e) {
			System.err.println("Error parsing configuration values: " + e.getMessage());
		}
	}

	private void loadFromWebResource(ServletContext context, String resourcePath) {
		try (InputStream is = context.getResourceAsStream(resourcePath)) {
			if (is != null) {
				allConfigs.load(is);
				System.out.println("Successfully loaded: " + resourcePath);
			} else {
				System.err.println("Could not find file: " + resourcePath);
			}
		} catch (IOException e) {
			System.err.println("Error reading " + resourcePath + ": " + e.getMessage());
		}
	}

	public static String getProperty(String propName) {
		return allConfigs.getProperty(propName);
	}

	public static List<Quiz> getQuiz(String name) throws SQLException {
		Connection con = DBService.getConnection();
		ArrayList <Quiz> questions = new ArrayList<>();
		String query = "Select id from learning_topics where topic = ?";
		String query1 =  "SELECT * from quiz where topic_id = ?";
		String query2 = "SELECT * from quiz_options where quiz_id = ?";
		try (PreparedStatement ps = con.prepareStatement(query); PreparedStatement ps1 = con.prepareStatement(query1);PreparedStatement ps2 = con.prepareStatement(query2)){
			ps.setString(1, name);
			ResultSet rs = ps.executeQuery();
			int id = 0;
			if(rs.next()) {
				id = rs.getInt("id");
   			}
			ps1.setInt(1, id);
			ResultSet rs1 = ps1.executeQuery();
			while(rs1.next()) {
				int qid = rs1.getInt("id");
				int topicId = rs1.getInt("topic_id");
				String headline = rs1.getString("headline");
				String description = rs1.getString("description");
				String question = rs1.getString("question");
				String language = rs1.getString("language");
				boolean isCode = rs1.getInt("is_code")== 1;
				String code = rs1.getString("code");
				int correctIndex = rs1.getInt("correct_index");
				ps2.setInt(1, qid);
				ResultSet rs2 = ps2.executeQuery();
				ArrayList <String> options = new ArrayList<>();
				while(rs2.next()) {
					int oid = rs2.getInt("id");
					int quizId = rs2.getInt("quiz_id");
					String option = rs2.getString("option_text");
					int order = rs2.getInt("option_order");
					options.add(option);
				}
				Quiz q = new Quiz(qid, topicId, headline, description, question, language, isCode, code, correctIndex, options);
				questions.add(q);
			}
			return questions;
		}
	}
	public static String getProperty(String propName, String defaultValue) {
		return allConfigs.getProperty(propName, defaultValue);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		Set<String> running = model.helper.LabRegistry.getAll();
		if (!running.isEmpty()) {
			System.out.println(
					"[LabCleanup] Destroying " + running.size() + " active lab container(s) on context shutdown...");

			service.infrastructure.LabRuntimeClient client = new service.infrastructure.LabRuntimeClient();

			for (String containerName : running) {
				try {
					System.out.println("[LabCleanup] Removing: " + containerName);
					client.cleanupLab(containerName);
				} catch (Exception e) {
					System.err.println("[LabCleanup] Failed to remove " + containerName + ": " + e.getMessage());
				}
			}
			System.out.println("[LabCleanup] Done.");
		}

		try {
			DBService.getConnection().close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}