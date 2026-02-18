package controller.main.servlets.labs;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import configs.ParamsAndDBLoader;
import service.helper.model.LabInstance;

@WebServlet("/lab/image/*")
public class LabOrchestratorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.sendError(401);
            return;
        }

        String pathInfo = req.getPathInfo();
        String labName = pathInfo.substring(1).replaceAll("[^a-zA-Z0-9-]", "");
        String tarPath = getServletContext().getRealPath("/WEB-INF/dockers/" + labName + ".tar");
        String containerName = "lab_" + labName + "_" + UUID.randomUUID().toString().substring(0, 8);

        try {
            Runtime.getRuntime().exec("docker load -i " + tarPath).waitFor();

            String runCmd = String.format("docker run -d --rm --name %s --memory=1024m %s", containerName, labName);
            Runtime.getRuntime().exec(runCmd).waitFor();

            String internalIp = "";
            String ipCmd = "docker inspect -f \"{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}\" " + containerName;
            Process ipProc = Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c", ipCmd});
            try (BufferedReader br = new BufferedReader(new InputStreamReader(ipProc.getInputStream()))) {
                internalIp = br.readLine();
                if (internalIp != null) internalIp = internalIp.trim();
            }

            if (internalIp == null || internalIp.isEmpty()) {
                throw new Exception("IP lookup failed");
            }

            boolean isReady = false;
            int retries = 0;
            while (!isReady && retries < 20) {
                Process check = Runtime.getRuntime().exec("docker inspect -f {{.State.Running}} " + containerName);
                try (BufferedReader br = new BufferedReader(new InputStreamReader(check.getInputStream()))) {
                    if (!"true".equals(br.readLine())) {
                        throw new Exception("Container Segfaulted");
                    }
                }

                try (Socket socket = new Socket()) {
                    socket.connect(new InetSocketAddress(internalIp, 3000), 400);
                    isReady = true;
                } catch (IOException e) {
                    retries++;
                    Thread.sleep(1000);
                }
            }

            if (!isReady) throw new Exception("Port timeout");

            LabInstance lab = new LabInstance(containerName, internalIp, ParamsAndDBLoader.LAB_TIMEOUT_SECONDS);
            session.setAttribute("ACTIVE_LAB", lab);

            scheduler.schedule(() -> {
                try {
                    Runtime.getRuntime().exec("docker rm -f " + containerName);
                } catch (IOException ignored) {}
            }, ParamsAndDBLoader.LAB_TIMEOUT_SECONDS, TimeUnit.SECONDS);

            resp.sendRedirect(req.getContextPath() + "/lab/view/" + containerName);

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