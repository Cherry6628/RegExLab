package service.utils.manager;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import listener.configLoader.ParamsAndDBLoader;

public class CSRFService {
	public static HttpSession getSession(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
		if (session == null) {
			session = req.getSession(true);
		}
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
		return csrfToken;
	}

	public static String getCSRFToken(HttpServletRequest req) {
		String csrfToken = (String) getSession(req).getAttribute("csrfToken");
		return csrfToken;
	}
}
