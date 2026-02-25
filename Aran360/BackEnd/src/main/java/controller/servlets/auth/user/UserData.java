package controller.servlets.auth.user;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import service.utils.manager.DBService;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

@WebServlet("/user-data")
public class UserData extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		JSONObject json = new JSONObject();
		String uname = (String) request.getAttribute("AUTHENTICATED_USER");
		json.put("uname", uname);
		Connection con = DBService.getConnection();

		String email = null;
		try (PreparedStatement ps = con
				.prepareStatement("SELECT email FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?")) {
			ps.setString(1, uname);
			ResultSet rs = ps.executeQuery();
			if (rs.next())
				email = rs.getString("email");
		} catch (Exception e) {
			e.printStackTrace();
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", null, json).toString());
			return;
		}
		json.put("email", email);

		int labsCompleted = 0, labsAttempted = 0, labsAbandoned = 0;
		try (PreparedStatement ps1 = con
				.prepareStatement("select count(*) as c from " + ParamsAndDBLoader.TABLE_LAB_ATTEMPTS
						+ " a where a.user_id = (SELECT id from "
						+ ParamsAndDBLoader.TABLE_USERS + " WHERE username=?);");
				PreparedStatement ps2 = con
						.prepareStatement("select count(*) as c from " + ParamsAndDBLoader.TABLE_LAB_ATTEMPTS
								+ " a where a.status = 'Completed' and a.user_id = (SELECT id from "
								+ ParamsAndDBLoader.TABLE_USERS + " WHERE username=?);");) {
			ps1.setString(1, uname);
			ps2.setString(1, uname);
			ResultSet rs = ps1.executeQuery();
			rs.next();
			labsAttempted = rs.getInt(1);
			rs = ps2.executeQuery();
			rs.next();
			labsCompleted = rs.getInt(1);
			labsAbandoned = labsAttempted-labsCompleted;

		} catch (SQLException e) {
			e.printStackTrace();
		}


		json.put("labsCompleted", labsCompleted);
		json.put("labsAttempted", labsAttempted);
		json.put("labsAbandoned", labsAbandoned);

		response.getWriter()
				.write(JSONResponse.response(JSONResponse.SUCCESS, "User Authenticated", null, json).toString());
	}
}