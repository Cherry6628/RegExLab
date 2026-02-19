import Header from "../../component/Header/Header";
import './Dashboard.css';
import ProgressBar from '../../component/ProgressBar/ProgressBar';
import CircleBar from '../../component/ProgressBar/CircleBar';
import Button from "../../component/Button/Button";
export default function Dashboard({name}) {
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header/>
            </div>
            <div id="dashboard">
                <div className="topBox">
                <div className="user">
                    <h1>Welcome back, Alex{name}</h1>
                    <p>You're doing great. You've completed 16% of your weekly goal</p>
                    <div className="goal">
                        <p>Current Learning Path</p>
                        <ProgressBar answer={"Cross - Site Request Forgery (CSRF)"} value={16} isPass={true}></ProgressBar>
                        <Button className="btn" ><span class="material-symbols-outlined">play_circle</span>Resume Learning</Button>
                        <hr/>
                        <ProgressBar answer={"Cross - Site Request Forgery (CSRF)"} value={16} isPass={true}></ProgressBar>
                    </div>
                </div>
                <div className="bar">
                    <CircleBar value={16} r={80}></CircleBar>
                </div>
                </div>
                <div className="lab">
                    <div className="complete">
                        <div className="labName">
                            <div className="icon">
                                <span class="material-symbols-outlined">terminal</span>
                            </div>
                            <div className="skill">
                                <h1>Vulnerability Labs</h1>
                                <p>Real - world sendboxes to test your deefensive skills.</p>
                            </div>
                        </div>
                        <div className="labCount">
                            <h1>12/150</h1>
                            <p>LABS COMPLETED</p>
                        </div>
                    </div>
                    <ProgressBar answer={"Cross - Site Request Forgery (CSRF)"} value={16} isPass={true}></ProgressBar>
                    <div className="doLab">
                        <div className="count">
                            <p>LABS ATTEMPTED</p>
                            <div className="attend">
                                <h1>24/150</h1>
                                <p>16%</p>
                            </div>
                        </div>
                        <div className="count">
                            <p>LABS LEFT ABANDONED</p>
                            <div className="notfull">
                                <h1>12/24</h1>
                                <p>50%</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}