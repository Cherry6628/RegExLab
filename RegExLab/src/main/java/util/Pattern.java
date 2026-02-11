package util;

import java.util.HashMap;

public class Pattern {
//	public static HashMap<String, String> patterns = new HashMap<>();
//	// XSS
//	static {
//		patterns.put(
//				"el.innerHTML = <VAR>",
//				"el.innerHTML = encodeHTML(<VAR>)");
//
//		patterns.put(
//				"el.innerHTML = \"<STR>\" + <VAR>",
//				"el.innerHTML = \"<STR>\" + encodeHTML(<VAR>)");
//
//		patterns.put(
//				"el.innerHTML = <VAR> + \"<STR>\"",
//				"el.innerHTML = encodeHTML(<VAR>) + \"<STR>\"");
//
//		patterns.put(
//				"el.innerHTML = \"<STR>\" + <VAR> + \"<STR>\"",
//				"el.innerHTML = \"<STR>\" + encodeHTML(<VAR>) + \"<STR>\"");
//
//		patterns.put(
//				"el.innerHTML = localStorage.<KEY>",
//				"el.innerHTML = encodeHTML(localStorage.<KEY>)");
//
//		patterns.put(
//				"el.innerHTML = sessionStorage.<KEY>",
//				"el.innerHTML = encodeHTML(sessionStorage.<KEY>)");
//
//		patterns.put(
//				"el.innerHTML = <DBVAL>",
//				"el.innerHTML = encodeHTML(<DBVAL>)");
//
//		patterns.put(
//				"el.innerHTML = event.data",
//				"el.innerHTML = encodeHTML(event.data)");
//
//		patterns.put(
//				"el.innerHTML = message.data",
//				"el.innerHTML = encodeHTML(message.data)");
//
//		patterns.put(
//				"el.outerHTML = <VAR>",
//				"el.outerHTML = encodeHTML(<VAR>)");
//
//		patterns.put(
//				"el.outerHTML = \"<STR>\" + <VAR> + \"<STR>\"",
//				"el.outerHTML = \"<STR>\" + encodeHTML(<VAR>) + \"<STR>\"");
//
//		patterns.put(
//				"insertAdjacentHTML(<POS>, <VAR>)",
//				"insertAdjacentHTML(<POS>, encodeHTML(<VAR>))");
//
//		patterns.put(
//				"document.write(<VAR>)",
//				"document.write(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"document.writeln(<VAR>)",
//				"document.writeln(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"Range.createContextualFragment(<VAR>)",
//				"Range.createContextualFragment(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"el.attributes[<IDX>].value = <VAR>",
//				"el.attributes[<IDX>].value = encodeHTMLAttribute(<VAR>)");
//
//		patterns.put(
//				"$(el).attr(\"<ATTR>\", <VAR>)",
//				"$(el).attr(\"<ATTR>\", encodeHTMLAttribute(<VAR>))");
//
//		patterns.put(
//				"el.href = <VAR>",
//				"el.href = encodeURL(<VAR>)");
//
//		patterns.put(
//				"el.src = <VAR>",
//				"el.src = encodeURL(<VAR>)");
//
//		patterns.put(
//				"el.formAction = <VAR>",
//				"el.formAction = encodeURL(<VAR>)");
//
//		patterns.put(
//				"el.setAttribute(\"<ATTR>\", <VAR>)",
//				"el.setAttribute(\"<ATTR>\", encodeHTMLAttribute(<VAR>))");
//
//		patterns.put(
//				"el.setAttribute(\"href\", <VAR>)",
//				"el.setAttribute(\"href\", encodeURL(<VAR>))");
//
//		patterns.put(
//				"el.setAttribute(\"src\", <VAR>)",
//				"el.setAttribute(\"src\", encodeURL(<VAR>))");
//
//		patterns.put(
//				"el.setAttribute(\"onclick\", <VAR>)",
//				"el.setAttribute(\"onclick\", encodeJavaScript(<VAR>))");
//
//		patterns.put(
//				"el.setAttribute(\"onload\", <VAR>)",
//				"el.setAttribute(\"onload\", encodeJavaScript(<VAR>))");
//
//		patterns.put(
//				"el.setAttribute(\"onerror\", <VAR>)",
//				"el.setAttribute(\"onerror\", encodeJavaScript(<VAR>))");
//
//		patterns.put(
//				"location = <VAR>",
//				"location = encodeURL(<VAR>)");
//
//		patterns.put(
//				"location.href = <VAR>",
//				"location.href = encodeURL(<VAR>)");
//
//		patterns.put(
//				"location.assign(<VAR>)",
//				"location.assign(encodeURL(<VAR>))");
//
//		patterns.put(
//				"location.replace(<VAR>)",
//				"location.replace(encodeURL(<VAR>))");
//
//		patterns.put(
//				"location.open(<VAR>)",
//				"location.open(encodeURL(<VAR>))");
//
//		patterns.put(
//				"eval(<VAR>)",
//				"eval(encodeJavaScript(<VAR>))");
//
//		patterns.put(
//				"setTimeout(<VAR>, <T>)",
//				"setTimeout(encodeJavaScript(<VAR>), <T>)");
//
//		patterns.put(
//				"setInterval(<VAR>, <T>)",
//				"setInterval(encodeJavaScript(<VAR>), <T>)");
//
//		patterns.put(
//				"var <X> = \"<STR>\" + <VAR>",
//				"var <X> = \"<STR>\" + encodeJavaScript(<VAR>)");
//
//		patterns.put(
//				"el.onclick = \"<STR>\" + <VAR> + \"<STR>\"",
//				"el.onclick = \"<STR>\" + encodeJavaScript(<VAR>) + \"<STR>\"");
//
//		patterns.put(
//				"el.insertAdjacentHTML(<POS>, <VAR>)",
//				"el.insertAdjacentHTML(<POS>, encodeHTML(<VAR>))");
//
//		patterns.put(
//				"el.replaceWith(<VAR>)",
//				"el.replaceWith(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"el.append(<VAR>)",
//				"el.append(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"el.prepend(<VAR>)",
//				"el.prepend(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"el.before(<VAR>)",
//				"el.before(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"el.after(<VAR>)",
//				"el.after(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"$(el).html(<VAR>)",
//				"$(el).html(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"$(el).append(<VAR>)",
//				"$(el).append(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"$(el).prepend(<VAR>)",
//				"$(el).prepend(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"$(el).before(<VAR>)",
//				"$(el).before(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"$(el).after(<VAR>)",
//				"$(el).after(encodeHTML(<VAR>))");
//
//		patterns.put(
//				"el.onmouseover = <VAR>",
//				"el.onmouseover = encodeJavaScript(<VAR>)");
//
//		patterns.put(
//				"el.onerror = <VAR>",
//				"el.onerror = encodeJavaScript(<VAR>)");
//
//		patterns.put(
//				"el.style = <VAR>",
//				"el.style = encodeCSS(<VAR>)");
//
//		patterns.put(
//				"el.style.cssText = <VAR>",
//				"el.style.cssText = encodeCSS(<VAR>)");
//
//		patterns.put(
//				"el.style.setProperty(<PROP>, <VAR>)",
//				"el.style.setProperty(<PROP>, encodeCSS(<VAR>))");
//
//		patterns.put(
//				"el.action = <VAR>",
//				"el.action = encodeURL(<VAR>)");
//
//		patterns.put(
//				"el.formAction = <VAR>",
//				"el.formAction = encodeURL(<VAR>)");
//
//		patterns.put(
//				"window.open(<VAR>)",
//				"window.open(encodeURL(<VAR>))");
//
//		patterns.put(
//				"DOMParser.parseFromString(<VAR>, \"text/html\")",
//				"DOMParser.parseFromString(encodeHTML(<VAR>), \"text/html\")");
//
//		patterns.put(
//				"document.implementation.createHTMLDocument(<VAR>)",
//				"document.implementation.createHTMLDocument(encodeHTML(<VAR>))");
//
//	}

	public static HashMap<String, String> payloads() {
    HashMap<String, String> patterns = new HashMap<>();

    // ===== HTML SINKS =====
    patterns.put(".innerHTML = ", "encodeHTML");
    patterns.put(".outerHTML = ", "encodeHTML");
    patterns.put(".insertAdjacentHTML(", "encodeHTML");
    patterns.put("document.write(", "encodeHTML");
    patterns.put("document.writeln(", "encodeHTML");
    patterns.put("Range.createContextualFragment(", "encodeHTML");
    patterns.put("DOMParser.parseFromString(", "encodeHTML");
    patterns.put("document.implementation.createHTMLDocument(", "encodeHTML");

    // React / Vue (assignment only)
    patterns.put("dangerouslySetInnerHTML = ", "encodeHTML");
    patterns.put("v-html = ", "encodeHTML");

    // ===== ATTRIBUTE SINKS =====
    patterns.put(".setAttribute(", "encodeHTMLAttribute");
    patterns.put(".attributes[", "encodeHTMLAttribute");
    patterns.put("$(el).attr(", "encodeHTMLAttribute");

    // ===== URL SINKS =====
    patterns.put(".href = ", "encodeURL");
    patterns.put(".src = ", "encodeURL");
    patterns.put(".action = ", "encodeURL");
    patterns.put(".formAction = ", "encodeURL");
    patterns.put("location = ", "encodeURL");
    patterns.put("location.href = ", "encodeURL");
    patterns.put("location.assign(", "encodeURL");
    patterns.put("location.replace(", "encodeURL");
    patterns.put("window.open(", "encodeURL");

    // ===== JS EXECUTION SINKS =====
    patterns.put("eval(", "encodeJavaScript");
    patterns.put("setTimeout(", "encodeJavaScript");
    patterns.put("setInterval(", "encodeJavaScript");
    patterns.put(".onclick = ", "encodeJavaScript");
    patterns.put(".onerror = ", "encodeJavaScript");
    patterns.put(".onload = ", "encodeJavaScript");
    patterns.put(".onmouseover = ", "encodeJavaScript");

    // ===== CSS SINKS =====
    patterns.put(".style = ", "encodeCSS");
    patterns.put(".style.cssText = ", "encodeCSS");
    patterns.put(".style.setProperty(", "encodeCSS");

    return patterns;
}
}