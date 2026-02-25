import "./QuizResult.css";
import Header from "../Header/Header";
import ProgressBar from "../ProgressBar/ProgressBar";
import CircleBar from "../ProgressBar/CircleBar";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
export default function QuizResult() {
    const navigate = useNavigate();
    const goDashboard = () => {
        navigate("/dashboard");
    };
    const retake = () => {
        navigate("/test");
    };
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="result">
                <div className="icon">
                    <span className="material-symbols-outlined">
                        social_leaderboard
                    </span>
                </div>
                <h1>Quiz Completed!</h1>
                <div className="outer">
                    <div className="percentage">
                        <CircleBar value={20}></CircleBar>
                    </div>
                    <div>
                        <div className="inner">
                            <div className="point">
                                <i className="fa-solid fa-star"></i>
                                <p>Points&nbsp;Earned</p>
                                <p>
                                    <span className="detail">1</span>/5 Correct
                                </p>
                            </div>
                            <div className="time">
                                <i className="fa-solid fa-stopwatch"></i>
                                <p>Time Taken</p>
                                <p>
                                    <span className="detail">0:29</span>mintes
                                </p>
                            </div>
                        </div>
                        <div className="perform">
                            <i className="fa-solid fa-chart-simple"></i>
                            <p>Performance Breakdown</p>
                            <ProgressBar
                                answer={"Correct Answers"}
                                value={20}
                                isPass={true}
                            ></ProgressBar>
                            <ProgressBar
                                answer={"Wrong Answers"}
                                value={80}
                                isPass={false}
                            ></ProgressBar>
                        </div>
                    </div>
                </div>
                <div className="btns">
                    <Button onClick={goDashboard} icon="dashboard" left={true}>
                        Back to <br />
                        Dashboard
                    </Button>
                    <Button onClick={retake} icon="replay" left={true}>
                        New Quiz
                    </Button>
                </div>
            </div>
        </>
    );
}
