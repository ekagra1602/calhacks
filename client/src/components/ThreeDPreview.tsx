import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { RotateCw, Maximize, ZoomIn, ZoomOut, RotateCcw, Download, Eye, EyeOff } from 'lucide-react';
import './ThreeDPreview.css';

interface ThreeDPreviewProps {
  images?: string[];
  modelUrl?: string;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({ 
  images = [], 
  modelUrl,
  isVisible = true,
  onToggleVisibility 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRotation = useMotionValue(0);
  
  // Use sample images if none provided
  const sampleImages = [
    'https://picsum.photos/400/400?random=1',
    'https://picsum.photos/400/400?random=2',
    'https://picsum.photos/400/400?random=3',
    'https://picsum.photos/400/400?random=4',
    'https://picsum.photos/400/400?random=5',
    'https://picsum.photos/400/400?random=6'
  ];
  
  const displayImages = images.length > 0 ? images : sampleImages;
  const cylinderWidth = 800;
  const faceCount = displayImages.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  
  const transform = useTransform(
    carouselRotation,
    (value: number) => `rotate3d(0, 1, 0, ${value}deg)`
  );

  const handleImageClick = useCallback((index: number) => {
    setActiveIndex(index);
    setIsCarouselActive(false);
    controls.stop();
  }, [controls]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  
  const handleRotate = (axis: 'x' | 'y' | 'z', direction: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: prev[axis] + (direction * 45)
    }));
  };

  const resetView = () => {
    setZoom(1);
    setRotation({ x: 0, y: 0, z: 0 });
    setIsCarouselActive(true);
  };

  if (!isVisible) {
    return (
      <div className="threed-preview-hidden">
        <motion.button
          className="visibility-toggle"
          onClick={onToggleVisibility}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye size={20} />
          <span>Show 3D Preview</span>
        </motion.button>
      </div>
    );
  }

  return (
    <>
      <div className="threed-preview-container" ref={containerRef}>
        <div className="threed-preview-header">
          <h3>3D Preview</h3>
          <div className="header-controls">
            <motion.button
              className="control-btn"
              onClick={() => setShowWireframe(!showWireframe)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Toggle Wireframe"
            >
              <Eye size={16} />
            </motion.button>
            <motion.button
              className="control-btn"
              onClick={() => setIsFullscreen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Fullscreen"
            >
              <Maximize size={16} />
            </motion.button>
            <motion.button
              className="control-btn"
              onClick={onToggleVisibility}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Hide Preview"
            >
              <EyeOff size={16} />
            </motion.button>
          </div>
        </div>

        <div className="threed-viewport">
          <div 
            className="carousel-container"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            <motion.div
              className="carousel-cylinder"
              drag={isCarouselActive ? 'x' : false}
              style={{
                transform,
                rotateY: carouselRotation,
                width: cylinderWidth,
                transformStyle: 'preserve-3d',
                scale: zoom,
                rotateX: rotation.x,
                rotateZ: rotation.z
              }}
              onDrag={(_: any, info: any) => 
                isCarouselActive && 
                carouselRotation.set(carouselRotation.get() + info.offset.x * 0.1)
              }
              onDragEnd={(_: any, info: any) =>
                isCarouselActive &&
                controls.start({
                  rotateY: carouselRotation.get() + info.velocity.x * 0.1,
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 30,
                    mass: 0.1,
                  },
                })
              }
              animate={controls}
            >
              {displayImages.map((imageUrl, i) => (
                <motion.div
                  key={`face-${i}`}
                  className={`carousel-face ${i === activeIndex ? 'active' : ''} ${showWireframe ? 'wireframe' : ''}`}
                  style={{
                    width: `${faceWidth}px`,
                    transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
                  }}
                  onClick={() => handleImageClick(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={imageUrl}
                    alt={`3D Preview ${i + 1}`}
                    className="face-image"
                  />
                  <div className="face-overlay">
                    <span className="face-number">{i + 1}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="viewport-controls">
            <div className="zoom-controls">
              <motion.button
                className="control-btn"
                onClick={handleZoomOut}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </motion.button>
              <span className="zoom-indicator">{Math.round(zoom * 100)}%</span>
              <motion.button
                className="control-btn"
                onClick={handleZoomIn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </motion.button>
            </div>

            <div className="rotation-controls">
              <motion.button
                className="control-btn"
                onClick={() => handleRotate('y', -1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Rotate Left"
              >
                <RotateCcw size={16} />
              </motion.button>
              <motion.button
                className="control-btn"
                onClick={() => handleRotate('x', 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Rotate Up"
              >
                ↑
              </motion.button>
              <motion.button
                className="control-btn"
                onClick={() => handleRotate('y', 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Rotate Right"
              >
                <RotateCw size={16} />
              </motion.button>
              <motion.button
                className="control-btn"
                onClick={() => handleRotate('x', -1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Rotate Down"
              >
                ↓
              </motion.button>
            </div>

            <motion.button
              className="reset-btn"
              onClick={resetView}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset View
            </motion.button>
          </div>
        </div>

        <div className="threed-info">
          <div className="info-item">
            <span className="info-label">Active Face:</span>
            <span className="info-value">{activeIndex + 1} of {displayImages.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Zoom:</span>
            <span className="info-value">{Math.round(zoom * 100)}%</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rotation:</span>
            <span className="info-value">
              X: {rotation.x}° Y: {rotation.y}° Z: {rotation.z}°
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fullscreen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              className="fullscreen-content"
              onClick={(e: any) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            >
              <div className="fullscreen-header">
                <h2>3D Preview - Fullscreen</h2>
                <motion.button
                  className="close-fullscreen"
                  onClick={() => setIsFullscreen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
              
              <div className="fullscreen-viewport">
                <div 
                  className="carousel-container fullscreen-carousel"
                  style={{
                    perspective: '1500px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div
                    className="carousel-cylinder"
                    drag="x"
                    style={{
                      transform,
                      rotateY: carouselRotation,
                      width: cylinderWidth * 1.5,
                      transformStyle: 'preserve-3d',
                      scale: zoom,
                      rotateX: rotation.x,
                      rotateZ: rotation.z
                    }}
                    onDrag={(_: any, info: any) => 
                      carouselRotation.set(carouselRotation.get() + info.offset.x * 0.05)
                    }
                  >
                    {displayImages.map((imageUrl, i) => (
                      <motion.div
                        key={`fullscreen-face-${i}`}
                        className={`carousel-face fullscreen-face ${i === activeIndex ? 'active' : ''}`}
                        style={{
                          width: `${faceWidth * 1.5}px`,
                          transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius * 1.5}px)`,
                        }}
                        onClick={() => setActiveIndex(i)}
                      >
                        <img
                          src={imageUrl}
                          alt={`3D Preview ${i + 1}`}
                          className="face-image"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className="fullscreen-controls">
                <div className="zoom-controls">
                  <motion.button onClick={handleZoomOut} whileHover={{ scale: 1.1 }}>
                    <ZoomOut size={20} />
                  </motion.button>
                  <span>{Math.round(zoom * 100)}%</span>
                  <motion.button onClick={handleZoomIn} whileHover={{ scale: 1.1 }}>
                    <ZoomIn size={20} />
                  </motion.button>
                </div>
                <motion.button 
                  className="reset-btn"
                  onClick={resetView}
                  whileHover={{ scale: 1.05 }}
                >
                  Reset View
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThreeDPreview; 