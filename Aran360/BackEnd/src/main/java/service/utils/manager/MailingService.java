package service.utils.manager;
//
//import org.json.JSONObject;
//
//import com.mashape.unirest.http.HttpResponse;
//import com.mashape.unirest.http.JsonNode;
//import com.mashape.unirest.http.Unirest;
//import com.mashape.unirest.http.exceptions.UnirestException;
//import configs.ParamsAndDBLoader;
//
//public class MailingService {
//	public static JSONObject sendEmail(String toEmail, String toName, String subject, String textContent)
//			throws UnirestException {
//		String apiKey = ParamsAndDBLoader.EMAIL_API_KEY;
//		if (apiKey == null || apiKey.isEmpty())
//			throw new RuntimeException("Mailgun API key not configured");
//		HttpResponse<JsonNode> response = Unirest
//				.post("https://api.mailgun.net/v3/" + ParamsAndDBLoader.EMAIL_DOMAIN + "/messages")
//				.basicAuth("api", apiKey)
//				.field("from", ParamsAndDBLoader.APP_NAME + " <postmaster@" + ParamsAndDBLoader.EMAIL_DOMAIN + ">")
//				.field("to", (toName != null && !toName.isEmpty()) ? toName + " <" + toEmail + ">" : toEmail)
//				.field("subject", subject).field("text", textContent).field("h:X-Priority", "1")
//				.field("h:Importance", "High").asJson();
//		if (response.getStatus() != 200)
//			throw new RuntimeException("Mailgun error: " + response.getStatus() + " - " + response.getBody());
//		return response.getBody().getObject();
//	}
//
//	public static JSONObject sendEmail(String toEmail, String subject, String textContent) throws UnirestException {
//		return sendEmail(toEmail, null, subject, textContent);
//	}
//}
//package service.utils.manager;

import org.json.JSONObject;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import listener.configLoader.ParamsAndDBLoader;

import java.util.Properties;

public class MailingService {
    public static JSONObject sendEmail(String toEmail, String toName, String subject, String textContent) {

        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(ParamsAndDBLoader.EMAIL_ADDRESS, ParamsAndDBLoader.EMAIL_PASSWORD);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(ParamsAndDBLoader.EMAIL_ADDRESS, ParamsAndDBLoader.APP_NAME));
            
            String recipient = (toName != null && !toName.isEmpty()) ? toName + " <" + toEmail + ">" : toEmail;
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
            
            message.setSubject(subject);
            message.setText(textContent);
            message.setHeader("X-Priority", "1");
            message.setHeader("Importance", "High");

            Transport.send(message);

            JSONObject successResponse = new JSONObject();
            successResponse.put("message", "Queued. Thank you.");
            successResponse.put("id", "google-" + System.currentTimeMillis());
            return successResponse;

        } catch (Exception e) {
            throw new RuntimeException("Gmail error: " + e.getMessage());
        }
    }

    public static JSONObject sendEmail(String toEmail, String subject, String textContent) {
        return sendEmail(toEmail, null, subject, textContent);
    }
}