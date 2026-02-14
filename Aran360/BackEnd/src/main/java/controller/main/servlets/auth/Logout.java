package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import configs.Params;

@WebServlet("/logout")
public class Logout extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String cookieHeader = String.format(
				"AUTH_TOKEN=; Path=/; Domain=%s; HttpOnly; Secure; SameSite=None; Max-Age=0",
				Params.COOKIE_DOMAIN);

		response.addHeader("Set-Cookie", cookieHeader);
		response.setContentType("application/json");
		response.getWriter().write("{\"status\":\"success\", \"message\":\"Logged out\"}");
	}
}