package controller.servlets.labs;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import model.helper.LabInstance;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;

@WebServlet("/lab/complete")
public class LabComplete extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String csrfNew = CSRFService.setCSRFToken(request);
		HttpSession session = request.getSession(false);
		if (session == null) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Unauthorized", csrfNew, null).toString());
			return;
		}

		@SuppressWarnings("unchecked")
		Map<String, LabInstance> labMap = (Map<String, LabInstance>) session.getAttribute("LAB_MAP");

		if (labMap == null || labMap.isEmpty()) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "No active lab", csrfNew, null).toString());
			return;
		}

		LabInstance activeLab = null;
		for (LabInstance lab : labMap.values()) {
			if (!lab.isExpired()) {
				activeLab = lab;
				break;
			}
		}

		if (activeLab == null) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "No active lab", csrfNew, null).toString());
			return;
		}

		try {
			String username = (String) request.getAttribute("AUTHENTICATED_USER");
			if (username == null) {
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Unauthorized", null, null).toString());
				return;
			}

			Connection con = DBService.getConnection();

			PreparedStatement userPs = con
					.prepareStatement("SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?");
			userPs.setString(1, username);
			ResultSet rs = userPs.executeQuery();
			if (!rs.next()) {
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "User not found", null, null).toString());
				return;
			}
			int userId = rs.getInt("id");
			System.out.println("userId: "+userId);
			PreparedStatement labPs = con
					.prepareStatement("SELECT id FROM " + ParamsAndDBLoader.TABLE_LABS + " WHERE image = ?");
			labPs.setString(1, activeLab.imageId);

			ResultSet labRs = labPs.executeQuery();

			if (!labRs.next()) {
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Lab not found", csrfNew, null).toString());
				return;
			}

			int labId = labRs.getInt("id");

			PreparedStatement checkPs = con.prepareStatement(
					"SELECT id FROM " + ParamsAndDBLoader.TABLE_LAB_ATTEMPTS + " WHERE user_id = ? AND lab_id = ?");
			checkPs.setInt(1, userId);
			checkPs.setInt(2, labId);

			ResultSet checkRs = checkPs.executeQuery();

			if (checkRs.next()) {

				PreparedStatement updatePs = con.prepareStatement("UPDATE " + ParamsAndDBLoader.TABLE_LAB_ATTEMPTS
						+ " SET status = 'Completed', completed_at = NOW() " + " WHERE user_id = ? AND lab_id = ?");
				updatePs.setInt(1, userId);
				updatePs.setInt(2, labId);

				updatePs.executeUpdate();

			} else {

				PreparedStatement insertPs = con.prepareStatement("INSERT INTO " + ParamsAndDBLoader.TABLE_LAB_ATTEMPTS
						+ " (user_id, lab_id, status, completed_at) VALUES (?, ?, 'Completed', NOW())");
				insertPs.setInt(1, userId);
				insertPs.setInt(2, labId);

				insertPs.executeUpdate();
			}
			response.getWriter()
			.write(JSONResponse
					.response(JSONResponse.SUCCESS, "Status Updated", csrfNew, null)
					.toString());
			return;
		} catch (Exception e) {
			e.printStackTrace();
			response.getWriter()
					.write(JSONResponse
							.response(JSONResponse.ERROR, "Something went wrong. Please try again later", csrfNew, null)
							.toString());
			return;
		}
	}
}