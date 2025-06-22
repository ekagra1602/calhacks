import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Edit3, Download, Share } from 'lucide-react';
import './VideoPreview.css';

interface VideoPreviewProps {
  videoUrl?: string;
  onEdit?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  videoUrl, 
  onEdit, 
  onDownload, 
  onShare 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = value / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isFinite(progress) ? progress : 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current && videoRef.current.duration) {
      const time = (value / 100) * videoRef.current.duration;
      if (isFinite(time)) {
        videoRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const CustomSlider = ({ 
    value, 
    onChange, 
    className 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    className?: string; 
  }) => (
    <motion.div
      className={`relative w-full h-1 bg-white/20 rounded-full cursor-pointer ${className}`}
      onClick={(e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );

  if (!videoUrl) {
    return (
      <div className="video-preview-placeholder">
        <div className="placeholder-content">
          <Play className="placeholder-icon" />
          <h3>Video Preview</h3>
          <p>Your generated video will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Video Thumbnail */}
      <motion.div
        className="video-preview-thumbnail"
        layoutId="video-preview"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <video
          src={videoUrl}
          className="thumbnail-video"
          muted
          preload="metadata"
        />
        <div className="thumbnail-overlay">
          <motion.div
            className="play-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play />
          </motion.div>
        </div>
        <div className="thumbnail-actions">
          <motion.button
            className="action-button"
            onClick={(e: any) => {
              e.stopPropagation();
              onEdit?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit3 size={16} />
          </motion.button>
          <motion.button
            className="action-button"
            onClick={(e: any) => {
              e.stopPropagation();
              onDownload?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download size={16} />
          </motion.button>
          <motion.button
            className="action-button"
            onClick={(e: any) => {
              e.stopPropagation();
              onShare?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Full Screen Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="video-modal-container"
              layoutId="video-preview"
              onClick={(e: any) => e.stopPropagation()}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            >
              <video
                ref={videoRef}
                className="modal-video"
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                autoPlay
              />

              {/* Close Button */}
              <motion.button
                className="close-button"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              {/* Video Controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    className="video-controls"
                    initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {/* Progress Bar */}
                    <div className="progress-container">
                      <span className="time-display">{formatTime(currentTime)}</span>
                      <CustomSlider
                        value={progress}
                        onChange={handleSeek}
                        className="progress-slider"
                      />
                      <span className="time-display">{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="controls-row">
                      <div className="controls-left">
                        <motion.button
                          className="control-button"
                          onClick={togglePlay}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </motion.button>

                        <div className="volume-control">
                          <motion.button
                            className="control-button"
                            onClick={toggleMute}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </motion.button>
                          <div className="volume-slider">
                            <CustomSlider
                              value={volume * 100}
                              onChange={handleVolumeChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="controls-right">
                        <motion.button
                          className="control-button"
                          onClick={onEdit}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit3 size={20} />
                        </motion.button>
                        <motion.button
                          className="control-button"
                          onClick={onDownload}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download size={20} />
                        </motion.button>
                        <motion.button
                          className="control-button"
                          onClick={() => setIsOpen(false)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Maximize size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoPreview; 