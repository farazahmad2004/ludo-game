import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./leaderboard.css";

type LeaderboardPlayer = {
  _id: string;
  username: string;
  coins: number;
  total_played: number;
};

export default function Leaderboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/leaderboard");
        setPlayers(res.data.leaderboard ?? []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/");
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1: return "🥇 1st";
      case 2: return "🥈 2nd";
      case 3: return "🥉 3rd";
      default: return `${rank}th`;
    }
  };

  const filteredPlayers = players.filter((p) =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/home" className="navbar-title">🎲 LUDO</Link>
        </div>
        <div className="navbar-right">
          <div className="coin-display">
            <span className="coin-icon">💰</span>
            <span className="coin-amount">{user?.coins} Coins</span>
          </div>
          <div className="user-dropdown">
            <button className="dropdown-btn">{user?.username} ▼</button>
            <div className="dropdown-menu">
              <Link to="/update-profile" className="dropdown-item">Update Profile</Link>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="header-top">
            <h2>Global Leaderboard</h2>
            <Link to="/home" className="back-link">← Back to Home</Link>
          </div>
          <div className="search-section">
            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="leaderboard-wrapper">
          {loading && <div style={{ padding: "20px" }}>Loading...</div>}
          {error && <div style={{ color: "red", padding: "20px" }}>{error}</div>}
          {!loading && !error && filteredPlayers.length === 0 && (
            <div style={{ padding: "20px" }}>No players found.</div>
          )}
          {!loading && !error && filteredPlayers.length > 0 && (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="rank-col">Rank</th>
                  <th className="name-col">Username</th>
                  <th className="games-col">Games Played</th>
                  <th className="coins-col">Coins</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((p) => {
                  const trueRank = players.findIndex((orig) => orig._id === p._id) + 1;
                  const isMe = p._id === user?._id;

                  return (
                    <tr key={p._id} className={isMe ? "highlight" : ""}>
                      <td className="rank">{getRankDisplay(trueRank)}</td>
                      <td className="username">
                        {p.username} {isMe && "(You)"}
                      </td>
                      <td className="games">{p.total_played}</td>
                      <td className="coins">{p.coins}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="pagination">
          <button className="page-btn prev">← Previous</button>
          <span className="page-info">Page 1 of 1</span>
          <button className="page-btn next">Next →</button>
        </div>
      </div>
    </div>
  );
}