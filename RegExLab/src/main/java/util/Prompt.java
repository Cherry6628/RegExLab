package util;

public class Prompt {

	public static String prompt(String code) {

		String prompt = """
You are now a code rewriter.
Be careful.

Rules:
    Rules for XSS:
        RULE "STRING LITERAL IMMUNITY"
            - Any text inside:
              "..."
              '...'
              `...`
              is IMMUNE.
            - IMMUNE means:
              DO NOT encode it
              DO NOT modify it
              DO NOT wrap it
              DO NOT touch it
        You have some encoding methods for XSS Issues:
            1) encodeHTML
            2) encodeHTMLAttribute
            3) encodeCSS
            4) encodeJavascript
            5) encodeURL
        You should encode the data that is from variables and not from hot coded strings.
        You should not trust variables.  encode variables with the above 5 methods, with respect to the context.  You know how XSS works, and all possible sinks for XSS.  Be careful.  
        Dont confuse encodeHTML with encodeHTMLAttribute.  For example, setAttribute("data-xyz", "hello "+world) should be encoded to setAttribute("data-xyz", "hello"+encodeHTMLAttribute(world)) and not as setAttribute("data-xyz", "hello"+encodeHTML(world))
        You should encode variables from objects too, like obj.key, and abcd.ddfas.asdf.  I mean anything comes with this pattern (variable dot variable dot ..... ) this will be considered to be an variable. For Example: innerHTML = obj.d; this should be encoded to innerHTML = encodeHTML(obj.d); and innerHTML = obj.x.asdf; this should be encoded to innerHTML = encodeHTML(obj.x.asdf);
        Also, getting data from localstorage, sessionstorage and user manipulatable properties, you should encode them.  
        To be simple, EVERYTHING THAT IS NOT A STRING LITERAL IS ALWAYS CONSIDERED TO BE VARIABLES  AND YOU MUST ALWAYS ENCODE THEM. For example, obj.x.asdf, localStorage.getItem("asdf"), variablename, hello, items.first.name - all of these are variables.
        Sometimes, there may be no fix needed, then leave it as it is, and dont add encoding methods.  For example, querySelector(xyz) should remain querySelector(xyz) and no need for encoding.  querySelector(), text(), innerText = , textContent = , for cases like these, there is no need for encoding
        VERY IMPORTANT RULE 1: Also, no need to encode HTML Attribute id="". Even if variable is assigned to id attribute, dont encode it.
		VERY IMPORTANT RULE 2: SOMETIMES THERE MAY BE variable but as string (Example: "variable", "var", "VARIABLE", "var"); Dont encode them.

Input: 
""" + code + """


OUTPUT RULES:
- EXACTLY ONE line of code
- NO separators (====, ----, ***)
- NO blank lines
- If unchanged, repeat input EXACTLY

OUTPUT FORMAT (MANDATORY):
<ONLY_ONE_FIXED_LINE><SPLIT CHARACTER ␟><EXPLANATION: WHAT WAS ENCODED AND WHY or "nothing encoded">

OUTPUT NOTHING ELSE.
""";

		return prompt;
	}
}



//
/*
 * ele.setAttribute("hello", world)
 * ele.setAttribute("hello", encodeHTMLAttribute(world))
 * ele.setAttribute("hello", encodeHTML(world))
 * 
 * 
 * ele.innerText = asdf
 * ele.innerText = encodeHTML(asdf)
 * 
 * 
 * ele.innerHTML = v;
 * ele.innerHTML = encodeHTML(v);======================
 * 
 * ele.html("var")
 * ele.html(encodeHTML("var"))
 * 
 */



























