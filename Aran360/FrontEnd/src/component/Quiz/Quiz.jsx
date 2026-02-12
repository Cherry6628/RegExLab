import CodeSnippet from "../CodeSnippet/CodeSnippet";
import "./Quiz.css";
import Option from "./Option/Option";
import Button from "../Button/Button";
export default function Quiz({ quizId = 0, isCode = true }) {
  let headline = "Where It Is Commonly Used";
  let describe =
    "A CSS property prefixed with -webkit- that works specifically in WebKit-based browsers like Safari and Chrome.";
  let question = "Which line contain the vulnerabilities?";
  const option = [
    "input.innerHTML = userInput",
    "input.innerHTML = userInput",
    "input.innerHTML = userInput",
    "input.innerHTML = userInput",
  ];
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
    <div className="Quiz">
      <h1 className="headline">{headline}</h1>
      <p className="describe">{describe}</p>
      {isCode && <CodeSnippet code={code}></CodeSnippet>}
      <p className="question"style={isCode?{
        fontSize: "20px"
      }:{
        fontSize:"50px"
      }}>{question}</p>
      <Option name={"name-" + quizId}>{option[0]}</Option>
      <Option name={"name-" + quizId}>{option[1]}</Option>
      <Option name={"name-" + quizId}>{option[2]}</Option>
      <Option name={"name-" + quizId}>{option[3]}</Option>
      <div className="btns">
        <Button>Get Answer</Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
}