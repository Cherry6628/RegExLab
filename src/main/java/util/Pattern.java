package util;
import java.util.HashMap;
public class Pattern {
	public static HashMap<String, String> payloads() {
		HashMap<String, String> patterns = new HashMap<>();
		// HTML context
		patterns.put(
				"el.innerHTML = v",
				"el.innerHTML = encodeHTML(v)");

		patterns.put(
				"el.innerHTML = \"x\" + v + \"y\"",
				"el.innerHTML = \"x\" + encodeHTML(v) + \"y\"");

		patterns.put(
				"el.outerHTML = v",
				"el.outerHTML = encodeHTML(v)");

		patterns.put(
				"el.outerHTML = \"x\" + v + \"y\"",
				"el.outerHTML = \"x\" + encodeHTML(v) + \"y\"");

		patterns.put(
				"insertAdjacentHTML(p, v)",
				"insertAdjacentHTML(p, encodeHTML(v))");

		patterns.put(
				"document.write(v)",
				"document.write(encodeHTML(v))");

		patterns.put(
				"document.writeln(v)",
				"document.writeln(encodeHTML(v))");

		patterns.put(
				"Range.createContextualFragment(v)",
				"Range.createContextualFragment(encodeHTML(v))");

		// Attribute context
		patterns.put(
				"el.setAttribute(\"title\", v)",
				"el.setAttribute(\"title\", encodeHTMLAttribute(v))");

		patterns.put(
				"el.attributes[i].value = v",
				"el.attributes[i].value = encodeHTMLAttribute(v)");

		patterns.put(
				"$(el).attr(\"title\", v)",
				"$(el).attr(\"title\", encodeHTMLAttribute(v))");

		// URL context
		patterns.put(
				"el.href = v",
				"el.href = encodeURL(v)");

		patterns.put(
				"el.src = v",
				"el.src = encodeURL(v)");

		patterns.put(
				"el.formAction = v",
				"el.formAction = encodeURL(v)");

		patterns.put(
				"el.setAttribute(\"href\", v)",
				"el.setAttribute(\"href\", encodeURL(v))");

		patterns.put(
				"el.setAttribute(\"src\", v)",
				"el.setAttribute(\"src\", encodeURL(v))");

		patterns.put(
				"location = v",
				"location = encodeURL(v)");

		patterns.put(
				"location.href = v",
				"location.href = encodeURL(v)");

		patterns.put(
				"location.assign(v)",
				"location.assign(encodeURL(v))");

		patterns.put(
				"location.replace(v)",
				"location.replace(encodeURL(v))");

		patterns.put(
				"location.open(v)",
				"location.open(encodeURL(v))");

		// JavaScript string context
		patterns.put(
				"var x = \"text \" + v",
				"var x = \"text \" + encodeJavaScript(v)");

		patterns.put(
				"el.onclick = \"do(\" + v + \")\"",
				"el.onclick = \"do(\" + encodeJavaScript(v) + \")\"");

		// Storage → DOM
		patterns.put(
				"el.innerHTML = localStorage.x",
				"el.innerHTML = encodeHTML(localStorage.x)");

		patterns.put(
				"el.innerHTML = sessionStorage.x",
				"el.innerHTML = encodeHTML(sessionStorage.x)");

		patterns.put(
				"el.innerHTML = dbValue",
				"el.innerHTML = encodeHTML(dbValue)");

		return patterns;
	}
}