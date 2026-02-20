package controller.main.servlets.labs;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import configs.ParamsAndDBLoader;
import service.helper.model.LabInstance;
import service.helper.model.LabRegistry;
import service.infrastructure.LabRuntimeClient;

@WebServlet("/lab/image/*")
public class LabOrchestratorServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String SESSION_LAB_MAP = "LAB_MAP";

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

	private final LabRuntimeClient runtimeClient = new LabRuntimeClient();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		HttpSession session = req.getSession(false);
		if (session == null) {
			resp.sendRedirect(req.getContextPath() + "/dashboard");
			return;
		}

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

			LabInstance lab = new LabInstance(labName, containerName, ParamsAndDBLoader.LAB_TIMEOUT_SECONDS);

			labMap.put(labName, lab);
			LabRegistry.register(containerName);
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

	private void redirectToDashboard(HttpServletRequest req, HttpServletResponse resp, HttpSession session,
			String message) throws IOException {
		session.setAttribute("FLASH_ERROR", message);
		resp.sendRedirect(req.getContextPath() + "/dashboard");
	}

	@Override
	public void destroy() {
		scheduler.shutdownNow();
	}
}