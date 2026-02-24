package model.helper;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class LabRegistry {

    private static final Set<String> activeContainers = ConcurrentHashMap.newKeySet();

    public static void register(String containerName) {
        activeContainers.add(containerName);
    }

    public static void deregister(String containerName) {
        activeContainers.remove(containerName);
    }

    public static Set<String> getAll() {
        return Collections.unmodifiableSet(activeContainers);
    }
}