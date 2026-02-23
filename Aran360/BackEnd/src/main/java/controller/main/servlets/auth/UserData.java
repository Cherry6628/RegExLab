package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;

import java.io.IOException;

import org.json.JSONObject;


@WebServlet("/user-data")
public class UserData extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject json = new JSONObject();
		json.put("uname", request.getAttribute("AUTHENTICATED_USER"));
		int lc = 23, la = 12;
		json.put("labsCompleted", lc);
		json.put("labsAbandoned", la);
		json.put("labsAttempted", lc+la);
		response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "User Authenticated", null, json).toString());
	}


}
