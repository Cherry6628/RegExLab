package controller.servlets.labs;

import java.io.*;
import java.net.*;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Set;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import model.helper.LabInstance;

@WebServlet("/lab/view/*")
public class LabProxyServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String SESSION_LAB_MAP = "LAB_MAP";

    private static final Set<String> BLOCKED_RESPONSE_HEADERS = Set.of(
            "content-security-policy",
            "content-security-policy-report-only",
            "x-frame-options",
            "access-control-allow-origin",
            "access-control-allow-credentials",
            "access-control-allow-methods",
            "access-control-allow-headers",
            "clear-site-data",
            "transfer-encoding",
            "content-encoding");

    private static final Set<String> BLOCKED_REQUEST_HEADERS = Set.of(
            "host",
            "authorization");

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null) {
            redirectToDashboard(req, resp, session, "No Session Found");
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            redirectToDashboard(req, resp, session, "No such lab exists.");
            return;
        }

        String stripped = pathInfo.substring(1);
        int slash = stripped.indexOf('/');
        String containerId = (slash == -1) ? stripped : stripped.substring(0, slash);
        String subPath = (slash == -1) ? "/" : stripped.substring(slash);

        @SuppressWarnings("unchecked")
        Map<String, LabInstance> labMap = (Map<String, LabInstance>) session.getAttribute(SESSION_LAB_MAP);
        LabInstance lab = findByContainerId(labMap, containerId);

        if (lab == null || lab.isExpired()) {
            redirectToDashboard(req, resp, session, "No such lab exists.");
            return;
        }

        String targetUrl = "http://" + containerId + ":3000" + subPath;
        if (req.getQueryString() != null) {
            targetUrl += "?" + req.getQueryString();
        }

        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(targetUrl).openConnection();
            conn.setRequestMethod(req.getMethod());
            conn.setDoOutput(true);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(10000);

            Enumeration<String> headers = req.getHeaderNames();
            while (headers.hasMoreElements()) {
                String name = headers.nextElement();
                if (!BLOCKED_REQUEST_HEADERS.contains(name.toLowerCase())) {
                    conn.setRequestProperty(name, req.getHeader(name));
                }
            }

            if ("POST".equalsIgnoreCase(req.getMethod()) || "PUT".equalsIgnoreCase(req.getMethod())) {
                try (OutputStream os = conn.getOutputStream()) {
                    req.getInputStream().transferTo(os);
                }
            }

            int code = conn.getResponseCode();
            resp.setStatus(code);

            for (Map.Entry<String, List<String>> entry : conn.getHeaderFields().entrySet()) {
                String key = entry.getKey();
                if (key != null && !BLOCKED_RESPONSE_HEADERS.contains(key.toLowerCase())) {
                    for (String v : entry.getValue()) {
                        resp.addHeader(key, v);
                    }
                }
            }

            try (InputStream is = (code >= 400) ? conn.getErrorStream() : conn.getInputStream()) {
                if (is != null)
                    is.transferTo(resp.getOutputStream());
            }

        } catch (Exception e) {
            redirectToDashboard(req, resp, session, "No such lab exists.");
        }
    }

    private LabInstance findByContainerId(Map<String, LabInstance> labMap, String containerId) {
        if (labMap == null || containerId == null)
            return null;
        for (LabInstance lab : labMap.values()) {
            if (containerId.equals(lab.containerId)) {
                return lab;
            }
        }
        return null;
    }

    private void redirectToDashboard(HttpServletRequest req, HttpServletResponse resp,
            HttpSession session, String message) throws IOException {
        session.setAttribute("FLASH_ERROR", message);
        resp.sendRedirect(req.getContextPath() + "/all-labs");
    }
}