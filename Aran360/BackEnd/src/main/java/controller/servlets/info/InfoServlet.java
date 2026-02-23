package controller.servlets.info;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.helper.JSONResponse;

import java.io.IOException;

import org.json.JSONObject;


@WebServlet("/info")
public class InfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject json = new JSONObject();
		json.put("totalLabs", 150);
		response.getWriter().append(JSONResponse.response(JSONResponse.SUCCESS, "Metadata fetched", null, json).toString());
	}


}
