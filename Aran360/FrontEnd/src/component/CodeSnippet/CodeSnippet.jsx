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
          minWidth: "50px",
          marginRight: "12px",
          borderRight: "1px solid var( --border-light)",
          textAlign: "center",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
export default CodeSnippet;
