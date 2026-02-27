import { use, useState } from "react";
import Quiz from "./Quiz";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast/ToastContext";
import { error } from "../../utils/params";
export default function QuizContainer({ quiz }) {
    const navigate = useNavigate();
    const {showToast} = useToast();
    console.log(quiz);
    if(!quiz || quiz?.length==0){
        showToast("Something went wrong", error)
        navigate("/test", {replace: true})
    }
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
