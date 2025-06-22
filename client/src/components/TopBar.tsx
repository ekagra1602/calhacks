import React, { useState } from 'react';
import './TopBar.css';

interface TopBarProps {
  onSearch?: (query: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, type: 'success', message: 'Video generation completed', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New template available', time: '1 hour ago' },
    { id: 3, type: 'warning', message: 'Storage space running low', time: '3 hours ago' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Dashboard</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">Video Generation</span>
        </div>
      </div>

      <div className="topbar-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search projects, templates, or help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="search-shortcut">⌘K</div>
          </div>
        </form>
      </div>

      <div className="topbar-right">
        <div className="action-buttons">
          <button className="action-btn">
            <span className="btn-icon">💡</span>
            <span className="btn-label">Tips</span>
          </button>
          
          <div className="notification-container">
            <button 
              className="action-btn notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="btn-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button className="mark-read">Mark all read</button>
                </div>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                      <div className="notif-content">
                        <p>{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          <div className="profile-container">
            <button 
              className="profile-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="profile-avatar">👤</div>
              <div className="profile-info">
                <span className="profile-name">Ekagra</span>
                <span className="profile-role">Pro User</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="large-avatar">👤</div>
                  <div className="profile-details">
                    <h4>Ekagra Gupta</h4>
                    <p>egupta3@asu.edu</p>
                  </div>
                </div>
                <div className="profile-menu">
                  <a href="#profile" className="menu-item">
                    <span>👤</span>
                    <span>Profile Settings</span>
                  </a>
                  <a href="#billing" className="menu-item">
                    <span>💳</span>
                    <span>Billing</span>
                  </a>
                  <a href="#preferences" className="menu-item">
                    <span>⚙️</span>
                    <span>Preferences</span>
                  </a>
                  <div className="menu-divider"></div>
                  <a href="#logout" className="menu-item logout">
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 