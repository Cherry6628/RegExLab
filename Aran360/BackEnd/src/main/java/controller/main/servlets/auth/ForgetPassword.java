package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.MailingService;

import java.io.BufferedReader;
import java.io.IOException;

import org.json.JSONObject;

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
		if (email==null||email.isEmpty()||email.isBlank()) {
			response.setStatus(400);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Email Address Required", csrfNew).toString());
			return;
		}
//		MailingService.sendEmail(email);
		//TODO
	}

}
