package controller.filters.auth;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import service.utils.manager.DBService;
import service.utils.manager.JWTService;

@WebFilter(urlPatterns = { "/employee-quiz-leaderboard" })
public class UsernameFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;

        String token = extractAuthToken(req);
        if (token != null) {
            String username = JWTService.validate(token);
            if (username != null) {
                String nonce = JWTService.getNonce(token);
                if (nonce != null && isNonceValid(username, nonce)) {
                    req.setAttribute("AUTHENTICATED_USER", username);
                }
            }
        }

        // always continue — no redirect
        chain.doFilter(request, response);
    }

    private String extractAuthToken(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        if (cookies == null)
            return null;
        for (Cookie cookie : cookies) {
            if ("AUTH_TOKEN".equals(cookie.getName()))
                return cookie.getValue();
        }
        return null;
    }

    private boolean isNonceValid(String username, String nonce) {
        try {
            Connection conn = DBService.getConnection();
            PreparedStatement ps = conn.prepareStatement(
                    "SELECT 1 FROM " + ParamsAndDBLoader.TABLE_LOGIN_SESSIONS +
                            " WHERE user_id = (SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS +
                            " WHERE username = ?) AND nonce = ? AND expires_at > CURRENT_TIMESTAMP");
            ps.setString(1, username);
            ps.setString(2, nonce);
            ResultSet rs = ps.executeQuery();
            return rs.next();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}