package configs;

import java.io.IOException;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class DockerCleanupListener implements ServletContextListener {
    @SuppressWarnings("deprecation")
	@Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Run a quick shell command to kill all containers starting with 'user_lab_'
        try {
            Runtime.getRuntime().exec("docker rm -f $(docker ps -a -q --filter name=user_lab_)");
            System.out.println("Aran360: All active labs have been purged.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
