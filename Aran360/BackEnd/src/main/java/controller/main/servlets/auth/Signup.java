package controller.main.servlets.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import service.helper.model.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;
import service.utils.manager.SessionManager;
import service.utils.manager.Argon2IDService;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLIntegrityConstraintViolationException;

import configs.ParamsAndDBLoader;

@WebServlet("/signup")
public class Signup extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        String csrfNew = CSRFService.setCSRFToken(request);

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);
        JSONObject body = new JSONObject(sb.toString());

        String user = body.optString("username");
        String pass = body.optString("password");
        String email = body.optString("email");

        if (user.isEmpty() || pass.length() < 8) {
            response.setStatus(400);
            response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Invalid input", csrfNew).toString());
            return;
        }

        String hashedPass = Argon2IDService.object.hash(pass);

        try {
        	System.out.println("Inserting into users");
            String query = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
            PreparedStatement pstmt = DBService.getConnection().prepareStatement(query);
            pstmt.setString(1, user);
            pstmt.setString(2, email);
            pstmt.setString(3, hashedPass);
            System.out.println(pstmt.executeUpdate()+" Result after insert");

            String token = SessionManager.createSession(user, request, DBService.getConnection());
            Login.setAuthCookie(response, token);

            response.setStatus(201);
            response.getWriter().write(JSONResponse.response(JSONResponse.SUCCESS, "Signup Successful", csrfNew).toString());
        } catch (SQLIntegrityConstraintViolationException e) {
//        	e.printStackTrace();
            response.setStatus(409);
            response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "User exists, Try with different username or email address", csrfNew).toString());
        } catch (Exception e) {
        	response.setStatus(500);
        	response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Internal Server Error", csrfNew).toString());
        }
    }
}