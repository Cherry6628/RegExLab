package service.utils.auth;

import java.sql.*;
import jakarta.servlet.http.HttpServletRequest;
import listener.configLoader.ParamsAndDBLoader;
import service.utils.manager.JWTService;
import service.utils.manager.RandomService;

public class SessionManager {

    public static String createSession(String username, HttpServletRequest request, Connection conn)
            throws SQLException {

        int userId;
        try (PreparedStatement userPstmt = conn.prepareStatement(
                "SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?")) {
            userPstmt.setString(1, username);
            try (ResultSet rs = userPstmt.executeQuery()) {
                if (!rs.next())
                    throw new SQLException("User not found: " + username);
                userId = rs.getInt("id");
            }
        }

        try (PreparedStatement countPstmt = conn.prepareStatement(
                "SELECT COUNT(*) FROM " + ParamsAndDBLoader.TABLE_LOGIN_SESSIONS + " WHERE user_id = ?")) {
            countPstmt.setInt(1, userId);
            try (ResultSet rs = countPstmt.executeQuery()) {
                rs.next();
                if (rs.getInt(1) >= ParamsAndDBLoader.MAX_SESSIONS_PER_USER) {
                    try (PreparedStatement delPstmt = conn.prepareStatement(
                            "DELETE FROM login_sessions WHERE user_id = ? ORDER BY created_at ASC LIMIT 1")) {
                        delPstmt.setInt(1, userId);
                        delPstmt.executeUpdate();
                    }
                }
            }
        }

        String nonce = RandomService.generateRandomString(255);
        try (PreparedStatement insPstmt = conn.prepareStatement(
                "INSERT INTO " + ParamsAndDBLoader.TABLE_LOGIN_SESSIONS
                        + " (user_id, nonce, user_agent) VALUES (?, ?, ?)")) {
            insPstmt.setInt(1, userId);
            insPstmt.setString(2, nonce);
            insPstmt.setString(3, request.getHeader("User-Agent"));
            insPstmt.executeUpdate();
        }

        return JWTService.generateToken(username, nonce);
    }
}