package service.utils.manager;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import configs.ParamsLoader;

public class MailingService {

    public static JsonNode sendEmail(
            String toEmail,
            String toName,
            String subject,
            String textContent
    ) throws UnirestException {

        String apiKey = ParamsLoader.EMAIL_API_KEY;

        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("Mailgun API key not configured");
        }

        HttpResponse<JsonNode> response = Unirest
                .post("https://api.mailgun.net/v3/" + ParamsLoader.EMAIL_DOMAIN + "/messages")
                .basicAuth("api", apiKey)
                .field("from", ParamsLoader.APP_NAME+" <postmaster@" + ParamsLoader.EMAIL_DOMAIN + ">")
                .field("to", toName + " <" + toEmail + ">")
                .field("subject", subject)
                .field("text", textContent)
                .asJson();

        if (response.getStatus() != 200) {
            throw new RuntimeException(
                    "Mailgun error: " + response.getStatus() + " - " + response.getBody()
            );
        }

        return response.getBody();
    }
}