import { Link } from 'react-router-dom';
import './update-profile.css';
export default function UpdateProfile() {
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
          <Link to="/home" className="dropdown-item">Home</Link>
          <button className="dropdown-item logout-btn">Logout</button>
        </div>
      </div>
    </div>
  </nav>
  <div className="profile-container">
    <div className="profile-header">
      <h2>Update Profile</h2>
      <p>Edit your account information</p>
    </div>
    <div className="profile-card">
      <form id="update-profile-form">
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input type="text" id="username" className="form-input" placeholder="Your username" defaultValue="PlayerName" required minLength={2} maxLength={20} />
          <span className="form-hint">Cannot be changed after account creation</span>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" className="form-input" defaultValue="2000-05-15" required />
        </div>
        <div className="form-divider">
          <span>Change Password (Optional)</span>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="current-password">Current Password</label>
          <input type="password" id="current-password" className="form-input" placeholder="Enter your current password" minLength={6} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" className="form-input" placeholder="Enter a new password" minLength={6} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
          <input type="password" id="confirm-new-password" className="form-input" placeholder="Re-enter your new password" minLength={6} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-save">Save Changes</button>
          <Link to="/home" className="btn-cancel">Cancel</Link>
        </div>
      </form>
    </div>
    <div className="profile-info">
      <h3>Account Information</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Member Since</span>
          <span className="info-value">January 15, 2024</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total Games</span>
          <span className="info-value">24</span>
        </div>
        <div className="info-item">
          <span className="info-label">Coin Balance</span>
          <span className="info-value">350 Coins</span>
        </div>
        <div className="info-item">
          <span className="info-label">Win Rate</span>
          <span className="info-value">33%</span>
        </div>
      </div>
    </div>
  </div>
</div>

    );
}