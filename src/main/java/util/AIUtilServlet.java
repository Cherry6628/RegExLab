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
import java.util.HashMap;
import org.json.JSONObject;

@WebServlet("/suggest")
public class AIUtilServlet extends HttpServlet {
	protected static HashMap<String, String> patterns = new HashMap<>();
	static {
		patterns.put("element.innerHTML = \"x\" + v + \"y\"", "element.innerHTML = \"x\" + encodeHTML(v) + \"y\"");
		patterns.put("element.outerHTML = \"x\" + v + \"y\"", "element.outerHTML = \"x\" + encodeHTML(v) + \"y\"");
		patterns.put("insertAdjacentHTML(p, v)", "insertAdjacentHTML(p, encodeHTML(v))");
		patterns.put("document.write(v)", "document.write(encodeHTML(v))");
		patterns.put("document.writeln(v)", "document.writeln(encodeHTML(v))");
		patterns.put("Range.createContextualFragment(v)", "Range.createContextualFragment(encodeHTML(v))");
		patterns.put("setAttribute(\"title\", v)", "setAttribute(\"title\", encodeHTMLAttribute(v))");
		patterns.put("element.attributes[i].value = v", "element.attributes[i].value = encodeHTMLAttribute(v)");
		patterns.put(".attr(\"title\", v)", ".attr(\"title\", encodeHTMLAttribute(v))");
		patterns.put("formaction = v", "formaction = encodeHTML(v)");
		patterns.put("href = v", "href = encodeHTML(v)");
		patterns.put("src = v", "src = encodeHTML(v)");
		patterns.put("xlink:href = v", "xlink:href = encodeHTML(v)");
		patterns.put("location.href = v", "location.href = encodeHTML(v)");
		patterns.put("location = v", "location = encodeHTML(v)");
		patterns.put("location.assign(v)", "location.assign(encodeHTML(v))");
		patterns.put("location.replace(v)", "location.replace(encodeHTML(v))");
		patterns.put("location.open(v)", "location.open(encodeHTML(v))");
	}

	protected static String prompt(String code) {
		String prompt =  """
You are a code correction assistant. Your task is to fix code lines based on provided sample issue-fix pairs.

Instructions:
	Analyze the sample data to understand the pattern between each issue and its fix.
	Compare the input line with the sample issues and identify the closest matching issue category.
	Apply the corresponding fix pattern to the input line.
	Output only the corrected code line no explanation, no extra text.

Sample Data:
""";
		for (String key:patterns.keySet()) 
			prompt+="\nIssue: \n"+key+"\nFix:\n"+patterns.get(key)+"\n";
		
		prompt+="Input:\n"+code+"\n\nOutput:\n<ONLY_FIXED_LINE>";
		return prompt;
	}

	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		JSONObject obj = new JSONObject(sb.toString());
		String msg = obj.getString("msg");
		JSONObject payload = new JSONObject();
		payload.put("prompt", prompt(msg));
		payload.put("stream", false);
		payload.put("model", "qwen3:30b-instruct");

		String json = payload.toString();
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest req = HttpRequest.newBuilder()
				.uri(URI.create("http://usha-0177-ait.csez.zohocorpin.com:11434/api/generate"))
				.header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build();
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
	}
}