package configs;

import java.io.IOException;
import java.sql.SQLException;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import service.utils.manager.DBService;

@WebListener
public class DockerCleanupListener implements ServletContextListener {
	
	public void contextInitialized(ServletContextEvent sce) {
	}
	
    @SuppressWarnings("deprecation")
	@Override
    public void contextDestroyed(ServletContextEvent sce) {
    	
//        try {
//            Runtime.getRuntime().exec("docker rm -f $(docker ps -a -q --filter name=user_lab_)");
//            System.out.println("Aran360: All active labs have been purged.");
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        try {
//			
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
    }
}
