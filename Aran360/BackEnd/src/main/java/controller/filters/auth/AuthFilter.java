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

@WebFilter(urlPatterns = { "/lab", "/lab/*", "/user-data", "/logout", "/quiz-results", "/quiz-questions","/saveLearningProgress" })
public class AuthFilter implements Filter {
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;

		String token = extractAuthToken(req);
		System.out.println("Token: " + token);
		if (token == null) {
			redirectToLogin(req, resp);
			return;
		}

		String username = JWTService.validate(token);
		if (username == null) {
			clearAuthCookie(resp);
			redirectToLogin(req, resp);
			return;
		}
		System.out.println("username " + username);
		String nonce = JWTService.getNonce(token);
		if (nonce == null || !isNonceValid(username, nonce)) {
			clearAuthCookie(resp);
			redirectToLogin(req, resp);
			return;
		}
		System.out.println("nonce: " + nonce);
		req.setAttribute("AUTHENTICATED_USER", username);

		chain.doFilter(request, response);
	}

	private String extractAuthToken(HttpServletRequest req) {
		Cookie[] cookies = req.getCookies();
		if (cookies == null)
			return null;
		for (Cookie cookie : cookies) {
			if ("AUTH_TOKEN".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}

	private boolean isNonceValid(String username, String nonce) {
		try {
			Connection conn = DBService.getConnection();
			PreparedStatement pstmt = conn.prepareStatement("SELECT 1 FROM " + ParamsAndDBLoader.TABLE_LOGIN_SESSIONS
					+ " WHERE user_id = (SELECT id from " + ParamsAndDBLoader.TABLE_USERS
					+ " WHERE username = ?) AND nonce = ? AND expires_at > CURRENT_TIMESTAMP;");
			pstmt.setString(1, username);
			pstmt.setString(2, nonce);
			ResultSet rs = pstmt.executeQuery();
			return rs.next();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	private void redirectToLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String originalUrl = req.getRequestURI();
		if (req.getQueryString() != null) {
			originalUrl += "?" + req.getQueryString();
		}
		req.getSession(true).setAttribute("REDIRECT_AFTER_LOGIN", originalUrl);
		resp.sendRedirect(req.getContextPath() + "/accounts");
	}

	private void clearAuthCookie(HttpServletResponse resp) {
		String clearCookie = String.format("AUTH_TOKEN=; Path=/; Domain=%s; HttpOnly; Secure; SameSite=None; Max-Age=0",
				ParamsAndDBLoader.COOKIE_DOMAIN);
		resp.addHeader("Set-Cookie", clearCookie);
	}
}