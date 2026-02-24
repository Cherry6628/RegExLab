package controller.servlets.auth.user;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

@WebServlet("/saveLearningProgress")
public class SaveLastLearntPage extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String csrfNew = CSRFService.setCSRFToken(request);

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		JSONObject body = new JSONObject(sb.toString());
		String topic_url = body.getString("topic_url");
		String page_id = body.isNull("page_id")?null:body.getString("page_id");

		Connection con = DBService.getConnection();

		int userId = -1;
		String username = (String) request.getAttribute("AUTHENTICATED_USER");
		if (username == null) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Not Authenticated", csrfNew).toString());
			return;
		}
		try (PreparedStatement userPstmt = con
				.prepareStatement("SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?")) {
			userPstmt.setString(1, username);
			try (ResultSet rs = userPstmt.executeQuery()) {
				if (!rs.next())
					throw new SQLException("User not found: " + username);
				userId = rs.getInt("id");
			}
		} catch (SQLException e1) {
			e1.printStackTrace();
		}
		if (userId == -1) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", csrfNew).toString());
			return;
		}
		try (PreparedStatement ps = con.prepareStatement("INSERT INTO " + ParamsAndDBLoader.TABLE_LEARNING_PROGRESS
				+ " (user_id, topic_url, page_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE topic_url = VALUES(topic_url),page_id = VALUES(page_id),updated_at = CURRENT_TIMESTAMP;")) {
			ps.setInt(1, userId);
			ps.setString(2, topic_url);
			ps.setString(3, page_id);
			ps.executeUpdate();
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Updated", csrfNew).toString());
			return;
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(500);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", csrfNew).toString());
			return;
		}
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Connection con = DBService.getConnection();
		int userId = -1;
		String username = (String) request.getAttribute("AUTHENTICATED_USER");
		if (username == null) {
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Not Authenticated").toString());
			return;
		}
		try (PreparedStatement userPstmt = con
				.prepareStatement("SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?")) {
			userPstmt.setString(1, username);
			try (ResultSet rs = userPstmt.executeQuery()) {
				if (!rs.next())
					throw new SQLException("User not found: " + username);
				userId = rs.getInt("id");
			}
		} catch (SQLException e1) {
			e1.printStackTrace();
			response.setStatus(500);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong").toString());
			return;
		}
		if (userId == -1) {
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong").toString());
			return;
		}
		try (PreparedStatement ps = con.prepareStatement(
				"SELECT topic_url, page_id FROM " + ParamsAndDBLoader.TABLE_LEARNING_PROGRESS + " WHERE user_id = ?")) {
			ps.setInt(1, userId);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				JSONObject json = new JSONObject();
				json.put("topic_url", rs.getString("topic_url"));

				String page_id = rs.getString("page_id");
				json.put("page_id", page_id == null ? JSONObject.NULL : page_id);

				response.getWriter().write(JSONResponse
						.response(JSONResponse.SUCCESS, "Data fetched successfully", null, json).toString());
				return;
			}
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "No Data Found").toString());
			return;
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(500);
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong").toString());
			return;
		}
	}

}
