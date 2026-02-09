package util;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;
@WebServlet("/QuizServelet")
public class QuizServelet extends HttpServlet {
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		JSONObject obj = new JSONObject(sb.toString());
		String msg = obj.getString("msg");
		JSONObject payload = new JSONObject();
		payload.put("prompt", "");
		payload.put("stream", false);
		payload.put("model", "qwen3:30b-instruct");
		String json = payload.toString();
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest req = HttpRequest.newBuilder().uri(URI.create("http://usha-0177-ait.csez.zohocorpin.com:11434/api/generate")).header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build();
		try {
			HttpResponse<String> apiResponse = client.send(req, HttpResponse.BodyHandlers.ofString());
			response.setContentType("application/json");
			response.setStatus(apiResponse.statusCode());
			response.getWriter().write(apiResponse.body());
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("application/json");
			response.getWriter().write("{\"error\":\"Failed to call external API\"}");
		}
		client.close();
	}
}