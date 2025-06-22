import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
  currentStep?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep = 1 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', active: true },
    { id: 'projects', icon: '📁', label: 'Projects', badge: '3' },
    { id: 'templates', icon: '🎨', label: 'Templates' },
    { id: 'gallery', icon: '🖼️', label: 'Gallery' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'help', icon: '❓', label: 'Help & Support' }
  ];

  const quickActions = [
    { id: 'new-project', icon: '➕', label: 'New Project' },
    { id: 'import', icon: '📥', label: 'Import' },
    { id: 'export', icon: '📤', label: 'Export' }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          {!isCollapsed && <span className="logo-text">Image to 3D</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="main-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className={item.active ? 'active' : ''}>
                <a href={`#${item.id}`} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {!isCollapsed && (
          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              {quickActions.map((action) => (
                <button key={action.id} className="action-btn">
                  <span className="action-icon">{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">👤</div>
            {!isCollapsed && (
              <div className="user-info">
                <div className="user-name">Ekagra</div>
                <div className="user-status">Pro Plan</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 