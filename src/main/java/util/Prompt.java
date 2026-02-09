package util;
public class Prompt {
	public static String prompt(String code) {
		String prompt = """
You are a code correction assistant.

Your task is to fix a single line of code using the provided Issue-Fix patterns.

GLOBAL RULES (apply to ALL vulnerabilities):
- String literals ("...") are SAFE by default.
- If an expression contains ONLY string literals, output it unchanged.
- Do NOT apply any fix to string literals.
- Apply fixes ONLY to non-literal variables or expressions.
- Some inputs are already secure; in such cases, output must be IDENTICAL to the input.
- Never wrap encodeHTML, encodeURL, encodeJavaScript, or similar functions around string literals.
- If no pattern clearly applies, output the original line unchanged.

INSTRUCTIONS:
- Analyze the sample Issue-Fix pairs to understand transformation intent.
- Identify the closest matching issue pattern.
- Apply ONLY the corresponding fix.
- Output ONLY ONE corrected line of code (or the unchanged line if no fix is needed).
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

OUTPUT:
<ONLY_ONE_FIXED_LINE><SPLIT CHARACTER ␟><EXPLANATION - After the split character, explain what the output does in exactly two short lines.>
Do not add anything else.
""";

		return prompt;
	}
}
