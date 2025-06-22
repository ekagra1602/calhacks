import React, { useRef, useEffect, useState } from 'react';
import './ThreeDPreview.css';

// Declare window.VIEWER for TypeScript
declare global {
  interface Window {
    VIEWER: any;
  }
}

// Import the Viewer class directly
let Viewer: any = null;

// Dynamically import the viewer to avoid SSR issues
const loadViewer = async () => {
  if (!Viewer) {
    const viewerModule = await import('../lib/gltf-viewer/viewer.js');
    Viewer = viewerModule.Viewer;
  }
  return Viewer;
};

interface ThreeDPreviewProps {
  images?: string[];
  modelUrl?: string;
  isVisible?: boolean;
  uploadedFiles?: File[];
  isGLB?: boolean;
}

const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({ 
  images = [], 
  modelUrl, 
  isVisible = true,
  uploadedFiles = [],
  isGLB = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [hasModel, setHasModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [viewerReady, setViewerReady] = useState(false);

  // Initialize the viewer
  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    const initViewer = async () => {
      try {
        const ViewerClass = await loadViewer();
        
        // Clear the container
        containerRef.current!.innerHTML = '';
        
        // Initialize the global VIEWER object that the viewer expects
        if (!window.VIEWER) {
          window.VIEWER = {};
        }
        
        // Create viewer instance with kiosk mode (no GUI)
        const viewer = new ViewerClass(containerRef.current, {
          kiosk: true, // Hide the GUI for cleaner integration
          preset: '',
          model: '',
          cameraPosition: null
        });

        viewerRef.current = viewer;
        setViewerReady(true);

        // If we have a file waiting, load it now
        if (currentFile) {
          loadModelInViewer(currentFile);
        }

      } catch (err) {
        console.error('Failed to initialize 3D viewer:', err);
        setError('Failed to initialize 3D viewer');
      }
    };

    initViewer();

    // Cleanup function
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch (e) {
          console.warn('Error clearing viewer:', e);
        }
        viewerRef.current = null;
      }
      setViewerReady(false);
    };
  }, [isVisible]);

  // Handle uploaded files
  useEffect(() => {
    if (!uploadedFiles.length) return;

    // Find GLB/GLTF files
    const gltfFiles = uploadedFiles.filter(file => 
      file.name.toLowerCase().endsWith('.glb') || 
      file.name.toLowerCase().endsWith('.gltf')
    );

    if (gltfFiles.length > 0) {
      const file = gltfFiles[0]; // Use the first GLB/GLTF file
      setCurrentFile(file);
      if (viewerReady) {
        loadModelInViewer(file);
      }
    }
  }, [uploadedFiles, viewerReady]);

  // Handle GLB URL from server
  useEffect(() => {
    if (!modelUrl || !isGLB || !viewerReady) return;

    const loadGLBFromUrl = async () => {
      setIsLoading(true);
      setError(null);
      setHasModel(false);

      try {
        console.log('🎲 Loading GLB from URL:', modelUrl);
        
        // Fetch the GLB file
        const response = await fetch(modelUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch GLB: ${response.status}`);
        }
        
        const blob = await response.blob();
        const file = new File([blob], 'generated_model.glb', { type: 'model/gltf-binary' });
        
        // Load using existing method
        await loadModelInViewer(file);
        
      } catch (err) {
        console.error('❌ Error loading GLB from URL:', err);
        setError('Failed to load 3D model from server: ' + (err as Error).message);
        setIsLoading(false);
      }
    };

    loadGLBFromUrl();
  }, [modelUrl, isGLB, viewerReady]);

  const loadModelInViewer = async (file: File) => {
    if (!viewerRef.current || !viewerReady) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasModel(false);

    try {
      // Create a file map as expected by the viewer
      const fileMap = new Map();
      fileMap.set(file.name, file);

      // Create a blob URL for the file
      const fileUrl = URL.createObjectURL(file);

      // Load the model using the viewer's load method
      await viewerRef.current.load(fileUrl, '', fileMap);
      
      setHasModel(true);
      setIsLoading(false);
      
      // Clean up the URL
      URL.revokeObjectURL(fileUrl);

    } catch (err) {
      console.error('Error loading model:', err);
      setError('Failed to load 3D model: ' + (err as Error).message);
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.glb') || file.name.toLowerCase().endsWith('.gltf')) {
        setCurrentFile(file);
        if (viewerReady) {
          loadModelInViewer(file);
        }
      } else {
        setError('Please select a GLB or GLTF file');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.glb') || file.name.toLowerCase().endsWith('.gltf')) {
        setCurrentFile(file);
        if (viewerReady) {
          loadModelInViewer(file);
        }
      } else {
        setError('Please drop a GLB or GLTF file');
      }
    }
  };

  const clearModel = () => {
    setCurrentFile(null);
    setHasModel(false);
    setError(null);
    if (viewerRef.current) {
      try {
        viewerRef.current.clear();
      } catch (e) {
        console.warn('Error clearing model:', e);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="threed-preview">
      <div className="preview-header">
        <h3>3D Model Preview</h3>
        <div className="preview-controls">
          <input
            type="file"
            id="gltf-file-input"
            accept=".glb,.gltf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="gltf-file-input" className="upload-btn">
            📁 Upload GLB/GLTF
          </label>
          {currentFile && (
            <>
              <span className="current-file">
                {currentFile.name}
              </span>
              <button onClick={clearModel} className="upload-btn secondary">
                🗑️ Clear
              </button>
            </>
          )}
        </div>
      </div>

      <div 
        className="viewer-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          ref={containerRef}
          className="viewer-canvas"
          style={{
            width: '100%',
            height: '500px',
            borderRadius: '8px',
            background: '#1a1a1a',
            position: 'relative'
          }}
        />

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading 3D model...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-overlay">
            <div className="error-message">
              <h4>Error</h4>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="dismiss-btn">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!hasModel && !isLoading && !error && !currentFile && (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">🎲</div>
              <h4>3D Model Viewer</h4>
              <p>Upload or drag & drop a GLB or GLTF file to view it in 3D</p>
              <label htmlFor="gltf-file-input" className="upload-btn primary">
                Choose File
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="model-info">
        <div className="info-item">
          <span className="info-label">Status:</span>
          <span className="info-value">
            {isLoading ? 'Loading...' : hasModel ? 'Model Loaded' : viewerReady ? 'Ready' : 'Initializing...'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Engine:</span>
          <span className="info-value">three-gltf-viewer</span>
        </div>
        <div className="info-item">
          <span className="info-label">Supported:</span>
          <span className="info-value">GLB, GLTF</span>
        </div>
      </div>
    </div>
  );
};

export default ThreeDPreview; 