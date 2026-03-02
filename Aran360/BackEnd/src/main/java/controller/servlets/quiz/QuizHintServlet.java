package controller.servlets.quiz;
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
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import org.json.JSONException;
import org.json.JSONObject;
@WebServlet("/quiz-hint")
public class QuizHintServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static String getQuestion(int id) throws SQLException {
		Connection con = DBService.getConnection();
		String query1 =  "SELECT question,is_code,code from quiz where id = ?";
		String query2 = "SELECT option_text from quiz_options where quiz_id = ?";
		try (PreparedStatement ps1 = con.prepareStatement(query1);PreparedStatement ps2 = con.prepareStatement(query2)){
			ps1.setInt(1, id);
			ResultSet rs1 = ps1.executeQuery();
			if(rs1.next()) {
				String question = rs1.getString("question");
				int hasCode = rs1.getInt("is_code");
				String code = rs1.getString("code");
				ps2.setInt(1, id);
				ResultSet rs2 = ps2.executeQuery();
				ArrayList <String> options = new ArrayList<>();
				while(rs2.next()) {
					String option = rs2.getString("option_text");
					options.add(option);
				}
				StringBuilder sb = new StringBuilder();
		        sb.append(question);
		        if(hasCode == 1 && code != null && !code.isEmpty()) {
		              sb.append("\n").append("```").append("\n").append(code).append("\n").append("```");
		        }
		        sb.append("\nOptions: ").append(options.toString());
                return sb.toString();
			}
		}
		return "Question not found";
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
		String csrfNew = CSRFService.setCSRFToken(request);
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		JSONObject body = new JSONObject(sb.toString());
	    int id  = body.getInt("id");
	    String questionFromDB = null;
		try {
			questionFromDB = getQuestion(id);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		String key = ParamsAndDBLoader.AI_HINT_KEY;
		JSONObject payload = new JSONObject();
		payload.put("prompt", questionFromDB);
		payload.put("x-api-key", key);
		String json = payload.toString();
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest req = HttpRequest.newBuilder().uri(URI.create(ParamsAndDBLoader.AI_HINT_API)).header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build();
		try {
			JSONObject jsonResponse = new JSONObject(client.send(req, HttpResponse.BodyHandlers.ofString()).body());
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "hint given", csrfNew,jsonResponse).toString());
		} catch (JSONException e) {
			e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(JSONResponse.response(JSONResponse.ERROR,"Something went wrong, Please try again later.", csrfNew).toString());
		} catch (InterruptedException e) {
			e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(JSONResponse.response(JSONResponse.ERROR,"Something went wrong, Please try again later.",csrfNew).toString());
		}
	}
}