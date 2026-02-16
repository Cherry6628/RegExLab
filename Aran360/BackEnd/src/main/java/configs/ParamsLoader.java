package configs;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class ParamsLoader implements ServletContextListener {
    private static final Properties allConfigs = new Properties();

    public static String JWT_SECRET, DB_URL, DB_USER, DB_PASS, EMAIL_DOMAIN, EMAIL_API_KEY;
    public static String APP_NAME, FRONTEND_URL, BACKEND_URL, COOKIE_DOMAIN;
    public static String TEMP_NODE, TEMP_LAB;
    public static int JWT_EXPIRY;

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
            
            System.out.println("--- Configuration Loaded Successfully ---");
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
    public void contextDestroyed(ServletContextEvent sce) {}
}