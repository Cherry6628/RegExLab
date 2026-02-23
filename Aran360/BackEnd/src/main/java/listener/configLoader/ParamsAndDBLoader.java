package listener.configLoader;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;
import java.util.Set;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import service.utils.manager.DBService;

@WebListener
public class ParamsAndDBLoader implements ServletContextListener {
	private static final Properties allConfigs = new Properties();

	public static String JWT_SECRET, DB_URL, DB_USER, DB_PASS;
//	public static String EMAIL_DOMAIN, EMAIL_API_KEY;
	public static String EMAIL_ADDRESS, EMAIL_PASSWORD;
	public static String APP_NAME, FRONTEND_URL, BACKEND_URL, COOKIE_DOMAIN;
	public static final String TABLE_USERS = "users", TABLE_LOGIN_SESSIONS = "login_sessions",
			TABLE_PASSWORD_RESET = "password_reset", TABLE_LABS = "labs", TABLE_LEARNING_TOPICS = "learning_topics",
			TABLE_LAB_ATTEMPTS = "lab_attempts", TABLE_LEARNING_PROGRESS = "learning_progress";
	public static int JWT_EXPIRY;
	public static int MAX_SESSIONS_PER_USER;
	public static int PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_SALT_LENGTH;
	public static int LAB_TIMEOUT_SECONDS;

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		ServletContext context = sce.getServletContext();

		loadFromWebResource(context, "/WEB-INF/secrets/params.env");
		loadFromWebResource(context, "/WEB-INF/secrets/secrets.env");

		try {
			String temp;
			JWT_SECRET = getProperty("JWT_SECRET");
			temp = getProperty("JWT_EXPIRY");
			JWT_EXPIRY = (temp != null) ? Integer.parseInt(temp) : 3600;
			DB_URL = getProperty("DB_URL");
			DB_USER = getProperty("DB_USER");
			DB_PASS = getProperty("DB_PASS");
//			EMAIL_DOMAIN = getProperty("EMAIL_DOMAIN");
//			EMAIL_API_KEY = getProperty("EMAIL_API_KEY");
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
			con.createStatement().execute("INSERT IGNORE INTO " + TABLE_LEARNING_TOPICS
					+ " (topic) VALUES ('XSS'),('SQL Injection'),('Access Control'),('Authentication'),('Path Traversal')");
			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_LABS + """
					(
					    id INT AUTO_INCREMENT PRIMARY KEY,
					    topic_id INT NOT NULL,
					    lab_name VARCHAR(512) UNIQUE NOT NULL,
					    image VARCHAR(512) NOT NULL,
					    FOREIGN KEY (topic_id) REFERENCES""" + " " + TABLE_LEARNING_TOPICS + """
					    (id) ON DELETE CASCADE
					)""");
			con.createStatement().execute(
				    "INSERT IGNORE INTO " + TABLE_LABS + " (topic_id, lab_name, image) VALUES " +

				    // XSS - topic_id via subquery
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'XSS'), 'Reflected XSS into HTML context with nothing encoded', 'xss-reflected-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'XSS'), 'Reflected XSS into attribute with angle brackets HTML encoded', 'xss-reflected-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'XSS'), 'Stored XSS into HTML context with nothing encoded', 'xss-stored-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'XSS'), 'Stored XSS into anchor href attribute with quotes encoded', 'xss-stored-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'XSS'), 'DOM XSS in document.write sink using source location.search', 'xss-dom-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'XSS'), 'DOM XSS in innerHTML sink using source location.search', 'xss-dom-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'XSS'), 'Surprise Lab - XSS', 'xss-surprise-1')," +

				    // SQLi
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'SQL Injection'), 'SQL injection vulnerability in WHERE clause allowing retrieval of hidden data', 'sqli-basic-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'SQL Injection'), 'SQL injection vulnerability allowing login bypass', 'sqli-basic-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'SQL Injection'), 'SQL injection UNION attack determining number of columns returned', 'sqli-union-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'SQL Injection'), 'SQL injection UNION attack retrieving data from other tables', 'sqli-union-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'SQL Injection'), 'Blind SQL injection with conditional responses', 'sqli-blind-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'SQL Injection'), 'Blind SQL injection with time delays and information retrieval', 'sqli-blind-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'SQL Injection'), 'Surprise Lab - SQL Injection', 'sqli-surprise-1')," +

				    // Access Control
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'Access Control'), 'Unprotected admin functionality exposed in robots.txt', 'ac-basic-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'Access Control'), 'User role controlled by request parameter', 'ac-basic-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'Access Control'), 'Surprise Lab - Access Control', 'ac-surprise-1')," +

				    // Authentication
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'Authentication'), 'Username enumeration via different responses', 'auth-basic-1')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'Authentication'), 'Password brute force protection bypass via account lockout', 'auth-basic-2')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'Authentication'), '2FA simple bypass via direct URL navigation', 'auth-basic-3')," +
				    "((SELECT id FROM " + TABLE_LEARNING_TOPICS + " WHERE topic = 'Authentication'), 'Surprise Lab - Authentication', 'auth-surprise-1')"
				);
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