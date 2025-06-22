import React, { useState, useRef } from 'react';
import './Workspace.css';
import PromptInput from './PromptInput';
import ImageUpload from './ImageUpload';
import ProgressStepper from './ProgressStepper';
import StatusCards from './StatusCards';
import ThreeDPreview from './ThreeDPreview';

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
  const [activeTab, setActiveTab] = useState<'generate' | '3d-preview'>('generate');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [templates] = useState([
    { id: 1, name: 'Cinematic Landscape', preview: '🏔️', description: 'Epic mountain scenery with dramatic lighting' },
    { id: 2, name: 'Urban Night', preview: '🌃', description: 'City lights and neon reflections' },
    { id: 3, name: 'Ocean Waves', preview: '🌊', description: 'Peaceful ocean with rolling waves' },
    { id: 4, name: 'Forest Path', preview: '🌲', description: 'Mystical forest with sunbeams' },
    { id: 5, name: 'Space Journey', preview: '🚀', description: 'Cosmic adventure through stars' },
    { id: 6, name: 'Desert Sunset', preview: '🏜️', description: 'Golden hour in vast desert' }
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
        signal: AbortSignal.timeout(300000)
      });

      const result = await response.json();
      
      if (result.success) {
        setVideoUrl(result.videoUrl);
        setCurrentStep(5);
        // Generate sample images for 3D preview (in real implementation, these would come from the API)
        setGeneratedImages([
          'https://picsum.photos/400/400?random=1',
          'https://picsum.photos/400/400?random=2',
          'https://picsum.photos/400/400?random=3',
          'https://picsum.photos/400/400?random=4',
          'https://picsum.photos/400/400?random=5',
          'https://picsum.photos/400/400?random=6'
        ]);
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
    setActiveTab('3d-preview');
  };

  const handleTemplateSelect = (template: any) => {
    setPrompt(template.description);
  };



  const renderGenerateTab = () => (
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
                  View in 3D
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

      
    </div>
  );

  const render3DPreviewTab = () => (
    <div className="threed-tab-container">
      <div className="threed-tab-header">
        <h3>3D Scene Preview</h3>
        <p>Explore your generated content in an interactive 3D environment</p>
      </div>
      <ThreeDPreview
        images={generatedImages}
        modelUrl={videoUrl || undefined}
        isVisible={true}
      />
      {!videoUrl && generatedImages.length === 0 && (
        <div className="no-content-message">
          <div className="no-content-icon">🎬</div>
          <h4>No 3D Content Available</h4>
          <p>Generate a video first to view it in 3D</p>
          <button 
            className="back-to-generate-btn"
            onClick={() => setActiveTab('generate')}
          >
            <span className="btn-icon">←</span>
            Back to Generate
          </button>
        </div>
      )}
    </div>
  );

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

      {/* Tab Navigation */}
      <div className="workspace-tabs">
        <button 
          className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          <span className="tab-icon">🎬</span>
          <span className="tab-label">Generate</span>
          {videoUrl && <span className="tab-badge">✓</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === '3d-preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('3d-preview')}
          disabled={!videoUrl && generatedImages.length === 0}
        >
          <span className="tab-icon">🎭</span>
          <span className="tab-label">3D Preview</span>
          {generatedImages.length > 0 && <span className="tab-badge">{generatedImages.length}</span>}
        </button>
      </div>

      {/* Tab Content */}
      <div className="workspace-content">
        {activeTab === 'generate' && renderGenerateTab()}
        {activeTab === '3d-preview' && render3DPreviewTab()}
      </div>
    </div>
  );
};

export default Workspace; 