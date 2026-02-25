package controller.servlets.auth;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;
import service.utils.manager.PBKDF2_Service;
import org.json.JSONObject;

@WebServlet("/update-password")
public class UpdatePassword extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
String csrfNew = CSRFService.setCSRFToken(request);
        String username = (String) request.getAttribute("AUTHENTICATED_USER");
        if (username == null) {
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "Unauthorized", csrfNew, null).toString());
            return;
        }

        StringBuilder sb = new StringBuilder();
        String line;
        java.io.BufferedReader reader = request.getReader();
        while ((line = reader.readLine()) != null) sb.append(line);
        JSONObject body = new JSONObject(sb.toString());
        String oldPassword = body.optString("oldPassword", "").strip();
        String newPassword = body.optString("newPassword", "").strip();

        if (oldPassword.isEmpty() || newPassword.isEmpty()) {
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "Missing fields", csrfNew, null).toString());
            return;
        }

        if (newPassword.length() < 8) {
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "Password must be at least 8 characters", csrfNew, null).toString());
            return;
        }

        try {
            Connection con = DBService.getConnection();

            PreparedStatement getPs = con.prepareStatement(
                "SELECT password_hash FROM " + ParamsAndDBLoader.TABLE_USERS +
                " WHERE username = ?"
            );
            getPs.setString(1, username);
            ResultSet rs = getPs.executeQuery();

            if (!rs.next()) {
                response.getWriter().write(JSONResponse.response(
                    JSONResponse.ERROR, "User not found", csrfNew, null).toString());
                return;
            }

            String storedHash = rs.getString("password_hash");

            if (!PBKDF2_Service.object.verify(oldPassword, storedHash)) {
                response.getWriter().write(JSONResponse.response(
                    JSONResponse.ERROR, "Old password is incorrect", csrfNew, null).toString());
                return;
            }

            String newHash = PBKDF2_Service.object.hash(newPassword);
            PreparedStatement updatePs = con.prepareStatement(
                "UPDATE " + ParamsAndDBLoader.TABLE_USERS +
                " SET password_hash = ? WHERE username = ?"
            );
            updatePs.setString(1, newHash);
            updatePs.setString(2, username);
            updatePs.executeUpdate();

            response.getWriter().write(JSONResponse.response(
                JSONResponse.SUCCESS, "Password updated successfully", csrfNew, null).toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "Something went wrong", csrfNew, null).toString());
        }
    }
}
