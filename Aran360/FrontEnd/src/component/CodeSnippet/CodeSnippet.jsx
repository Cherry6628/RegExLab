import React from "react";
import "./CodeSnippet.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
function CodeSnippet({ code, language }) {
  return (
    <div className="wrapper">
      <div className="header">
        <span className="fileName">app</span>
        <span className="language">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        codeTagProps={{ style: { fontSize: "var(--default-size)" } }}
        className="codeBlock"
        lineNumberStyle={{
          minWidth: "2.604166666666667vw",
          marginRight: "0.625vw",
          borderRight: "0.052083333333333336vw solid var( --border-light)",
          textAlign: "center",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
export default CodeSnippet;
