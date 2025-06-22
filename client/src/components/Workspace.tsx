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
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [has3D, setHas3D] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'generate' | '3d-preview'>('generate');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Demo mode for hackathon presentation
  const [isDemoMode, setIsDemoMode] = useState(true); // Set to true for demo
  const [isGenerating3D, setIsGenerating3D] = useState(false);

  // Demo file paths (you'll need to add these files to public folder)
  const DEMO_GLB_URL = '/demo-model.glb';
  const DEMO_VIDEO_URL = '/demo-video.mp4';

  const [templates] = useState([
    { id: 1, name: 'Cinematic Landscape', preview: '🏔️', description: 'Epic mountain scenery with dramatic lighting' },
    { id: 2, name: 'Urban Night', preview: '🌃', description: 'City lights and neon reflections' },
    { id: 3, name: 'Ocean Waves', preview: '🌊', description: 'Peaceful ocean with rolling waves' },
    { id: 4, name: 'Forest Path', preview: '🌲', description: 'Mystical forest with sunbeams' },
    { id: 5, name: 'Space Journey', preview: '🚀', description: 'Cosmic adventure through stars' },
    { id: 6, name: 'Desert Sunset', preview: '🏜️', description: 'Golden hour in vast desert' }
  ]);

  const handleGenerate = async (e?: React.MouseEvent) => {
    e?.preventDefault(); // Prevent any form submission
    
    console.log('🎬 Generate button clicked');
    console.log('Prompt:', prompt);
    console.log('Image:', image);
    console.log('Demo Mode:', isDemoMode);
    
    if (!prompt.trim() && !image) {
      console.log('❌ No prompt or image provided');
      return;
    }

    console.log('✅ Starting video generation...');
    setIsGenerating(true);
    setCurrentStep(2);
    setGenerationProgress(0);
    setEstimatedTime(isDemoMode ? 10 : 45);

    try {
      if (isDemoMode) {
        // Demo mode: simulate everything locally
        await simulateVideoGeneration();
        onVideoGenerated?.(DEMO_VIDEO_URL);
      } else {
        // Real API mode
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

        const formData = new FormData();
        formData.append('prompt', prompt);
        if (image) {
          formData.append('image', image);
        }

        console.log('📡 Making API call to /api/generate-video');
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(300000)
        });

        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('📡 API Response:', result);
        
        if (result.success) {
          setVideoUrl(result.videoUrl);
          setCurrentStep(5);
          
          // Real API mode - handle actual 3D conversion
          if (result.glbUrl) {
            setGlbUrl(result.glbUrl);
            setHas3D(true);
            console.log('✅ GLB file received:', result.glbUrl);
          } else {
            setHas3D(false);
            console.log('⚠️ No GLB file generated:', result.error3D || 'Unknown reason');
          }
          
          // Generate sample images for 3D preview
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
          throw new Error(result.error || 'Unknown error occurred');
        }
        
        clearInterval(progressInterval);
      }
    } catch (error) {
      console.error('❌ Error generating video:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCurrentStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceedTo3D = () => {
    setActiveTab('3d-preview');
  };

  const handleTemplateSelect = (template: any) => {
    setPrompt(template.description);
  };

  const simulateVideoGeneration = async () => {
    console.log('🎭 Demo mode: Simulating video generation...');
    
    // Simulate realistic video generation time (8-12 seconds)
    const totalTime = 8000 + Math.random() * 4000;
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const increment = (100 / totalTime) * 500; // Update every 500ms
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setCurrentStep(4);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    await new Promise(resolve => setTimeout(resolve, totalTime));
    
    // Load demo video
    setVideoUrl(DEMO_VIDEO_URL);
    setCurrentStep(5);
    setHas3D(false); // Will be set to true when user clicks "Generate 3D Model"
    
    // Generate sample images for 3D preview
    setGeneratedImages([
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=5',
      'https://picsum.photos/400/400?random=6'
    ]);
    
    console.log('✅ Demo video loaded:', DEMO_VIDEO_URL);
    clearInterval(progressInterval);
  };

  const simulateGLBGeneration = async () => {
    setIsGenerating3D(true);
    setHas3D(false);
    
    // Simulate 3D generation progress
    console.log('🎲 Simulating 3D model generation...');
    
    // Simulate realistic processing time (3-5 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    // Set the demo GLB file
    setGlbUrl(DEMO_GLB_URL);
    setHas3D(true);
    setIsGenerating3D(false);
    
    console.log('✅ Demo GLB file loaded:', DEMO_GLB_URL);
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
                <>
                  {isDemoMode && !has3D ? (
                    <button 
                      className="proceed-btn generate-3d-btn" 
                      onClick={simulateGLBGeneration}
                      disabled={isGenerating3D}
                    >
                      {isGenerating3D ? (
                        <>
                          <span className="btn-spinner"></span>
                          Generating 3D...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">🎲</span>
                          Generate 3D Model
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="proceed-btn" onClick={handleProceedTo3D}>
                      <span className="btn-icon">{has3D ? '🎲' : '🚀'}</span>
                      {has3D ? 'View 3D Model' : 'View in 3D'}
                      {has3D && <span className="status-badge">✓</span>}
                    </button>
                  )}
                </>
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
                isDemoMode={isDemoMode}
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Create URLs for image preview
      const imageUrls = newFiles
        .filter(file => file.type.startsWith('image/'))
        .map(file => URL.createObjectURL(file));
      
      setGeneratedImages(prev => [...prev, ...imageUrls]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
  };

  const render3DPreviewTab = () => (
    <div className="threed-tab-container">
      <div className="threed-tab-header">
        <h3>3D Scene Preview</h3>
        <p>Explore your generated content in an interactive 3D environment</p>
      </div>

      {/* File Upload Section */}
      <div className="upload-section">
        <div className="upload-area">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*,video/*,.gltf,.glb,.obj,.fbx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="upload-label">
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <h4>Upload 3D Assets</h4>
              <p>Drop files here or click to browse</p>
              <div className="supported-formats">
                <span>Images</span> • <span>Videos</span> • <span>3D Models</span>
              </div>
            </div>
          </label>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            <h4>Uploaded Files ({uploadedFiles.length})</h4>
            <div className="files-grid">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-preview">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name}
                        className="file-thumbnail"
                      />
                    ) : (
                      <div className="file-icon">
                        {file.type.startsWith('video/') ? '🎬' : 
                         file.name.endsWith('.gltf') || file.name.endsWith('.glb') ? '🎲' : '📄'}
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button 
                    className="remove-file-btn"
                    onClick={() => removeUploadedFile(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ThreeDPreview
        images={generatedImages}
        modelUrl={glbUrl || videoUrl || undefined}
        isVisible={true}
        isGLB={!!glbUrl}
      />

      {!videoUrl && generatedImages.length === 0 && uploadedFiles.length === 0 && (
        <div className="no-content-message">
          <div className="no-content-icon">🎲</div>
          <h4>No 3D Content Available</h4>
          <p>Upload files above or generate a video to view in 3D</p>
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
          {isDemoMode && (
            <div className="demo-badge">
              <span className="demo-icon">🎭</span>
              <span>Demo Mode Active</span>
            </div>
          )}
        </div>
        <div className="workspace-actions">
          <div className="demo-mode-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Demo Mode</span>
            </label>
          </div>
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