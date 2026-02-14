package service.utils.manager;

import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class CSRFService {
	public static HttpSession getSession(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
		if(session==null) {
			session = req.getSession();
		}
		return session;
	}
	public static String csrfToken() {
		return UUID.randomUUID().toString();
	}
	public static String setCSRFToken(HttpServletRequest req) {
		HttpSession session = getSession(req);
		String csrfToken = csrfToken();
		session.setAttribute("csrfToken", csrfToken);
		return csrfToken;
	}
	public static String getCSRFToken(HttpServletRequest req) {
		return (String) getSession(req).getAttribute("csrfToken");
	}
}
