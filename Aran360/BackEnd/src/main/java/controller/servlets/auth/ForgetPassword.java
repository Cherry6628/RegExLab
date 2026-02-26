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
import service.utils.manager.MailingService;
import service.utils.manager.ValidatorService;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;

import org.json.JSONObject;

import com.mashape.unirest.http.exceptions.UnirestException;

@WebServlet("/forget-password")
public class ForgetPassword extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		JSONObject body = new JSONObject(sb.toString());

		String email = body.getString("email");
		String csrfNew = CSRFService.setCSRFToken(request);
		if (email == null || email.isEmpty() || email.isBlank()) {
			response.setStatus(400);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Email Address Required", csrfNew).toString());
			return;
		}
		if (ValidatorService.isValidEmail(email)) {
			try {
				String token = PasswordResetDAO.createPasswordResetToken(email);
				if (token == null)
					throw new SQLException("No Such Email Found");
				MailingService.sendEmail(email, "Action required: Reset your password", "Hello,\n\n"
						+ "We received a request to reset the password for your account.\n\n"
						+ "To continue, click the link below:\n"
						+ ParamsAndDBLoader.BACKEND_URL + "/reset-password?token=" + token + "\n\n"
						+ "This link will expire in 15 minutes for security reasons.\n\n"
						+ "If you did not request a password reset, you can safely ignore this email. No changes have been made to your account.\n\n"
						+ "If you continue to receive unexpected reset requests, we recommend reviewing your account security.\n\n"
						+ "—\n" + "Aran360");

				response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS,
						"Please follow the instructions in the mail sent to your email address to reset your password",
						csrfNew).toString());
				return;
			} catch (SQLException e) {
				e.printStackTrace();
				response.getWriter().write(JSONResponse
						.response(JSONResponse.ERROR, "No such email exists.  Please verify.", csrfNew).toString());
				return;
			}

		} else {
			response.getWriter().write(JSONResponse
					.response(JSONResponse.ERROR, "Please enter a Valid Email Address", csrfNew).toString());
			return;
		}
	}

}
