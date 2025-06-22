import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, X, Sparkles, Wand2, RefreshCw, Save, History } from 'lucide-react';
import './PromptEditor.css';

interface PromptEditorProps {
  onSubmit?: (prompt: string, type: 'refine' | 'new') => void;
  isLoading?: boolean;
  originalPrompt?: string;
  suggestions?: string[];
}

interface PromptHistory {
  id: string;
  text: string;
  timestamp: Date;
  type: 'refine' | 'new';
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  onSubmit,
  isLoading = false,
  originalPrompt = '',
  suggestions = []
}) => {
  const [prompt, setPrompt] = useState('');
  const [promptType, setPromptType] = useState<'refine' | 'new'>('refine');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const defaultSuggestions = [
    'Make it more cinematic with dramatic lighting',
    'Add slow motion effects',
    'Enhance the colors and contrast',
    'Make it more dynamic with camera movement',
    'Add particle effects or sparkles',
    'Change the time of day to golden hour',
    'Make it more futuristic',
    'Add depth of field blur effect'
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = () => {
    if (prompt.trim() && onSubmit) {
      const newHistoryItem: PromptHistory = {
        id: Date.now().toString(),
        text: prompt,
        timestamp: new Date(),
        type: promptType
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      onSubmit(prompt, promptType);
      setPrompt('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const applySuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
  };

  const applyHistoryItem = (historyItem: PromptHistory) => {
    setPrompt(historyItem.text);
    setPromptType(historyItem.type);
    setShowHistory(false);
  };

  const savePrompt = () => {
    if (prompt.trim() && !savedPrompts.includes(prompt)) {
      setSavedPrompts(prev => [prompt, ...prev.slice(0, 4)]);
    }
  };

  const generateRandomPrompt = () => {
    const randomSuggestion = displaySuggestions[Math.floor(Math.random() * displaySuggestions.length)];
    setPrompt(randomSuggestion);
  };

  return (
    <div className="prompt-editor">
      <div className="prompt-editor-header">
        <div className="prompt-type-selector">
          <motion.button
            className={`type-button ${promptType === 'refine' ? 'active' : ''}`}
            onClick={() => setPromptType('refine')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Wand2 size={16} />
            Refine Video
          </motion.button>
          <motion.button
            className={`type-button ${promptType === 'new' ? 'active' : ''}`}
            onClick={() => setPromptType('new')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            New Generation
          </motion.button>
        </div>

        <div className="editor-actions">
          <motion.button
            className="action-button"
            onClick={() => setShowHistory(!showHistory)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Prompt History"
          >
            <History size={16} />
          </motion.button>
          <motion.button
            className="action-button"
            onClick={generateRandomPrompt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Random Suggestion"
          >
            <RefreshCw size={16} />
          </motion.button>
          <motion.button
            className="action-button"
            onClick={savePrompt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Save Prompt"
          >
            <Save size={16} />
          </motion.button>
        </div>
      </div>

      {originalPrompt && promptType === 'refine' && (
        <motion.div
          className="original-prompt"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="original-prompt-label">Original Prompt:</div>
          <div className="original-prompt-text">{originalPrompt}</div>
        </motion.div>
      )}

      <div className="prompt-input-container">
        <textarea
          ref={textareaRef}
          className="prompt-textarea"
          placeholder={
            promptType === 'refine' 
              ? "Describe how you'd like to modify the video..." 
              : "Describe the video you want to create..."
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={3}
        />

        <div className="input-actions">
          <motion.button
            className="suggestions-button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={16} />
            Suggestions
          </motion.button>

          <motion.button
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            whileHover={{ scale: prompt.trim() ? 1.05 : 1 }}
            whileTap={{ scale: prompt.trim() ? 0.95 : 1 }}
          >
            {isLoading ? (
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw size={16} />
              </motion.div>
            ) : (
              <>
                <Send size={16} />
                {promptType === 'refine' ? 'Refine' : 'Generate'}
              </>
            )}
          </motion.button>
        </div>

        <div className="prompt-info">
          <span className="character-count">
            {prompt.length}/500
          </span>
          <span className="shortcut-hint">
            ⌘+Enter to submit
          </span>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="suggestions-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="suggestions-header">
              <h4>Suggestions</h4>
              <motion.button
                className="close-button"
                onClick={() => setShowSuggestions(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>
            <div className="suggestions-list">
              {displaySuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="suggestion-item"
                  onClick={() => applySuggestion(suggestion)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Sparkles size={14} />
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Dropdown */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="history-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="history-header">
              <h4>Recent Prompts</h4>
              <motion.button
                className="close-button"
                onClick={() => setShowHistory(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-history">No recent prompts</div>
              ) : (
                history.map((item, index) => (
                  <motion.button
                    key={item.id}
                    className="history-item"
                    onClick={() => applyHistoryItem(item)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="history-item-content">
                      <div className="history-item-text">{item.text}</div>
                      <div className="history-item-meta">
                        <span className={`history-type ${item.type}`}>
                          {item.type === 'refine' ? 'Refine' : 'New'}
                        </span>
                        <span className="history-time">
                          {item.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Prompts */}
      {savedPrompts.length > 0 && (
        <motion.div
          className="saved-prompts"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="saved-prompts-label">Saved Prompts:</div>
          <div className="saved-prompts-list">
            {savedPrompts.map((savedPrompt, index) => (
              <motion.button
                key={index}
                className="saved-prompt-item"
                onClick={() => setPrompt(savedPrompt)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {savedPrompt.substring(0, 50)}
                {savedPrompt.length > 50 ? '...' : ''}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PromptEditor; 