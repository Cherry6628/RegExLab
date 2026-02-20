package service.infrastructure;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class LabRuntimeClient {

    private static final String BASE_URL = "http://lab-runtime:9000";

    public boolean labExists(String labName) {
        try {
            URL url = new URL(BASE_URL + "/exists?lab=" + labName);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setConnectTimeout(3000);
            con.setReadTimeout(3000);
            return con.getResponseCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    public String createLab(String labName) throws Exception {
        URL url = new URL(BASE_URL + "/create?lab=" + labName);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        con.setConnectTimeout(5000);
        con.setReadTimeout(20000);

        int status = con.getResponseCode();
        if (status != 200) {
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(con.getErrorStream()))) {
                String detail = br.readLine();
                throw new RuntimeException("Lab creation failed (" + status + "): " + detail);
            }
        }

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(con.getInputStream()))) {
            return br.readLine().trim();
        }
    }

    public void cleanupLab(String containerName) {
        try {
            URL url = new URL(BASE_URL + "/cleanup?name=" + containerName);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setConnectTimeout(3000);
            con.setReadTimeout(5000);
            con.getResponseCode();
        } catch (Exception ignored) {
        }
    }
}