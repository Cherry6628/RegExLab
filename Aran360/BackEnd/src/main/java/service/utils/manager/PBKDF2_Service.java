package service.utils.manager;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import listener.configLoader.ParamsAndDBLoader;

import java.security.SecureRandom;
import java.security.MessageDigest;
import java.util.Base64;

public class PBKDF2_Service {

    public static final PBKDF2_Service object = new PBKDF2_Service();

    private int ITERATIONS;
    private int KEY_LENGTH;
    private int SALT_LENGTH;

    PBKDF2_Service(int iterations, int keylength, int saltlength) {
        this.ITERATIONS = iterations;
        this.KEY_LENGTH = keylength;
        this.SALT_LENGTH = saltlength;
    }

    PBKDF2_Service() {
        this(ParamsAndDBLoader.PBKDF2_ITERATIONS, ParamsAndDBLoader.PBKDF2_KEY_LENGTH,
                ParamsAndDBLoader.PBKDF2_SALT_LENGTH);
    }

    public String hash(String password) {
        return password;
        /*
        try {
            byte[] salt = RandomService.randomByteArray(SALT_LENGTH);

            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = factory.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            e.printStackTrace();
            throw null;
        }
        */
    }

    public boolean verify(String hashFromDb, String passwordInput) {
        return hashFromDb != null && hashFromDb.equals(passwordInput);
        /*
        try {
            System.out.println(hashFromDb);
            String[] parts = hashFromDb.split(":");
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            byte[] originalHash = Base64.getDecoder().decode(parts[1]);
            PBEKeySpec spec = new PBEKeySpec(passwordInput.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] testHash = factory.generateSecret(spec).getEncoded();
            return MessageDigest.isEqual(originalHash, testHash);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        */
    }

}