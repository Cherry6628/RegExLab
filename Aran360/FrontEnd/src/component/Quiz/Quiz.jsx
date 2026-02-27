import CodeSnippet from "../CodeSnippet/CodeSnippet";
import "./Quiz.css";
import Option from "./Option/Option";
import Button from "../Button/Button";
import { backendFetch } from "../../utils/helpers.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Quiz({
    headline,
    description,
    code,
    question,
    language,
    qid,
    hasCode = 0,
    options = [],
    next = () => {},
    length,
    time,
}) {
    hasCode = hasCode == 1;
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [answer, setAnswer] = useState({});
    const [selected, setSelected] = useState(null);
    const handleSubmit = async () => {
        if (!selected) {
            return;
        }
        const updatedAnswer = {
            ...answer,
            [qid]: selected,
        };
        setAnswer(updatedAnswer);
        if (count == length - 1) {
            await getResult(updatedAnswer);
        } else {
            next();
            setCount(count + 1);
            setSelected(null);
        }
        async function getResult(answers) {
            await backendFetch("/quiz-results", {
                method: "POST",
                body: answers,
            })
                .then((res) => {
                    const end = Date.now() - time;
                    navigate("/result", { state: { answers: res, time: end } });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    let ques={
        question:question,
        options:options
    }
        async function getHint(ques) {
            await backendFetch("/quiz-hint", {
                method: "POST",
                body: ques,
            })
                .then((res) => {
                    let result = JSON.parse(res);
                    let hint = result.hint;
                    let explain = result.explanation;
                    console.log(hint,explanation);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    return (
        <div id="Quiz">
            <h1 className="headline">{count + 1 + ". " + headline}</h1>
            <p className="describe">{description}</p>
            <p
                className="question"
                style={
                    hasCode
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
            {hasCode && (
                <CodeSnippet code={code} language={language}></CodeSnippet>
            )}
            {options.map((r, i) => {
                return (
                    <Option
                        key={i}
                        name={"name-" + qid}
                        value={r}
                        checked={selected === r}
                        onChange={() => setSelected(r)}
                    >
                        {r}
                    </Option>
                );
            })}
            <div className="btns">
                <Button
                    onClick={async () => {
                        await handleSubmit();
                    }}
                    disabled={!selected}
                    style={{ cursor: selected ? "pointer" : "not-allowed" }}
                >
                    Submit
                </Button>
                <Button onClick={async () => {await getHint(ques);}} icon="wand_stars" >Get Hint </Button>
            </div>
            <div className="hint">
                <p>{explain}</p>
            </div>
        </div>
    );
}
