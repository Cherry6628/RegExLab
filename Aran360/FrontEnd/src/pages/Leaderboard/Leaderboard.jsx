import Header from "../../component/Header/Header";
import "./Leaderboard.css";
import Button from "../../component/Button/Button";
export default function Leaderboard() {
  const data = [
    { rank: 1, username: "Venkat", team: "Zoho Schools", score: 1000 },
    { rank: 2, username: "Arjun", team: "Zoho Corp", score: 950 },
    { rank: 2, username: "Arjun", team: "Zoho Corp", score: 950 },
    { rank: 2, username: "Arjun", team: "Zoho Corp", score: 950 },
    { rank: 2, username: "Arjun", team: "Zoho Corp", score: 950 },
    { rank: 2, username: "Arjun", team: "Zoho Corp", score: 950 },
  ];
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
              {data.map((user, index) => (
                <tr key={index}>
                    <td data-label="Rank">{user.rank}</td>
                    <td data-label="UserName">{user.username}</td>
                    <td data-label="TeamName">{user.team}</td>
                    <td data-label="Score">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}