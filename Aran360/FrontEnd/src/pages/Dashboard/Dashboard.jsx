import Header from "../../component/Header/Header";
import "./Dashboard.css";
import ProgressBar from "../../component/ProgressBar/ProgressBar";
import CircleBar from "../../component/ProgressBar/CircleBar";
import Button from "../../component/Button/Button";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { useEffect } from "react";
import { backendFetch } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
    const context = useGlobalContext();
    const navigate = useNavigate();
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="dashboard">
                <div className="topBox">
                    <h1>
                        {context.uname
                            ? "Welcome Back, " + context.uname
                            : "Hello, Guest"}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <div className="user">
                            <p>
                                You're doing great. You've completed 16% of your
                                weekly goal
                            </p>
                            <div className="goal">
                                {context.uname ? (
                                    <>
                                        <p>Current Learning Path</p>
                                        <ProgressBar
                                            answer={
                                                "Cross - Site Request Forgery (CSRF)"
                                            }
                                            value={16}
                                            isPass={true}
                                        ></ProgressBar>
                                        <Button
                                            className="btn"
                                            icon="play_circle"
                                        >
                                            Resume Learning
                                        </Button>
                                    </>
                                ) : (
                                    <p
                                        style={
                                            context.uname
                                                ? {}
                                                : {
                                                      marginBottom: "0px",
                                                      cursor: "pointer",
                                                  }
                                        }
                                        onClick={() => navigate("/accounts")}
                                    >
                                        Login to Continue Tracking your Progress
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* <div className="bar">
                            <CircleBar
                                value={context.uname ? 16 : 0}
                                r={80}
                            ></CircleBar>
                        </div> */}
                    </div>
                </div>
                <div className="lab">
                    <div className="complete">
                        <div className="labName">
                            <div className="icon">
                                <span className="material-symbols-outlined">
                                    terminal
                                </span>
                            </div>
                            <div className="skill">
                                <h1>Vulnerability Labs</h1>
                                <p>
                                    Real-world sandboxes are provided to help
                                    you practice and strengthen your defensive
                                    skills.
                                </p>
                            </div>
                        </div>
                        <div className="labCount">
                            <h1>
                                {context.labsStat.labsCompleted || 0}/
                                {context.labsStat.totalLabs || 0}
                            </h1>
                            <p>LABS COMPLETED</p>
                        </div>
                    </div>
                    <ProgressBar
                        answer={"Cross - Site Request Forgery (CSRF)"}
                        value={16}
                        isPass={true}
                    ></ProgressBar>
                    <div className="doLab">
                        <div className="count">
                            <p>LABS ATTEMPTED</p>
                            <div className="attend">
                                <h1>
                                    {context.labsStat.labsAttempted || 0}/
                                    {context.labsStat.totalLabs || 0}
                                </h1>
                                <p>
                                    {(
                                        (context.labsStat.labsAttempted * 100) /
                                            context.labsStat.totalLabs || 0
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </div>
                        <div className="count">
                            <p>LABS LEFT ABANDONED</p>
                            <div className="notfull">
                                <h1>
                                    {context.labsStat.labsAbandoned || 0}/
                                    {context.labsStat.labsAttempted || 0}
                                </h1>
                                <p>
                                    {(
                                        (context.labsStat.labsAbandoned * 100) /
                                            context.labsStat.labsAttempted || 0
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
