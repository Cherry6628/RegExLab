package service.utils.manager;

import org.json.JSONObject;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import configs.ParamsAndDBLoader;

public class MailingService {
	public static JSONObject sendEmail(String toEmail, String toName, String subject, String textContent)
			throws UnirestException {
		String apiKey = ParamsAndDBLoader.EMAIL_API_KEY;
		if (apiKey == null || apiKey.isEmpty())
			throw new RuntimeException("Mailgun API key not configured");
		HttpResponse<JsonNode> response = Unirest
				.post("https://api.mailgun.net/v3/" + ParamsAndDBLoader.EMAIL_DOMAIN + "/messages")
				.basicAuth("api", apiKey)
				.field("from", ParamsAndDBLoader.APP_NAME + " <postmaster@" + ParamsAndDBLoader.EMAIL_DOMAIN + ">")
				.field("to", (toName != null && !toName.isEmpty()) ? toName + " <" + toEmail + ">" : toEmail)
				.field("subject", subject).field("text", textContent).field("h:X-Priority", "1")
				.field("h:Importance", "High").asJson();
		if (response.getStatus() != 200)
			throw new RuntimeException("Mailgun error: " + response.getStatus() + " - " + response.getBody());
		return response.getBody().getObject();
	}

	public static JSONObject sendEmail(String toEmail, String subject, String textContent) throws UnirestException {
		return sendEmail(toEmail, null, subject, textContent);
	}
}