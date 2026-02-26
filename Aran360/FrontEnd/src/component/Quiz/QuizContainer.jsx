import { use, useState } from "react";
import Quiz from "./Quiz";
import { useNavigate } from "react-router-dom";
export default function QuizContainer({ quiz }) {
    let length = quiz.length;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const incrementQuestion = () => setCurrentQuestion(currentQuestion + 1);
    const start = Date.now();
    return (
        <Quiz
            {...quiz[currentQuestion]}
            length={length}
            time={start}
            next={incrementQuestion}
            qid={quiz[currentQuestion].id}
            hasCode={!!quiz[currentQuestion].hasCode}
        />
    );
}
