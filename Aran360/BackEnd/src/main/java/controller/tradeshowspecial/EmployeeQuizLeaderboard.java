package controller.tradeshowspecial;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.json.JSONObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import service.utils.manager.DBService;

@WebServlet("/employee-quiz-leaderboard")
public class EmployeeQuizLeaderboard extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String csrfNew = null;
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		JSONObject json = new JSONObject();
		Connection con = DBService.getConnection();
		try {

			try (PreparedStatement ps = con.prepareStatement("SELECT u.username, e.team, "
					+ "(1000.0 * POW(e.score, 2) / SQRT(e.time + 1)) AS points " + "FROM "
					+ ParamsAndDBLoader.TABLE_EMPLOYEE_TEST_DETAILS + " e " + "JOIN " + ParamsAndDBLoader.TABLE_USERS
					+ " u ON e.user_id = u.id " + "WHERE e.time > 0 " + "ORDER BY points DESC LIMIT 10")) {

				ResultSet rs = ps.executeQuery();
				org.json.JSONArray topUsers = new org.json.JSONArray();

				while (rs.next()) {
					JSONObject user = new JSONObject();
					user.put("username", rs.getString("username"));
					user.put("team", rs.getString("team"));
					user.put("points", rs.getDouble("points"));
					topUsers.put(user);
				}

				json.put("topUsers", topUsers);
			}

			String username = (String) request.getAttribute("AUTHENTICATED_USER");
			System.out.println("Is Logged in " + username);
			if (username != null) {
				try (PreparedStatement currentUserPs = con.prepareStatement(
						"SELECT u.username, e.team, " +
								"(1000.0 * POW(e.score, 2) / SQRT(e.time + 1)) AS points " +
								"FROM " + ParamsAndDBLoader.TABLE_EMPLOYEE_TEST_DETAILS + " e " +
								"JOIN " + ParamsAndDBLoader.TABLE_USERS + " u ON e.user_id = u.id " +
								"WHERE u.username = ? AND e.time > 0")) {
					currentUserPs.setString(1, username);
					ResultSet currentRs = currentUserPs.executeQuery();
					if (currentRs.next()) {
						double points = currentRs.getDouble("points");
						System.out.println(points);
						try (PreparedStatement rankPs = con.prepareStatement(
								"SELECT COUNT(*) + 1 AS `rank` FROM " +
										ParamsAndDBLoader.TABLE_EMPLOYEE_TEST_DETAILS +
										" WHERE (1000.0 * POW(score, 2) / SQRT(time + 1)) > ?")) {

							rankPs.setDouble(1, points);
							ResultSet rankRs = rankPs.executeQuery();

							int rank = 1;
							if (rankRs.next()) {
								rank = rankRs.getInt("rank");
							}

							JSONObject currentUser = new JSONObject();
							currentUser.put("username", currentRs.getString("username"));
							currentUser.put("team", currentRs.getString("team"));
							currentUser.put("points", points);
							currentUser.put("rank", rank);

							json.put("currentUser", currentUser);
							System.out.println(json);
						}
					}
				}
			}

			response.getWriter()
					.write(JSONResponse.response(JSONResponse.SUCCESS, "Data retrieved", csrfNew, json).toString());

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Something went wrong", csrfNew).toString());
		}
	}
}