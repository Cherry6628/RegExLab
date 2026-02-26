import "./QuizResult.css";
import Header from "../Header/Header";
import ProgressBar from "../ProgressBar/ProgressBar";
import CircleBar from "../ProgressBar/CircleBar";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
export default function QuizResult() {
  const location = useLocation();
  const [result, setResult] = useState(location.state?.answers);
  const navigate = useNavigate();
  const goDashboard = () => {
    navigate("/dashboard");
  };
  const retake = () => {
    navigate("/test");
  };
  console.log("final result : " + JSON.stringify(location.state || {}));
  let c = result?.correctAnswerCount;
  let t = result?.totalQuestions;
  if (!c || !t) {
    navigate("/test");
  }
  const formatTime = (milliseconds) => {
    const totalSeconds = milliseconds / 1000;
    if (totalSeconds < 60) {
      return totalSeconds.toFixed(2) + " sec";
    } else {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const paddedSeconds = seconds.toString().padStart(2, "0");
      return `${minutes}:${paddedSeconds}+" min"`;
    }
  };
  return (
    <>
      <div style={{ height: "100px" }}>
        <Header />
      </div>
      <div id="result">
        <div className="icon">
          <span className="material-symbols-outlined">social_leaderboard</span>
        </div>
        <h1>Quiz Completed!</h1>
        <div className="outer">
          <div className="percentage">
            <CircleBar value={(c * 100) / t || 0}></CircleBar>
          </div>
          <div>
            <div className="inner">
              <div className="point">
                <i className="fa-solid fa-star"></i>
                <p>Points&nbsp;Earned</p>
                <p>
                  <span className="detail">{c}</span>/{t} Correct
                </p>
              </div>
              <div className="time">
                <i className="fa-solid fa-stopwatch"></i>
                <p>Time Taken</p>
                <p>
                  <span className="detail">
                    {formatTime(location.state?.time || 0)}
                  </span>
                </p>
              </div>
            </div>
            <div className="perform">
              <i className="fa-solid fa-chart-simple"></i>
              <p>Performance Breakdown</p>
              <ProgressBar
                answer={"Correct Answers"}
                value={(c * 100) / t || 0}
                isPass={true}
              ></ProgressBar>
              <ProgressBar
                answer={"Wrong Answers"}
                value={100 - ((c * 100) / t || 0)}
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
