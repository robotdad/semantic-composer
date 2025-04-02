import React, { useState, useEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import './CortexComposer.css';

const CortexComposer = ({
  initialValue = '',
  defaultMode = 'edit',
  defaultView = 'rich',
  onChange,
  onSave,
  onModeChange,
  onViewChange,
  theme = 'light',
  height = '500px',
  width = '100%',
  placeholder = 'Start writing...',
  readOnly = false,
  autoFocus = true,
  spellCheck = true,
}) => {
  const [mode, setMode] = useState(defaultMode);
  const [view, setView] = useState(defaultView);
  const [content, setContent] = useState(initialValue);
  const editorRef = useRef(null);
  const crepeRef = useRef(null);
  
  // Initialize Milkdown editor
  useEffect(() => {
    // Only create the editor when in rich mode and the container exists
    if (editorRef.current && mode === 'edit' && view === 'rich' && !crepeRef.current) {
      const crepe = new Crepe({
        root: editorRef.current,
        defaultValue: content,
      });
      
      crepe.create().then(() => {
        crepeRef.current = crepe;
      });
      
      return () => {
        if (crepeRef.current) {
          crepeRef.current.destroy();
          crepeRef.current = null;
        }
      };
    }
  }, [content, mode, view]);
  
  // Toggle handlers
  const toggleMode = () => {
    // If in rich edit mode, try to get content before switching
    if (mode === 'edit' && view === 'rich' && crepeRef.current) {
      try {
        // Try to get content but don't crash if method doesn't exist
        const markdown = crepeRef.current.getMarkdown();
        if (markdown) {
          setContent(markdown);
          if (onChange) onChange(markdown);
        }
      } catch (error) {
        console.log('Could not get markdown content from editor');
      }
    }
    
    const newMode = mode === 'edit' ? 'read' : 'edit';
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };
  
  const toggleView = () => {
    // If switching from rich to raw, try to get content
    if (view === 'rich' && crepeRef.current) {
      try {
        // Try to get content but don't crash if method doesn't exist
        const markdown = crepeRef.current.getMarkdown();
        if (markdown) {
          setContent(markdown);
          if (onChange) onChange(markdown);
        }
      } catch (error) {
        console.log('Could not get markdown content from editor');
      }
    }
    
    const newView = view === 'rich' ? 'raw' : 'rich';
    setView(newView);
    if (onViewChange) onViewChange(newView);
  };
  
  // Handle raw editor changes
  const handleRawChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) onChange(newContent);
  };
  
  // Save handler
  const handleSave = () => {
    // If in rich edit mode, try to get content before saving
    if (mode === 'edit' && view === 'rich' && crepeRef.current) {
      try {
        // Try to get content but don't crash if method doesn't exist
        const markdown = crepeRef.current.getMarkdown();
        if (markdown) {
          setContent(markdown);
          if (onSave) onSave(markdown);
          return;
        }
      } catch (error) {
        console.log('Could not get markdown content from editor');
      }
    }
    
    // Default: save current content state
    if (onSave) onSave(content);
  };
  
  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // React to external initialValue changes
  useEffect(() => {
    setContent(initialValue);
    
    // Try to update editor content if it exists
    if (crepeRef.current) {
      try {
        crepeRef.current.setMarkdown(initialValue);
      } catch (error) {
        console.log('Could not update editor content');
        
        // If setting content fails, recreate the editor
        if (crepeRef.current) {
          crepeRef.current.destroy();
          crepeRef.current = null;
        }
      }
    }
  }, [initialValue]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Save on Ctrl+S or Command+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [content]);
  
  // Convert markdown to HTML for preview mode
  const renderPreview = () => {
    // Simple markdown rendering for preview
    // In a real implementation, you might want to use a proper markdown renderer
    const html = content
      .replace(/# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(.*?)```/gs, (match, code) => `<pre><code>${code}</code></pre>`)
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br />');
    
    return html;
  };
  
  return (
    <div className="cortex-composer" data-theme={theme} style={{ width, height }}>
      <div className="composer-toolbar">
        <button className="toolbar-button" onClick={toggleMode}>
          {mode === 'edit' ? 'Preview' : 'Edit'}
        </button>
        
        {mode === 'edit' && (
          <button className="toolbar-button" onClick={toggleView}>
            {view === 'rich' ? 'Raw' : 'Rich'}
          </button>
        )}
        
        <button className="toolbar-button" onClick={handleSave}>
          Save
        </button>
        
        {/* Word count display */}
        <div className="toolbar-info">
          {content.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
      
      <div className="editor-content" style={{ height: `calc(${height} - 50px)` }}>
        {mode === 'edit' ? (
          view === 'rich' ? (
            <div ref={editorRef} className="milkdown-editor-wrapper" />
          ) : (
            <textarea
              className="raw-editor"
              value={content}
              onChange={handleRawChange}
              placeholder={placeholder}
              spellCheck={spellCheck}
              autoFocus={autoFocus}
              readOnly={readOnly}
            />
          )
        ) : (
          <div className="markdown-preview">
            <div 
              className="preview-content" 
              dangerouslySetInnerHTML={{ 
                __html: renderPreview() 
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CortexComposer;