import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import axios from 'axios';
import './login.css';
export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.username.trim() === "" || formData.password.trim() === "") {
      setError("Username and password are required!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8000/api/auth/login", {
        username: formData.username,
        password: formData.password
      }, { withCredentials: true });
      const meResponse = await axios.get("http://localhost:8000/api/auth/me", { withCredentials: true });
      setUser(meResponse.data);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">🎲 LUDO</h1>
          <p className="auth-subtitle">Welcome Back</p>
        </div>
        <div className="auth-card">
          <h2>Login</h2>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input type="text" id="username" className="form-input" placeholder="Enter your username" required minLength={2} maxLength={20} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} disabled={isLoading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" id="password" className="form-input" placeholder="Enter your password" required minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={isLoading} />
            </div>
            <button type="submit" className="form-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>

  );
}