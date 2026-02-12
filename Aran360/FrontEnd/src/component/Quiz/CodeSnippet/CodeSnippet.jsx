// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// // import {Prism as SyntaxHighlighter} from "../../../../react-syntax-highlighter";
// // import { vscDarkPlus } from "../../../../react-syntax-highlighter/dist/esm/styles/prism";
// function CodeSnippet({code="print(\"Hello\")"}) {
//   return (
//     <SyntaxHighlighter language="python" style={vscDarkPlus}>
//       {code}
//     </SyntaxHighlighter>
//   );
// }

// export default CodeSnippet;

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeSnippet() {
  const code = `@app.route("/user/<username>")
def get_user(username):
    db = get_db_connection()
    # Fetch user details safely?
    query = f"SELECT * FROM users WHERE name = '{username}'"
    result = db.execute(query).fetchone()

    if result:
        return render_template("profile.html", user=result)
    return "User not found", 404`;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.fileName}>app.py</span>
        <span style={styles.language}>Python 3.10</span>
      </div>

      <SyntaxHighlighter
        language="python"
        style={vscDarkPlus}
        showLineNumbers
        customStyle={styles.codeBlock}
        lineNumberStyle={styles.lineNumber}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const styles = {
  wrapper: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid #1f2937",
    background: "#0f172a",
    fontFamily: "Inter, monospace",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 16px",
    background: "#111827",
    fontSize: "14px",
    color: "#9ca3af",
    borderBottom: "1px solid #1f2937",
  },
  fileName: {
    fontWeight: "500",
  },
  language: {
    opacity: 0.7,
  },
  codeBlock: {
    margin: 0,
    padding: "20px",
    background: "#0f172a",
  },
  lineNumber: {
    color: "#6b7280",
    minWidth: "30px",
  },
};

export default CustomCodeBlock;
