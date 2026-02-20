package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import service.helper.model.JSONResponse;
import service.utils.manager.*;
import java.io.IOException;
import java.sql.*;
import configs.ParamsAndDBLoader;

@WebServlet("/logout")
public class Logout extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie c : cookies) {
				if ("AUTH_TOKEN".equals(c.getName())) {
					String nonce = JWTService.getNonce(c.getValue());
					try {
						PreparedStatement pstmt = DBService.getConnection()
								.prepareStatement("DELETE FROM login_sessions WHERE nonce = ?");
						pstmt.setString(1, nonce);
						pstmt.executeUpdate();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}

		String cookieHeader = String.format(
				"AUTH_TOKEN=; Path=/; Domain=%s; HttpOnly; Secure; SameSite=None; Max-Age=0",
				ParamsAndDBLoader.COOKIE_DOMAIN);
		response.addHeader("Set-Cookie", cookieHeader);
		response.setContentType("application/json");
		response.getWriter().write(JSONResponse
				.response(JSONResponse.SUCCESS, "Logged out", CSRFService.setCSRFToken(request)).toString());
	}
}