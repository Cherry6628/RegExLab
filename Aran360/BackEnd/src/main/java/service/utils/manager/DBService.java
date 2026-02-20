package service.utils.manager;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import configs.ParamsAndDBLoader;

public class DBService {
	private static Connection con;

	private DBService() {
	}

	private static void initializeConnection() {

		try {
			System.out.println("[+] Establishing Connection");
			Class.forName("com.mysql.cj.jdbc.Driver");
			con = DriverManager.getConnection(ParamsAndDBLoader.DB_URL, ParamsAndDBLoader.DB_USER, ParamsAndDBLoader.DB_PASS);
//			con = null;
			System.out.println("[+] Connection Established");

		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static Connection getConnection() {
		if (con == null) {}
			initializeConnection();
		return con;
	}
}
