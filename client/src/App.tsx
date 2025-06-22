import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageUpload from './components/ImageUpload';
import ProgressStepper from './components/ProgressStepper';
import StatusCards from './components/StatusCards';
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

  return (
    <div className="App">
      <ParticleBackground />
      <AnimatedBackground />
      <Header />

      <main className="app-main">
        <ProgressStepper 
          currentStep={currentStep} 
          isLoading={isLoading || isProceeding} 
        />
        
        <StatusCards 
          isGenerating={isLoading}
          hasVideo={!!videoUrl}
          currentStep={currentStep}
        />

        <div className="prompt-section">
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
      </main>
    </div>
  );
}

export default App; 