package configs;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class Params {
	private static final Properties allConfigs = new Properties();

	static {
		loadFromFile("src/main/secrets/secrets.env");
		loadFromFile("src/main/secrets/params.env");
	}

	private static void loadFromFile(String fileName) {
		try (FileInputStream fis = new FileInputStream(fileName)) {
			allConfigs.load(fis);
		} catch (IOException e) {
			System.err.println(
					"Warning: Could not load " + new File(fileName).getAbsolutePath() + " - " + e.getMessage());
		}
	}

	public static String getProperty(String propName) {
		return getProperty(propName, null);
	}

	public static String getProperty(String propName, String defaultValue) {
		return allConfigs.getProperty(propName, defaultValue);
	}

	public static final String JWT_SECRET = getProperty("JWT_SECRET");
	public static final int JWT_EXPIRY = Integer.parseInt(getProperty("JWT_EXPIRY"));

	public static final String DB_URL = getProperty("DB_URL");
	public static final String DB_USER = getProperty("DB_USER");
	public static final String DB_PASS = getProperty("DB_PASS");

	public static final String EMAIL_DOMAIN = getProperty("EMAIL_DOMAIN");
	public static final String EMAIL_API_KEY = getProperty("EMAIL_API_KEY");

	public static final String APP_NAME = getProperty("APP_NAME");
	
	public static final String FRONTEND_URL = getProperty("FRONTEND_URL");
	public static final String BACKEND_URL = getProperty("BACKEND_URL");
	public static final String COOKIE_DOMAIN = getProperty("COOKIE_DOMAIN");
}
