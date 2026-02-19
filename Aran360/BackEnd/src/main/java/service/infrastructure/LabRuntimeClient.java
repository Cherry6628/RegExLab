package service.infrastructure;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class LabRuntimeClient {

	private static final String BASE_URL = "http://lab-runtime:9000";

	public String createLab(String labName) throws Exception {

		URL url = new URL(BASE_URL + "/create?lab=" + labName);

		HttpURLConnection con = (HttpURLConnection) url.openConnection();

		con.setRequestMethod("GET");
		con.setConnectTimeout(5000);
		con.setReadTimeout(10000);

		int status = con.getResponseCode();

		if (status != 200) {
			throw new RuntimeException("Lab creation failed: " + status);
		}

		try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()))) {

			return br.readLine();
		}
	}

	public void cleanupLab(String containerName) {

		try {
			URL url = new URL(BASE_URL + "/cleanup?name=" + containerName);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();

			con.setRequestMethod("POST");
			con.getResponseCode();

		} catch (Exception ignored) {
		}
	}
}
