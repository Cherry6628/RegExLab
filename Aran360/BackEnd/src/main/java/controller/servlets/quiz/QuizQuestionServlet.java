package controller.servlets.quiz;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.pojo.Quiz;
import service.utils.manager.DBService;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;
@WebServlet("/quiz-questions")
public class QuizQuestionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static List<Quiz> getQuiz(String name) throws SQLException {
		Connection con = DBService.getConnection();
		ArrayList <Quiz> questions = new ArrayList<>();
		String query = "Select id from learning_topics where topic = ?";
		String query1 =  "SELECT * from quiz where topic_id = ?";
		String query2 = "SELECT * from quiz_options where quiz_id = ?";
		try (PreparedStatement ps = con.prepareStatement(query); PreparedStatement ps1 = con.prepareStatement(query1);PreparedStatement ps2 = con.prepareStatement(query2)){
			ps.setString(1, name);
			System.out.println(name);
			ResultSet rs = ps.executeQuery();
			int id = 0;
			if(rs.next()) {
				id = rs.getInt("id");
   			}
			System.out.println(id);
			ps1.setInt(1, id);
			ResultSet rs1 = ps1.executeQuery();
			while(rs1.next()) {
				int qid = rs1.getInt("id");
				int topicId = rs1.getInt("topic_id");
				String headline = rs1.getString("headline");
				String description = rs1.getString("description");
				String question = rs1.getString("question");
				String language = rs1.getString("language");
				boolean isCode = rs1.getInt("is_code")== 1;
				String code = rs1.getString("code");
				int correctIndex = rs1.getInt("correct_index");
				ps2.setInt(1, qid);
				ResultSet rs2 = ps2.executeQuery();
				ArrayList <String> options = new ArrayList<>();
				while(rs2.next()) {
					int oid = rs2.getInt("id");
					int quizId = rs2.getInt("quiz_id");
					String option = rs2.getString("option_text");
					int order = rs2.getInt("option_order");
					options.add(option);
				}
				Quiz q = new Quiz(qid, topicId, headline, description, question, language, isCode, code, options);
				questions.add(q);
			}
			return questions;
		}
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		JSONObject body = new JSONObject(sb.toString());
		String title = body.getString("topic");
		if (title == null || title.isBlank()) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Topic is missing");
		    return;
		}
		System.out.println(title);
		try {
			List <Quiz> question = getQuiz(title);
			ObjectMapper mapper = new ObjectMapper();
	        String jsonResponse = mapper.writeValueAsString(question);
	        response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonResponse);
		} catch (SQLException e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}
}