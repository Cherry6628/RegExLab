import React from "react";
import "./CodeSnippet.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
function CodeSnippet({ code }) {
    return (
        <div className="wrapper">
            <div className="header">
                <span className="fileName">app.py</span>
                <span className="language">Python 3.10</span>
            </div>
            <SyntaxHighlighter
                language="python"
                style={vscDarkPlus}
                showLineNumbers
                codeTagProps={{ style: { fontSize: "var(--normal-size)" } }}
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
