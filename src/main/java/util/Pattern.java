package util;
import java.util.HashMap;
public class Pattern {
	public static HashMap<String, String> payloads(){
		HashMap<String, String> patterns = new HashMap<>();
		patterns.put("element.innerHTML = \"x\" + v + \"y\"", "element.innerHTML = \"x\" + encodeHTML(v) + \"y\"");
		patterns.put("element.outerHTML = \"x\" + v + \"y\"", "element.outerHTML = \"x\" + encodeHTML(v) + \"y\"");
		patterns.put("insertAdjacentHTML(p, v)", "insertAdjacentHTML(p, encodeHTML(v))");
		patterns.put("document.write(v)", "document.write(encodeHTML(v))");
		patterns.put("document.writeln(v)", "document.writeln(encodeHTML(v))");
		patterns.put("Range.createContextualFragment(v)", "Range.createContextualFragment(encodeHTML(v))");
		patterns.put("setAttribute(\"title\", v)", "setAttribute(\"title\", encodeHTMLAttribute(v))");
		patterns.put("element.attributes[i].value = v", "element.attributes[i].value = encodeHTMLAttribute(v)");
		patterns.put(".attr(\"title\", v)", ".attr(\"title\", encodeHTMLAttribute(v))");
		patterns.put("formaction = v", "formaction = encodeHTML(v)");
		patterns.put("href = v", "href = encodeHTML(v)");
		patterns.put("src = v", "src = encodeHTML(v)");
		patterns.put("xlink:href = v", "xlink:href = encodeHTML(v)");
		patterns.put("location.href = v", "location.href = encodeHTML(v)");
		patterns.put("location = v", "location = encodeHTML(v)");
		patterns.put("location.assign(v)", "location.assign(encodeHTML(v))");
		patterns.put("location.replace(v)", "location.replace(encodeHTML(v))");
		patterns.put("location.open(v)", "location.open(encodeHTML(v))");
		return patterns;
	}
}