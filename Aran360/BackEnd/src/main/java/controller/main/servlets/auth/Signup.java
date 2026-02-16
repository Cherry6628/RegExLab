package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import service.helper.model.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.JWTService;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import jakarta.servlet.http.Cookie;

import configs.ParamsLoader;

@WebServlet("/signup")
public class Signup extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");

		String csrfNew = CSRFService.setCSRFToken(request);
		String existingUser = getAuthenticatedUser(request);
		if (existingUser != null) {
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Already logged in as "+existingUser, csrfNew).toString());
			return;
		}
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String requestBodyLine=null;
		while((requestBodyLine=reader.readLine())!=null) {
			sb.append(requestBodyLine);
		}
		JSONObject requestBody = new JSONObject(sb.toString());
		
		String user = requestBody.getString("username");
		String pass = requestBody.getString("password");
		String email = requestBody.getString("email");
		System.out.println(user);
		System.out.println(pass);
		System.out.println(email);

		if (user == null || pass == null || user.isEmpty() || pass.length() < 8) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Invalid input. Username required and password must be 8+ chars.", csrfNew).toString());
			return;
		}

		if (registerUser(user, pass, email)) {
			String token = JWTService.generateToken(user);

			StringBuilder cookie = new StringBuilder();
			cookie.append("AUTH_TOKEN=").append(token).append("; ");
			cookie.append("Path=/; ");
			cookie.append("Domain=").append(ParamsLoader.COOKIE_DOMAIN).append("; ");
			cookie.append("Max-Age=").append(ParamsLoader.JWT_EXPIRY / 1000).append("; ");
			cookie.append("HttpOnly; ");
			cookie.append("Secure; ");
			cookie.append("SameSite=None");

			response.addHeader("Set-Cookie", cookie.toString());

			response.setStatus(HttpServletResponse.SC_CREATED);
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Registration successful", csrfNew).toString());
			return;
		} else {
			response.setStatus(HttpServletResponse.SC_CONFLICT);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Username or Email already taken", csrfNew).toString());
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
	
	public class User{String email,password;User(String email,String pwd){this.email=email;this.password=pwd;}}
	public static Map<String, User> users = new HashMap<>();
	private boolean registerUser(String username, String password, String email) {
		// DB Logic here
		System.out.println(username);
		System.out.println(password);
		System.out.println(email);
		users.put(username, new User(email, password));
		return true;
	}
}