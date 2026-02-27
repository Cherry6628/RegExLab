package controller.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import service.utils.auth.SessionManager;
import service.utils.manager.*;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.*;

@WebServlet("/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		String csrfNew = CSRFService.setCSRFToken(request);

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		JSONObject body = new JSONObject(sb.toString());

		String username = body.optString("username");
		String password = body.optString("password");

		try {
			String query = "SELECT password_hash FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?";
			PreparedStatement pstmt = DBService.getConnection().prepareStatement(query);
			pstmt.setString(1, username);
			ResultSet rs = pstmt.executeQuery();

			if (rs.next() && PBKDF2_Service.object.verify(rs.getString("password_hash"), password)) {
				String token = SessionManager.createSession(username, request, DBService.getConnection());
				setAuthCookie(response, token);
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.SUCCESS, "Login Successful", csrfNew).toString());
				return;
			} else {
				response.setStatus(401);
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Invalid Credentials", csrfNew).toString());
				return;
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
			response.getWriter()
					.write(JSONResponse
							.response(JSONResponse.ERROR, "Something went wrong, Please try again later.", csrfNew)
							.toString());
			return;
		}
	}

	public static void setAuthCookie(HttpServletResponse response, String token) {
		String cookieHeader = String.format(
				"AUTH_TOKEN=%s; Path=/; Domain=%s; HttpOnly; Secure; SameSite=None; Max-Age=%d", token,
				ParamsAndDBLoader.COOKIE_DOMAIN, ParamsAndDBLoader.JWT_EXPIRY / 1000);
		response.addHeader("Set-Cookie", cookieHeader);
	}
}