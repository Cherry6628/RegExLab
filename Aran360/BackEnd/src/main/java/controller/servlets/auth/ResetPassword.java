package controller.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.dao.PasswordResetDAO;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;
import service.utils.manager.PBKDF2_Service;
import service.utils.manager.ValidatorService;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.json.JSONObject;

@WebServlet("/reset-pwd")
public class ResetPassword extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		JSONObject body = new JSONObject(sb.toString());
		String token = body.getString("token");
		String pass = body.getString("pass");
		String repeat_pass = body.getString("repeat_pass");
		String csrfNew = CSRFService.setCSRFToken(request);
		if (token == null || token.isBlank()) {
			response.setStatus(400);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Token needed", csrfNew).toString());
			return;
		}
		if (pass == null || pass.isBlank() || repeat_pass == null || repeat_pass.isBlank() || !pass.equals(repeat_pass)) {
			response.setStatus(400);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Passwords didn't match", csrfNew).toString());
			return;
		}
		if (pass.length()<8 || !ValidatorService.isValidPassword(pass)) {
			response.setStatus(400);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Passwords didn't match", csrfNew).toString());
			return;	
		}
		Connection con = DBService.getConnection();
		try {
			con.setAutoCommit(true);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try (PreparedStatement pstmt = con
				.prepareStatement("UPDATE " + ParamsAndDBLoader.TABLE_USERS + " SET password_hash = ? WHERE email = ?");
				PreparedStatement pstmt2 = con.prepareStatement("UPDATE " + ParamsAndDBLoader.TABLE_PASSWORD_RESET
						+ " SET expires_at = CURRENT_TIMESTAMP WHERE user_id = (SELECT id FROM "
						+ ParamsAndDBLoader.TABLE_USERS + " WHERE email = ?)")) {
			String email = PasswordResetDAO.getEmail(token);
			if (email == null) {
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Invalid Token", csrfNew).toString());
				return;
			}
			System.out.println(pass);
			pstmt.setString(2, email);
			pstmt.setString(1, PBKDF2_Service.object.hash(pass));
			pstmt2.setString(1, email);
			pstmt.executeUpdate();
			pstmt2.executeUpdate();
			response.getWriter().write(
					JSONResponse.response(JSONResponse.SUCCESS, "Password Reset Successful", csrfNew).toString());
			return;

		} catch (SQLException e) {
			e.printStackTrace();
			response.getWriter().write(JSONResponse
					.response(JSONResponse.ERROR, "Invalid Token / Something went wrong", csrfNew).toString());
			return;
		}

	}
}
