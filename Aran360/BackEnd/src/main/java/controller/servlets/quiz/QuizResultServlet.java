package controller.servlets.quiz;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/quiz-results")
public class QuizResultServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public static int getResult(Map<Integer, String> answers) throws SQLException {
		
		Connection con = DBService.getConnection();
		int score = 0;
		String query1 = "SELECT correct_index from quiz where id = ?";
		String query2 = "SELECT option_text from quiz_options where quiz_id = ? AND option_order =?";
		try (PreparedStatement ps1 = con.prepareStatement(query1);
				PreparedStatement ps2 = con.prepareStatement(query2)) {
			for (Entry<Integer, String> es : answers.entrySet()) {
				int id = es.getKey();
				ps1.setInt(1, id);
				System.out.println("\t\tid in first for loop"+id);
				ResultSet rs1 = ps1.executeQuery();
				if (rs1.next()) {
					int correctIndex = rs1.getInt("correct_index");
					ps2.setInt(1, id);
					ps2.setInt(2, correctIndex);
					System.out.println("\t\tid inside if: "+id);
					System.out.println("\t\tcorrect:"+correctIndex);
					ResultSet rs2 = ps2.executeQuery();
					if (rs2.next()) {
						String option = rs2.getString("option_text");
						if (option == es.getValue()) {
							score++;
							System.out.println("\t\tscore: "+score);
						}
					}
				}
			}
			System.out.println("\t\tfinal score: "+score);
			return score;
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String csrfNew = CSRFService.setCSRFToken(request);
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		JSONObject body = new JSONObject(sb.toString());
		Map<Integer, String> answers = new HashMap<>();
		for (String key : body.keySet()) {
			if (key.equals("csrfToken"))
				continue;
			try {
				answers.put(Integer.parseInt(key), body.getString(key));
			} catch (Exception e) {
				continue;
			}
		}
		int result;
		try {
			result = getResult(answers);
			JSONObject json = new JSONObject();
			json.put("correctAnswerCount", result);
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Answers Validated", csrfNew, json).toString());
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(500);
			response.getWriter().write(JSONResponse
					.response(JSONResponse.ERROR, "Something went wrong, Please try again later.", csrfNew).toString());
			return;
		}

	}
}