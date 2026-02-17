package service.utils.manager;

import configs.ParamsAndDBLoader;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

public class Argon2IDService {

	private static final Argon2 argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
	public static final Argon2IDService object = new Argon2IDService();
	private int ITERATIONS;
	private int MEMORY;
	private int PARALLELISM;

	Argon2IDService(int iterations, int memory, int parallelism){
		this.ITERATIONS=iterations;
		this.MEMORY=memory;
		this.PARALLELISM=parallelism;
	}
	Argon2IDService(){
		this(ParamsAndDBLoader.ARGON2ID_ITERATIONS, ParamsAndDBLoader.ARGON2ID_MEMORY, ParamsAndDBLoader.ARGON2ID_PARALLELISM);
	}
	public String hash(String password) {
		char[] passwordChars = password.toCharArray();
		try {
			return argon2.hash(ITERATIONS, MEMORY, PARALLELISM, passwordChars);
		} finally {
			argon2.wipeArray(passwordChars);
		}
	}

	public boolean verify(String hashFromDb, String passwordInput) {
		char[] passwordChars = passwordInput.toCharArray();
		try {
			return argon2.verify(hashFromDb, passwordChars);
		} finally {
			argon2.wipeArray(passwordChars);
		}
	}

}
