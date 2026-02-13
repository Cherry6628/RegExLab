package service.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class Config {
	private static final Properties allConfigs = new Properties();

	static {
		loadFromFile("src/main/java/secrets/secrets.env");
//		loadFromFile("config.properties");
	}

	private static void loadFromFile(String fileName) {
		try (FileInputStream fis = new FileInputStream(fileName)) {
			allConfigs.load(fis);
		} catch (IOException e) {
			System.err.println("Warning: Could not load " + new File(fileName).getAbsolutePath() + " - " + e.getMessage());
		}
	}

	public static String getProperty(String propName) {
		return getProperty(propName, null);
	}
	public static String getProperty(String propName, String defaultValue) {
	    return allConfigs.getProperty(propName, defaultValue);
	}

}