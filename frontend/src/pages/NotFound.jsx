import { Link } from 'react-router-dom';
import '../App.css';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container fade-in">
      <div className="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      
      <h1 className="error-title">Oops! Link not found.</h1>
      
      <div className="error-message-box">
        <p>This link has expired, was typed incorrectly, or doesn't exist.</p>
      </div>
      
      <Link to="/" className="cta-button">
        Create your own short link
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </Link>
    </div>
  );
}
