package controller.servlets.labs;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;
import java.util.concurrent.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import listener.configLoader.ParamsAndDBLoader;
import model.helper.LabInstance;
import model.helper.LabRegistry;
import service.infrastructure.LabRuntimeClient;
import service.utils.manager.DBService;

@WebServlet("/lab/image/*")
public class LabOrchestratorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String SESSION_LAB_MAP = "LAB_MAP";
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final LabRuntimeClient runtimeClient = new LabRuntimeClient();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        System.out.println("\t\t\t\tSession Doesn't Exists");
        if (session == null) {
            resp.sendRedirect(req.getContextPath() + "/dashboard");
            return;
        }
        System.out.println("\t\t\t\tSession Exists");
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            redirectToDashboard(req, resp, session, "Invalid lab name.");
            return;
        }
        String labName = pathInfo.substring(1).replaceAll("[^a-zA-Z0-9_-]", "");
        if (labName.isEmpty()) {
            redirectToDashboard(req, resp, session, "Invalid lab name.");
            return;
        }

        if (!runtimeClient.labExists(labName)) {
            redirectToDashboard(req, resp, session, "No such lab exists: " + labName);
            return;
        }

        System.out.println("\t\t\t\tLab Exists");
        @SuppressWarnings("unchecked")
        Map<String, LabInstance> labMap = (Map<String, LabInstance>) session.getAttribute(SESSION_LAB_MAP);
        if (labMap == null) {
            labMap = new ConcurrentHashMap<>();
            session.setAttribute(SESSION_LAB_MAP, labMap);
        }

        LabInstance existing = labMap.get(labName);
        if (existing != null) {
            if (!existing.isExpired()) {
                resp.sendRedirect(req.getContextPath() + "/lab/view/" + existing.containerId);
                return;
            } else {
                runtimeClient.cleanupLab(existing.containerId);
                labMap.remove(labName);
            }
        }

        try {
            String containerName = runtimeClient.createLab(labName);
            LabInstance lab = new LabInstance(labName, labName, containerName, ParamsAndDBLoader.LAB_TIMEOUT_SECONDS);
            labMap.put(labName, lab);
            LabRegistry.register(containerName);

            try {
                String username = (String) req.getAttribute("AUTHENTICATED_USER");
                if (username != null) {
                    Connection con = DBService.getConnection();

                    PreparedStatement userPs = con.prepareStatement(
                        "SELECT id FROM " + ParamsAndDBLoader.TABLE_USERS + " WHERE username = ?"
                    );
                    userPs.setString(1, username);
                    ResultSet rs = userPs.executeQuery();

                    if (rs.next()) {
                        int userId = rs.getInt("id");
                        PreparedStatement ps = con.prepareStatement(
                            "INSERT INTO " + ParamsAndDBLoader.TABLE_LAB_ATTEMPTS +
                            " (user_id, lab_id, status) " +
                            " SELECT ?, l.id, 'Attempted' FROM " + ParamsAndDBLoader.TABLE_LABS +
                            " l WHERE l.image = ? " +
                            " ON DUPLICATE KEY UPDATE " +
                            " status = IF(status = 'Completed', 'Completed', 'Attempted'), " +
                            " attempted_at = CURRENT_TIMESTAMP"
                        );
                        ps.setInt(1, userId);
                        ps.setString(2, labName);
                        ps.executeUpdate();
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            final Map<String, LabInstance> mapRef = labMap;
            scheduler.schedule(() -> {
                runtimeClient.cleanupLab(containerName);
                mapRef.remove(labName);
                LabRegistry.deregister(containerName);
            }, ParamsAndDBLoader.LAB_TIMEOUT_SECONDS, TimeUnit.SECONDS);

            resp.sendRedirect(req.getContextPath() + "/lab/view/" + containerName);

        } catch (Exception e) {
            e.printStackTrace();
            redirectToDashboard(req, resp, session, "Lab creation failed: " + e.getMessage());
        }
    }

    private void redirectToDashboard(HttpServletRequest req, HttpServletResponse resp,
            HttpSession session, String message) throws IOException {
        session.setAttribute("FLASH_ERROR", message);
        resp.sendRedirect(req.getContextPath() + "/dashboard");
    }

    @Override
    public void destroy() {
        scheduler.shutdownNow();
    }
}