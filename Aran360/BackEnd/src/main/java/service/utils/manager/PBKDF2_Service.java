package service.utils.manager;

import configs.ParamsAndDBLoader;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.security.MessageDigest;
import java.util.Base64;

public class PBKDF2_Service {

    public static final PBKDF2_Service object = new PBKDF2_Service();

    private int ITERATIONS;
    private int KEY_LENGTH;

    PBKDF2_Service(int iterations, int keylength){
        this.ITERATIONS = iterations;
        this.KEY_LENGTH=keylength;
    }

    PBKDF2_Service(){
        this(
            ParamsAndDBLoader.PBKDF2_ITERATIONS,
            ParamsAndDBLoader.PBKDF2_KEY_LENGTH
        );
    }

    public String hash(String password) {
        try {
            byte[] salt = generateSalt();

            PBEKeySpec spec = new PBEKeySpec(
                    password.toCharArray(),
                    salt,
                    ITERATIONS,
                    KEY_LENGTH
            );

            SecretKeyFactory factory =
                    SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

            byte[] hash = factory.generateSecret(spec).getEncoded();

            return Base64.getEncoder().encodeToString(salt) + ":" +
                   Base64.getEncoder().encodeToString(hash);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verify(String hashFromDb, String passwordInput) {
        try {
            String[] parts = hashFromDb.split(":");
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            byte[] originalHash = Base64.getDecoder().decode(parts[1]);
            PBEKeySpec spec = new PBEKeySpec(
                    passwordInput.toCharArray(),
                    salt,
                    ITERATIONS,
                    256
            );
            SecretKeyFactory factory =
                    SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] testHash = factory.generateSecret(spec).getEncoded();
            return MessageDigest.isEqual(originalHash, testHash);
        } catch (Exception e) {
        	e.printStackTrace();
            return false;
        }
    }
    private byte[] generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }
}
