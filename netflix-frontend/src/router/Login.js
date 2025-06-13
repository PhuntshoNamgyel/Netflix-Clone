import { useState } from 'react';
import './App.css';

function Login() { // Renamed from App to Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        alert('Login successful! (This is a demo)');
      } else {
        setError('Please fill in all fields');
      }
    }, 1500);
  };

  return (
    <div className="netflix-login">
      <header className="login-header">
        <div className="logo">NETFLIX</div>
      </header>

      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Sign In</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className={email ? 'active' : ''}>Email or phone number</label>
          </div>
          
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className={password ? 'active' : ''}>Password</label>
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="form-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#">Need help?</a>
          </div>
        </form>
        
        <div className="login-footer">
          <p>New to Netflix? <a href="#">Sign up now</a></p>
          <p className="recaptcha-notice">
            This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#">Learn more.</a>
          </p>
        </div>
      </div>
      
      <div className="background-overlay"></div>
    </div>
  );
}

export default Login;