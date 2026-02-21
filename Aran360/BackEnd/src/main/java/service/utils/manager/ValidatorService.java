package service.utils.manager;

import java.util.regex.Pattern;

public class ValidatorService {

	private static final Pattern EMAIL_PATTERN = Pattern.compile("^(?![._%+\\-])[a-zA-Z0-9._%+\\-]{1,64}(?<![._%+\\-])@(?!\\-)(?:[a-zA-Z0-9\\-]{1,63}\\.)+[a-zA-Z]{2,63}$");
	private static final Pattern EMAIL_LABEL_PATTERN = Pattern.compile("[a-zA-Z0-9\\-]+");
	private static final Pattern EMAIL_TLD_PATTERN = Pattern.compile("[0-9]+");

	public static boolean isEmail(String email) {

		if (email == null)
			return false;
		email = email.strip();
		if (email.isEmpty())
			return false;

		if (email.length() > 254)
			return false;

		for (char c : email.toCharArray()) {
			if (c <= 32 || c > 126)
				return false;
		}

		int atIndex = email.indexOf('@');
		if (atIndex == -1)
			return false;
		if (atIndex != email.lastIndexOf('@'))
			return false;

		String local = email.substring(0, atIndex);
		String domain = email.substring(atIndex + 1);

		if (local.isEmpty() || local.length() > 64)
			return false;
		if (local.contains(".."))
			return false;
		if (local.startsWith(".") || local.endsWith("."))
			return false;

		if (domain.isEmpty() || domain.length() > 253)
			return false;
		if (!domain.contains("."))
			return false;
		if (domain.startsWith(".") || domain.endsWith(".") || domain.startsWith("-") || domain.endsWith("-"))
			return false;
		if (domain.contains(".."))
			return false;

		String[] labels = domain.split("\\.");
		for (String label : labels) {
			if (label.isEmpty() || label.length() > 63)
				return false;
			if (label.startsWith("-") || label.endsWith("-"))
				return false;
			if (!EMAIL_LABEL_PATTERN.matcher(label).matches())
				return false;
		}

		String tld = labels[labels.length - 1];
		if (EMAIL_TLD_PATTERN.matcher(tld).matches())
			return false;

		return EMAIL_PATTERN.matcher(email).matches();
	}
}