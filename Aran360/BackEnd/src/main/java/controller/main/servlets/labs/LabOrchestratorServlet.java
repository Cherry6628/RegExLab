//package controller.main.servlets.labs;
//
//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.InputStreamReader;
//import java.util.concurrent.Executors;
//import java.util.concurrent.ScheduledExecutorService;
//import java.util.concurrent.TimeUnit;
//
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
//            resp.getWriter().write("No session found. Please login.");
//            return;
//        }
//
//        LabInstance existingLab = (LabInstance) session.getAttribute("ACTIVE_LAB");
//        if (existingLab != null) {
//            resp.sendRedirect(req.getContextPath() + "/lab/view/" + existingLab.containerId);
//            return;
//        }
//
////        try {
////            String tarPath = getServletContext().getRealPath("/WEB-INF/dockers/xss-stored-lab.tar");
////            String containerName = "user_lab_" + session.getId().substring(0, 8);
////
////            Runtime.getRuntime().exec("docker rm -f " + containerName).waitFor();
////
////            Runtime.getRuntime().exec("docker load -i " + tarPath).waitFor();
////
////            String runCmd = "docker run -d --network host --name " + containerName + " xss-stored-lab";
////            Runtime.getRuntime().exec(runCmd).waitFor();
////            String ip = "127.0.0.1";
////
////            System.out.println("DEBUG: Lab Started on Host Network. ID: " + containerName + " IP: " + ip);
////
////            LabInstance newLab = new LabInstance(containerName, ip, 600);
////            session.setAttribute("ACTIVE_LAB", newLab);
////            
////            Thread.sleep(3000);
////
////            resp.sendRedirect(req.getContextPath() + "/lab/view/" + containerName);
////
////        } catch (Exception e) {
////            e.printStackTrace();
////            resp.sendError(500, "Launch Error: " + e.getMessage());
////        }
//     // Inside LabOrchestratorServlet.java -> doGet
//        try {
//            String labPath = "/home/san-zstk426/demo-lab/"; // Path to your Node files
//            String containerName = "DEMO_MODE_" + session.getId().substring(0, 8);
//
//            // 1. Start Node.js as a local process
//            ProcessBuilder pb = new ProcessBuilder("node", "server.js");
//            pb.directory(new java.io.File(labPath));
//            Process nodeProcess = pb.start();
//
//            // 2. Store the process in the session so we can kill it later
//            // Note: We use 127.0.0.1 because it's running natively on your machine
//            String ip = "127.0.0.1";
//            
//            // We treat the "Process" as our "Container"
//            LabInstance newLab = new LabInstance(containerName, ip, 600);
//            session.setAttribute("ACTIVE_LAB", newLab);
//            session.setAttribute("NODE_PROCESS", nodeProcess); // Save the actual process object
//
//            System.out.println("DEMO MODE: Node process started at 127.0.0.1:3000");
//
//            Thread.sleep(2000); // Wait for Node to bind to port 3000
//            resp.sendRedirect(req.getContextPath() + "/lab/view/" + containerName);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            resp.sendError(500, "Demo Orchestrator Error: " + e.getMessage());
//        }
//    }
//}
package controller.main.servlets.labs;

import java.io.IOException;
import java.io.File;
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

@WebServlet("/lab/image/stored-xss")
public class LabOrchestratorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
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
            resp.getWriter().write("No session found.");
            return;
        }

        String labPath = "/home/venkat-zstk413/temp/xss-lab"; 
        String fakeContainerId = "demo_" + session.getId().substring(0, 8);
        String ip = "127.0.0.1";

        try {
            String nodePath = "/home/venkat-zstk413/.nvm/versions/node/v24.11.1/bin/node";
            ProcessBuilder pb = new ProcessBuilder(nodePath, "server.js");
            pb.directory(new File(labPath));
            pb.redirectErrorStream(true);
            Process nodeProcess = pb.start();

            LabInstance newLab = new LabInstance(fakeContainerId, ip, 600);
            session.setAttribute("ACTIVE_LAB", newLab);
            session.setAttribute("LAB_PROCESS", nodeProcess);

            Thread.sleep(2000);

            scheduler.schedule(() -> {
                if (nodeProcess.isAlive()) {
                    nodeProcess.destroyForcibly();
                }
            }, 10, TimeUnit.MINUTES);

            resp.sendRedirect(req.getContextPath() + "/lab/view/" + fakeContainerId);

        } catch (Exception e) {
            resp.sendError(500, e.getMessage());
        }
    }
}