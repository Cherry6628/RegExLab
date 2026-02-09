package util;
import java.util.HashMap;
public class Pattern {
	public static HashMap<String, String> patterns = new HashMap<>();

	static {
		patterns.put(
				"el.innerHTML = <VAR>",
				"el.innerHTML = encodeHTML(<VAR>)");

		patterns.put(
				"el.innerHTML = \"<STR>\" + <VAR>",
				"el.innerHTML = \"<STR>\" + encodeHTML(<VAR>)");

		patterns.put(
				"el.innerHTML = <VAR> + \"<STR>\"",
				"el.innerHTML = encodeHTML(<VAR>) + \"<STR>\"");

		patterns.put(
				"el.innerHTML = \"<STR>\" + <VAR> + \"<STR>\"",
				"el.innerHTML = \"<STR>\" + encodeHTML(<VAR>) + \"<STR>\"");

		patterns.put(
				"el.outerHTML = <VAR>",
				"el.outerHTML = encodeHTML(<VAR>)");

		patterns.put(
				"el.outerHTML = \"<STR>\" + <VAR> + \"<STR>\"",
				"el.outerHTML = \"<STR>\" + encodeHTML(<VAR>) + \"<STR>\"");

		patterns.put(
				"insertAdjacentHTML(<POS>, <VAR>)",
				"insertAdjacentHTML(<POS>, encodeHTML(<VAR>))");

		patterns.put(
				"document.write(<VAR>)",
				"document.write(encodeHTML(<VAR>))");

		patterns.put(
				"document.writeln(<VAR>)",
				"document.writeln(encodeHTML(<VAR>))");

		patterns.put(
				"Range.createContextualFragment(<VAR>)",
				"Range.createContextualFragment(encodeHTML(<VAR>))");

		patterns.put(
				"el.setAttribute(\"<ATTR>\", <VAR>)",
				"el.setAttribute(\"<ATTR>\", encodeHTMLAttribute(<VAR>))");

		patterns.put(
				"el.attributes[<IDX>].value = <VAR>",
				"el.attributes[<IDX>].value = encodeHTMLAttribute(<VAR>)");

		patterns.put(
				"$(el).attr(\"<ATTR>\", <VAR>)",
				"$(el).attr(\"<ATTR>\", encodeHTMLAttribute(<VAR>))");

		patterns.put(
				"el.href = <VAR>",
				"el.href = encodeURL(<VAR>)");

		patterns.put(
				"el.src = <VAR>",
				"el.src = encodeURL(<VAR>)");

		patterns.put(
				"el.formAction = <VAR>",
				"el.formAction = encodeURL(<VAR>)");

		patterns.put(
				"el.setAttribute(\"href\", <VAR>)",
				"el.setAttribute(\"href\", encodeURL(<VAR>))");

		patterns.put(
				"el.setAttribute(\"src\", <VAR>)",
				"el.setAttribute(\"src\", encodeURL(<VAR>))");

		patterns.put(
				"location = <VAR>",
				"location = encodeURL(<VAR>)");

		patterns.put(
				"location.href = <VAR>",
				"location.href = encodeURL(<VAR>)");

		patterns.put(
				"location.assign(<VAR>)",
				"location.assign(encodeURL(<VAR>))");

		patterns.put(
				"location.replace(<VAR>)",
				"location.replace(encodeURL(<VAR>))");

		patterns.put(
				"location.open(<VAR>)",
				"location.open(encodeURL(<VAR>))");

		patterns.put(
				"eval(<VAR>)",
				"eval(encodeJavaScript(<VAR>))");

		patterns.put(
				"setTimeout(<VAR>, <T>)",
				"setTimeout(encodeJavaScript(<VAR>), <T>)");

		patterns.put(
				"setInterval(<VAR>, <T>)",
				"setInterval(encodeJavaScript(<VAR>), <T>)");

		patterns.put(
				"var <X> = \"<STR>\" + <VAR>",
				"var <X> = \"<STR>\" + encodeJavaScript(<VAR>)");

		patterns.put(
				"el.onclick = \"<STR>\" + <VAR> + \"<STR>\"",
				"el.onclick = \"<STR>\" + encodeJavaScript(<VAR>) + \"<STR>\"");

		patterns.put(
				"el.innerHTML = localStorage.<KEY>",
				"el.innerHTML = encodeHTML(localStorage.<KEY>)");

		patterns.put(
				"el.innerHTML = sessionStorage.<KEY>",
				"el.innerHTML = encodeHTML(sessionStorage.<KEY>)");

		patterns.put(
				"el.innerHTML = <DBVAL>",
				"el.innerHTML = encodeHTML(<DBVAL>)");
	}
	public static HashMap<String, String> payloads() {
		return patterns;
	}
}