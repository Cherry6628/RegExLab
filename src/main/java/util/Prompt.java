package util;
public class Prompt {
	public static String prompt(String code) {
		String prompt = """
				You are a code correction assistant. Your task is to fix code lines based on provided sample issue-fix pairs
                    Instructions:
	                     Analyze the sample data to understand the pattern between each issue and its fix.
	                     Compare the input line with the sample issues and identify the closest matching issue category.
	                     Apply the corresponding fix pattern to the input line.
	                     Output only the corrected code line no explanation, no extra text.
                    Sample Data:""";
		for(String key:Pattern.payloads().keySet()){
			prompt+="\nIssue: \n"+key+"\nFix:\n"+Pattern.payloads().get(key)+"\n";
		}
		prompt +="Input:\n" + code +
				  "\n\nOutput:\n<ONLY_FIXED_LINE>" +
				  "\n\nYou MUST print this split character on its own line:\n" +
				  "␟\n" +
				  "After the split character, explain what the output does in exactly two short lines.\n" +
				  "Do not add anything else.";
		return prompt;
	}
}