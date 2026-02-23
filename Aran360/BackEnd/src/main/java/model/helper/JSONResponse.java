package model.helper;

import org.json.JSONObject;

public class JSONResponse {
	final public static String SUCCESS = "success";
	final public static String ERROR = "error";

	private JSONResponse(){}

	public static JSONObject response(String status, String message, String csrfToken,
			JSONObject otherParams) {
		JSONObject json = new JSONObject();
		if (status != null)
			json.put("status", status);
		if (message != null)
			json.put("message", message);
		if (csrfToken != null)
			json.put("csrfToken", csrfToken);
		if (otherParams != null) {
			for(String key: otherParams.keySet()) {
				json.put(key, otherParams.get(key));
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
