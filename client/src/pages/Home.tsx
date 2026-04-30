import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './home.css';

export default function Home() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
            setUser(null);
            navigate("/");
        } catch (error) {
            console.log("Logout failed");
        }
    };

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
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Welcome, {user?.username}!</h2>
                    <p>Choose an option below to continue</p>
                </div>
                <div className="dashboard-grid">
                    <div className="dashboard-card play-card">
                        <div className="card-icon">🎮</div>
                        <h3>Play Game</h3>
                        <p>Join a lobby and play with other players</p>
                        <Link to="/newgame/lobby" className="card-button">Start Playing</Link>
                    </div>
                    <div className="dashboard-card leaderboard-card">
                        <div className="card-icon">🏆</div>
                        <h3>Leaderboard</h3>
                        <p>Check global rankings and player stats</p>
                        <Link to="/leaderboard" className="card-button">View Rankings</Link>
                    </div>
                    <div className="dashboard-card history-card">
                        <div className="card-icon">📊</div>
                        <h3>Game History</h3>
                        <p>Review your past matches and results</p>
                        <Link to="/history" className="card-button">View History</Link>
                    </div>
                </div>
                <div className="stats-section">
                    <h3>Your Stats</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Total Games</span>
                            <span className="stat-value">{user?.total_played}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Wins</span>
                            <span className="stat-value">0</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Win Rate</span>
                            <span className="stat-value">0%</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total Coins</span>
                            <span className="stat-value">{user?.coins}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}