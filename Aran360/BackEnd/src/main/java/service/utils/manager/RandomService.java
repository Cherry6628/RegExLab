package service.utils.manager;

import java.security.SecureRandom;

public class RandomService {
	public static byte[] randomByteArray(int n) {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[n];
        random.nextBytes(salt);
        return salt;
    }
}
