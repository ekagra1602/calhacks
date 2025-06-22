import React, { useState, useRef } from 'react';
import './Workspace.css';
import PromptInput from './PromptInput';
import ImageUpload from './ImageUpload';
import ProgressStepper from './ProgressStepper';
import StatusCards from './StatusCards';

interface WorkspaceProps {
  onVideoGenerated?: (videoUrl: string) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ onVideoGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [templates] = useState([
    { id: 1, name: 'Cinematic Landscape', preview: '🏔️', description: 'Epic mountain scenery with dramatic lighting' },
    { id: 2, name: 'Urban Night', preview: '🌃', description: 'City lights and neon reflections' },
    { id: 3, name: 'Ocean Waves', preview: '🌊', description: 'Peaceful ocean with rolling waves' },
    { id: 4, name: 'Forest Path', preview: '🌲', description: 'Mystical forest with sunbeams' },
    { id: 5, name: 'Space Journey', preview: '🚀', description: 'Cosmic adventure through stars' },
    { id: 6, name: 'Desert Sunset', preview: '🏜️', description: 'Golden hour in vast desert' }
  ]);

  const [recentProjects] = useState([
    { id: 1, name: 'Mountain Vista', thumbnail: '🏔️', duration: '8s', status: 'completed', date: '2 hours ago' },
    { id: 2, name: 'City Lights', thumbnail: '🌃', duration: '8s', status: 'processing', date: '4 hours ago' },
    { id: 3, name: 'Ocean Dreams', thumbnail: '🌊', duration: '8s', status: 'completed', date: '1 day ago' }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim() && !image) return;

    setIsGenerating(true);
    setCurrentStep(2);
    setGenerationProgress(0);
    setEstimatedTime(45);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setCurrentStep(4);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:5000/api/generate-video', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setVideoUrl(result.videoUrl);
        setCurrentStep(5);
        onVideoGenerated?.(result.videoUrl);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error generating video:', error);
      setCurrentStep(1);
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const handleProceedTo3D = () => {
    if (videoUrl) {
      console.log('Proceeding to 3D with video:', videoUrl);
      // Implement 3D processing logic here
    }
  };

  const handleTemplateSelect = (template: any) => {
    setPrompt(template.description);
  };

  const handleRecentProjectSelect = (project: any) => {
    console.log('Loading project:', project.name);
    // Implement project loading logic
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Video Generation Studio</h1>
          <p>Transform your ideas into cinematic 3D experiences</p>
        </div>
        <div className="workspace-actions">
          <button className="action-btn secondary">
            <span className="btn-icon">💾</span>
            Save Project
          </button>
          <button className="action-btn primary">
            <span className="btn-icon">📤</span>
            Export
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        {/* Main Generation Area */}
        <div className="generation-section">
          <div className="generation-card">
            <div className="generation-header">
              <h3>Create Your Video</h3>
              <div className="generation-stats">
                <span className="stat">
                  <span className="stat-icon">⚡</span>
                  <span>AI Powered</span>
                </span>
                <span className="stat">
                  <span className="stat-icon">🎬</span>
                  <span>8s Duration</span>
                </span>
                <span className="stat">
                  <span className="stat-icon">🎯</span>
                  <span>4K Quality</span>
                </span>
              </div>
            </div>

            <div className="input-section">
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                placeholder="Describe your vision..."
                maxLength={500}
              />
              
              <ImageUpload
                onImageSelect={setImage}
                selectedImage={image}
                disabled={isGenerating}
              />

              <div className="generation-controls">
                <button 
                  className="generate-btn"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!prompt.trim() && !image)}
                >
                  {isGenerating ? (
                    <>
                      <span className="btn-spinner"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🎬</span>
                      Generate Video
                    </>
                  )}
                </button>

                {videoUrl && (
                  <button className="proceed-btn" onClick={handleProceedTo3D}>
                    <span className="btn-icon">🚀</span>
                    Proceed to 3D
                  </button>
                )}
              </div>
            </div>

            {isGenerating && (
              <div className="progress-section">
                <ProgressStepper currentStep={currentStep} />
                <StatusCards 
                  progress={generationProgress}
                  isGenerating={isGenerating}
                  estimatedTime={estimatedTime}
                />
              </div>
            )}

            {videoUrl && (
              <div className="video-preview">
                <div className="video-header">
                  <h4>Generated Video</h4>
                  <div className="video-controls">
                    <button className="control-btn">
                      <span>🔄</span>
                      Regenerate
                    </button>
                    <button className="control-btn">
                      <span>📥</span>
                      Download
                    </button>
                  </div>
                </div>
                <div className="video-container">
                  <video 
                    ref={videoRef}
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop
                    className="generated-video"
                  />
                  <div className="video-overlay">
                    <div className="video-info">
                      <span className="video-duration">8.0s</span>
                      <span className="video-quality">4K</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Templates Section */}
        <div className="templates-section">
          <div className="templates-card">
            <div className="templates-header">
              <h3>Templates</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="templates-grid">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className="template-item"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="template-preview">
                    <span className="template-icon">{template.preview}</span>
                    <div className="template-overlay">
                      <span className="use-template">Use Template</span>
                    </div>
                  </div>
                  <div className="template-info">
                    <div className="template-name">{template.name}</div>
                    <div className="template-desc">{template.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="projects-section">
          <div className="projects-card">
            <div className="projects-header">
              <h3>Recent Projects</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="projects-list">
              {recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-item"
                  onClick={() => handleRecentProjectSelect(project)}
                >
                  <div className="project-thumbnail">
                    <span className="project-icon">{project.thumbnail}</span>
                    <div className={`project-status ${project.status}`}>
                      {project.status === 'completed' ? '✅' : '⏳'}
                    </div>
                  </div>
                  <div className="project-details">
                    <div className="project-name">{project.name}</div>
                    <div className="project-meta">
                      <span className="project-duration">{project.duration}</span>
                      <span className="project-date">{project.date}</span>
                    </div>
                  </div>
                  <div className="project-actions">
                    <button className="project-action">
                      <span>▶️</span>
                    </button>
                    <button className="project-action">
                      <span>📥</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <div className="stats-card">
            <div className="stats-header">
              <h3>Quick Stats</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">🎬</div>
                <div className="stat-content">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Videos Created</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-value">96s</div>
                  <div className="stat-label">Total Duration</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💾</div>
                <div className="stat-content">
                  <div className="stat-value">28MB</div>
                  <div className="stat-label">Storage Used</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🚀</div>
                <div className="stat-content">
                  <div className="stat-value">4.2s</div>
                  <div className="stat-label">Avg Render</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace; 