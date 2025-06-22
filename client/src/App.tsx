import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PromptInput from './components/PromptInput';
import ImageUpload from './components/ImageUpload';
import ProgressStepper from './components/ProgressStepper';
import StatusCards from './components/StatusCards';
import ProjectCard from './components/ProjectCard';
import ParticleBackground from './components/ParticleBackground';
import AnimatedBackground from './components/AnimatedBackground';

interface VideoResponse {
  success: boolean;
  videoUrl?: string;
  jobId?: string;
  error?: string;
  message?: string;
}

interface ProceedResponse {
  success: boolean;
  message?: string;
  renderingId?: string;
  error?: string;
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [isProceeding, setIsProceeding] = useState(false);
  const [renderingId, setRenderingId] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  // Mock recent projects data
  const recentProjects = [
    {
      id: '1',
      title: 'Sunset Landscape',
      description: 'Beautiful sunset over mountains with cinematic lighting',
      type: 'video' as const,
      status: 'completed' as const,
      createdAt: '2024-01-20',
      duration: '8s',
      size: '2.3 MB',
      tags: ['landscape', 'sunset', 'cinematic']
    },
    {
      id: '2',
      title: 'Urban Street Scene',
      description: 'Dynamic city street with moving traffic and people',
      type: 'video' as const,
      status: 'processing' as const,
      createdAt: '2024-01-19',
      duration: '8s',
      tags: ['urban', 'street', 'dynamic']
    },
    {
      id: '3',
      title: 'Nature Template',
      description: 'Pre-built template for nature scenes',
      type: 'template' as const,
      status: 'completed' as const,
      createdAt: '2024-01-18',
      tags: ['template', 'nature', 'forest']
    }
  ];

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideoUrl('');
    setCurrentStep(3);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
      });

      const data: VideoResponse = await response.json();

      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setCurrentStep(4);
      } else {
        setError(data.message || 'Failed to generate video');
        setCurrentStep(1);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedTo3D = async () => {
    if (!videoUrl) {
      setError('No video available to proceed');
      return;
    }

    setIsProceeding(true);
    setError('');
    setCurrentStep(5);

    try {
      const response = await fetch('/api/proceed-to-3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl, prompt }),
      });

      const data: ProceedResponse = await response.json();

      if (data.success) {
        setRenderingId(data.renderingId || '');
      } else {
        setError(data.message || 'Failed to proceed to 3D rendering');
        setCurrentStep(4);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
      setCurrentStep(4);
    } finally {
      setIsProceeding(false);
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview('');
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (value.trim() && currentStep === 1) {
      setCurrentStep(prompt.trim() ? 2 : 1);
    }
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
    // Implement search functionality
  };

  return (
    <div className="App">
      <ParticleBackground />
      <AnimatedBackground />
      <Sidebar currentStep={currentStep} />
      <TopBar onSearch={handleSearch} />

      <main className="app-main">
        <div className="main-content">
          <div className="content-header">
            <h1>Create Amazing 3D Videos</h1>
            <p>Transform your images and ideas into stunning 3D cinematic experiences</p>
          </div>

          <div className="workspace-grid">
            <div className="primary-workspace">
              <ProgressStepper 
                currentStep={currentStep} 
                isLoading={isLoading || isProceeding} 
              />
              
              <StatusCards 
                isGenerating={isLoading}
                hasVideo={!!videoUrl}
                currentStep={currentStep}
              />

              <div className="creation-panel">
                <div className="panel-header">
                  <h2>🎬 Video Generation</h2>
                  <div className="panel-actions">
                    <button className="panel-btn">
                      <span>💡</span>
                      <span>Tips</span>
                    </button>
                    <button className="panel-btn">
                      <span>🎨</span>
                      <span>Templates</span>
                    </button>
                  </div>
                </div>

                <div className="input-grid">
                  <PromptInput 
                    value={prompt}
                    onChange={handlePromptChange}
                    disabled={isLoading}
                  />
                  
                  <ImageUpload
                    uploadedImage={uploadedImage}
                    imagePreview={imagePreview}
                    onImageUpload={handleImageUpload}
                    onImageRemove={removeImage}
                    disabled={isLoading}
                  />
                </div>

                <button
                  className="generate-btn"
                  onClick={generateVideo}
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Generating Video...</span>
                      <div className="progress-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>🎥</span>
                      <span>Generate Video</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="error-message">
                  <span>⚠️</span>
                  <span>{error}</span>
                  <button 
                    className="error-close"
                    onClick={() => setError('')}
                  >
                    ×
                  </button>
                </div>
              )}

              {videoUrl && (
                <div className="video-section">
                  <h2>🎬 Your Generated Video</h2>
                  <div className="video-container">
                    <video
                      controls
                      width="100%"
                      height="auto"
                      src={videoUrl}
                      className="video-player"
                      autoPlay
                      muted
                      loop
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="video-overlay">
                      <div className="video-info">
                        <span className="video-duration">8s</span>
                        <span className="video-quality">HD</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="video-actions">
                    <button
                      className="regenerate-btn"
                      onClick={generateVideo}
                      disabled={isLoading}
                    >
                      <span>🔄</span>
                      <span>Regenerate</span>
                    </button>
                    
                    <button
                      className="proceed-btn"
                      onClick={proceedTo3D}
                      disabled={isProceeding}
                    >
                      {isProceeding ? (
                        <>
                          <div className="spinner"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Proceed to 3D</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {renderingId && (
                <div className="success-message">
                  <span>✅</span>
                  <span>3D rendering initiated! Rendering ID: {renderingId}</span>
                  <div className="success-animation">
                    <div className="success-ripple"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="secondary-workspace">
              <div className="recent-projects">
                <div className="section-header">
                  <h3>Recent Projects</h3>
                  <button className="view-all-btn">View All</button>
                </div>
                
                <div className="projects-grid">
                  {recentProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      onPlay={() => console.log('Play:', project.id)}
                      onEdit={() => console.log('Edit:', project.id)}
                      onDelete={() => console.log('Delete:', project.id)}
                      onShare={() => console.log('Share:', project.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="quick-stats">
                <div className="section-header">
                  <h3>Quick Stats</h3>
                </div>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🎬</div>
                    <div className="stat-content">
                      <div className="stat-value">12</div>
                      <div className="stat-label">Videos Created</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                      <div className="stat-value">96s</div>
                      <div className="stat-label">Total Duration</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">💾</div>
                    <div className="stat-content">
                      <div className="stat-value">28MB</div>
                      <div className="stat-label">Storage Used</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 