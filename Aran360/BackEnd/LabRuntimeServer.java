import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.io.*;
import java.util.UUID;

public class LabRuntimeServer {

    private static final String DOCKER_NETWORK = "lab-net";
    private static final String LABS_DIR = "/labs/";

    public static void main(String[] args) throws Exception {

        // Pre-load all lab images at startup (not on every request)
        File labsDir = new File(LABS_DIR);
        File[] tars = labsDir.listFiles((d, n) -> n.endsWith(".tar"));
        if (tars != null) {
            for (File tar : tars) {
                System.out.println("[+] Pre-loading image: " + tar.getName());
                Process p = new ProcessBuilder("docker", "load", "-i", tar.getAbsolutePath())
                        .inheritIO().start();
                int exit = p.waitFor();
                if (exit != 0) {
                    System.err.println("[!] Failed to load: " + tar.getName());
                } else {
                    System.out.println("[✓] Loaded: " + tar.getName());
                }
            }
        }

        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 9000), 0);

        server.createContext("/create", exchange -> {

            String query = exchange.getRequestURI().getQuery();
            String labName = "default";
            if (query != null && query.startsWith("lab=")) {
                labName = query.substring(4);
            }

            String containerName = "lab_" + labName + "_" +
                    UUID.randomUUID().toString().substring(0, 8);

            ProcessBuilder run = new ProcessBuilder(
                    "docker", "run",
                    "-d",
                    "--network", DOCKER_NETWORK,
                    "--network-alias", "lab-active",
                    "--name", containerName,
                    "--memory=1024m",
                    labName);

            try {
                // Run the container
                Process runProcess = run.start();
                String runError = new String(runProcess.getErrorStream().readAllBytes());
                int runExit = runProcess.waitFor();

                if (runExit != 0) {
                    String msg = "docker run failed: " + runError;
                    System.err.println(msg);
                    byte[] body = msg.getBytes();
                    exchange.sendResponseHeaders(500, body.length);
                    exchange.getResponseBody().write(body);
                    exchange.getResponseBody().close();
                    return;
                }

                // Wait for the container's app to be ready on port 3000
                boolean ready = false;
                long deadline = System.currentTimeMillis() + 15_000; // 15s max
                while (System.currentTimeMillis() < deadline) {
                    try {
                        new java.net.Socket("lab-active", 3000).close();
                        ready = true;
                        break;
                    } catch (Exception ignored) {
                        Thread.sleep(300);
                    }
                }

                if (!ready) {
                    String msg = "Container started but app did not come up on port 3000 in time";
                    byte[] body = msg.getBytes();
                    exchange.sendResponseHeaders(500, body.length);
                    exchange.getResponseBody().write(body);
                    exchange.getResponseBody().close();
                    return;
                }

                // All good — return container name
                byte[] body = containerName.getBytes();
                exchange.sendResponseHeaders(200, body.length);
                exchange.getResponseBody().write(body);
                exchange.getResponseBody().close();

            } catch (Exception e) {
                e.printStackTrace();
                byte[] body = e.getMessage().getBytes();
                exchange.sendResponseHeaders(500, body.length);
                exchange.getResponseBody().write(body);
                exchange.getResponseBody().close();
            }
        });

        server.createContext("/cleanup", exchange -> {
            String query = exchange.getRequestURI().getQuery();
            if (query != null && query.startsWith("name=")) {
                String name = query.substring(5);
                new ProcessBuilder("docker", "rm", "-f", name).start();
            }
            exchange.sendResponseHeaders(200, 0);
            exchange.getResponseBody().close();
        });

        server.start();
        System.out.println("[✓] LabRuntimeServer running on port 9000");
    }
}