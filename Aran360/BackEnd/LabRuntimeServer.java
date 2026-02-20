// import com.sun.net.httpserver.HttpServer;
// import java.net.InetSocketAddress;
// import java.io.*;
// import java.util.UUID;

// public class LabRuntimeServer {

//     private static final String DOCKER_NETWORK = "lab-net";
//     private static final String LABS_DIR = "/labs/";

//     public static void main(String[] args) throws Exception {

//         // Pre-load all lab images at startup (not on every request)
//         File labsDir = new File(LABS_DIR);
//         File[] tars = labsDir.listFiles((d, n) -> n.endsWith(".tar"));
//         if (tars != null) {
//             for (File tar : tars) {
//                 System.out.println("[+] Pre-loading image: " + tar.getName());
//                 Process p = new ProcessBuilder("docker", "load", "-i", tar.getAbsolutePath())
//                         .inheritIO().start();
//                 int exit = p.waitFor();
//                 if (exit != 0) {
//                     System.err.println("[!] Failed to load: " + tar.getName());
//                 } else {
//                     System.out.println("[✓] Loaded: " + tar.getName());
//                 }
//             }
//         }

//         HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 9000), 0);

//         server.createContext("/create", exchange -> {

//             String query = exchange.getRequestURI().getQuery();
//             String labName = "default";
//             if (query != null && query.startsWith("lab=")) {
//                 labName = query.substring(4);
//             }

//             String containerName = "lab_" + labName + "_" +
//                     UUID.randomUUID().toString().substring(0, 8);

//             ProcessBuilder run = new ProcessBuilder(
//                     "docker", "run",
//                     "-d",
//                     "--network", DOCKER_NETWORK,
//                     "--network-alias", "lab-active",
//                     "--name", containerName,
//                     "--memory=1024m",
//                     labName);

//             try {
//                 // Run the container
//                 Process runProcess = run.start();
//                 String runError = new String(runProcess.getErrorStream().readAllBytes());
//                 int runExit = runProcess.waitFor();

//                 if (runExit != 0) {
//                     String msg = "docker run failed: " + runError;
//                     System.err.println(msg);
//                     byte[] body = msg.getBytes();
//                     exchange.sendResponseHeaders(500, body.length);
//                     exchange.getResponseBody().write(body);
//                     exchange.getResponseBody().close();
//                     return;
//                 }

//                 // Wait for the container's app to be ready on port 3000
//                 boolean ready = false;
//                 long deadline = System.currentTimeMillis() + 15_000; // 15s max
//                 while (System.currentTimeMillis() < deadline) {
//                     try {
//                         new java.net.Socket("lab-active", 3000).close();
//                         ready = true;
//                         break;
//                     } catch (Exception ignored) {
//                         Thread.sleep(300);
//                     }
//                 }

//                 if (!ready) {
//                     String msg = "Container started but app did not come up on port 3000 in time";
//                     byte[] body = msg.getBytes();
//                     exchange.sendResponseHeaders(500, body.length);
//                     exchange.getResponseBody().write(body);
//                     exchange.getResponseBody().close();
//                     return;
//                 }

//                 // All good — return container name
//                 byte[] body = containerName.getBytes();
//                 exchange.sendResponseHeaders(200, body.length);
//                 exchange.getResponseBody().write(body);
//                 exchange.getResponseBody().close();

//             } catch (Exception e) {
//                 e.printStackTrace();
//                 byte[] body = e.getMessage().getBytes();
//                 exchange.sendResponseHeaders(500, body.length);
//                 exchange.getResponseBody().write(body);
//                 exchange.getResponseBody().close();
//             }
//         });

//         server.createContext("/cleanup", exchange -> {
//             String query = exchange.getRequestURI().getQuery();
//             if (query != null && query.startsWith("name=")) {
//                 String name = query.substring(5);
//                 new ProcessBuilder("docker", "rm", "-f", name).start();
//             }
//             exchange.sendResponseHeaders(200, 0);
//             exchange.getResponseBody().close();
//         });

//         server.start();
//         System.out.println("[✓] LabRuntimeServer running on port 9000");
//     }
// }

import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class LabRuntimeServer {

    private static final String DOCKER_NETWORK = "lab-net";
    private static final String LABS_DIR       = "/labs/";

    /**
     * Names of successfully pre-loaded images.
     * Used by the /exists endpoint so Tomcat doesn't have to guess.
     */
    private static final Set<String> LOADED_IMAGES =
            ConcurrentHashMap.newKeySet();

    public static void main(String[] args) throws Exception {

        // ── Pre-load all lab images at startup ────────────────────────────
        File labsDir = new File(LABS_DIR);
        File[] tars  = labsDir.listFiles((d, n) -> n.endsWith(".tar"));
        if (tars != null) {
            for (File tar : tars) {
                String imageName = tar.getName()
                        .substring(0, tar.getName().length() - 4); // strip .tar
                System.out.println("[+] Pre-loading image: " + tar.getName());
                Process p = new ProcessBuilder("docker", "load", "-i",
                        tar.getAbsolutePath())
                        .inheritIO().start();
                int exit = p.waitFor();
                if (exit != 0) {
                    System.err.println("[!] Failed to load: " + tar.getName());
                } else {
                    LOADED_IMAGES.add(imageName);
                    System.out.println("[✓] Loaded: " + tar.getName());
                }
            }
        }
        System.out.println("[✓] Loaded images: " + LOADED_IMAGES);

        // ── HTTP server ───────────────────────────────────────────────────
        HttpServer server = HttpServer.create(
                new InetSocketAddress("0.0.0.0", 9000), 0);

        // /exists?lab=<labName>  — 200 if known, 404 if not
        server.createContext("/exists", exchange -> {
            String query   = exchange.getRequestURI().getQuery();
            String labName = parseParam(query, "lab");
            if (labName != null && LOADED_IMAGES.contains(labName)) {
                exchange.sendResponseHeaders(200, 0);
            } else {
                exchange.sendResponseHeaders(404, 0);
            }
            exchange.getResponseBody().close();
        });

        // /create?lab=<labName>  — spins up a container, returns its name
        server.createContext("/create", exchange -> {
            String query   = exchange.getRequestURI().getQuery();
            String labName = parseParam(query, "lab");

            if (labName == null || !LOADED_IMAGES.contains(labName)) {
                String msg = "Unknown lab image: " + labName;
                byte[] body = msg.getBytes();
                exchange.sendResponseHeaders(404, body.length);
                exchange.getResponseBody().write(body);
                exchange.getResponseBody().close();
                return;
            }

            // Container name is also used as the network alias so the
            // proxy can reach it at  http://<containerName>:3000
            String containerName = "lab_" + labName + "_"
                    + UUID.randomUUID().toString().substring(0, 8);

            ProcessBuilder run = new ProcessBuilder(
                    "docker", "run",
                    "-d",
                    "--network",         DOCKER_NETWORK,
                    "--network-alias",   containerName,   // ← unique alias per container
                    "--name",            containerName,
                    "--memory=1024m",
                    labName
            );

            try {
                Process runProcess = run.start();
                String runError = new String(
                        runProcess.getErrorStream().readAllBytes());
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

                // Wait for container app to be ready on port 3000 (15 s max)
                boolean ready    = false;
                long    deadline = System.currentTimeMillis() + 15_000L;
                while (System.currentTimeMillis() < deadline) {
                    try {
                        new java.net.Socket(containerName, 3000).close();
                        ready = true;
                        break;
                    } catch (Exception ignored) {
                        Thread.sleep(300);
                    }
                }

                if (!ready) {
                    String msg = "Container started but app did not come up "
                            + "on port 3000 in time";
                    byte[] body = msg.getBytes();
                    exchange.sendResponseHeaders(500, body.length);
                    exchange.getResponseBody().write(body);
                    exchange.getResponseBody().close();
                    return;
                }

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

        // /cleanup?name=<containerName>
        server.createContext("/cleanup", exchange -> {
            String query = exchange.getRequestURI().getQuery();
            String name  = parseParam(query, "name");
            if (name != null && !name.isEmpty()) {
                new ProcessBuilder("docker", "rm", "-f", name)
                        .start(); // fire-and-forget
            }
            exchange.sendResponseHeaders(200, 0);
            exchange.getResponseBody().close();
        });

        server.start();
        System.out.println("[✓] LabRuntimeServer running on port 9000");
    }

    // ── Utility ───────────────────────────────────────────────────────────

    /** Parses a single key=value from a query string.  Returns null if missing. */
    private static String parseParam(String query, String key) {
        if (query == null) return null;
        String prefix = key + "=";
        for (String part : query.split("&")) {
            if (part.startsWith(prefix)) {
                return part.substring(prefix.length());
            }
        }
        return null;
    }
}