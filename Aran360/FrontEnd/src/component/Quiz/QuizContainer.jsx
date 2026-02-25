import { use, useState } from "react";
import Quiz from "./Quiz";
export default function QuizContainer({quiz}) {
    let length = quiz.length;
    const [selections, setSelections] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    function incrementQuestion() {
        setCurrentQuestion(currentQuestion + 1);
    }
    return (
        <Quiz
            {...quiz[currentQuestion]}
            length={length}
            next={incrementQuestion}
            quizId={Math.floor(Math.random() * 10000)}
            setSelections={setSelections}
        />
    );
}