package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import service.helper.model.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.JWTService;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import configs.Params;

@WebServlet("/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");

		String username = getAuthenticatedUser(request);
		Map<String, String> map = new HashMap<>();
		map.put("username", username);
		if (username != null) {
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Already Logged in", null, map).toString());
			return;
		} else {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Not Logged in", null).toString());
			return;
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		JSONObject json = new JSONObject();

		String csrfNew = CSRFService.setCSRFToken(request);
		if (getAuthenticatedUser(request) != null) {
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Already Logged in", csrfNew).toString());
			return;
		}
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String requestBodyLine=null;
		while((requestBodyLine=reader.readLine())!=null) {
			sb.append(requestBodyLine);
		}
		JSONObject requestBody = new JSONObject(sb.toString());
		
		String user = requestBody.getString("email");
		String pass = requestBody.getString("password");

		if (isValidUser(user, pass)) {
			String token = JWTService.generateToken(user);
			StringBuilder cookie = new StringBuilder();
			cookie.append("AUTH_TOKEN=").append(token).append("; ");
			cookie.append("Path=/; ");
			cookie.append("Domain=").append(Params.COOKIE_DOMAIN).append("; ");
			cookie.append("Max-Age=").append(Params.JWT_EXPIRY / 1000).append("; ");
			cookie.append("HttpOnly; ");
			cookie.append("Secure; ");
			cookie.append("SameSite=None");
			response.addHeader("Set-Cookie", cookie.toString());
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Login Successful", csrfNew).toString());
			return;
		} else {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			json.put("status", "error");
			json.put("message", "Invalid credentials");
			response.getWriter().write(json.toString());
		}
	}

	private String getAuthenticatedUser(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie c : cookies) {
				if ("AUTH_TOKEN".equals(c.getName()))
					return JWTService.validate(c.getValue());
			}
		}
		return null;
	}

	private boolean isValidUser(String username, String password) {
		return "admin".equals(username) && "password123".equals(password);
	}
}