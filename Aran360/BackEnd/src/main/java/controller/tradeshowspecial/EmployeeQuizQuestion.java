package controller.tradeshowspecial;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import model.pojo.Quiz;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/employee-quiz-questions")
public class EmployeeQuizQuestion extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public static List<Quiz> getQuiz() throws SQLException {
		Connection con = DBService.getConnection();
		ArrayList<Quiz> questions = new ArrayList<>();
		try (PreparedStatement ps1 = con.prepareStatement(
				"SELECT * FROM quiz ORDER BY RAND() LIMIT " + ParamsAndDBLoader.QUIZ_COUNT_PER_ATTEMPT);
				PreparedStatement ps2 = con.prepareStatement("SELECT * FROM quiz_options WHERE quiz_id = ?")) {
			ResultSet rs1 = ps1.executeQuery();
			while (rs1.next()) {
				int qid = rs1.getInt("id");
				int topicId = rs1.getInt("topic_id");
				String headline = rs1.getString("headline");
				String description = rs1.getString("description");
				String question = rs1.getString("question");
				String language = rs1.getString("language");
				int hasCode = rs1.getInt("is_code");
				System.out.println("isCode" + hasCode);
				String code = rs1.getString("code");
				ps2.setInt(1, qid);
				ResultSet rs2 = ps2.executeQuery();
				ArrayList<String> options = new ArrayList<>();
				while (rs2.next())
					options.add(rs2.getString("option_text"));
				Quiz q = new Quiz(qid, topicId, headline, description, question, language, hasCode, code, options);
				questions.add(q);
			}
			return questions;
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String csrfNew = CSRFService.setCSRFToken(request);
		String username = (String) request.getAttribute("AUTHENTICATED_USER");

		if (username == null) {
		    response.getWriter()
		        .write(JSONResponse.response(JSONResponse.ERROR, "Not Authenticated", csrfNew).toString());
		    return;
		}

		Connection con = DBService.getConnection();

		try (PreparedStatement ps = con.prepareStatement(
		        "SELECT 1 FROM " + ParamsAndDBLoader.TABLE_EMPLOYEE_TEST_DETAILS +
		        " WHERE user_id = (SELECT id FROM " +
		        ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?)")) {

		    ps.setString(1, username);
		    ResultSet rs = ps.executeQuery();

		    if (rs.next()) {
		        response.getWriter()
		            .write(JSONResponse.response(JSONResponse.ERROR, "Already Attempted", csrfNew).toString());
		        return;
		    }

		} catch (Exception e) {
		    e.printStackTrace();
		    response.setStatus(500);
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
		String team = body.getString("team");
		if (team == null || team.isBlank()) {
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.ERROR, "Team Name Required", csrfNew).toString());
			return;
		}
		long start = System.currentTimeMillis();
		// request.setAttribute("START_TIME", start);
		// request.setAttribute("TEAM_NAME", team);
		EmployeeQuizResult.updateTeam((String)request.getAttribute("AUTHENTICATED_USER"), team, start);
		System.out.println("Team name set: "+team+" start: "+start);
		try {
			List<Quiz> question = getQuiz();
			JSONArray questionsArray = new JSONArray();
			for (Quiz q : question) {
				JSONObject qJson = new JSONObject();
				qJson.put("id", q.getQid());
				qJson.put("topicId", q.getTopicId());
				qJson.put("headline", q.getHeadline());
				qJson.put("description", q.getDescription());
				qJson.put("question", q.getQuestion());
				qJson.put("language", q.getLanguage());
				qJson.put("hasCode", q.hasCode());
				qJson.put("code", q.getCode());
				qJson.put("options", q.getOptions());
				questionsArray.put(qJson);
			}

			JSONObject responseData = new JSONObject();
			responseData.put("questions", questionsArray);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(
					JSONResponse.response(JSONResponse.SUCCESS, "Answers Validated", csrfNew, responseData).toString());
		} catch (SQLException e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(JSONResponse
					.response(JSONResponse.ERROR, "Something went wrong, Please try again later.", csrfNew).toString());
		}
	}
}