import CodeSnippet from "../CodeSnippet/CodeSnippet";
import "./Quiz.css";
import Option from "./Option/Option";
import Button from "../Button/Button";
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
    const handleSubmit =()=>{
        if(!selected)return;
        console.log(count,length);
        console.log(options[correctIndex],selected);
        
        if(count == length-1){
            getResult()
            navigate("/result");
        }
        else{
            next();
            setCount(count+1);
        }
    }
    function getResult(topicName) {
        backendFetch("/quiz-questions", {
            method: "POST",
            body: { answers: topicName },
            })
            .then((res) => {
                console.log(res);
                setResponse(res);
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
