import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './update-profile.css';

export default function UpdateProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(user?.username || "");
  const [dob, setDob] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (err) {
      setError("Logout failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      return setError("New passwords do not match");
    }

    if (newPassword && !currentPassword) {
      return setError("Current password is required to set a new password");
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/update-profile",
        { username, dob, currentPassword, newPassword },
        { withCredentials: true }
      );
      
      setMessage(response.data.message);
      setUser(response.data.user);
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
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
            <span className="coin-amount">{user?.coins || 0} Coins</span>
          </div>
          <div className="user-dropdown">
            <button className="dropdown-btn">{user?.username} ▼</button>
            <div className="dropdown-menu">
              <Link to="/home" className="dropdown-item">Home</Link>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
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
          {message && <div style={{ color: "green", marginBottom: "15px" }}>{message}</div>}
          {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
          
          <form id="update-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                className="form-input" 
                placeholder="Your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                minLength={2} 
                maxLength={20} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="dob">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                className="form-input" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            
            <div className="form-divider">
              <span>Change Password (Optional)</span>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="current-password">Current Password</label>
              <input 
                type="password" 
                id="current-password" 
                className="form-input" 
                placeholder="Enter your current password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                minLength={6} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">New Password</label>
              <input 
                type="password" 
                id="new-password" 
                className="form-input" 
                placeholder="Enter a new password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
              <input 
                type="password" 
                id="confirm-new-password" 
                className="form-input" 
                placeholder="Re-enter your new password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6} 
              />
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
              <span className="info-label">Total Games</span>
              <span className="info-value">{user?.total_played || 0}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Coin Balance</span>
              <span className="info-value">{user?.coins || 0} Coins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}