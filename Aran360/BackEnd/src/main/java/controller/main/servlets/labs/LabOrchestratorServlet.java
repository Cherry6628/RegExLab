package controller.main.servlets.labs;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import service.helper.model.LabInstance;

@WebServlet("/lab/image/*")
public class LabOrchestratorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final int LAB_TIMEOUT_MINUTES = 10;
    private ScheduledExecutorService scheduler;

    @Override
    public void init() throws ServletException {
        this.scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r);
            t.setDaemon(true);
            return t;
        });
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.sendError(401, "Session Expired");
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.sendError(400, "Lab Name Missing");
            return;
        }

        String labName = pathInfo.substring(1).replaceAll("[^a-zA-Z0-9-]", "");
        String tarPath = getServletContext().getRealPath("/WEB-INF/dockers/" + labName + ".tar");
        
        File labFile = new File(tarPath);
        if (!labFile.exists()) {
            resp.setContentType("text/plain");
            resp.setStatus(404);
            resp.getWriter().write("No such lab: " + labName);
            return;
        }

        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String containerName = "lab_" + labName + "_" + uniqueId;

        try {
            Runtime.getRuntime().exec("docker load -i " + tarPath).waitFor();

            String runCmd = String.format(
                "docker run -d --name %s --memory=100m --cpus=0.2 --pids-limit=20 --security-opt=no-new-privileges --cap-drop ALL %s",
                containerName, labName
            );
            Runtime.getRuntime().exec(runCmd).waitFor();

            Process ipProc = Runtime.getRuntime().exec("docker inspect -f {{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}} " + containerName);
            String internalIp;
            try (BufferedReader br = new BufferedReader(new InputStreamReader(ipProc.getInputStream()))) {
                internalIp = br.readLine().trim();
            }

            if (internalIp == null || internalIp.isEmpty()) {
                throw new Exception("Failed to acquire container IP");
            }

            LabInstance lab = new LabInstance(containerName, internalIp, LAB_TIMEOUT_MINUTES * 60);
            session.setAttribute("ACTIVE_LAB", lab);

            scheduler.schedule(() -> {
                try {
                    Runtime.getRuntime().exec("docker rm -f " + containerName);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }, LAB_TIMEOUT_MINUTES, TimeUnit.MINUTES);

            resp.sendRedirect(req.getContextPath() + "/lab/view/" + containerName);

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, "Orchestration Error: " + e.getMessage());
        }
    }

    @Override
    public void destroy() {
        if (scheduler != null) {
            scheduler.shutdownNow();
        }
    }
}
//package controller.main.servlets.labs;
//
//import java.io.IOException;
//import java.io.File;
//import java.util.concurrent.Executors;
//import java.util.concurrent.ScheduledExecutorService;
//import java.util.concurrent.TimeUnit;
//
//import configs.ParamsLoader;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.annotation.WebServlet;
//import jakarta.servlet.http.HttpServlet;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//import service.helper.model.LabInstance;
//
//@WebServlet("/lab/image/stored-xss")
//public class LabOrchestratorServlet extends HttpServlet {
//    private static final long serialVersionUID = 1L;
//    private ScheduledExecutorService scheduler;
//
//    @Override
//    public void init() throws ServletException {
//        this.scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
//            Thread t = new Thread(r);
//            t.setDaemon(true);
//            return t;
//        });
//    }
//
//    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        HttpSession session = req.getSession(false);
//        if (session == null) {
//            resp.getWriter().write("No session found.");
//            return;
//        }
//
//        String labPath = ParamsLoader.TEMP_LAB; 
//        String fakeContainerId = "demo_" + session.getId().substring(0, 8);
//        String ip = "127.0.0.1";
//
//        try {
//            String nodePath = ParamsLoader.TEMP_NODE;
//            ProcessBuilder pb = new ProcessBuilder(nodePath, "server.js");
//            pb.directory(new File(labPath));
//            pb.redirectErrorStream(true);
//            Process nodeProcess = pb.start();
//
//            LabInstance newLab = new LabInstance(fakeContainerId, ip, 600);
//            session.setAttribute("ACTIVE_LAB", newLab);
//            session.setAttribute("LAB_PROCESS", nodeProcess);
//
//            Thread.sleep(2000);
//
//            scheduler.schedule(() -> {
//                if (nodeProcess.isAlive()) {
//                    nodeProcess.destroyForcibly();
//                }
//            }, 10, TimeUnit.MINUTES);
//
//            resp.sendRedirect(req.getContextPath() + "/lab/view/" + fakeContainerId);
//
//        } catch (Exception e) {
//            resp.sendError(500, e.getMessage());
//        }
//    }
//}