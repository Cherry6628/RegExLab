package controller.servlets.labs;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.JSONResponse;
import model.helper.LabInstance;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;

@WebServlet("/lab/complete")
public class LabComplete extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	String csrfNew = CSRFService.setCSRFToken(request);
        HttpSession session = request.getSession(false);
        if (session == null) {
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "Unauthorized", csrfNew, null).toString());
            return;
        }

        @SuppressWarnings("unchecked")
        Map<String, LabInstance> labMap = (Map<String, LabInstance>)
            session.getAttribute("LAB_MAP");

        if (labMap == null || labMap.isEmpty()) {
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "No active lab", csrfNew, null).toString());
            return;
        }

        LabInstance activeLab = null;
        for (LabInstance lab : labMap.values()) {
            if (!lab.isExpired()) {
                activeLab = lab;
                break;
            }
        }

        if (activeLab == null) {
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "No active lab", csrfNew, null).toString());
            return;
        }

        try {
        	String username = (String) request.getAttribute("AUTHENTICATED_USER");
        	if (username == null) {
        	    response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "Unauthorized", null, null).toString());
        	    return;
        	}

        	Connection con = DBService.getConnection();

        	PreparedStatement userPs = con.prepareStatement(
        	    "SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?"
        	);
        	userPs.setString(1, username);
        	ResultSet rs = userPs.executeQuery();
        	if (!rs.next()) {
        	    response.getWriter().write(JSONResponse.response(JSONResponse.ERROR, "User not found", null, null).toString());
        	    return;
        	}
        	int userId = rs.getInt("id");
        	PreparedStatement ps = con.prepareStatement(
        	    "INSERT INTO " + ParamsAndDBLoader.TABLE_LAB_ATTEMPTS +
        	    " (user_id, lab_id, status, completed_at) " +
        	    " SELECT ?, l.id, 'Completed', NOW() FROM " + ParamsAndDBLoader.TABLE_LABS +
        	    " l WHERE l.image = ? " +
        	    " ON DUPLICATE KEY UPDATE status = 'Completed', completed_at = NOW()"
        	);
        	ps.setInt(1, userId);
        	ps.setString(2, activeLab.imageId);
        	ps.executeUpdate();
        } catch (Exception e) {
        	e.printStackTrace();
            response.getWriter().write(JSONResponse.response(
                JSONResponse.ERROR, "Something went wrong. Please try again later", csrfNew, null).toString());
        }
    }
}