package controller.main.filters.config;
import java.io.BufferedReader;
import java.io.IOException;
import org.json.JSONObject;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import model.helper.CachedBodyHttpServletRequest;
import model.helper.JSONResponse;

public class CSRFFilter extends HttpFilter {
	private static final long serialVersionUID = 1L;

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest req = (HttpServletRequest) request;
		String path = req.getRequestURI();

		if (path.startsWith(req.getContextPath() + "/lab/view/")
				|| path.startsWith(req.getContextPath() + "/lab/image/")
				|| path.startsWith(req.getContextPath() + "/csrf")) {
			chain.doFilter(request, response);
			return;
		}

		CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(req);
		if (!cachedRequest.getMethod().equals("GET")) {
			String csrfToken = req.getHeader("X-CSRF-Token");
			if (csrfToken == null || csrfToken.strip().isEmpty()) {
				response.getWriter().write(JSONResponse.response("error", "CSRF Token Missing").toString());
				return;
			}
			String csrfToken2 = null;
			StringBuilder sb = new StringBuilder();
			BufferedReader reader = cachedRequest.getReader();
			String requestBodyLine = null;
			while ((requestBodyLine = reader.readLine()) != null) {
				sb.append(requestBodyLine);
			}
			JSONObject requestBody = new JSONObject(sb.toString());

			csrfToken2 = requestBody.getString("csrfToken");
			if (csrfToken2 == null || csrfToken2.strip().isEmpty()) {
				response.getWriter().write(JSONResponse.response("error", "CSRF Token Missing").toString());
				return;
			}
			if (!(csrfToken.strip().equals(csrfToken2.strip()) && isValidCSRFToken(req, csrfToken.strip()))) {
				response.getWriter().write(JSONResponse.response("error", "Invalid CSRF Token").toString());
				return;
			}

		}
		chain.doFilter(cachedRequest, response);
	}

	private static final boolean isValidCSRFToken(HttpServletRequest req, String csrfToken) {
		HttpSession session = req.getSession(false);
		if (session == null) {
			System.out.println("No session found for ID: " + req.getRequestedSessionId());
			return false;
		}
		System.out.println("Session ID in Filter: " + session.getId());
		String storedToken = (String) session.getAttribute("csrfToken");
		System.out.println(storedToken);
		return csrfToken.equals(storedToken);
	}
}
