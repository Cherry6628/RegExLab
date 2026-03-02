import Header from "../../component/Header/Header";
import "./Leaderboard.css";
import Button from "../../component/Button/Button";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
export default function Leaderboard() {
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
  return (
    <>
      <div style={{ height: "100px" }}>
        <Header />
      </div>
      <div id="leaderboard">
        <div className="leaderboard-container">
          <div>
            <h1>TradeShow Special LeaderBoard</h1>
            <p>Competitive ranking of elite security speciality worldwide.</p>
          </div>
          <div>
            <Button>Start Quiz</Button>
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
                      style={{ display: "flex", alignItems: "center" }}
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
      </div>
    </>
  );
}
