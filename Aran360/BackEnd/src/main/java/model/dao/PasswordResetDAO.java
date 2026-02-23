package model.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import listener.configLoader.ParamsAndDBLoader;
import service.utils.manager.DBService;
import service.utils.manager.RandomService;

public class PasswordResetDAO {
	public static String createPasswordResetToken(String email) throws SQLException {
		Connection con = DBService.getConnection();
		try (PreparedStatement pstmt = con.prepareStatement("INSERT INTO " + ParamsAndDBLoader.TABLE_PASSWORD_RESET
				+ " (user_id, nonce) VALUES ((SELECT id FROM users WHERE email = ?), ?) ON DUPLICATE KEY UPDATE nonce = ?, edited_at = CURRENT_TIMESTAMP, expires_at = (CURRENT_TIMESTAMP + INTERVAL 15 MINUTE)")) {
			pstmt.setString(1, email);
			String token = RandomService.generateRandomString(128, true, true, true, false);
			pstmt.setString(2, token);
			pstmt.setString(3, token);
			pstmt.executeUpdate();
			return token;
		}
		
	}

	public static String getEmail(String token) throws SQLException {
		Connection con = DBService.getConnection();
		try (PreparedStatement pstmt = con.prepareStatement("SELECT u.email as email FROM " + ParamsAndDBLoader.TABLE_USERS + " u JOIN " + ParamsAndDBLoader.TABLE_PASSWORD_RESET + " p ON u.id = p.user_id AND p.expires_at > CURRENT_TIMESTAMP AND p.nonce = ?")) {
			pstmt.setString(1, token);
			ResultSet rs = pstmt.executeQuery();
			if (rs.next())
				return rs.getString("email");
			return null;
		}
	}
}
