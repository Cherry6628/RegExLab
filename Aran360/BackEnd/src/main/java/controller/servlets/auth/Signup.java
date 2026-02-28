package controller.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;
import service.utils.manager.PBKDF2_Service;
import service.utils.auth.SessionManager;
import service.utils.manager.ValidatorService;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.SQLIntegrityConstraintViolationException;

@WebServlet("/signup")
public class Signup extends HttpServlet {
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

		String user = body.optString("username");
		String pass = body.optString("password");
		String email = body.optString("email");
		if (!ValidatorService.isValidEmail(email)) {
			response.setStatus(400);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Invalid Email", csrfNew).toString());
			return;
		}

		if (user == null || user.isBlank() || user.length() < 6) {
			response.setStatus(400);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Invalid Username", csrfNew).toString());
			return;
		}
		if (pass == null || pass.isBlank() || pass.length() < 8 || (!ValidatorService.isValidPassword(pass))) {
			response.setStatus(400);
			response.getWriter().write(
					JSONResponse.response(JSONResponse.ERROR, "Try using a strong password", csrfNew).toString());
			return;
		}

		String hashedPass = PBKDF2_Service.object.hash(pass);

		try {
			String query = "INSERT INTO " + ParamsAndDBLoader.TABLE_USERS
					+ " (username, email, password_hash) VALUES (?, ?, ?)";
			PreparedStatement pstmt = DBService.getConnection().prepareStatement(query);
			pstmt.setString(1, user);
			pstmt.setString(2, email);
			pstmt.setString(3, hashedPass);
			pstmt.executeUpdate();

			String token = SessionManager.createSession(user, request, DBService.getConnection());
			Login.setAuthCookie(response, token);

			response.setStatus(201);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.SUCCESS, "Signup Successful", csrfNew).toString());
		} catch (SQLIntegrityConstraintViolationException e) {
			e.printStackTrace();
			response.setStatus(409);
			response.getWriter().write(JSONResponse
					.response(JSONResponse.ERROR, "User exists, Try with different username or email address", csrfNew)
					.toString());
		} catch (Exception e) {
			e.printStackTrace();

			response.setStatus(500);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", csrfNew).toString());
		}
	}
}