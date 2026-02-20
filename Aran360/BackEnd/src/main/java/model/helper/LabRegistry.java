package model.helper;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class LabRegistry {

    private static final Set<String> activeContainers =
            ConcurrentHashMap.newKeySet();

    /** Called by LabOrchestratorServlet immediately after a container starts. */
    public static void register(String containerName) {
        activeContainers.add(containerName);
    }

    /** Called by the scheduled cleanup task when a container is torn down. */
    public static void deregister(String containerName) {
        activeContainers.remove(containerName);
    }

    /** Returns an unmodifiable snapshot — safe to iterate during shutdown. */
    public static Set<String> getAll() {
        return Collections.unmodifiableSet(activeContainers);
    }
}