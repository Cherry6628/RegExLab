import Header from "../../component/Header/Header";
import "./Dashboard.css";
import ProgressBar from "../../component/ProgressBar/ProgressBar";
import Button from "../../component/Button/Button";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const context = useGlobalContext();
  const navigate = useNavigate();

  const isLoggedIn = !!context?.uname;

  const hasStarted = !!context?.lastLearnt?.topic_url;

  const isTopicComplete =
    isLoggedIn && hasStarted && !context?.lastLearnt?.page_id;

  const isInProgress =
    isLoggedIn && hasStarted && !!context?.lastLearnt?.page_id;
  const learningData = context?.learningData || {};
  const lastTopicUrl = context?.lastLearnt?.topic_url || null;
  const lastPageId = context?.lastLearnt?.page_id || null;

  const currentTopicTitle = hasStarted
    ? Object.keys(learningData).find(
        (key) => learningData[key]?.url === lastTopicUrl
      )
    : null;

  const currentTopicData = hasStarted
    ? Object.values(learningData).find((topic) => topic?.url === lastTopicUrl)
    : null;

  const realPages = currentTopicData?.subTitles
    ? Object.keys(currentTopicData.subTitles).filter(
        (key) => currentTopicData.subTitles[key]?.comp
      )
    : [];

  const currentIndex = realPages.indexOf(lastPageId);

  const progressValue =
    currentIndex >= 0 && realPages.length > 0
      ? Math.round(((currentIndex + 1) / realPages.length) * 100)
      : 0;

  const labsStat = context?.labsStat || {};

  const totalLabs = labsStat.totalLabs || 0;
  const labsCompleted = labsStat.labsCompleted || 0;
  const labsAttempted = labsStat.labsAttempted || 0;
  const labsAbandoned = labsStat.labsAbandoned || 0;

  const labsAttemptedPct =
    totalLabs > 0 ? ((labsAttempted * 100) / totalLabs).toFixed(1) : "0.0";

  const labsAbandonedPct =
    labsAttempted > 0
      ? ((labsAbandoned * 100) / labsAttempted).toFixed(1)
      : "0.0";

  function LearningStatus() {
    if (!isLoggedIn) {
      return (
        <p
          style={{ marginBottom: 0, cursor: "pointer" }}
          onClick={() => navigate("/accounts")}
        >
          Login to continue tracking your progress
        </p>
      );
    }

    if (isTopicComplete) {
      return (
        <p style={{ marginBottom: 0 }}>
          You've completed your current topic. Start a new one!
        </p>
      );
    }

    if (isInProgress) {
      return (
        <>
          <p>Currently learning...</p>
          <ProgressBar
            answer={currentTopicTitle + " — " + lastPageId}
            value={progressValue}
            isPass={true}
          />
          <Button
            className="btn"
            icon="play_circle"
            onClick={() =>
              navigate("/learning-material/" + lastTopicUrl + "#last")
            }
          >
            Resume Learning
          </Button>
        </>
      );
    }

    return (
      <p style={{ marginBottom: 0 }}>Start learning to track your progress.</p>
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
      <div style={{ height: "5.208333333333334vw" }}>
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
              <div
                className="goal"
                style={{
                  marginTop: "1.0416666666666667vw",
                }}
              >
                <LearningStatus />
              </div>
            </div>
          </div>
        </div>

        <div className="lab">
          <div className="complete">
            <div className="labName">
              <div className="icon">
                <span className="material-symbols-outlined">terminal</span>
              </div>
              <div className="skill">
                <h1>Vulnerability Labs</h1>
                <p>
                  Real-world sandboxes to help you practice and strengthen your
                  defensive skills.
                </p>
              </div>
            </div>

            <div className="labCount">
              <h1>
                {labsCompleted}/{totalLabs}
              </h1>
              <p>LABS COMPLETED</p>
            </div>
          </div>

          <div className="doLab">
            <div className="count">
              <p>LABS ATTEMPTED</p>
              <div className="attend">
                <h1>
                  {labsAttempted}/{totalLabs}
                </h1>
                <p>{labsAttemptedPct}%</p>
              </div>
            </div>

            <div className="count">
              <p>LABS ABANDONED</p>
              <div className="notfull">
                <h1>
                  {labsAbandoned}/{labsAttempted}
                </h1>
                <p>{labsAbandonedPct}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="quizReleaseCard">
          <h3 className="quizTitle">🚀 Today: Tradeshow Special Quiz!</h3>
          <p className="quizDescription">
            Attend the quiz now and climb the leaderboard. Don’t miss your
            chance to shine!
          </p>
          <div className="quizButtons">
            <Button
              onClick={() => {
                context.fetchUserData();
                navigate("/leaderboard");
              }}
            >
              Climb the Ranks
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
