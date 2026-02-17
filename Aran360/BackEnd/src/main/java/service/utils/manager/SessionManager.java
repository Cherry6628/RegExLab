package service.utils.manager;

import java.sql.*;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;
import configs.ParamsAndDBLoader;

public class SessionManager {
    public static String createSession(String username, HttpServletRequest request, Connection conn) throws SQLException {
        PreparedStatement countPstmt = conn.prepareStatement("SELECT COUNT(*) FROM login_sessions WHERE username = ?");
        countPstmt.setString(1, username);
        ResultSet rs = countPstmt.executeQuery();
        rs.next();

        if (rs.getInt(1) >= ParamsAndDBLoader.MAX_SESSIONS_PER_USER) {
            PreparedStatement delPstmt = conn.prepareStatement(
                "DELETE FROM login_sessions WHERE username = ? ORDER BY created_at ASC LIMIT 1");
            delPstmt.setString(1, username);
            delPstmt.executeUpdate();
        }

        String nonce = UUID.randomUUID().toString();
        PreparedStatement insPstmt = conn.prepareStatement(
            "INSERT INTO login_sessions (username, nonce, user_agent) VALUES (?, ?, ?)");
        insPstmt.setString(1, username);
        insPstmt.setString(2, nonce);
        insPstmt.setString(3, request.getHeader("User-Agent"));
        insPstmt.executeUpdate();

        return JWTService.generateToken(username, nonce);
    }
}