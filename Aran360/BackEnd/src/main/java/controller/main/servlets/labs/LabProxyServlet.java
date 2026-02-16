//package controller.main.servlets.labs;
//
//import java.io.IOException;
//import java.io.InputStream;
//import java.io.OutputStream;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.util.Enumeration;
//import java.util.List;
//import java.util.Map;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.annotation.WebServlet;
//import jakarta.servlet.http.HttpServlet;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//import service.helper.model.LabInstance;
//
//@WebServlet("/lab/view/*")
//public class LabProxyServlet extends HttpServlet {
//    private static final long serialVersionUID = 1L;
//
//    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        HttpSession session = req.getSession(false);
//        if (session == null) {
//            resp.sendError(403, "No Session");
//            return;
//        }
//
//        LabInstance lab = (LabInstance) session.getAttribute("ACTIVE_LAB");
//        if (lab == null || lab.ipAddress == null) {
//            resp.sendError(503, "Lab not active.");
//            return;
//        }
//
//        // Calculate Target URL
//        String requestURI = req.getRequestURI();
//        String contextPart = req.getContextPath() + "/lab/view/" + lab.containerId;
//        String targetPath = requestURI.substring(contextPart.length());
//        if (targetPath.isEmpty()) targetPath = "/";
//
//        String targetUrl = "http://" + lab.ipAddress + ":3000" + targetPath;
//        if (req.getQueryString() != null) targetUrl += "?" + req.getQueryString();
//
//        // Connect to Docker Container
//        HttpURLConnection conn = (HttpURLConnection) new URL(targetUrl).openConnection();
//        conn.setRequestMethod(req.getMethod());
//        conn.setDoOutput(true);
//        conn.setConnectTimeout(3000);
//
//        // Copy Request Headers
//        Enumeration<String> headerNames = req.getHeaderNames();
//        while (headerNames.hasMoreElements()) {
//            String h = headerNames.nextElement();
//            conn.setRequestProperty(h, req.getHeader(h));
//        }
//
//        // Handle POST body
//        if ("POST".equalsIgnoreCase(req.getMethod())) {
//            try (OutputStream os = conn.getOutputStream()) {
//                req.getInputStream().transferTo(os);
//            }
//        }
//
//        // Handle Response
//        int code = conn.getResponseCode();
//        resp.setStatus(code);
//
//        Map<String, List<String>> resHeaders = conn.getHeaderFields();
//        for (Map.Entry<String, List<String>> entry : resHeaders.entrySet()) {
//            String key = entry.getKey();
//            if (key != null && !key.equalsIgnoreCase("Transfer-Encoding")) {
//                for (String value : entry.getValue()) {
//                    resp.addHeader(key, value);
//                }
//            }
//        }
//
//        try (InputStream is = (code >= 400) ? conn.getErrorStream() : conn.getInputStream()) {
//            if (is != null) is.transferTo(resp.getOutputStream());
//        }
//    }
//}
package controller.main.servlets.labs;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import service.helper.model.LabInstance;

@WebServlet("/lab/view/*")
public class LabProxyServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        LabInstance lab = (session != null) ? (LabInstance) session.getAttribute("ACTIVE_LAB") : null;

        if (lab == null) {
            resp.sendError(503, "Lab not started.");
            return;
        }

        String requestURI = req.getRequestURI();
        String prefix = req.getContextPath() + "/lab/view/" + lab.containerId;
        String targetPath = requestURI.substring(prefix.length());
        if (targetPath.isEmpty()) targetPath = "/";

        String targetUrl = "http://127.0.0.1:3000" + targetPath;
        if (req.getQueryString() != null) targetUrl += "?" + req.getQueryString();

        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(targetUrl).openConnection();
            conn.setRequestMethod(req.getMethod());
            conn.setDoOutput(true);
            conn.setConnectTimeout(2000);

            Enumeration<String> headers = req.getHeaderNames();
            while (headers.hasMoreElements()) {
                String name = headers.nextElement();
                conn.setRequestProperty(name, req.getHeader(name));
            }

            if ("POST".equalsIgnoreCase(req.getMethod())) {
                try (OutputStream os = conn.getOutputStream()) {
                    req.getInputStream().transferTo(os);
                }
            }

            int code = conn.getResponseCode();
            resp.setStatus(code);

            for (Map.Entry<String, List<String>> entry : conn.getHeaderFields().entrySet()) {
                String key = entry.getKey();
                if (key != null && !key.equalsIgnoreCase("Transfer-Encoding")) {
                    for (String v : entry.getValue()) resp.addHeader(key, v);
                }
            }

            try (InputStream is = (code >= 400) ? conn.getErrorStream() : conn.getInputStream()) {
                if (is != null) is.transferTo(resp.getOutputStream());
            }
        } catch (Exception e) {
            resp.sendError(502, e.getMessage());
        }
    }
}