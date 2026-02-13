package configs;

import service.utils.Config;

public class Params {
	final public static String JWT_SECRET = Config.getProperty("JWT_SECRET");
	final public static String DB_URL = Config.getProperty("DB_DOMAIN");
	final public static String DB_USER = Config.getProperty("DB_USER");
	final public static String DB_PASS = Config.getProperty("DB_PASS");
}
