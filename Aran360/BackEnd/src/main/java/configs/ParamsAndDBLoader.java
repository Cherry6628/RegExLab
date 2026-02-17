package configs;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import service.utils.manager.DBService;

@WebListener
public class ParamsAndDBLoader implements ServletContextListener {
    private static final Properties allConfigs = new Properties();

    public static String JWT_SECRET, DB_URL, DB_USER, DB_PASS, EMAIL_DOMAIN, EMAIL_API_KEY;
    public static String APP_NAME, FRONTEND_URL, BACKEND_URL, COOKIE_DOMAIN;
    public static String TEMP_NODE, TEMP_LAB;
    public static int JWT_EXPIRY;
    public static int MAX_SESSIONS_PER_USER;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext context = sce.getServletContext();

        loadFromWebResource(context, "/WEB-INF/secrets/params.env");
        loadFromWebResource(context, "/WEB-INF/secrets/secrets.env");

        try {
            JWT_SECRET = getProperty("JWT_SECRET");
            String expiryStr = getProperty("JWT_EXPIRY");
            JWT_EXPIRY = (expiryStr != null) ? Integer.parseInt(expiryStr) : 3600; 
            
            DB_URL = getProperty("DB_URL");
            DB_USER = getProperty("DB_USER");
            DB_PASS = getProperty("DB_PASS");
            EMAIL_DOMAIN = getProperty("EMAIL_DOMAIN");
            EMAIL_API_KEY = getProperty("EMAIL_API_KEY");
            APP_NAME = getProperty("APP_NAME");
            FRONTEND_URL = getProperty("FRONTEND_URL");
            BACKEND_URL = getProperty("BACKEND_URL");
            COOKIE_DOMAIN = getProperty("COOKIE_DOMAIN");
            TEMP_NODE = getProperty("TEMP_NODE");
            TEMP_LAB = getProperty("TEMP_LAB");
            String max_sessions = getProperty("MAX_SESSIONS_PER_USER");
            MAX_SESSIONS_PER_USER = (max_sessions!=null)?Integer.parseInt(max_sessions):2;
            
            
            

    		Connection con = DBService.getConnection();
    		con.createStatement().execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    secret_nonce VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""");
    		con.createStatement().execute("""
CREATE TABLE IF NOT EXISTS login_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    nonce VARCHAR(255) UNIQUE NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);
""");
    	
    		
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
    	try {
			DBService.getConnection().close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
    }
}