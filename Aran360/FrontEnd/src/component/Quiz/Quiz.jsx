import CodeSnippet from "../CodeSnippet/CodeSnippet";
import "./Quiz.css";
import Option from "./Option/Option";
import Button from "../Button/Button";
import QuizContainer from "./QuizContainer";
export default function Quiz({
  headline,
  describe,
  code,
  question,
  language = "python",
  quizId = 0,
  isCode = false,
  options = [],
  next = () => {},
}) {
//   const code = `@app.route("/user/<username>")
//   def get_user(username):
//       db = get_db_connection()
//       # Fetch user details safely?
//       query = f"SELECT * FROM users WHERE name = '{username}'"
//       result = db.execute(query).fetchone()

//       if result:
//           return render_template("profile.html", user=result)
//       return "User not found", 404`;
  return (
    <div id="Quiz" style={{marginTop:"100px",height:"100%"}}>
      <h1 className="headline">{headline}</h1>
      <p className="describe">{describe}</p>
      {isCode && <CodeSnippet code={code} language={language}></CodeSnippet>}
      <p
        className="question"
        style={
          isCode
            ? {
                fontSize: "var(--normal-size)",
              }
            : {
                fontSize: "var(--extra-large-size)",
                textAlign: "center",
                marginBottom: "40px",
              }
        }
      >
        {question}
      </p>
      {options.map((r, i) => {
        return (
          <Option key={i} name={"name-" + quizId}>
            {r}
          </Option>
        );
      })}
      <div className="btns">
        <Button onClick={next}>Submit</Button>
        <Button>Get Answer</Button>
      </div>
    </div>
  );
}