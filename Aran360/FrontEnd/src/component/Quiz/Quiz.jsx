import CodeSnippet from "../CodeSnippet/CodeSnippet";
import "./Quiz.css";
import Option from "./Option/Option";
import Button from "../Button/Button";
import { backendFetch, refreshCsrfToken } from "../../utils/helpers.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Quiz({
    headline,
    description,
    code,
    question,
    language,
    quizId,
    isCode,
    options,
    next = () => {},
    length
}) {
    const navigate = useNavigate();
    const [count,setCount] = useState(0);
    const [score,setScore] = useState(0);
    const [answer,setAnswer] = useState({});
    const handleSubmit =()=>{
        if(!selected)return;
        console.log(count,length);
        console.log(selected);
        setAnswer({...answer, quizId: quizId,answer : selected})
        console.log(answer);
        if(count == length-1){
            getResult(answer)
            navigate("/result");
        }
        else{
            next();
            setCount(count+1);
        }
    }
    function getResult(answer) {
        backendFetch("/quiz-results", {
            method: "POST",
            body: answer,
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
        });
    }
    const [selected, setSelected] = useState(null);
    return (
        <div id="Quiz">
            <h1 className="headline">{headline}</h1>
            <p className="describe">{description}</p>
            {isCode && (
                <CodeSnippet code={code} language={language}></CodeSnippet>
            )}
            <p
                className="question"
                style={
                    isCode
                        ? {
                              fontSize: "var(--normal-size)",
                          }
                        : {
                              fontSize: "var(--large-size)",
                              textAlign: "center",
                              marginBottom: "40px",
                          }
                }
            >
                {question}
            </p>
            {options.map((r, i) => {
                return (
                    <Option
                        key={i}
                        name={"name-" + quizId}
                        value={r}
                        checked={selected === r}
                        onChange={() => setSelected(r)}
                    >
                        {r}
                    </Option>
                );
            })}
            <div className="btns">
                <Button onClick={handleSubmit} disabled = {!selected}>Submit</Button>
                <Button>Get Answer</Button>
            </div>
        </div>
    );
}
