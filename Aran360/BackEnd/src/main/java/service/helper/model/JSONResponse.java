package service.helper.model;

import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONObject;

public class JSONResponse {
	final public static String SUCCESS = "success";
	final public static String ERROR = "error";
	private JSONResponse() {}
	public static JSONObject response(String status, String message, String csrfToken, Map<String, String> otherParams) {
		JSONObject json = new JSONObject();
		if(status!=null)json.put("status", status);
		if(message!=null)json.put("message", message);
		if(csrfToken!=null)json.put("csrfToken", csrfToken);
		if(otherParams!=null) {
			for(Entry<String, String> entry: otherParams.entrySet()) {
				json.put(entry.getKey(), entry.getValue());
			}
		}
		return json;
	}
	public static JSONObject response(String status, String message, String csrfToken) {
		return response(status, message, csrfToken, null);
	}
	public static JSONObject response(String status, String message) {
		return response(status, message, null);
	}
}
