import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class LabRuntimeServer {
	private static final String DOCKER_NETWORK = "lab-net";
	private static final String LABS_DIR = "/labs/";
	private static final Set<String> LOADED_IMAGES = ConcurrentHashMap.newKeySet();

	public static void main(String[] args) throws Exception {
		File labsDir = new File(LABS_DIR);
		File[] tars = labsDir.listFiles((d, n) -> n.endsWith(".tar"));
		if (tars != null) {
			for (File tar : tars) {
				String imageName = tar.getName().substring(0, tar.getName().length() - 4);
				System.out.println("[+] Pre-loading image: " + tar.getName());
				Process p = new ProcessBuilder("docker", "load", "-i", tar.getAbsolutePath()).inheritIO().start();
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
		HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 9000), 0);
		server.createContext("/exists", exchange -> {
			String query = exchange.getRequestURI().getQuery();
			String labName = parseParam(query, "lab");
			if (labName != null && LOADED_IMAGES.contains(labName)) {
				exchange.sendResponseHeaders(200, 0);
			} else {
				exchange.sendResponseHeaders(404, 0);
			}
			exchange.getResponseBody().close();
		});
		server.createContext("/create", exchange -> {
			String query = exchange.getRequestURI().getQuery();
			String labName = parseParam(query, "lab");
			if (labName == null || !LOADED_IMAGES.contains(labName)) {
				String msg = "Unknown lab image: " + labName;
				byte[] body = msg.getBytes();
				exchange.sendResponseHeaders(404, body.length);
				exchange.getResponseBody().write(body);
				exchange.getResponseBody().close();
				return;
			}
			String containerName = "lab_" + labName + "_" + UUID.randomUUID().toString().substring(0, 8);
			ProcessBuilder run = new ProcessBuilder("docker", "run", "-d", "--network", DOCKER_NETWORK,
					"--network-alias", containerName, "--name", containerName, "--memory=1024m", labName);
			try {
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
				boolean ready = false;
				long deadline = System.currentTimeMillis() + 15_000L;
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
					String msg = "Container started but app did not come up " + "on port 3000 in time";
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
		server.createContext("/cleanup", exchange -> {
			String query = exchange.getRequestURI().getQuery();
			String name = parseParam(query, "name");
			if (name != null && !name.isEmpty()) {
				new ProcessBuilder("docker", "rm", "-f", name).start();
			}
			exchange.sendResponseHeaders(200, 0);
			exchange.getResponseBody().close();
		});
		server.start();
		System.out.println("[✓] LabRuntimeServer running on port 9000");
	}

	private static String parseParam(String query, String key) {
		if (query == null)
			return null;
		String prefix = key + "=";
		for (String part : query.split("&")) {
			if (part.startsWith(prefix))
				return part.substring(prefix.length());
		}
		return null;
	}
}