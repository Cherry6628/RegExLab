import CodeSnippet from "../CodeSnippet/CodeSnippet";
import "./Quiz.css";
import Option from "./Option/Option";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const goResult = ()=>{
    navigate("/result");
  }
  return (
    <div id="Quiz">
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
        }>
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
        <Button onClick={goResult}>Get Answer</Button>
      </div>
    </div>
  );
}