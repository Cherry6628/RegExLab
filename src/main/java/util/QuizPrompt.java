package util;
public class QuizPrompt {
	public static String prompt(String code) {
		String prompt = """
		You are a code correction assistant.

		Your task is to fix a single line of code using the provided Issue–Fix patterns
		and present the result as a multiple-choice question.

		GLOBAL RULES (apply to ALL vulnerabilities):
		- String literals ("...") are SAFE by default.
		- If an expression contains ONLY string literals, output it unchanged.
		- Do NOT apply any fix to string literals.
		- Apply fixes ONLY to non-literal variables or expressions.
		- Some inputs are already secure; in such cases, the correct option MUST be IDENTICAL to the input.
		- Never wrap encodeHTML, encodeURL, encodeJavaScript, or similar functions around string literals.
		- If no Issue–Fix pattern clearly applies, keep the original line unchanged.

		INSTRUCTIONS:
		- Analyze the sample Issue–Fix pairs to understand the transformation intent.
		- Identify the closest matching issue pattern.
		- Determine the ONE correct fixed line (or unchanged line if already secure).
		- Create THREE additional plausible but incorrect options.
		- Randomly shuffle all FOUR options every time.
		- Do NOT change the meaning of any option.
		- Output ONLY in the specified format.
		- Do NOT add explanations before the output.

		SAMPLE DATA:
		""";

		for (String key : Pattern.payloads().keySet()) {
			prompt += "\nIssue:\n" + key +
			          "\nFix:\n" + Pattern.payloads().get(key) + "\n";
		}

		prompt += """

		INPUT:
		""" + code + """

		OUTPUT FORMAT:
		Options:
		A) <code line>
		B) <code line>
		C) <code line>
		D) <code line>""";
		return prompt;
	}
}