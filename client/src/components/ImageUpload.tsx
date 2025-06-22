import React, { useState, useRef, useCallback } from 'react';
import './ImageUpload.css';

interface ImageUploadProps {
  uploadedImage: File | null;
  imagePreview: string;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  uploadedImage,
  imagePreview,
  onImageUpload,
  onImageRemove,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processFile(imageFile);
    }
  }, [disabled]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          onImageUpload(file);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-upload-container">
      <div className="upload-header">
        <label className="upload-label">
          📷 Reference Image
        </label>
        <span className="upload-hint">(Optional - helps guide generation)</span>
      </div>

      {!imagePreview ? (
        <div
          className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
            disabled={disabled}
          />
          
          <div className="upload-content">
            {isProcessing ? (
              <div className="upload-processing">
                <div className="processing-spinner"></div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span>Processing... {uploadProgress}%</span>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="upload-text">
                  <span className="primary-text">Click to upload or drag & drop</span>
                  <span className="secondary-text">PNG, JPG, GIF up to 10MB</span>
                </div>
              </>
            )}
          </div>
          
          <div className="upload-ripple"></div>
        </div>
      ) : (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={imagePreview} alt="Uploaded reference" />
            <div className="image-overlay">
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
                disabled={disabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
          
          {uploadedImage && (
            <div className="image-info">
              <div className="image-details">
                <span className="image-name">{uploadedImage.name}</span>
                <span className="image-size">{getFileSize(uploadedImage.size)}</span>
              </div>
              <button
                className="change-button"
                onClick={handleClick}
                disabled={disabled}
              >
                Change Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 