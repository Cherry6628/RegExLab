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
import service.utils.manager.DBService;
import model.pojo.Quiz;

@WebListener
public class ParamsAndDBLoader implements ServletContextListener {
	private static final Properties allConfigs = new Properties();

	public static String JWT_SECRET, DB_URL, DB_USER, DB_PASS;
	// public static String EMAIL_DOMAIN, EMAIL_API_KEY;
	public static String EMAIL_ADDRESS, EMAIL_PASSWORD;
	public static String APP_NAME, FRONTEND_URL, BACKEND_URL, COOKIE_DOMAIN;

	public static final String TABLE_USERS = "users", TABLE_LOGIN_SESSIONS = "login_sessions",
			TABLE_PASSWORD_RESET = "password_reset", TABLE_LABS = "labs", TABLE_LEARNING_TOPICS = "learning_topics",
			TABLE_LAB_ATTEMPTS = "lab_attempts", TABLE_LEARNING_PROGRESS = "learning_progress", TABLE_QUIZZES = "quiz",
			TABLE_QUIZ_OPTIONS = "quiz_options", TABLE_EMPLOYEE_TEST_DETAILS = "employee_test_details";

	public static int JWT_EXPIRY;
	public static int MAX_SESSIONS_PER_USER;
	public static int PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_SALT_LENGTH;
	public static int LAB_TIMEOUT_SECONDS;
	public static int QUIZ_COUNT_PER_ATTEMPT;
	public static String AI_HINT_API, AI_HINT_KEY;

	public static String[][] LABS = {
			{ "Cross Site Scripting (XSS)", "Reflected XSS into HTML context with nothing encoded", "xss-reflected-1" },
			{ "Cross Site Scripting (XSS)", "Reflected XSS into attribute with angle brackets HTML encoded",
					"xss-reflected-2" },
			{ "Cross Site Scripting (XSS)", "Stored XSS into HTML context with nothing encoded", "xss-stored-1" },
			{ "Cross Site Scripting (XSS)", "Stored XSS into anchor href attribute with quotes encoded",
					"xss-stored-2" },
			{ "Cross Site Scripting (XSS)", "DOM XSS in innerHTML sink using source location.search", "xss-dom-1" },
//			{ "Cross Site Scripting (XSS)", "Surprise Lab - XSS", "xss-surprise-1" },

//			{ "SQL Injection (SQLi)",
//					"SQL injection vulnerability in WHERE clause allowing retrieval of hidden data",
//					"sqli-basic-1" },
//			{ "SQL Injection (SQLi)", "SQL injection vulnerability allowing login bypass", "sqli-basic-2" },
//			{ "SQL Injection (SQLi)", "SQL injection UNION attack determining number of columns returned",
//					"sqli-union-1" },
//			{ "SQL Injection (SQLi)", "SQL injection UNION attack retrieving data from other tables",
//					"sqli-union-2" },
//			{ "SQL Injection (SQLi)", "Blind SQL injection with conditional responses", "sqli-blind-1" },
//			{ "SQL Injection (SQLi)", "Blind SQL injection with time delays and information retrieval",
//					"sqli-blind-2" },
//			{ "SQL Injection (SQLi)", "Surprise Lab - SQL Injection", "sqli-surprise-1" },
//
//			{ "Access Control", "Unprotected admin functionality exposed in robots.txt", "ac-basic-1" },
//			{ "Access Control", "User role controlled by request parameter", "ac-basic-2" },
			{ "Access Control", "Insecure direct object reference on user's note endpoint", "ac-basic-1" },
//			{ "Access Control", "Surprise Lab - Access Control", "ac-surprise-1" },
//
//			{ "Authentication", "Username enumeration via different responses", "auth-basic-1" },
			{ "Authentication", "Broken 2FA Session Binding leading to account takeover", "auth-basic-1" },
//			{ "Authentication", "Password brute force protection bypass via account lockout", "auth-basic-2" },
//			{ "Authentication", "2FA simple bypass via direct URL navigation", "auth-basic-3" },
//			{ "Authentication", "Surprise Lab - Authentication", "auth-surprise-1" },
	};

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
			EMAIL_ADDRESS = getProperty("EMAIL_ADDRESS");
			AI_HINT_API = getProperty("AI_HINT_API");
			AI_HINT_KEY = getProperty("AI_HINT_KEY");
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
			con.createStatement()
					.execute("INSERT IGNORE INTO " + TABLE_LEARNING_TOPICS + " (topic) VALUES "
							+ "('Cross Site Scripting (XSS)'), ('SQL Injection (SQLi)'), ('Access Control'),"
							+ "('Authentication'), ('Path Traversal'), ('Race Condition')");
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
			PreparedStatement labStmt = con.prepareStatement(
					"INSERT IGNORE INTO " + TABLE_LABS + " (topic_id, lab_name, image) SELECT t.id, ?, ? FROM "
							+ TABLE_LEARNING_TOPICS + " t WHERE t.topic = ?");
			for (String[] lab : LABS) {
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
					    page_id VARCHAR(255),
					    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					    FOREIGN KEY (user_id) REFERENCES""" + " " + TABLE_USERS + """
					    (id) ON DELETE CASCADE
					)""");

			con.createStatement().execute("CREATE TABLE IF NOT EXISTS " + TABLE_EMPLOYEE_TEST_DETAILS + """
					(
						id INT AUTO_INCREMENT PRIMARY KEY,
						user_id INT UNIQUE NOT NULL,
						team VARCHAR(255) NOT NULL,
						score INT NOT NULL,
						time INT NOT NULL,
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