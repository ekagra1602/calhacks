import React, { useState } from 'react';
import './Navigation.css';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Video Generation Complete', message: 'Mountain Vista is ready', time: '2m ago', type: 'success' },
    { id: 3, title: 'Storage Warning', message: '80% of storage used', time: '3h ago', type: 'warning' }
  ]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { id: 'workspace', label: 'Workspace', icon: '🎬', badge: null },
    { id: 'settings', label: 'Settings', icon: '⚙️', badge: null }
  ];

  const quickActions = [
    { id: 'new-project', label: 'New Project', icon: '➕' },
    { id: 'import', label: 'Import', icon: '📥' },
    { id: 'export', label: 'Export', icon: '📤' },
    { id: 'share', label: 'Share', icon: '🔗' }
  ];

  return (
    <div className={`navigation ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <div className="nav-brand">
          <div className="brand-icon">🎭</div>
          {!isCollapsed && (
            <div className="brand-text">
              <div className="brand-name">Image to 3D</div>
              <div className="brand-subtitle">Studio</div>
            </div>
          )}
        </div>
        <button 
          className="nav-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="nav-content">
        <div className="nav-section">
          <div className="nav-section-title">
            {!isCollapsed && 'Main'}
          </div>
          <div className="nav-items">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
                title={isCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">
            {!isCollapsed && 'Quick Actions'}
          </div>
          <div className="nav-items">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="nav-item action"
                title={isCollapsed ? action.label : ''}
              >
                <span className="nav-icon">{action.icon}</span>
                {!isCollapsed && (
                  <span className="nav-label">{action.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {!isCollapsed && (
          <div className="nav-section">
            <div className="nav-section-title">Recent Activity</div>
            <div className="activity-feed">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className={`activity-item ${notification.type}`}>
                  <div className="activity-icon">
                    {notification.type === 'success' && '✅'}
                    {notification.type === 'info' && 'ℹ️'}
                    {notification.type === 'warning' && '⚠️'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{notification.title}</div>
                    <div className="activity-message">{notification.message}</div>
                    <div className="activity-time">{notification.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="nav-section">
            <div className="nav-section-title">Storage</div>
            <div className="storage-info">
              <div className="storage-bar">
                <div className="storage-fill" style={{ width: '68%' }}></div>
              </div>
              <div className="storage-text">
                <span>68GB used</span>
                <span>of 100GB</span>
              </div>
              <button className="upgrade-btn">
                <span>⬆️</span>
                Upgrade Plan
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="nav-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">John Doe</div>
              <div className="user-role">Creator</div>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="nav-footer-actions">
            <button className="footer-action" title="Help">
              <span>❓</span>
            </button>
            <button className="footer-action" title="Notifications">
              <span>🔔</span>
              <span className="notification-dot"></span>
            </button>
            <button className="footer-action" title="Logout">
              <span>🚪</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation; 