import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./history.css";

type FinishSlot = { userId: string; username: string; color: string } | null;

type HistoryGame = {
  id: string;
  totalPlayers: number;
  finishedAt: string | null;
  finishOrder: FinishSlot[];
  myCoins: number;
};

const ORDER_LABELS = ["1st", "2nd", "3rd", "4th"];

export default function History() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<HistoryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/history", {
          withCredentials: true,
        });
        setGames(res.data.games ?? []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/");
  };

  const formatNames = (finishOrder: FinishSlot[]) =>
    finishOrder.map((slot) => {
      if (!slot) return "-";
      return slot.userId === user?._id ? "You" : slot.username;
    });

  const playersLine = (g: HistoryGame) =>
    `${g.totalPlayers} players: ${formatNames(g.finishOrder).join(", ")}`;

  const orderLine = (g: HistoryGame) =>
    ORDER_LABELS.map((label, idx) => `${label}: ${formatNames(g.finishOrder)[idx]}`).join(", ");

  return (
    <div className="page">
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

      <div className="history-container">
        <div className="history-header">
          <div className="header-top">
            <h2>Game History</h2>
            <Link to="/home" className="back-link">← Back to Home</Link>
          </div>
          <p className="header-subtitle">Review all your past matches</p>
        </div>

        <div className="history-list">
          {loading && <div style={{ color: "white" }}>Loading...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {!loading && !error && games.length === 0 && (
            <div style={{ color: "white" }}>No games yet.</div>
          )}
          {games.map((g) => (
            <div key={g.id} className="history-item">
              <div className="game-header">
                <span className="game-id">Game #{g.id}</span>
                <span className="game-date">
                  {g.finishedAt ? new Date(g.finishedAt).toLocaleString() : "Unknown date"}
                </span>
              </div>
              <div className="game-details">
                <div className="detail-row">
                  <span className="label">Players:</span>
                  <span className="value">{playersLine(g)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Finishing Order:</span>
                  <span className="value">{orderLine(g)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Coins Earned:</span>
                  <span className="coins">+{g.myCoins}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}