package model.helper;

public class LabInstance {

	public final String labName;
	public final String imageId;
	public final String containerId;
	private final long expiresAt;

	public LabInstance(String labName, String imageId, String containerId, long timeoutSeconds) {
		this.labName = labName;
		this.imageId=imageId;
		this.containerId = containerId;
		this.expiresAt = System.currentTimeMillis() + (timeoutSeconds * 1000L);
	}

	public boolean isExpired() {
		return System.currentTimeMillis() >= expiresAt;
	}

	public long secondsRemaining() {
		return (expiresAt - System.currentTimeMillis()) / 1000L;
	}
}