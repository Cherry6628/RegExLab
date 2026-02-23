package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

import configs.ParamsAndDBLoader;


@WebServlet("/user-data")
public class UserData extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject json = new JSONObject();
		String uname = (String) request.getAttribute("AUTHENTICATED_USER");
		json.put("uname", uname);
		Connection con = DBService.getConnection();
		String email = "no-email@domain.com";
		try( PreparedStatement ps = con.prepareStatement("SELECT email from "+ParamsAndDBLoader.TABLE_USERS+" WHERE username = ?")) {
		
			ps.setString(1, uname);
			ResultSet rs = ps.executeQuery();
			rs.next();

			email = rs.getString("email");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		json.put("email", email);
		
		
		int lc = 23, la = 12;
		json.put("labsCompleted", lc);
		json.put("labsAbandoned", la);
		json.put("labsAttempted", lc+la);
		response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "User Authenticated", null, json).toString());
	}


}
