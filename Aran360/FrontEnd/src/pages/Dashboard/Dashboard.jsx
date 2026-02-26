import Header from "../../component/Header/Header";
import "./Dashboard.css";
import ProgressBar from "../../component/ProgressBar/ProgressBar";
import Button from "../../component/Button/Button";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const context = useGlobalContext();
    const navigate = useNavigate();
    const isLoggedIn = !!context.uname;
    const hasStarted = !!context.lastLearnt?.topic_url;
    const isTopicComplete =
        isLoggedIn && hasStarted && !context.lastLearnt?.page_id;
    const isInProgress =
        isLoggedIn && hasStarted && !!context.lastLearnt?.page_id;

    const currentTopicTitle = hasStarted
        ? Object.keys(context.learningData).find(
              (r) =>
                  context.learningData[r].url === context.lastLearnt.topic_url,
          )
        : null;

    const currentTopicData = hasStarted
        ? Object.values(context.learningData).find(
              (t) => t.url === context.lastLearnt.topic_url,
          )
        : null;

    const realPages = currentTopicData
        ? Object.keys(currentTopicData.subTitles).filter(
              (k) => currentTopicData.subTitles[k].comp,
          )
        : [];

    const currentIndex = realPages.indexOf(context.lastLearnt?.page_id);
    const progressValue =
        currentIndex >= 0
            ? Math.round((currentIndex / realPages.length) * 100)
            : 0;

    const labsAttemptedPct = context.labsStat.totalLabs
        ? (
              (context.labsStat.labsAttempted * 100) /
              context.labsStat.totalLabs
          ).toFixed(1)
        : "0.0";

    const labsAbandonedPct = context.labsStat.labsAttempted
        ? (
              (context.labsStat.labsAbandoned * 100) /
              context.labsStat.labsAttempted
          ).toFixed(1)
        : "0.0";

    function LearningStatus() {
        if (!isLoggedIn) {
            return (
                <p
                    style={{
                        marginBottom: "0px",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/accounts")}
                >
                    Login to continue tracking your progress
                </p>
            );
        }
        if (isTopicComplete) {
            return (
                <p style={{ marginBottom: "0px" }}>
                    You've completed your current topic. Start a new one!
                </p>
            );
        }
        if (isInProgress) {
            return (
                <>
                    <p>Currently learning...</p>
                    <ProgressBar
                        answer={
                            currentTopicTitle +
                            " — " +
                            context.lastLearnt.page_id
                        }
                        value={progressValue}
                        isPass={true}
                    />
                    <Button
                        className="btn"
                        icon="play_circle"
                        onClick={async () =>
                            await navigate(
                                "/learning-material/" +
                                    context.lastLearnt.topic_url +
                                    "#last",
                            )
                        }
                    >
                        Resume Learning
                    </Button>
                </>
            );
        }
        return (
            <p style={{ marginBottom: "0px" }}>
                Start learning to track your progress.
            </p>
        );
    }

    function WelcomeMessage() {
        if (!isLoggedIn) return <h1>Hello, Guest</h1>;
        const greeting = hasStarted ? "Welcome back, " : "Welcome, ";
        return <h1>{greeting + context.uname}</h1>;
    }

    function Tagline() {
        if (!isLoggedIn || !hasStarted) return null;
        return <p>You're doing a great job, keep it up!</p>;
    }

    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="dashboard">
                <div className="topBox">
                    <WelcomeMessage />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <div className="user">
                            <Tagline />
                            <div className="goal" style={{ marginTop: "20px" }}>
                                <LearningStatus />
                            </div>
                        </div>
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
                                    Real-world sandboxes to help you practice
                                    and strengthen your defensive skills.
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

                    <div className="doLab">
                        <div className="count">
                            <p>LABS ATTEMPTED</p>
                            <div className="attend">
                                <h1>
                                    {context.labsStat.labsAttempted || 0}/
                                    {context.labsStat.totalLabs || 0}
                                </h1>
                                <p>{labsAttemptedPct}%</p>
                            </div>
                        </div>
                        <div className="count">
                            <p>LABS ABANDONED</p>
                            <div className="notfull">
                                <h1>
                                    {context.labsStat.labsAbandoned || 0}/
                                    {context.labsStat.labsAttempted || 0}
                                </h1>
                                <p>{labsAbandonedPct}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
