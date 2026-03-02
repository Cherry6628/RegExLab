package controller.tradeshowspecial;

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

import org.json.JSONObject;

@WebServlet("/employee-test-result")
public class EmployeeQuizResult extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		long end = System.currentTimeMillis();

		String csrfNew = CSRFService.setCSRFToken(request);
		String username = (String) request.getAttribute("AUTHENTICATED_USER");
		if (username == null) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Not Authenticated", csrfNew).toString());
			return;
		}

		Connection con = DBService.getConnection();
		try (PreparedStatement ps = con
				.prepareStatement("SELECT * FROM " + ParamsAndDBLoader.TABLE_EMPLOYEE_TEST_DETAILS
						+ " WHERE user_id=(SELECT id from " + ParamsAndDBLoader.TABLE_USERS + " WHERE username=?)")) {
			ps.setString(1, username);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {

				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Already Attempted", csrfNew).toString());
				return;
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", csrfNew).toString());
			return;
		}

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		JSONObject body = new JSONObject(sb.toString());
		String team = (String) request.getAttribute("TEAM_NAME");
		if (team == null) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Team Name Required", csrfNew).toString());
			return;
		}

		long start = -1;
		try {
			start = (long) request.getAttribute("START_TIME");
		} catch (Exception e) {
		}
		if (start == -1) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Starting Time Required", csrfNew).toString());
			return;
		}

		int score = body.getInt("score"); // TODO
		int time = (int) (end - start);
		team = team.strip();
		try (PreparedStatement ps = con
				.prepareStatement("INSERT INTO IGNORE " + ParamsAndDBLoader.TABLE_EMPLOYEE_TEST_DETAILS
						+ "(user_id, team, score, time) VALUES ((SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS
						+ " WHERE username=?), ?, ?, ?)")) {
			ps.setString(1, username);
			ps.setString(2, team);
			ps.setInt(3, score);
			ps.setInt(4, time);
			ps.executeUpdate();
			response.setStatus(201);
			JSONObject json = new JSONObject();
			json.put("score", score);
			json.put("time", time);
			json.put("points", (1.0 * score) / time);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.SUCCESS, "Updated", csrfNew, json).toString());
			return;
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", csrfNew).toString());
			return;
		}

	}

}
