import React from "react";
import './Code.css';
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
    <div className="wrapper">
      <div className="header">
        <span className="fileName">app.py</span>
        <span className="language">Python 3.10</span>
      </div>
      <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers className="codeBlock" lineNumberStyle={{ minWidth: "30px", marginRight: "12px", borderRight: "1px solid var( --border-light)", textAlign: "center"}}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
export default CodeSnippet;