package controller.servlets.auth;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;

import java.io.IOException;

@WebServlet("/csrf")
public class CSRFServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		HttpSession session = req.getSession(false);
		if (session != null) {
			System.out.println(session.getId() + " exists and was invalidated.");
			session.invalidate();
		}
		session = req.getSession(true);
		System.out.println(session.getId() + " session created");
		String csrfToken = CSRFService.csrfToken();
		session.setAttribute("csrfToken", csrfToken);
		System.out.println(session.getId() + " " + csrfToken);
		resp.setContentType("application/json");
		resp.getWriter().write(JSONResponse.response("success", "CSRF Token Generated.", csrfToken).toString());
	}
}
