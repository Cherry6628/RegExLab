package service.helper.model;

import java.io.Serializable;

public class LabInstance implements Serializable {
    private static final long serialVersionUID = 1L;
	public String containerId;
    public String ipAddress;
    public long expiryTime;

    public LabInstance(String id, String ip, int durationSec) {
        this.containerId = id;
        this.ipAddress = ip;
        this.expiryTime = System.currentTimeMillis() + (durationSec * 1000);
    }
}