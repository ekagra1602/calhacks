import React, { useState, useEffect } from 'react';
import './PromptInput.css';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const PLACEHOLDER_SUGGESTIONS = [
  "A mystical dragon soaring through ancient mountains...",
  "A futuristic cityscape with neon lights reflecting in rain...",
  "A peaceful forest scene with magical floating lights...",
  "An underwater kingdom with bioluminescent creatures...",
  "A space station orbiting a distant alien planet...",
  "A medieval castle surrounded by enchanted gardens..."
];

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled = false, placeholder, maxLength = 500 }) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  useEffect(() => {
    if (!value && !disabled) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [value, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const getCharCountColor = () => {
    if (charCount > 400) return '#ff6b6b';
    if (charCount > 300) return '#fbbf24';
    return 'rgba(255, 255, 255, 0.6)';
  };

  return (
    <div className="prompt-input-container">
      <div className="input-header">
        <label className="input-label">
          ✨ Describe your vision
        </label>
        <div className="char-counter" style={{ color: getCharCountColor() }}>
          {charCount}/{maxLength}
        </div>
      </div>
      
      <div className={`textarea-wrapper ${isTyping ? 'typing' : ''} ${disabled ? 'disabled' : ''}`}>
        <textarea
          className="prompt-input"
          placeholder={placeholder || PLACEHOLDER_SUGGESTIONS[currentPlaceholder]}
          value={value}
          onChange={handleChange}
          rows={4}
          disabled={disabled}
        />
        <div className="input-glow"></div>
      </div>
      
      <div className="prompt-suggestions">
        <div className="suggestion-header">💡 Quick suggestions:</div>
        <div className="suggestion-tags">
          {["Cinematic", "Fantasy", "Sci-fi", "Nature", "Abstract"].map((tag) => (
            <button
              key={tag}
              className="suggestion-tag"
              onClick={() => {
                if (!disabled && value.length + tag.length + 1 <= maxLength) {
                  onChange(value + (value ? ' ' : '') + tag.toLowerCase());
                }
              }}
              disabled={disabled}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput; 