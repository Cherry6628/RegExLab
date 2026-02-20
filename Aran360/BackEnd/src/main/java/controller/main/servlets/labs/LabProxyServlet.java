// package controller.main.servlets.labs;

// import java.io.IOException;
// import java.io.InputStream;
// import java.io.OutputStream;
// import java.io.PrintWriter;
// import java.io.StringWriter;
// import java.net.HttpURLConnection;
// import java.net.URL;
// import java.util.Enumeration;
// import java.util.List;
// import java.util.Map;

// import jakarta.servlet.ServletException;
// import jakarta.servlet.annotation.WebServlet;
// import jakarta.servlet.http.HttpServlet;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import jakarta.servlet.http.HttpSession;
// import service.helper.model.LabInstance;

// @WebServlet("/lab/view/*")
// public class LabProxyServlet extends HttpServlet {
//     private static final long serialVersionUID = 1L;

//     protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//         HttpSession session = req.getSession(false);
//         LabInstance lab = (session != null) ? (LabInstance) session.getAttribute("ACTIVE_LAB") : null;

//         if (lab == null) {
//             resp.sendError(503, "Lab Environment Not Found");
//             return;
//         }

//         String requestURI = req.getRequestURI();
//         String prefix = req.getContextPath() + "/lab/view/" + lab.containerId;
//         if (!requestURI.startsWith(prefix)) {
//             resp.sendError(400, "Invalid lab path");
//             return;
//         }

//         String targetPath = requestURI.substring(prefix.length());
//         if (targetPath.isEmpty())
//             targetPath = "/";
//         String targetUrl = "http://lab-active:3000" + targetPath;

//         if (req.getQueryString() != null) {
//             targetUrl += "?" + req.getQueryString();
//         }

//         try {
//             HttpURLConnection conn = (HttpURLConnection) new URL(targetUrl).openConnection();
//             conn.setRequestMethod(req.getMethod());
//             conn.setDoOutput(true);
//             conn.setConnectTimeout(5000);
//             conn.setReadTimeout(5000);

//             Enumeration<String> headers = req.getHeaderNames();
//             while (headers.hasMoreElements()) {
//                 String name = headers.nextElement();
//                 if (!name.equalsIgnoreCase("Host")) {
//                     conn.setRequestProperty(name, req.getHeader(name));
//                 }
//             }

//             if ("POST".equalsIgnoreCase(req.getMethod()) || "PUT".equalsIgnoreCase(req.getMethod())) {
//                 try (OutputStream os = conn.getOutputStream()) {
//                     req.getInputStream().transferTo(os);
//                 }
//             }

//             int code = conn.getResponseCode();
//             resp.setStatus(code);

//             for (Map.Entry<String, List<String>> entry : conn.getHeaderFields().entrySet()) {
//                 String key = entry.getKey();
//                 if (key != null && !key.equalsIgnoreCase("Transfer-Encoding")
//                         && !key.equalsIgnoreCase("Content-Encoding")) {
//                     for (String v : entry.getValue()) {
//                         resp.addHeader(key, v);
//                     }
//                 }
//             }

//             try (InputStream is = (code >= 400) ? conn.getErrorStream() : conn.getInputStream()) {
//                 if (is != null) {
//                     is.transferTo(resp.getOutputStream());
//                 }
//             }
//         } catch (Exception e) {
//             StringWriter sw = new StringWriter();
//             PrintWriter pw = new PrintWriter(sw);
//             e.printStackTrace(pw);
//             String stackTrace = sw.toString();

//             resp.sendError(502, stackTrace);
//         }
//     }
// }
package controller.main.servlets.labs;

import java.io.*;
import java.net.*;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import service.helper.model.LabInstance;

@WebServlet("/lab/view/*")
public class LabProxyServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final String SESSION_LAB_MAP = "LAB_MAP";

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.sendRedirect(req.getContextPath() + "/dashboard");
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
        String subPath     = (slash == -1) ? "/" : stripped.substring(slash);

        @SuppressWarnings("unchecked")
        Map<String, LabInstance> labMap =
                (Map<String, LabInstance>) session.getAttribute(SESSION_LAB_MAP);

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
            HttpURLConnection conn =
                    (HttpURLConnection) new URL(targetUrl).openConnection();
            conn.setRequestMethod(req.getMethod());
            conn.setDoOutput(true);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(10000);

            Enumeration<String> headers = req.getHeaderNames();
            while (headers.hasMoreElements()) {
                String name = headers.nextElement();
                if (!name.equalsIgnoreCase("Host")) {
                    conn.setRequestProperty(name, req.getHeader(name));
                }
            }

            if ("POST".equalsIgnoreCase(req.getMethod())
                    || "PUT".equalsIgnoreCase(req.getMethod())) {
                try (OutputStream os = conn.getOutputStream()) {
                    req.getInputStream().transferTo(os);
                }
            }

            int code = conn.getResponseCode();
            resp.setStatus(code);

            for (Map.Entry<String, List<String>> entry :
                    conn.getHeaderFields().entrySet()) {
                String key = entry.getKey();
                if (key != null
                        && !key.equalsIgnoreCase("Transfer-Encoding")
                        && !key.equalsIgnoreCase("Content-Encoding")) {
                    for (String v : entry.getValue()) {
                        resp.addHeader(key, v);
                    }
                }
            }

            try (InputStream is = (code >= 400)
                    ? conn.getErrorStream() : conn.getInputStream()) {
                if (is != null) {
                    is.transferTo(resp.getOutputStream());
                }
            }

        } catch (Exception e) {
            redirectToDashboard(req, resp, session, "No such lab exists.");
        }
    }

    private LabInstance findByContainerId(Map<String, LabInstance> labMap,
                                          String containerId) {
        if (labMap == null || containerId == null) return null;
        for (LabInstance lab : labMap.values()) {
            if (containerId.equals(lab.containerId)) {
                return lab;
            }
        }
        return null;
    }

    private void redirectToDashboard(HttpServletRequest req,
                                     HttpServletResponse resp,
                                     HttpSession session,
                                     String message) throws IOException {
        session.setAttribute("FLASH_ERROR", message);
        resp.sendRedirect(req.getContextPath() + "/dashboard");
    }
}