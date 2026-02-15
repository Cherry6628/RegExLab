package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import service.helper.model.JSONResponse;
import service.utils.manager.CSRFService;

import java.io.IOException;

import configs.ParamsLoader;

@WebServlet("/logout")
public class Logout extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String cookieHeader = String.format(
				"AUTH_TOKEN=; Path=/; Domain=%s; HttpOnly; Secure; SameSite=None; Max-Age=0",
				ParamsLoader.COOKIE_DOMAIN);
		String csrfNew = CSRFService.setCSRFToken(request);
		response.addHeader("Set-Cookie", cookieHeader);
		response.setContentType("application/json");
		response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Logged out"+csrfNew).toString());
	}
}