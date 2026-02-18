import './QuizResult.css';
import Header from '../Header/Header';
import ProgressBar from '../ProgressBar/ProgressBar';
import CircleBar from '../ProgressBar/CircleBar';
import Button from "../Button/Button";
import { useNavigate } from 'react-router-dom';
export default function QuizResult(){
    const navigate = useNavigate();
    const goDashboard = ()=>{
        navigate("/dashboard");
    }
    const retake = ()=>{
        navigate("/test")
    }
    return(<>
        <div style={{height: "100px"}}>
            <Header/>
      </div>
        <div id="result">
            <div className="icon"><span className="material-symbols-outlined">social_leaderboard</span></div>
            <h1>Quiz Completed!</h1>
            <div className='outer'>
                <div className='percentage'>
                    <CircleBar value={80}></CircleBar>
                </div>
                <div>
                    <div className='inner'>
                        <div className='point'>
                            <i className="fa-solid fa-circle-check"></i>
                            <p>Points Earned</p>
                            <p><span className='detail'>8</span>/10 Correct</p>
                        </div>
                        <div className='time'>
                            <i className="fa-solid fa-stopwatch"></i>
                            <p>Time Taken</p>
                            <p><span className='detail'>4:30</span>mintes</p>
                        </div>
                    </div>
                    <div className='perform'>
                        <i className="fa-solid fa-chart-simple"></i><p>Performance Breakdown</p>
                        <ProgressBar answer={"Correct Answer"} value={80} isPass={true}></ProgressBar>
                        <ProgressBar answer={"Wrong Answer"} value={20} isPass={false}></ProgressBar>
                    </div>
                </div>
            </div>
            <div className='btns'>
                <Button onClick={goDashboard}><span class="material-symbols-outlined">dashboard</span>Back to <br/>Dashboard</Button>
                <Button onClick={retake}><span class="material-symbols-outlined">replay</span>Retake Quiz</Button>
            </div>
        </div>
        </>
    );
}