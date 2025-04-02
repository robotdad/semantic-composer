import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import './SemanticComposer.css';

/**
 * Semantic Composer - A markdown editor component
 * 
 * Implementation Notes:
 * --------------------
 * 1. Uses a single Milkdown/Crepe instance for both Edit and Read modes
 *    - This ensures consistent styling between modes
 *    - Uses setReadonly() to toggle editability rather than creating separate instances
 * 
 * 2. Raw markdown editing mode uses a separate textarea
 *    - Milkdown/Crepe doesn't provide a built-in raw markdown editing mode
 *    - We sync content between the Crepe instance and the textarea when toggling
 * 
 * 3. Styling consistency is maintained by:
 *    - Using the same renderer for edit and read modes
 *    - Targeting Milkdown's internal elements with specific CSS selectors
 *    - Setting !important on crucial typography styles
 */
/**
 * Semantic Composer - A markdown editor component
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
  } = props;
  
  // Ensure initialValue is a string
  const safeInitialValue = typeof initialValue === 'string' ? initialValue : '';
  
  const [mode, setMode] = useState(defaultMode);
  const [view, setView] = useState(defaultView);
  const [content, setContent] = useState(safeInitialValue);
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
    
    // Get current content
    getCurrentContent: () => content,
    
    // Toggle view
    toggleEditorView: () => toggleView(),
    
    // Toggle mode
    toggleEditorMode: () => toggleMode()
  }));
  
  // Initialize Milkdown editor - single instance for both edit and read modes
  useEffect(() => {
    // Only try to initialize if we have DOM element, are in rich mode, and don't have an instance yet
    if (editorRef.current && view === 'rich' && !crepeRef.current) {
      try {
        // First check for content in localStorage
        const localContent = localStorage.getItem('semantic-composer-content');
        
        // Check content sources in priority order
        let contentToUse = '';
        
        if (localContent && localContent !== '<br />' && localContent !== '<br>') {
          contentToUse = localContent;
          if (debug) console.log('Using content from localStorage for initialization');
        } else if (initialValue) {
          contentToUse = initialValue;
          if (debug) console.log('Using initialValue prop for initialization');
        } else if (content) {
          contentToUse = content;
          if (debug) console.log('Using component state for initialization');
        }
        
        // Log what we're initializing with
        if (debug) {
          console.log('Initializing editor with content:', 
                     contentToUse ? contentToUse.substring(0, 30) + '...' : 'empty');
        }
        
        // Basic initialization pattern, straight from Milkdown docs
        const crepe = new Crepe({
          root: editorRef.current,
          defaultValue: contentToUse
        });
        
        // Create editor using promise approach (not async/await)
        crepe.create()
          .then(() => {
            crepeRef.current = crepe;
            
            // Set initial read-only state
            crepe.setReadonly(mode === 'read' || readOnly);
            
            // Use event listeners for changes
            crepe.on((listener) => {
              listener.markdownUpdated((markdown) => {
                if (typeof markdown === 'string' && markdown !== content) {
                  setContent(markdown);
                  if (onChange) onChange(markdown);
                }
              });
            });
            
            // Save to state to keep in sync
            if (contentToUse && contentToUse !== content) {
              setContent(contentToUse);
              if (onChange) onChange(contentToUse);
            }
          })
          .catch(error => {
            console.error('Editor creation failed:', error);
            if (onError) onError(new Error(`Editor creation error: ${error.message}`));
          });
      } catch (error) {
        console.error('Editor initialization error:', error);
        if (onError) onError(new Error(`Editor initialization error: ${error.message}`));
      }
    }
    
    // Cleanup function
    return () => {
      if (crepeRef.current) {
        try {
          crepeRef.current.destroy();
        } catch (error) {
          console.error('Editor cleanup error:', error);
        }
        crepeRef.current = null;
      }
    };
  }, [view, readOnly, mode, initialValue, onChange, content, debug, onError]);
  
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
  }, [mode, view, readOnly]);
  
  // Toggle between edit and read modes
  const toggleMode = () => {
    // If in rich mode, sync content before toggling
    if (view === 'rich' && crepeRef.current) {
      try {
        const markdown = crepeRef.current.getMarkdown();
        if (typeof markdown === 'string') {
          setContent(markdown);
          if (onChange) onChange(markdown);
        }
      } catch (error) {
        const toggleError = new Error(`Failed to get markdown when toggling mode: ${error.message}`);
        toggleError.originalError = error;
        if (onError) onError(toggleError);
      }
    }
    
    // Toggle mode
    const newMode = mode === 'edit' ? 'read' : 'edit';
    setMode(newMode);
    
    // For rich mode, set editor readonly state
    if (view === 'rich' && crepeRef.current) {
      crepeRef.current.setReadonly(newMode === 'read');
    }
    
    if (onModeChange) onModeChange(newMode);
  };
  
  // Toggle between rich and raw editing modes (edit mode only)
  const toggleView = () => {
    if (mode !== 'edit') return;
    
    // If switching from rich to raw, get the latest markdown content
    if (view === 'rich' && crepeRef.current) {
      try {
        // Save current content to localStorage before switching
        // This ensures we have a good copy if getMarkdown() returns <br /> tags
        localStorage.setItem('semantic-composer-temp', content);
        
        // Log state before getting markdown if in debug mode
        if (debug) {
          console.group('Editor state before getMarkdown()');
          console.log('Current React state content:', content);
          console.log('Current localStorage content:', localStorage.getItem('semantic-composer-temp'));
          console.groupEnd();
        }
        
        const markdown = crepeRef.current.getMarkdown();
        
        // Enhanced diagnostic logging
        if (debug) {
          console.group('getMarkdown() output');
          console.log('Raw output:', markdown);
          console.log('Output type:', typeof markdown);
          console.log('Length:', markdown ? markdown.length : 0);
          console.log('Contains <br>:', markdown && (markdown.includes('<br>') || markdown.includes('<br />')));
          console.log('Character codes:', [...(markdown || '')].map(c => c.charCodeAt(0)));
          console.groupEnd();
        }
        
        // Check if we got valid markdown, or just a <br /> tag
        if (markdown && markdown !== '<br />' && markdown !== '<br>') {
          setContent(markdown);
          if (onChange) onChange(markdown);
          // Update the localStorage with good content
          localStorage.setItem('semantic-composer-temp', markdown);
          
          if (debug) {
            console.log('Using markdown from getMarkdown()');
          }
        } else if (markdown === '<br />' || markdown === '<br>') {
          // Convert <br> tags to empty string explicitly
          const emptyContent = '';
          setContent(emptyContent);
          if (onChange) onChange(emptyContent);
          localStorage.setItem('semantic-composer-temp', emptyContent);
          
          if (debug) {
            console.warn('getMarkdown() returned <br /> tag, converting to empty string');
          }
        } else {
          // For any other invalid/empty content, use our React state
          // which should already be in sync with the editor
          if (debug) {
            console.warn('getMarkdown() returned invalid content, using React state instead');
          }
        }
      } catch (error) {
        const toggleError = new Error(`Failed to get markdown when toggling to raw mode: ${error.message}`);
        toggleError.originalError = error;
        if (onError) onError(toggleError);
      }
    }
    
    // Toggle view mode
    const newView = view === 'rich' ? 'raw' : 'rich';
    setView(newView);
    
    // When toggling back to rich mode, we need to restore content and re-initialize
    if (newView === 'rich') {
      try {
        // Prioritize content sources in this order:
        // 1. Current React state (if valid)
        // 2. localStorage temp content (if valid)
        // 3. initialValue prop (fallback)
        
        let contentToUse = content;
        
        // Only check localStorage if current content is empty or invalid
        if (!contentToUse || contentToUse === '<br />' || contentToUse === '<br>') {
          const savedContent = localStorage.getItem('semantic-composer-temp');
          
          if (savedContent && savedContent !== '<br />' && savedContent !== '<br>') {
            contentToUse = savedContent;
            
            if (debug) {
              console.log('Using saved content from localStorage');
            }
          } else if (initialValue) {
            contentToUse = initialValue;
            
            if (debug) {
              console.log('Falling back to initialValue prop');
            }
          }
        }
        
        // Always update state with best content
        setContent(contentToUse);
        if (onChange) onChange(contentToUse);
        
        if (debug) {
          console.group('Content for Rich Mode');
          console.log('Content source:', content === contentToUse ? 'React state' : 
                                      contentToUse === initialValue ? 'initialValue prop' : 'localStorage');
          console.log('Content length:', contentToUse ? contentToUse.length : 0);
          console.log('Preview:', contentToUse ? contentToUse.substring(0, 30) + '...' : 'empty');
          console.groupEnd();
        }
        
        // Always destroy and recreate for clean initialization
        if (crepeRef.current) {
          crepeRef.current.destroy();
          crepeRef.current = null;
        }
      } catch (error) {
        const richModeError = new Error(`Failed to toggle to rich mode: ${error.message}`);
        richModeError.originalError = error;
        if (onError) onError(richModeError);
      }
    }
    
    if (onViewChange) onViewChange(newView);
  };
  
  // Handle raw editor changes
  const handleRawChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) onChange(newContent);
  };
  
  // Save handler - memoized to avoid dependency loops
  const handleSave = useCallback(() => {
    // Ensure content is a string before saving
    const contentToSave = typeof content === 'string' ? content : '';
    
    // Just use the current content state that's being kept in sync
    // with the editor through onChange
    if (onSave) onSave(contentToSave);
    
    // Store in localStorage
    localStorage.setItem('semantic-composer-content', contentToSave);
  }, [content, onSave]);
  
  // Load from localStorage if available
  const handleLoad = () => {
    const savedContent = localStorage.getItem('semantic-composer-content');
    if (savedContent) {
      // Update state
      setContent(savedContent);
      if (onChange) onChange(savedContent);
      
      // For rich mode, we need to recreate the editor with the new content
      if (view === 'rich' && crepeRef.current) {
        try {
          // Destroy the current editor instance
          crepeRef.current.destroy();
          crepeRef.current = null;
          
          // The editor will be reinitialized with the new content
          // when React detects that crepeRef.current is null in the useEffect
        } catch (error) {
          const loadError = new Error(`Failed to load content from localStorage: ${error.message}`);
          loadError.originalError = error;
          if (onError) onError(loadError);
        }
      }
    }
  };
  
  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // React to external initialValue changes
  useEffect(() => {
    // Ensure we have a string
    const safeValue = typeof initialValue === 'string' ? initialValue : '';
    setContent(safeValue);
    
    // For rich mode, we need to recreate the editor with the new content
    if (view === 'rich' && crepeRef.current) {
      try {
        // Destroy the current editor instance
        crepeRef.current.destroy();
        crepeRef.current = null;
        
        // The editor will be reinitialized with the new content
        // when React detects that crepeRef.current is null in the useEffect
      } catch (error) {
        const valueChangeError = new Error(`Failed to update editor with new initialValue: ${error.message}`);
        valueChangeError.originalError = error;
        if (onError) onError(valueChangeError);
      }
    }
  }, [initialValue, view]);
  
  // Auto-save to localStorage on an interval
  useEffect(() => {
    // Only set up auto-saving when enabled
    if (autoSaveInterval <= 0) return;
    
    const interval = setInterval(() => {
      // Save only if content has changed (and it's a valid string)
      if (typeof content === 'string') {
        localStorage.setItem('semantic-composer-content', content);
        
        if (debug) {
          console.log('Auto-saved content to localStorage');
        }
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [content, autoSaveInterval, debug]);
  
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
  }, [content, handleSave]);
  
  // Formatting handlers
  const insertMarkdownSyntax = (syntax, placeholder = '') => {
    if (mode !== 'edit') return;
    
    if (view === 'rich' && crepeRef.current) {
      // For rich editor, we can only try to insert markdown and hope it works
      try {
        const current = crepeRef.current.getMarkdown();
        const newContent = current + '\n' + syntax + placeholder;
        
        // Since there's no setMarkdown API, we need to destroy and recreate
        crepeRef.current.destroy();
        crepeRef.current = null;
        
        // Update the content state so it's used when recreating
        setContent(newContent);
        if (onChange) onChange(newContent);
      } catch (error) {
        const insertError = new Error(`Failed to insert markdown syntax: ${error.message}`);
        insertError.originalError = error;
        if (onError) onError(insertError);
      }
    } else if (view === 'raw') {
      // For raw editor, just update the state
      const newContent = content + '\n' + syntax + placeholder;
      setContent(newContent);
      if (onChange) onChange(newContent);
    }
  };
  
  // Specific formatting functions
  const insertHeading = (level) => {
    const prefix = '#'.repeat(level) + ' ';
    insertMarkdownSyntax(prefix, 'Heading');
  };
  
  const insertBold = () => insertMarkdownSyntax('**', 'bold text**');
  const insertItalic = () => insertMarkdownSyntax('*', 'italic text*');
  const insertCode = () => insertMarkdownSyntax('`', 'code`');
  const insertLink = () => insertMarkdownSyntax('[', 'link text](https://example.com)');
  const insertImage = () => insertMarkdownSyntax('![', 'alt text](https://example.com/image.jpg)');
  const insertBulletList = () => insertMarkdownSyntax('- ', 'List item');
  const insertNumberedList = () => insertMarkdownSyntax('1. ', 'List item');
  const insertTable = () => insertMarkdownSyntax('| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |');
  const insertCodeBlock = () => insertMarkdownSyntax('```\n', 'console.log("Hello World");\n```');
  
  return (
    <div className="semantic-composer" data-theme={theme} style={{ width }}>
      <div className="composer-toolbar">
        {/* Left side - Formatting buttons (only in edit mode) */}
        {mode === 'edit' && (
          <div className="toolbar-formatting">
            <button className="format-button" onClick={() => insertHeading(1)} title="Heading 1">H1</button>
            <button className="format-button" onClick={() => insertHeading(2)} title="Heading 2">H2</button>
            <button className="format-button" onClick={() => insertHeading(3)} title="Heading 3">H3</button>
            <span className="toolbar-divider"></span>
            <button className="format-button" onClick={insertBold} title="Bold">B</button>
            <button className="format-button" onClick={insertItalic} title="Italic">I</button>
            <button className="format-button" onClick={insertCode} title="Inline Code">C</button>
            <span className="toolbar-divider"></span>
            <button className="format-button" onClick={insertBulletList} title="Bullet List">•</button>
            <button className="format-button" onClick={insertNumberedList} title="Numbered List">1.</button>
            <span className="toolbar-divider"></span>
            <button className="format-button" onClick={insertLink} title="Link">🔗</button>
            <button className="format-button" onClick={insertImage} title="Image">🖼️</button>
            <button className="format-button" onClick={insertTable} title="Table">📊</button>
            <button className="format-button" onClick={insertCodeBlock} title="Code Block">{ }{ }</button>
          </div>
        )}
        
        {/* Spacer */}
        <div className="toolbar-spacer"></div>
        
        {/* Right side - Mode toggles & actions */}
        <div className="toolbar-actions">
          <button className="toolbar-button" onClick={toggleMode}>
            {mode === 'edit' ? 'Read' : 'Edit'}
          </button>
          
          {mode === 'edit' && (
            <button className="toolbar-button" onClick={toggleView}>
              {view === 'rich' ? 'Raw' : 'Rich'}
            </button>
          )}
          
          <button className="toolbar-button" onClick={handleLoad} title="Load from localStorage">
            Load
          </button>
          
          <button className="toolbar-button" onClick={handleSave} title="Save to localStorage">
            Save
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
          <div ref={editorRef} className={`milkdown-editor-wrapper ${mode === 'read' ? 'read-only' : ''}`} />
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
            style={{ height: (typeof content === 'string' ? content.split('\n').length : 1) * 1.6 + 'em' }} // Auto-grow based on content
          />
        ) : (
          // Fallback for read mode when view is raw (should never happen in normal usage)
          <div className="raw-preview">{typeof content === 'string' ? content : ''}</div>
        )}
      </div>
    </div>
  );
});

export default SemanticComposer;