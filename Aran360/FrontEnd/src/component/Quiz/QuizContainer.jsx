import { use, useState } from "react";
import Quiz from "./Quiz";
export default function QuizContainer({quiz}) {
    let length = quiz.length;
    const [selections, setSelections] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    function incrementQuestion() {
        setCurrentQuestion(currentQuestion + 1);
    }
    const start = Date.now();
    return (
        <Quiz
            {...quiz[currentQuestion]}
            length={length}
            time={start}
            next={incrementQuestion}
            qid={quiz[currentQuestion].id} 
            hasCode={!!quiz[currentQuestion].hasCode} 
            setSelections={setSelections}
        />
    );
}