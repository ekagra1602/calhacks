import React from 'react';
import './ProjectCard.css';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  type: 'video' | 'template' | 'draft';
  status: 'completed' | 'processing' | 'draft' | 'failed';
  createdAt: string;
  duration?: string;
  size?: string;
  tags?: string[];
  onPlay?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  thumbnail,
  type,
  status,
  createdAt,
  duration,
  size,
  tags = [],
  onPlay,
  onEdit,
  onDelete,
  onShare
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⏳';
      case 'draft': return '📝';
      case 'failed': return '❌';
      default: return '📄';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'video': return '🎬';
      case 'template': return '🎨';
      case 'draft': return '📝';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`project-card ${status}`}>
      <div className="card-thumbnail">
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <div className="placeholder-thumbnail">
            <span className="placeholder-icon">{getTypeIcon()}</span>
          </div>
        )}
        
        <div className="thumbnail-overlay">
          <div className="overlay-actions">
            {status === 'completed' && onPlay && (
              <button className="overlay-btn play-btn" onClick={onPlay}>
                <span>▶️</span>
              </button>
            )}
            <button className="overlay-btn edit-btn" onClick={onEdit}>
              <span>✏️</span>
            </button>
          </div>
          
          <div className="status-badge">
            <span className="status-icon">{getStatusIcon()}</span>
            <span className="status-text">{status}</span>
          </div>
        </div>

        {status === 'processing' && (
          <div className="processing-indicator">
            <div className="progress-ring">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="card-actions">
            <button className="action-btn" onClick={onShare} title="Share">
              🔗
            </button>
            <button className="action-btn delete-btn" onClick={onDelete} title="Delete">
              🗑️
            </button>
          </div>
        </div>

        <p className="card-description">{description}</p>

        {tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="tag more-tags">+{tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="card-footer">
          <div className="card-meta">
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{formatDate(createdAt)}</span>
            </span>
            {duration && (
              <span className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>{duration}</span>
              </span>
            )}
            {size && (
              <span className="meta-item">
                <span className="meta-icon">💾</span>
                <span>{size}</span>
              </span>
            )}
          </div>
          
          <div className="card-type">
            <span className="type-icon">{getTypeIcon()}</span>
            <span className="type-text">{type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 