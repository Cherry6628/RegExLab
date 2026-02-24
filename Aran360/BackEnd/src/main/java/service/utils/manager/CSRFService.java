package service.utils.manager;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import listener.configLoader.ParamsAndDBLoader;

public class CSRFService {
	public static HttpSession getSession(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
		if (session == null) {
			session = req.getSession(true);
			System.out.println("New Session Created");
		}
		System.out.println("Session ID: " + session.getId());
		System.out.println(ParamsAndDBLoader.JWT_EXPIRY);
		session.setMaxInactiveInterval(ParamsAndDBLoader.JWT_EXPIRY / 1000);
		return session;
	}

	public static String csrfToken() {
		return RandomService.generateRandomString(128,true,true,true,false);
	}

	public static String setCSRFToken(HttpServletRequest req) {
		HttpSession session = getSession(req);
		String csrfToken = csrfToken();
		session.setAttribute("csrfToken", csrfToken);
		System.out.println(csrfToken + " set on Session " + session.getId());
		return csrfToken;
	}

	public static String getCSRFToken(HttpServletRequest req) {
		String csrfToken = (String) getSession(req).getAttribute("csrfToken");
		System.out.println("csrfToken set on " + getSession(req).getId());
		return csrfToken;
	}
}
