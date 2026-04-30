import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './signup.css';
export default function Signup() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8000/api/auth/signup", {
        username: formData.username,
        dob: formData.dob,
        password: formData.password,
      }, { withCredentials: true });
      const meResponse = await axios.get("http://localhost:8000/api/auth/me", { withCredentials: true });
      setUser(meResponse.data);
      navigate("/home");
    }
    catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during signup.");
    }
    finally {      
      setIsLoading(false);
    }
  };
  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">🎲 LUDO</h1>
          <p className="auth-subtitle">Create Your Account</p>
        </div>
        <div className="auth-card">
          <h2>Sign Up</h2>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>} {/* naya add hua apart from design. Display error message if exists */}
          <form id="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input type="text" id="username" className="form-input" placeholder="Choose a username" required minLength={2} maxLength={20} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} disabled={isLoading} />
              <span className="form-hint">Must be unique and 2-20 characters</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="dob">Date of Birth</label>
              <input type="date" id="dob" className="form-input" required value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} disabled={isLoading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" id="password" className="form-input" placeholder="Enter a strong password" required minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={isLoading} />
              <span className="form-hint">Minimum 6 characters</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" className="form-input" placeholder="Re-enter your password" required minLength={6} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} disabled={isLoading} />
            </div>
            <button type="submit" className="form-button" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
          </div>
        </div>
      </div>
    </div>

  );
}
// Notes:
// Axios is a popular, promise-based HTTP client library for JavaScript, used to make asynchronous network requests from browsers or Node.js to RESTful APIs