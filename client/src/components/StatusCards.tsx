import React, { useState, useEffect } from 'react';
import './StatusCards.css';

interface StatusCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}

interface StatusCardsProps {
  isGenerating?: boolean;
  hasVideo?: boolean;
  currentStep?: number;
  progress?: number;
  estimatedTime?: number;
  isDemoMode?: boolean;
}

const StatusCards: React.FC<StatusCardsProps> = ({ 
  isGenerating = false, 
  hasVideo = false,
  currentStep = 1,
  progress = 0,
  estimatedTime = 0,
  isDemoMode = false
}) => {
  const [animationTrigger, setAnimationTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getCards = (): StatusCard[] => [
    {
      id: 'progress',
      title: 'Progress',
      value: `${Math.round(progress || (currentStep / 5) * 100)}%`,
      subtitle: `Step ${currentStep} of 5`,
      icon: '📊',
      trend: currentStep > 1 ? 'up' : 'neutral',
      color: '#333333'
    },
    {
      id: 'status',
      title: 'Status',
      value: isGenerating ? (isDemoMode ? 'Demo Mode' : 'Generating') : hasVideo ? 'Ready' : 'Waiting',
      subtitle: isGenerating ? (isDemoMode ? 'Simulating...' : 'AI at work...') : hasVideo ? 'Video created' : 'Ready to start',
      icon: isGenerating ? (isDemoMode ? '🎭' : '⚡') : hasVideo ? '✅' : '⏸️',
      trend: 'neutral',
      color: isGenerating ? (isDemoMode ? '#4a4a2a' : '#4a4a4a') : hasVideo ? '#2a4a2a' : '#4a2a2a'
    },
    {
      id: 'quality',
      title: 'Quality',
      value: hasVideo ? 'HD' : 'N/A',
      subtitle: hasVideo ? '1080p ready' : 'Pending',
      icon: '🎬',
      trend: hasVideo ? 'up' : 'neutral',
      color: '#4a3a2a'
    },
    {
      id: 'time',
      title: 'Est. Time',
      value: isGenerating ? `${estimatedTime || 45}s` : hasVideo ? 'Done' : '--',
      subtitle: isGenerating ? 'Processing' : hasVideo ? 'Completed' : 'Not started',
      icon: '⏱️',
      trend: 'neutral',
      color: '#3a3a4a'
    }
  ];

  return (
    <div className="status-cards">
      <div className="cards-header">
        <h3>Live Status</h3>
        <div className="pulse-indicator">
          <div className="pulse-dot"></div>
          <span>Live</span>
        </div>
      </div>
      
      <div className="cards-grid">
        {getCards().map((card, index) => (
          <div 
            key={card.id} 
            className={`status-card ${card.trend || ''}`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              '--card-color': card.color 
            } as React.CSSProperties}
          >
            <div className="card-header">
              <span className="card-icon">{card.icon}</span>
              <div className="card-trend">
                {card.trend === 'up' && '📈'}
                {card.trend === 'down' && '📉'}
              </div>
            </div>
            
            <div className="card-content">
              <div className="card-value">{card.value}</div>
              <div className="card-title">{card.title}</div>
              <div className="card-subtitle">{card.subtitle}</div>
            </div>
            
            <div className="card-background-effect"></div>
            
            {isGenerating && card.id === 'status' && (
              <div className="generating-animation">
                <div className="wave wave1"></div>
                <div className="wave wave2"></div>
                <div className="wave wave3"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="cards-footer">
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default StatusCards; 