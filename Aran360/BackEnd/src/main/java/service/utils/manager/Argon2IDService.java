// package service.utils.manager;

// import configs.ParamsAndDBLoader;
// import de.mkammerer.argon2.Argon2;
// import de.mkammerer.argon2.Argon2Factory;

// public class Argon2IDService {

// 	private static final Argon2 argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
// 	public static final Argon2IDService object = new Argon2IDService();
// 	private int ITERATIONS;
// 	private int MEMORY;
// 	private int PARALLELISM;

// 	Argon2IDService(int iterations, int memory, int parallelism){
// 		this.ITERATIONS=iterations;
// 		this.MEMORY=memory;
// 		this.PARALLELISM=parallelism;
// 	}
// 	Argon2IDService(){
// 		this(ParamsAndDBLoader.ARGON2ID_ITERATIONS, ParamsAndDBLoader.ARGON2ID_MEMORY, ParamsAndDBLoader.ARGON2ID_PARALLELISM);
// 	}
// 	public String hash(String password) {
// 		char[] passwordChars = password.toCharArray();
// 		try {
// 			return argon2.hash(ITERATIONS, MEMORY, PARALLELISM, passwordChars);
// 		} finally {
// 			argon2.wipeArray(passwordChars);
// 		}
// 	}

// 	public boolean verify(String hashFromDb, String passwordInput) {
// 		char[] passwordChars = passwordInput.toCharArray();
// 		try {
// 			return argon2.verify(hashFromDb, passwordChars);
// 		} finally {
// 			argon2.wipeArray(passwordChars);
// 		}
// 	}

// }

package service.utils.manager;

import configs.ParamsAndDBLoader;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.security.MessageDigest;
import java.util.Base64;

public class Argon2IDService {

    public static final Argon2IDService object = new Argon2IDService();

    private int ITERATIONS;
    private int MEMORY;       // not used (kept for compatibility)
    private int PARALLELISM;  // not used (kept for compatibility)

    Argon2IDService(int iterations, int memory, int parallelism){
        this.ITERATIONS = iterations;
        this.MEMORY = memory;
        this.PARALLELISM = parallelism;
    }

    Argon2IDService(){
        this(
            ParamsAndDBLoader.ARGON2ID_ITERATIONS,
            ParamsAndDBLoader.ARGON2ID_MEMORY,
            ParamsAndDBLoader.ARGON2ID_PARALLELISM
        );
    }

    public String hash(String password) {
        try {
            byte[] salt = generateSalt();

            PBEKeySpec spec = new PBEKeySpec(
                    password.toCharArray(),
                    salt,
                    ITERATIONS,
                    256
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
            throw new RuntimeException(e);
        }
    }

    private byte[] generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }
}
