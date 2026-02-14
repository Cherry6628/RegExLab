package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import service.utils.manager.JWTService;

import java.io.IOException;
import jakarta.servlet.http.Cookie;
import org.json.JSONObject;

import configs.Params;

@WebServlet("/signup")
public class Signup extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		JSONObject json = new JSONObject();

		String existingUser = getAuthenticatedUser(request);
		if (existingUser != null) {
			json.put("status", "success");
			json.put("message", "Already logged in as " + existingUser);
			response.getWriter().write(json.toString());
			return;
		}

		String user = request.getParameter("username");
		String pass = request.getParameter("password");
		String email = request.getParameter("email");

		if (user == null || pass == null || user.isEmpty() || pass.length() < 8) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			json.put("status", "error");
			json.put("message", "Invalid input. Username required and password must be 8+ chars.");
			response.getWriter().write(json.toString());
			return;
		}

		if (registerUser(user, pass, email)) {
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

			response.setStatus(HttpServletResponse.SC_CREATED);
			json.put("status", "success");
			json.put("message", "Registration successful");
			response.getWriter().write(json.toString());
		} else {
			response.setStatus(HttpServletResponse.SC_CONFLICT);
			json.put("status", "error");
			json.put("message", "Username or Email already taken");
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

	private boolean registerUser(String username, String password, String email) {
		// DB Logic here
		return true;
	}
}