package service.utils.manager;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import configs.ParamsLoader;

public class DBService {
	private static Connection con;

	private DBService() {
	}

	private static void initializeConnection() {

//		try {
//			Class.forName("com.mysql.cj.jdbc.Driver");
//			con = DriverManager.getConnection(ParamsLoader.DB_URL, ParamsLoader.DB_USER, ParamsLoader.DB_PASS);
			con = null;

//		} catch (ClassNotFoundException e) {
//			e.printStackTrace();
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
	}

	public static Connection getConnection() {
		if (con == null) {}
//			initializeConnection();
		return con;
	}
}
