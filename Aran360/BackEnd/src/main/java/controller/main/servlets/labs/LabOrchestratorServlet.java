package controller.main.servlets.labs;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import configs.ParamsAndDBLoader;
import service.helper.model.LabInstance;
import service.infrastructure.LabRuntimeClient;

@WebServlet("/lab/image/*")
public class LabOrchestratorServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final ScheduledExecutorService scheduler =
            Executors.newScheduledThreadPool(2);

    private final LabRuntimeClient runtimeClient =
            new LabRuntimeClient();

    @Override
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse resp)
            throws ServletException, IOException {

        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            resp.sendError(400, "Invalid lab name");
            return;
        }

        String labName = pathInfo.substring(1)
                .replaceAll("[^a-zA-Z0-9_-]", "");

        String tarPath = getServletContext()
                .getRealPath("/WEB-INF/dockers/" + labName + ".tar");

        File tarFile = new File(tarPath);
        if (!tarFile.exists()) {
            resp.sendError(404, "Lab image not found");
            return;
        }

        try {

            // ----------------------------
            // 1. Request host runtime to create lab
            // ----------------------------
            String containerName =
                    runtimeClient.createLab(labName);

            // ----------------------------
            // 2. Store session
            // ----------------------------
            LabInstance lab = new LabInstance(
                    containerName,
                    containerName,
                    ParamsAndDBLoader.LAB_TIMEOUT_SECONDS
            );

            session.setAttribute("ACTIVE_LAB", lab);

            // ----------------------------
            // 3. Schedule cleanup
            // ----------------------------
            scheduler.schedule(() ->
                    runtimeClient.cleanupLab(containerName),
                    ParamsAndDBLoader.LAB_TIMEOUT_SECONDS,
                    TimeUnit.SECONDS
            );

            resp.sendRedirect(req.getContextPath()
                    + "/lab/view/" + containerName);

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    public void destroy() {
        scheduler.shutdownNow();
    }
}
