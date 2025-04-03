import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Crepe } from '@milkdown/crepe';
import { FiEdit, FiEye, FiType, FiCode, FiSave, FiDownload } from 'react-icons/fi';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import './SemanticComposer.css';

/**
 * Semantic Composer - A markdown editor component
 */
/**
 * Semantic Composer - A markdown editor component with rich/raw editing modes
 * 
 * @param {Object} props - Component props
 * @param {string} [props.initialValue=''] - Initial markdown content
 * @param {string} [props.defaultMode='edit'] - Default mode ('edit' or 'read')
 * @param {string} [props.defaultView='rich'] - Default view ('rich' or 'raw')
 * @param {Function} [props.onChange] - Callback for content changes
 * @param {Function} [props.onSave] - Callback for save operations
 * @param {Function} [props.onModeChange] - Callback for mode changes
 * @param {Function} [props.onViewChange] - Callback for view changes
 * @param {Function} [props.onError] - Callback for error handling
 * @param {string} [props.theme='light'] - Theme ('light' or 'dark')
 * @param {string} [props.width='100%'] - Component width
 * @param {string} [props.placeholder='Start writing...'] - Placeholder text
 * @param {boolean} [props.readOnly=false] - Read-only mode
 * @param {boolean} [props.autoFocus=true] - Auto-focus on load
 * @param {boolean} [props.spellCheck=true] - Enable spell check
 * @param {number} [props.autoSaveInterval=5000] - Auto-save interval in ms
 * @param {boolean} [props.debug=false] - Enable debug logging
 * @param {string} [props.storageKey='semantic-composer-default'] - Storage key for localStorage persistence
 */
const SemanticComposer = forwardRef((props, ref) => {
  const {
    initialValue = '',
    defaultMode = 'edit',
    defaultView = 'rich',
    onChange,
    onSave,
    onModeChange,
    onViewChange,
    onError,
    theme = 'light',
    width = '100%',
    placeholder = 'Start writing...',
    readOnly = false,
    autoFocus = true,
    spellCheck = true,
    autoSaveInterval = 5000,
    debug = false,
    storageKey = 'semantic-composer-default',
  } = props;
  
  // Ensure initialValue is a string
  const safeInitialValue = typeof initialValue === 'string' ? initialValue : '';
  
  // Storage key for content (used for autosave and temporary persistence)
  const contentKey = `${storageKey}:content`;
  
  // Simple state setup - no complex initialization
  const [mode, setMode] = useState(defaultMode);
  const [view, setView] = useState(defaultView);
  const [content, setContent] = useState(safeInitialValue || '');
  const editorRef = useRef(null);
  const crepeRef = useRef(null);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    // Get current editor view state
    getCurrentView: () => view,
    
    // Get current editor mode
    getCurrentMode: () => mode,
    
    // Get crepe instance
    getCrepeInstance: () => crepeRef.current,
    
    // Get current content directly from editor instance
    getCurrentContent: () => {
      // Always get content directly from editor if possible
      if (crepeRef.current && view === 'rich') {
        try {
          return crepeRef.current.getMarkdown();
        } catch (error) {
          console.error('Error getting content from editor:', error);
          throw new Error(`Failed to get content from editor: ${error.message}`);
        }
      } else if (view === 'raw') {
        // In raw mode, the textarea state is accurate
        return content;
      }
      throw new Error('No valid editor instance available');
    },
    
    // CORE API: Set content - the primary method for consumers to update content
    setContent: (newContent) => {
      if (debug) console.log('setContent called with new content');
      
      // 1. Clean up any HTML artifacts 
      const cleanedContent = typeof newContent === 'string' ? 
        cleanupBrTags(newContent) : '';
      
      // 2. If in rich mode and editor exists, destroy it
      if (view === 'rich' && crepeRef.current) {
        try {
          // Destroy current instance
          crepeRef.current.destroy();
          crepeRef.current = null;
          
          // Clear container
          if (editorRef.current) {
            editorRef.current.innerHTML = '';
          }
        } catch (error) {
          console.error('Editor cleanup error:', error);
          if (onError) onError(new Error(`Editor cleanup error: ${error.message}`));
        }
      }
      
      // 3. Update the React state with new content
      setContent(cleanedContent);
      
      // 4. The editor will be reinitialized via useEffect with the new content
      // This ensures a clean lifecycle: destroy → update state → reinitialize
      
      return true; // Success
    },
    
    // Toggle view
    toggleEditorView: () => toggleView(),
    
    // Toggle mode
    toggleEditorMode: () => toggleMode(),
    
    // Legacy reset function - now just calls the set content implementation directly
    reset: (newContent) => {
      console.log('reset() called - using setContent implementation');
      
      // Same implementation as setContent to avoid circular reference
      // 1. Clean up any HTML artifacts 
      const cleanedContent = typeof newContent === 'string' ? 
        cleanupBrTags(newContent) : '';
      
      // 2. If in rich mode and editor exists, destroy it
      if (view === 'rich' && crepeRef.current) {
        try {
          // Destroy current instance
          crepeRef.current.destroy();
          crepeRef.current = null;
          
          // Clear container
          if (editorRef.current) {
            editorRef.current.innerHTML = '';
          }
        } catch (error) {
          console.error('Editor cleanup error:', error);
          if (onError) onError(new Error(`Editor cleanup error: ${error.message}`));
        }
      }
      
      // 3. Update the React state with new content
      setContent(cleanedContent);
      
      return true; // Success
    },
    
    // Get the current storage key being used
    getStorageKey: () => storageKey
  }));
  
  // Initialize Milkdown editor - editor is the source of truth for content
  useEffect(() => {
    // Only initialize in rich mode with DOM element & no existing instance
    if (editorRef.current && view === 'rich' && !crepeRef.current) {
      try {
        // Very important: Clear editor container first
        editorRef.current.innerHTML = '';
        
        if (debug) {
          console.log('Initializing editor with content:', 
                     safeInitialValue ? safeInitialValue.substring(0, 30) + '...' : 'empty');
        }
        
        // Only log in debug mode to reduce console noise
        if (debug) {
          console.log('INIT CONTENT:', safeInitialValue?.substring(0, 30));
        }
        
        // Create editor with current content from React state
        const crepe = new Crepe({
          root: editorRef.current,
          defaultValue: content || ''
        });
        
        // Create the editor
        crepe.create()
          .then(() => {
            // Store reference only after creation is complete
            crepeRef.current = crepe;
            
            // Set read-only state
            crepe.setReadonly(mode === 'read' || readOnly);
            
            // Simple event listener for content changes
            crepe.on((listener) => {
              listener.markdownUpdated((markdown) => {
                if (typeof markdown === 'string') {
                  // Update React state and notify parent
                  setContent(markdown);
                  if (onChange) onChange(markdown);
                }
              });
            });
            
            if (debug) {
              console.log('Editor initialized successfully');
            }
          })
          .catch(error => {
            console.error('Editor creation failed:', error);
            if (onError) onError(new Error(`Editor creation failed: ${error.message}`));
            crepeRef.current = null;
          });
      } catch (error) {
        console.error('Editor initialization failed:', error);
        if (onError) onError(new Error(`Editor initialization failed: ${error.message}`));
      }
    }
    
    return () => {
      // Clean up editor instance
      if (crepeRef.current) {
        try {
          crepeRef.current.destroy();
        } catch (error) {
          console.error('Editor cleanup error:', error);
        } finally {
          crepeRef.current = null;
        }
      }
      
      // If this is a component unmount (not just view change), clean up localStorage
      if (view === 'rich') {
        try {
          // Remove temporary localStorage when component is destroyed
          localStorage.removeItem(contentKey);
          if (debug) console.log(`Cleaned up localStorage key: ${contentKey}`);
        } catch (error) {
          console.error('Error cleaning localStorage on unmount:', error);
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, safeInitialValue, mode, readOnly, debug, onChange, onError]);
  
  // Update read-only state when mode changes
  useEffect(() => {
    if (crepeRef.current && view === 'rich') {
      crepeRef.current.setReadonly(mode === 'read' || readOnly);
      
      // Add specific class for styling
      const editorDOM = editorRef.current.querySelector('.milkdown');
      if (editorDOM) {
        if (mode === 'read') {
          editorDOM.classList.add('read-only');
        } else {
          editorDOM.classList.remove('read-only');
        }
      }
    }
  }, [mode, view, readOnly, editorRef]);
  
  // Toggle between edit and read modes
  const toggleMode = () => {
    const newMode = mode === 'edit' ? 'read' : 'edit';
    
    // If in raw mode and trying to switch to read mode,
    // we need to switch to rich mode first then set readonly
    if (view === 'raw' && newMode === 'read') {
      // First switch to rich view
      try {
        // Content is already in state, no need for local variable
        
        if (debug) {
          console.log('Switching from raw to read mode via rich view');
        }
        
        // First switch view to rich, which will trigger editor initialization
        setView('rich');
        
        // Then mark as read-only in the next render cycle 
        // (after editor is initialized)
        setTimeout(() => {
          setMode('read');
          
          // If editor has been created by now, set it to readonly
          if (crepeRef.current) {
            crepeRef.current.setReadonly(true);
          }
        }, 50);
        
        return; // Exit early to avoid setting mode directly
      } catch (error) {
        console.error('Error transitioning from raw to read:', error);
        if (onError) onError(new Error(`Error transitioning from raw to read: ${error.message}`));
      }
    }
    // Normal case - just toggle mode
    else {
      // For rich mode, ensure React state has latest content before toggling
      if (view === 'rich' && crepeRef.current) {
        try {
          // Update React state from editor content
          const currentContent = crepeRef.current.getMarkdown();
          
          if (typeof currentContent === 'string') {
            // Clean up <br> tags in table cells for read mode too
            const cleanedContent = cleanupBrTags(currentContent);
            setContent(cleanedContent);
            if (debug) {
              console.log('RICH TO READ - CLEANED CONTENT SAVED TO STATE:', cleanedContent);
            }
          }
        } catch (error) {
          console.error('Error getting content during mode toggle:', error);
        }
        
        // Now update mode and readonly state
        setMode(newMode);
        crepeRef.current.setReadonly(newMode === 'read' || readOnly);
      }
      // For other views, just update mode
      else {
        setMode(newMode);
      }
    }
    
    if (onModeChange) onModeChange(newMode);
  };
  
  // Utility function to clean <br /> tags from table cells and document end
  const cleanupBrTags = (markdown) => {
    if (!markdown) return markdown;
    
    // Split the markdown into lines for processing
    const lines = markdown.split('\n');
    const cleanedLines = lines.map(line => {
      // Only process table rows (lines starting with |)
      if (line.trim().startsWith('|')) {
        // Replace <br /> tags in table cells with empty string
        return line.replace(/<br\s*\/?>/g, '');
      }
      return line;
    });
    
    // Join lines back together
    let result = cleanedLines.join('\n');
    
    // Remove trailing <br /> at the end of the document
    result = result.replace(/\n<br\s*\/?>\s*$/, '\n');
    
    return result;
  };
  
  // Toggle between rich and raw editing modes (edit mode only)
  const toggleView = () => {
    if (mode !== 'edit') return;
    
    // Calculate new view
    const newView = view === 'rich' ? 'raw' : 'rich';
    
    // From rich to raw: Get content from the editor (source of truth)
    if (view === 'rich' && crepeRef.current) {
      try {
        // Get content from the editor before destroying it
        const editorContent = crepeRef.current.getMarkdown();
        
        // Save this content for the raw editor to use
        if (typeof editorContent === 'string') {
          // Clean up <br> tags in table cells before saving to React state
          const cleanedContent = cleanupBrTags(editorContent);
          
          // Save cleaned content to React state for raw editor
          setContent(cleanedContent);
          
          // Also save to localStorage
          try {
            localStorage.setItem(contentKey, cleanedContent);
            
            if (debug) {
              console.log(`Saved content to ${contentKey} for raw mode transition`);
            }
          } catch (error) {
            console.error('Error saving content during view toggle:', error);
          }
          
          if (debug) {
            console.log('Switching to raw mode with editor content:', 
                      editorContent.substring(0, 30) + '...');
          }
        }
        
        // Clean up editor
        crepeRef.current.destroy();
        crepeRef.current = null;
        
        // Clear container
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      } catch (error) {
        console.error('Error switching to raw view:', error);
        if (onError) onError(new Error(`Error switching to raw view: ${error.message}`));
      }
    }
    // From raw to rich: content in React state will be used to initialize editor
    else if (view === 'raw') {
      // When switching back to rich, content from React state will
      // be used to initialize the editor in the useEffect
      
      if (debug) {
        console.log('RAW TO RICH - CONTENT FROM STATE:');
        console.log(content);
        console.log('HAS <br> TAGS:', content.includes('<br'));
        console.log('POSITION OF <br>:', content.indexOf('<br'));
      }
      
      if (debug) {
        console.log('Switching to rich mode with content from state:', 
                  content ? content.substring(0, 30) + '...' : 'empty');
      }
    }
    
    // Set new view - this will trigger editor initialization via useEffect
    setView(newView);
    
    if (onViewChange) onViewChange(newView);
  };
  
  // Handle raw editor changes
  // In raw mode, the textarea becomes the temporary source of truth
  const handleRawChange = (e) => {
    const newContent = e.target.value;
    // Update React state with raw editor content
    setContent(newContent);
    if (onChange) onChange(newContent);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem(contentKey, newContent);
      
      if (debug) {
        console.log(`Raw editor change: saved to ${contentKey}`);
      }
    } catch (error) {
      console.error('Error saving raw editor content:', error);
    }
  };
  
  // Save handler - memoized to avoid dependency loops
  const handleSave = useCallback(() => {
    // Ensure content is a string before saving
    const contentToSave = typeof content === 'string' ? content : '';
    
    // Call onSave if provided
    if (onSave) onSave(contentToSave);
    
    // Store in localStorage
    try {
      localStorage.setItem(contentKey, contentToSave);
      
      if (debug) {
        console.log(`Saved content to ${contentKey}`, contentToSave.substring(0, 30) + '...');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      if (onError) onError(new Error(`Error saving content: ${error.message}`));
    }
  }, [content, onSave, contentKey, debug, onError]);
    
  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // React to external initialValue changes
  useEffect(() => {
    // Update content state
    setContent(safeInitialValue);
    
    // For rich mode, recreate editor with new content
    if (view === 'rich' && crepeRef.current) {
      try {
        // Destroy current editor
        crepeRef.current.destroy();
        crepeRef.current = null;
        
        // Clear container
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      } catch (error) {
        console.error('Error updating content:', error);
        if (onError) onError(new Error(`Error updating content: ${error.message}`));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);
  
  // Auto-save functionality (active by default)
  useEffect(() => {
    // Skip only if explicitly disabled (interval set to 0)
    if (autoSaveInterval === 0) return;
    
    const interval = setInterval(() => {
      try {
        // Get current content from the appropriate source of truth
        let currentContent;
        
        if (view === 'rich' && crepeRef.current) {
          // From rich editor
          currentContent = crepeRef.current.getMarkdown();
        } else if (view === 'raw') {
          // From raw editor state
          currentContent = content;
        } else {
          return; // No valid source
        }
        
        // Save to localStorage and notify parent via onSave if provided
        if (typeof currentContent === 'string') {
          localStorage.setItem(contentKey, currentContent);
          if (onSave) onSave(currentContent);
          if (debug) console.log(`Auto-saved content to ${contentKey}`);
        }
      } catch (error) {
        console.error('Error during auto-save:', error);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveInterval, debug, contentKey, view, content, onSave]);
  
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
  }, [handleSave]);
  
  return (
    <div className="semantic-composer" data-theme={theme} style={{ width }}>
      <div className="composer-toolbar">
        {/* Empty space on the left */}
        <div className="toolbar-spacer"></div>
        
        {/* Mode toggles & actions on the right */}
        <div className="toolbar-actions" style={{ marginLeft: 'auto' }}>
          <button className="toolbar-button icon-button" onClick={toggleMode} title={mode === 'edit' ? 'Switch to Read mode' : 'Switch to Edit mode'}>
            {mode === 'edit' ? <FiEye /> : <FiEdit />}
          </button>
          
          {mode === 'edit' && (
            <button className="toolbar-button icon-button" onClick={toggleView} title={view === 'rich' ? 'Switch to Raw markdown' : 'Switch to Rich editor'}>
              {view === 'rich' ? <FiCode /> : <FiType />}
            </button>
          )}
          
          <button className="toolbar-button icon-button" onClick={handleSave} title="Save content">
            <FiSave />
          </button>
          
          <button 
            className="toolbar-button icon-button" 
            onClick={() => {
              try {
                // Get current content from appropriate source
                let currentContent = '';
                if (view === 'rich' && crepeRef.current) {
                  currentContent = crepeRef.current.getMarkdown();
                  // Clean up <br> tags when exporting from rich mode
                  currentContent = cleanupBrTags(currentContent);
                } else if (view === 'raw') {
                  // Raw mode already has clean content
                  currentContent = content;
                } else {
                  // Read mode - use content from state but ensure it's clean
                  currentContent = cleanupBrTags(content);
                }
                
                // Create blob and download link
                const blob = new Blob([currentContent], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'document.md';
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }, 100);
              } catch (error) {
                console.error('Error exporting markdown:', error);
                if (onError) onError(new Error(`Error exporting markdown: ${error.message}`));
              }
            }} 
            title="Export markdown"
          >
            <FiDownload />
          </button>
          
          {/* Word count display */}
          <div className="toolbar-info">
            {typeof content === 'string' ? content.split(/\s+/).filter(Boolean).length : 0} words
          </div>
        </div>
      </div>
      
      <div className="editor-content">
        {view === 'rich' ? (
          // Single Milkdown instance for both edit and read modes
          <div 
            ref={editorRef} 
            className={`milkdown-editor-wrapper ${mode === 'read' ? 'read-only' : ''}`}
            style={{ minHeight: '200px' }} // Ensure enough space for editor to render
          />
        ) : mode === 'edit' ? (
          // Raw mode (only available in edit mode)
          <textarea
            className="raw-editor"
            value={typeof content === 'string' ? content : ''}
            onChange={handleRawChange}
            placeholder={placeholder}
            spellCheck={spellCheck}
            autoFocus={autoFocus}
            readOnly={readOnly}
            style={{ 
              minHeight: '200px',
              height: (typeof content === 'string' ? content.split('\n').length : 1) * 1.6 + 'em' 
            }}
          />
        ) : (
          // Fallback for read mode when view is raw (should never happen after our fix)
          <div className="raw-preview">{typeof content === 'string' ? content : ''}</div>
        )}
      </div>
    </div>
  );
});

export default SemanticComposer;