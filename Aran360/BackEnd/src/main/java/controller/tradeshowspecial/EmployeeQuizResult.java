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
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import org.json.JSONObject;

@WebServlet("/employee-quiz-results")
public class EmployeeQuizResult extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static class Team {
		String team;
		long time;
		Team(String team, long time) {
			this.team = team;
			this.time = time;
		}
	}
	static Map<String, Team> map = new ConcurrentHashMap<>();
	public static void updateTeam(String username, String team, long time) {
		map.put(username, new Team(team, time));
	}

	public static int getResult(Map<Integer, String> answers) throws SQLException {
		Connection con = DBService.getConnection();
		int score = 0;
		try (PreparedStatement ps1 = con.prepareStatement("SELECT correct_index FROM quiz WHERE id = ?");
				PreparedStatement ps2 = con.prepareStatement(
						"SELECT option_text FROM quiz_options WHERE quiz_id = ? AND option_order = ?")) {

			for (Entry<Integer, String> entry : answers.entrySet()) {
				int quizId = entry.getKey();
				String userAnswer = entry.getValue();

				ps1.setInt(1, quizId);
				ResultSet rs1 = ps1.executeQuery();

				if (rs1.next()) {
					int correctIndex = rs1.getInt("correct_index");
					System.out.println("Correct Index: " + correctIndex);

					ps2.setInt(1, quizId);
					ps2.setInt(2, correctIndex);
					ResultSet rs2 = ps2.executeQuery();
					if (rs2.next()) {
						String correctOption = rs2.getString("option_text");
						System.out.println("Correct Option: '" + correctOption + "'");

						String trimmedUserAnswer = userAnswer.trim();
						String trimmedCorrectOption = correctOption.trim();
						if (trimmedCorrectOption.equals(trimmedUserAnswer))
							score++;
					}
					rs2.close();
				}
				rs1.close();
			}

			return score;
		}
	}
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
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		reader.close();
		JSONObject body = new JSONObject(sb.toString());

		Map<Integer, String> answers = new HashMap<>();

		for (String key : body.keySet()) {
			if (key.equals("csrfToken"))
				continue;
			try {
				int quizId = Integer.parseInt(key);
				String answer = body.getString(key);
				answers.put(quizId, answer);
			} catch (NumberFormatException e) {
				continue;
			}
		}

		try {
			int result = getResult(answers);
			Team t = map.get(username);
			map.remove(username);
			String team = t.team;
			System.out.println("team: " + team);
			if (team == null) {
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Team Name Required", csrfNew).toString());
				return;
			}
			long start = t.time;
			if (start == -1) {
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Starting Time Required", csrfNew).toString());
				return;
			}

			int score = result;
			int time = (int) (end - start);
			team = team.strip();
			try (PreparedStatement ps = con
					.prepareStatement("INSERT IGNORE INTO " + ParamsAndDBLoader.TABLE_EMPLOYEE_TEST_DETAILS
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
				json.put("points", (100000.0 * score) / time);
				json.put("correctAnswerCount", result);
				json.put("totalQuestions", answers.size());
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.getWriter().write(
						JSONResponse.response(JSONResponse.SUCCESS, "Answers Validated", csrfNew, json).toString());
				return;
			} catch (Exception e) {
				e.printStackTrace();
				response.setStatus(500);
				response.getWriter()
						.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", csrfNew).toString());
				return;
			}

		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(JSONResponse
					.response(JSONResponse.ERROR, "Something went wrong, Please try again later.", csrfNew).toString());
			return;
		}

	}
}
