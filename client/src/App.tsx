import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import ParticleBackground from './components/ParticleBackground';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  const [currentView, setCurrentView] = useState('workspace');

  const handleVideoGenerated = (url: string) => {
    console.log('Video generated:', url);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'workspace':
        return <Workspace onVideoGenerated={handleVideoGenerated} />;
      case 'settings':
        return (
          <div className="view-placeholder">
            <div className="placeholder-content">
              <h2>⚙️ Settings</h2>
              <p>Configure your preferences and account</p>
              <div className="placeholder-icon">🚧</div>
              <p className="placeholder-text">Coming Soon</p>
            </div>
          </div>
        );
      default:
        return <Workspace onVideoGenerated={handleVideoGenerated} />;
    }
  };

  return (
    <div className="app">
      <ParticleBackground />
      <AnimatedBackground />
      
      <div className="app-layout">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <div className="main-content">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}

export default App; 