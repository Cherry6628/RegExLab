import Header from "../../component/Header/Header";
import "./Leaderboard.css";
import QuizContainer from "../../component/Quiz/QuizContainer.jsx";
import Button from "../../component/Button/Button";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { backendFetch } from "../../utils/helpers.js";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider.jsx";
import { useToast } from "../../component/Toast/ToastContext.jsx";
import { useState } from "react";
export default function Leaderboard() {
  const context = useGlobalContext();
  const { showToast } = useToast();
  const [display, setDisplay] = useState(0);
  const [response, setResponse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [teamName, setTeamName] = useState("");
  const data = [
    { username: "Venkat", team: "Zoho Schools", score: 1000 },
    { username: "Arjun", team: "Zoho Corp", score: 950 },
    { username: "Rahul", team: "Zoho Schools", score: 900 },
    { username: "Karthik", team: "Zoho Corp", score: 850 },
    { username: "Meena", team: "Zoho Schools", score: 800 },
  ];
  const sortedData = [...data].sort((a, b) => b.score - a.score);
  const getMedalColor = (rank) => {
    if (rank === 1) return "gold";
    if (rank === 2) return "silver";
    if (rank === 3) return "#cd7f32";
    return null;
  };
  const openTeamPopup = () => {
    if (!context.uname) {
      showToast("Login to take a test");
      return;
    }
    setTeamName("");
    setShowPopup(true);
  };
  const takeTest = async () => {
    if (!teamName.trim()) {
      showToast("Team name cannot be empty");
      return;
    }
    try {
      const res = await backendFetch("/employee-quiz-questions", {
        method: "POST",
        body: { team: teamName },
      });
      if (res instanceof Response) {
        showToast("Login to take a test");
        return;
      }
      setResponse(res);
      setDisplay(1);
      setShowPopup(false);
    } catch (err) {
      console.log(err);
      showToast("Error fetching quiz");
    }
  };
  return (
    <>
      <div style={{ height: "100px" }}>
        <Header />
      </div>
      {display == 0 && (
        <div id="leaderboard">
          <>
            <div className="leaderboard-container">
              <div>
                <h1>TradeShow Special LeaderBoard</h1>
                <p>
                  Competitive ranking of elite security speciality worldwide.
                </p>
              </div>
              <div>
                <Button onClick={openTeamPopup} icon="content_paste_go">
                  Start Quiz
                </Button>
              </div>
            </div>
            <div className="table">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>UserName</th>
                    <th>TeamName</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((user, index) => {
                    const rank = index + 1;
                    const medalColor = getMedalColor(rank);
                    return (
                      <tr key={index} className={rank <= 3 ? "top-rank" : ""}>
                        <td
                          data-label="Rank"
                          style={{ display: "flex", alignItems: "center",justifyContent: "center" }}
                        >
                          {rank <= 3 && (
                            <MilitaryTechIcon
                              style={{
                                color:
                                  rank === 1
                                    ? "gold"
                                    : rank === 2
                                    ? "silver"
                                    : "#cd7f32",
                                marginRight: "6px",
                              }}
                            />
                          )}
                          {rank}
                        </td>
                        <td data-label="UserName">{user.username}</td>
                        <td data-label="TeamName">{user.team}</td>
                        <td data-label="Score">{user.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        </div>
      )}
      {display == 1 && (
        <QuizContainer quiz={response.questions} url="/employee-quiz-results" />
      )}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Enter Your Team Name</h2>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <div className="popup-buttons">
              <Button onClick={takeTest} disabled={!teamName.trim()}>
                Start Quiz
              </Button>
              <Button
                onClick={() => setShowPopup(false)}
                style={{ marginLeft: "10px", background: "#ccc" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}