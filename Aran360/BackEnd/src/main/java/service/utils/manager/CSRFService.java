package service.utils.manager;

import java.util.UUID;

import configs.ParamsAndDBLoader;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class CSRFService {
	public static HttpSession getSession(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
//		System.out.println(session.getId());
		if(session==null) {
			session = req.getSession(true);
			System.out.println("New Session Created");
		}
		System.out.println("Session ID: "+session.getId());
		System.out.println(ParamsAndDBLoader.JWT_EXPIRY);
		session.setMaxInactiveInterval(ParamsAndDBLoader.JWT_EXPIRY/1000);
		return session;
	}
	public static String csrfToken() {
		return UUID.randomUUID().toString();
	}
	public static String setCSRFToken(HttpServletRequest req) {
		HttpSession session = getSession(req);
//		if (session!=null) {
			String csrfToken = csrfToken();
			session.setAttribute("csrfToken", csrfToken);
			System.out.println(csrfToken+" set on Session "+session.getId());
//		}
		return csrfToken;
	}
	public static String getCSRFToken(HttpServletRequest req) {
		String csrfToken = (String) getSession(req).getAttribute("csrfToken");
		System.out.println("csrfToken set on "+getSession(req).getId());
		return csrfToken;
	}
}
