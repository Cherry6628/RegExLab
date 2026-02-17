import { use, useState } from "react"
import Quiz from "./Quiz";

export default function QuizContainer(){
    let quiz = [
        {
            headline: "Where it is commonly used ? ",
            describe: "A CSS property prefixed with -webkit- that works specifically in WebKit-based browsers like Safari and Chrome.",
            question: "Which line contain the vulnerabilities?",
            isCode: false,
            language: undefined,
            options: [
                "input.innerHTML = userInput",
                "input.innerHTML = userInput",
                "input.innerHTML = userInput",
                "input.innerHTML = userInput",
            ]
        },
        {
            headline: " 1231 Where it is commonly used ? ",
            describe: "A CSS property prefixed with -webkit- that works specifically in WebKit-based browsers like Safari and Chrome.",
            question: "Which line contain the vulnerabilities?",
            isCode: false,
            language: undefined,
            options: [
                "input.innerHTML = userInput",
                "input.innerHTML = userInput",
                "input.innerHTML = userInput",
                "input.innerHTML = userInput",
            ]
        },
        
    ]
    const [currentQuestion, setCurrentQuestion] = useState(0);
    function incrementQuestion(){
        setCurrentQuestion(currentQuestion+1);
    };
    return <Quiz {...quiz[currentQuestion]} next={incrementQuestion} quizId={Math.floor(Math.random()*10000)}/>
    
}