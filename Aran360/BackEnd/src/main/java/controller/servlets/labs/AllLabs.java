package controller.servlets.labs;

import java.io.IOException;
import java.sql.Connection;
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

@WebServlet("/all-labs-data")
public class AllLabs extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		JSONObject result = new JSONObject();
		JSONObject data = new JSONObject();
		Connection con = DBService.getConnection();
		try {
			ResultSet rs = con.createStatement()
					.executeQuery("SELECT t.topic, l.lab_name, l.image FROM " + ParamsAndDBLoader.TABLE_LABS
							+ " l JOIN " + ParamsAndDBLoader.TABLE_LEARNING_TOPICS
							+ " t ON l.topic_id = t.id ORDER BY t.id, l.id");
			while (rs.next()) {
				String topic = rs.getString("topic");
				if (!data.has(topic))
					data.put(topic, new JSONObject());
				JSONObject lab = new JSONObject();
				lab.put("name", rs.getString("lab_name"));
				lab.put("image", rs.getString("image"));
				data.getJSONObject(topic).put(rs.getString("image"), lab);
			}
			result.put("data", data);
			response.getWriter()
					.write(JSONResponse.response(JSONResponse.SUCCESS, "Labs fetched", null, result).toString());
		} catch (Exception e) {
			response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Failed").toString());
			return;
		}
	}
}