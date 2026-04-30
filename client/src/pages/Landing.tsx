import { Link } from 'react-router-dom';
import './landing.css';
export default function Landing() {
    return (
        <div className="page">
  <div className="hero-container">
    <h1 className="hero-title">🎲 LUDO</h1>
    <p className="hero-subtitle">Classic Board Game Experience</p>
    <div className="form-card">
      <h2>Welcome to LUDO</h2>
      <div className="auth-options">
        <p className="options-label">Join the Game</p>
        <Link to="/login" className="option-button login-button">🔐 Login</Link>
        <Link to="/signup" className="option-button signup-button">✨ Sign Up</Link>
      </div>
      <div className="rules-section">
        <h3>Quick Rules</h3>
        <ul>
          <li>Roll the dice to move your tokens</li>
          <li>Get all 4 tokens from home to the finish</li>
          <li>First player to finish wins!</li>
          <li>Capture opponents' tokens to send them home</li>
        </ul>
      </div>
    </div>
  </div>
</div>
    );
}
// Acha, to mainly class -> className karna hai. (if the html to jsx converter is available, it would do it easily (verify everything though))
// Then, change each anchor tag to Link component from react-router-dom, and set the "to" prop to the appropriate route (e.g., "/login" for login, "/signup" for signup).
// Also, do import { Link } from 'react-router-dom' at the top of the file to use the Link component.
// Finally, make sure to import the CSS file for styling the landing page.
