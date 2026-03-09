package service.utils.manager;

import listener.configLoader.ParamsAndDBLoader;
import org.mindrot.jbcrypt.BCrypt;

public class BCrypt_Service {
    public static final BCrypt_Service object = new BCrypt_Service();
    private int ITERATIONS;
    BCrypt_Service(int iterations) {
        this.ITERATIONS = iterations;
    }
    BCrypt_Service() {
        this(ParamsAndDBLoader.PBKDF2_ITERATIONS);
    }
    public String hash(String password) {
        int logRounds = ITERATIONS > 0 ? ITERATIONS : 12;
        return BCrypt.hashpw(password, BCrypt.gensalt(logRounds));
    }
    public boolean verify(String hashFromDb, String passwordInput) {
        if (hashFromDb == null || passwordInput == null) return false;
        return BCrypt.checkpw(passwordInput, hashFromDb);
    }
}