import React, { useState, useEffect } from 'react';
import './Dashboard.css';

interface DashboardProps {
  currentStep?: number;
  isGenerating?: boolean;
  hasVideo?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  currentStep = 1, 
  isGenerating = false, 
  hasVideo = false 
}) => {
  const [stats, setStats] = useState({
    videosCreated: 12,
    totalDuration: 96,
    storageUsed: 28,
    renderTime: 4.2
  });

  const [recentActivity] = useState([
    { id: 1, action: 'Video Generated', item: 'Sunset Landscape', time: '2 min ago', type: 'success' },
    { id: 2, action: 'Template Used', item: 'Urban Scene', time: '15 min ago', type: 'info' },
    { id: 3, action: 'Project Shared', item: 'Nature Walk', time: '1 hour ago', type: 'neutral' },
    { id: 4, action: 'Export Completed', item: 'City Lights', time: '2 hours ago', type: 'success' }
  ]);

  const [performanceData] = useState([
    { label: 'Mon', value: 85 },
    { label: 'Tue', value: 92 },
    { label: 'Wed', value: 78 },
    { label: 'Thu', value: 96 },
    { label: 'Fri', value: 89 },
    { label: 'Sat', value: 94 },
    { label: 'Sun', value: 87 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        renderTime: prev.renderTime + (Math.random() - 0.5) * 0.1
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>Dashboard Overview</h2>
          <div className="header-actions">
            <button className="action-button primary">
              <span className="icon">📊</span>
              <span>Analytics</span>
            </button>
            <button className="action-button secondary">
              <span className="icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
        <div className="dashboard-nav">
          <button className="nav-tab active">Overview</button>
          <button className="nav-tab">Projects</button>
          <button className="nav-tab">Analytics</button>
          <button className="nav-tab">Settings</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card primary">
            <div className="stat-header">
              <span className="stat-icon">🎬</span>
              <div className="stat-trend up">
                <span>↗</span>
                <span>+12%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.videosCreated}</div>
              <div className="stat-label">Videos Created</div>
            </div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-text">75% of monthly goal</span>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-header">
              <span className="stat-icon">⏱️</span>
              <div className="stat-trend neutral">
                <span>→</span>
                <span>0%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalDuration}s</div>
              <div className="stat-label">Total Duration</div>
            </div>
            <div className="stat-chart">
              <div className="mini-chart">
                {performanceData.map((point, index) => (
                  <div 
                    key={index} 
                    className="chart-bar" 
                    style={{ height: `${point.value}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="stat-card tertiary">
            <div className="stat-header">
              <span className="stat-icon">💾</span>
              <div className="stat-trend down">
                <span>↘</span>
                <span>-5%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.storageUsed}MB</div>
              <div className="stat-label">Storage Used</div>
            </div>
            <div className="stat-meter">
              <div className="meter-track">
                <div className="meter-fill" style={{ width: '28%' }}></div>
              </div>
              <span className="meter-text">28% of 100MB</span>
            </div>
          </div>

          <div className="stat-card quaternary">
            <div className="stat-header">
              <span className="stat-icon">🚀</span>
              <div className="stat-trend up">
                <span>↗</span>
                <span>+8%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.renderTime.toFixed(1)}s</div>
              <div className="stat-label">Avg Render Time</div>
            </div>
            <div className="stat-indicator">
              <div className="indicator excellent">
                <span className="indicator-dot"></span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Performance Metrics</h3>
              <div className="chart-controls">
                <button className="chart-btn active">7D</button>
                <button className="chart-btn">30D</button>
                <button className="chart-btn">90D</button>
              </div>
            </div>
            <div className="chart-container">
              <div className="performance-chart">
                {performanceData.map((point, index) => (
                  <div key={index} className="chart-column">
                    <div 
                      className="chart-bar-large" 
                      style={{ height: `${point.value}%` }}
                      data-value={point.value}
                    ></div>
                    <span className="chart-label">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="activity-card">
            <div className="activity-header">
              <h3>Recent Activity</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">
                    {activity.type === 'success' && '✅'}
                    {activity.type === 'info' && 'ℹ️'}
                    {activity.type === 'neutral' && '📄'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-item-name">{activity.item}</div>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <div className="actions-card">
            <div className="actions-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="actions-grid">
              <button className="quick-action create">
                <span className="action-icon">➕</span>
                <span className="action-text">New Project</span>
                <span className="action-desc">Start creating</span>
              </button>
              <button className="quick-action import">
                <span className="action-icon">📥</span>
                <span className="action-text">Import</span>
                <span className="action-desc">Upload files</span>
              </button>
              <button className="quick-action template">
                <span className="action-icon">🎨</span>
                <span className="action-text">Templates</span>
                <span className="action-desc">Browse library</span>
              </button>
              <button className="quick-action export">
                <span className="action-icon">📤</span>
                <span className="action-text">Export</span>
                <span className="action-desc">Download files</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="status-section">
          <div className="status-card">
            <div className="status-header">
              <h3>System Status</h3>
              <div className="status-indicator online">
                <span className="status-dot"></span>
                <span>All Systems Operational</span>
              </div>
            </div>
            <div className="status-list">
              <div className="status-item">
                <span className="service-name">Video Generation API</span>
                <span className="service-status operational">Operational</span>
              </div>
              <div className="status-item">
                <span className="service-name">3D Rendering Service</span>
                <span className="service-status operational">Operational</span>
              </div>
              <div className="status-item">
                <span className="service-name">File Storage</span>
                <span className="service-status operational">Operational</span>
              </div>
              <div className="status-item">
                <span className="service-name">Authentication</span>
                <span className="service-status operational">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 