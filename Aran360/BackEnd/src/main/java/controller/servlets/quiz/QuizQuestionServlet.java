package controller.servlets.quiz;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.pojo.Quiz;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import org.json.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;
@WebServlet("/quiz-questions")
public class QuizQuestionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		JSONObject body = new JSONObject(sb.toString());
		String title = body.getString("title");
		if (title == null || title.isBlank()) {
			response.sendRedirect("/test");
		}
		try {
			List <Quiz> question = ParamsAndDBLoader.getQuiz(title);
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