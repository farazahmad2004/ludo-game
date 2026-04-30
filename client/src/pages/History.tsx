import { Link } from 'react-router-dom';
import './history.css';
export default function History() {
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
            <span className="coin-amount">350 Coins</span>
          </div>
          <div className="user-dropdown">
            <button className="dropdown-btn">Username ▼</button>
            <div className="dropdown-menu">
              <Link to="/update-profile" className="dropdown-item">Update Profile</Link>
              <button className="dropdown-item logout-btn">Logout</button>
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
          {/* Game 1 */}
          <div className="history-item">
            <div className="game-header">
              <span className="game-id">Game #101</span>
              <span className="game-date">March 15, 2024 - 3:45 PM</span>
            </div>
            <div className="game-details">
              <div className="detail-row">
                <span className="label">Players:</span>
                <span className="value">You (Red), Ali (Blue), Sara (Green), Zain (Yellow)</span>
              </div>
              <div className="detail-row">
                <span className="label">Finish Position:</span>
                <span className="value position-1st">1st Place 🥇</span>
              </div>
              <div className="detail-row">
                <span className="label">Coins Earned:</span>
                <span className="coins">+100</span>
              </div>
            </div>
          </div>
          {/* Game 2 */}
          <div className="history-item">
            <div className="game-header">
              <span className="game-id">Game #100</span>
              <span className="game-date">March 14, 2024 - 8:20 PM</span>
            </div>
            <div className="game-details">
              <div className="detail-row">
                <span className="label">Players:</span>
                <span className="value">You (Blue), Pro_Player (Red), Master_Mind (Green)</span>
              </div>
              <div className="detail-row">
                <span className="label">Finish Position:</span>
                <span className="value position-2nd">2nd Place 🥈</span>
              </div>
              <div className="detail-row">
                <span className="label">Coins Earned:</span>
                <span className="coins">+25</span>
              </div>
            </div>
          </div>
          {/* Game 3 */}
          <div className="history-item">
            <div className="game-header">
              <span className="game-id">Game #99</span>
              <span className="game-date">March 13, 2024 - 6:15 PM</span>
            </div>
            <div className="game-details">
              <div className="detail-row">
                <span className="label">Players:</span>
                <span className="value">You (Green), Thunder_Strike (Red), Nova_Star (Blue), Cosmic_King (Yellow)</span>
              </div>
              <div className="detail-row">
                <span className="label">Finish Position:</span>
                <span className="value position-3rd">3rd Place 🥉</span>
              </div>
              <div className="detail-row">
                <span className="label">Coins Earned:</span>
                <span className="coins">+0</span>
              </div>
            </div>
          </div>
          {/* Game 4 */}
          <div className="history-item">
            <div className="game-header">
              <span className="game-id">Game #98</span>
              <span className="game-date">March 12, 2024 - 9:00 PM</span>
            </div>
            <div className="game-details">
              <div className="detail-row">
                <span className="label">Players:</span>
                <span className="value">You (Yellow), Elite_Gamer (Red), Swift_Fox (Blue)</span>
              </div>
              <div className="detail-row">
                <span className="label">Finish Position:</span>
                <span className="value position-1st">1st Place 🥇</span>
              </div>
              <div className="detail-row">
                <span className="label">Coins Earned:</span>
                <span className="coins">+50</span>
              </div>
            </div>
          </div>
          {/* Game 5 */}
          <div className="history-item">
            <div className="game-header">
              <span className="game-id">Game #97</span>
              <span className="game-date">March 11, 2024 - 5:30 PM</span>
            </div>
            <div className="game-details">
              <div className="detail-row">
                <span className="label">Players:</span>
                <span className="value">You (Red), Blaze_Runner (Blue), Zen_Master (Green), Shadow_Player (Yellow)</span>
              </div>
              <div className="detail-row">
                <span className="label">Finish Position:</span>
                <span className="value position-4th">4th Place</span>
              </div>
              <div className="detail-row">
                <span className="label">Coins Earned:</span>
                <span className="coins">+0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}