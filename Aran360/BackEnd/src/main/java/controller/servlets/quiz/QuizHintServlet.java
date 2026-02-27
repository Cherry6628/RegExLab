package controller.servlets.quiz;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import java.io.BufferedReader;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
@WebServlet("/quiz-hint")
public class QuizHintServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
		String csrfNew = CSRFService.setCSRFToken(request);
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		System.out.println("Received Request Body: " + sb.toString());
		JSONObject body = new JSONObject(sb.toString());
		String question = body.getString("question");
		JSONArray optionsArray = body.getJSONArray("options");
		StringBuilder optionsBuilder = new StringBuilder();
		for(int i = 0; i < optionsArray.length(); i++){
		    if (i > 0) optionsBuilder.append(", ");
		    optionsBuilder.append(optionsArray.getString(i));
		}
		String combined = question + " Options: " + optionsBuilder.toString();
		String key = ParamsAndDBLoader.AI_HINT_KEY;
		System.out.println("Input : "+combined);
		JSONObject payload = new JSONObject();
		payload.put("prompt", combined);
		payload.put("x-api-key", key);
		String json = payload.toString();
		System.out.println(json);
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest req = HttpRequest.newBuilder().uri(URI.create(ParamsAndDBLoader.AI_HINT_API)).header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build();
		try {
			JSONObject jsonResponse = new JSONObject(client.send(req, HttpResponse.BodyHandlers.ofString()).body());
			System.out.println("Output"+jsonResponse);
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