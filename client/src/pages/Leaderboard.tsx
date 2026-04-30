import { Link } from 'react-router-dom';
import './leaderboard.css';
export default function Leaderboard() {
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
  <div className="leaderboard-container">
    <div className="leaderboard-header">
      <div className="header-top">
        <h2>Global Leaderboard</h2>
        <Link to="/home" className="back-link">← Back to Home</Link>
      </div>
      <div className="search-section">
        <input type="text" id="search-input" className="search-input" placeholder="Search by username..." />
      </div>
    </div>
    <div className="leaderboard-wrapper">
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
          <tr className="highlight">
            <td className="rank">🥇 1st</td>
            <td className="username">Pro_Player</td>
            <td className="games">145</td>
            <td className="coins">4850</td>
          </tr>
          <tr>
            <td className="rank">🥈 2nd</td>
            <td className="username">Master_Mind</td>
            <td className="games">132</td>
            <td className="coins">4200</td>
          </tr>
          <tr>
            <td className="rank">🥉 3rd</td>
            <td className="username">Elite_Gamer</td>
            <td className="games">128</td>
            <td className="coins">4100</td>
          </tr>
          <tr>
            <td className="rank">4th</td>
            <td className="username">Swift_Fox</td>
            <td className="games">115</td>
            <td className="coins">3650</td>
          </tr>
          <tr>
            <td className="rank">5th</td>
            <td className="username">Shadow_Player</td>
            <td className="games">108</td>
            <td className="coins">3420</td>
          </tr>
          <tr>
            <td className="rank">6th</td>
            <td className="username">Thunder_Strike</td>
            <td className="games">102</td>
            <td className="coins">3200</td>
          </tr>
          <tr>
            <td className="rank">7th</td>
            <td className="username">Nova_Star</td>
            <td className="games">98</td>
            <td className="coins">3050</td>
          </tr>
          <tr>
            <td className="rank">8th</td>
            <td className="username">Cosmic_King</td>
            <td className="games">95</td>
            <td className="coins">2900</td>
          </tr>
          <tr>
            <td className="rank">9th</td>
            <td className="username">Blaze_Runner</td>
            <td className="games">92</td>
            <td className="coins">2750</td>
          </tr>
          <tr>
            <td className="rank">10th</td>
            <td className="username">Zen_Master</td>
            <td className="games">88</td>
            <td className="coins">2600</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="pagination">
      <button className="page-btn prev">← Previous</button>
      <span className="page-info">Page 1 of 5</span>
      <button className="page-btn next">Next →</button>
    </div>
  </div>
</div>

    );
}