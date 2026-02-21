package service.utils.manager;

import java.security.SecureRandom;
import java.util.UUID;

public class RandomService {
	public static byte[] randomByteArray(int n) {
		SecureRandom random = new SecureRandom();
		byte[] salt = new byte[n];
		random.nextBytes(salt);
		return salt;
	}

	public static String randomUUID() {
		return UUID.randomUUID().toString();
	}

	private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
	private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static final String NUMBERS = "0123456789";
	private static final String SYMBOLS = "!@#$%^&*()-_=+<>?";

	public static String generateRandomString(int length, boolean includeLower, boolean includeUpper,
			boolean includeNumbers, boolean includeSymbols) {
		if (length <= 0)
			length = 128;

		StringBuilder characterSet = new StringBuilder();
		if (includeLower)
			characterSet.append(LOWERCASE);
		if (includeUpper)
			characterSet.append(UPPERCASE);
		if (includeNumbers)
			characterSet.append(NUMBERS);
		if (includeSymbols)
			characterSet.append(SYMBOLS);

		if (characterSet.length() == 0) {
			characterSet.append(LOWERCASE);
			characterSet.append(UPPERCASE);
			characterSet.append(NUMBERS);
			characterSet.append(SYMBOLS);
		}

		SecureRandom random = new SecureRandom();
		StringBuilder randomString = new StringBuilder(length);

		for (int i = 0; i < length; i++) {
			int randomIndex = random.nextInt(characterSet.length());
			randomString.append(characterSet.charAt(randomIndex));
		}

		return randomString.toString();
	}
	public static String generateRandomString(int length) {
		return generateRandomString(length, false, false, false, false);
	}
}
