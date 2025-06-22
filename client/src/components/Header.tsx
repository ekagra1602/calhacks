import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">
          <span className="title-icon">🎬</span>
          <span className="title-text">Image to 3D</span>
          <div className="title-glow"></div>
        </h1>
        <p className="app-subtitle">
          Transform your ideas into cinematic 3D experiences
        </p>
        <div className="floating-elements">
          <div className="floating-dot dot-1"></div>
          <div className="floating-dot dot-2"></div>
          <div className="floating-dot dot-3"></div>
        </div>
      </div>
    </header>
  );
};

export default Header; 