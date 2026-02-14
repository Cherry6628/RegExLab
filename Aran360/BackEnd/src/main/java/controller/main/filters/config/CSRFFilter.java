package controller.main.filters.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import service.helper.model.CachedBodyHttpServletRequest;
import service.helper.model.JSONResponse;
import service.utils.manager.CSRFService;

import java.io.BufferedReader;
import java.io.IOException;

import org.json.JSONObject;

public class CSRFFilter extends HttpFilter implements Filter {
    private static final long serialVersionUID = 1L;
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(req);
		JSONObject json = new JSONObject();
		if (!cachedRequest.getMethod().equals("GET")) {
			String csrfToken = req.getHeader("X-CSRF-Token");
			if(csrfToken==null||csrfToken.strip().isEmpty()) {
				response.getWriter().write(JSONResponse.response("error", "CSRF Token Missing").toString());
				return;
			}
			String csrfToken2 = null;
			StringBuilder sb = new StringBuilder();
			BufferedReader reader = cachedRequest.getReader();
			String requestBodyLine=null;
			while((requestBodyLine=reader.readLine())!=null) {
				sb.append(requestBodyLine);
			}
			JSONObject requestBody = new JSONObject(sb.toString());
			
			csrfToken2 = requestBody.getString("csrfToken");
			if(csrfToken2==null||csrfToken2.strip().isEmpty()) {
				response.getWriter().write(JSONResponse.response("error", "CSRF Token Missing").toString());
				return;
			}
			if(!(csrfToken.strip().equals(csrfToken2.strip()) && isValidCSRFToken(req, csrfToken.strip()))) {
				response.getWriter().write(JSONResponse.response("error", "Invalid CSRF Token").toString());
			}
			
		}
		chain.doFilter(request, response);
	}
	private static final boolean isValidCSRFToken(HttpServletRequest req, String csrfToken) {
		return CSRFService.getCSRFToken(req).equals(csrfToken);
	}
}
