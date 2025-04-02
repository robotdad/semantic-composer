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
  
  // Initialize Milkdown editor - editor is the source of truth for content
  useEffect(() => {
    // Only initialize in rich mode with DOM element & no existing instance
    if (editorRef.current && view === 'rich' && !crepeRef.current) {
      try {
        // Very important: Clear editor container first
        editorRef.current.innerHTML = '';
        
        if (debug) {
          console.log('Initializing editor with initialValue, length:', 
                     safeInitialValue ? safeInitialValue.length : 0);
        }
        
        // Create editor with initial content from props
        const crepe = new Crepe({
          root: editorRef.current,
          defaultValue: safeInitialValue // Editor is source of truth, use prop directly
        });
        
        // Create the editor
        crepe.create()
          .then(() => {
            // Store reference only after creation is complete
            crepeRef.current = crepe;
            
            // Set read-only state
            crepe.setReadonly(mode === 'read' || readOnly);
            
            // EDITOR IS SOURCE OF TRUTH: Only update React state in response to editor changes
            crepe.on((listener) => {
              listener.markdownUpdated((markdown) => {
                if (typeof markdown === 'string') {
                  // Update React state to reflect editor state
                  setContent(markdown);
                  if (onChange) onChange(markdown);
                  
                  if (debug) {
                    console.log('Editor updated content, new length:', markdown.length);
                  }
                }
              });
            });
            
            // After initialization, get current content from editor
            // This ensures our React state matches editor state
            try {
              const currentMarkdown = crepe.getMarkdown();
              if (typeof currentMarkdown === 'string') {
                setContent(currentMarkdown);
                if (onChange) onChange(currentMarkdown);
              }
            } catch (error) {
              console.error('Could not get initial markdown from editor:', error);
            }
            
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
      // Cleanup on unmount or view change
      if (crepeRef.current) {
        try {
          crepeRef.current.destroy();
        } catch (error) {
          console.error('Editor cleanup error:', error);
        } finally {
          crepeRef.current = null;
        }
      }
    };
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
  }, [mode, view, readOnly]);
  
  // Toggle between edit and read modes
  const toggleMode = () => {
    const newMode = mode === 'edit' ? 'read' : 'edit';
    setMode(newMode);
    
    // For rich mode, set editor readonly state
    if (view === 'rich' && crepeRef.current) {
      crepeRef.current.setReadonly(newMode === 'read' || readOnly);
    }
    
    if (onModeChange) onModeChange(newMode);
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
        if (typeof editorContent === 'string' && editorContent !== '<br />') {
          // Save to React state for raw editor
          setContent(editorContent);
          // Also save to localStorage as backup
          localStorage.setItem('semantic-composer-raw-content', editorContent);
          
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
    
    // Also save to localStorage for persistence between mode switches
    localStorage.setItem('semantic-composer-raw-content', newContent);
  };
  
  // Save handler - memoized to avoid dependency loops
  const handleSave = useCallback(() => {
    // Ensure content is a string before saving
    const contentToSave = typeof content === 'string' ? content : '';
    
    // Call onSave if provided
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
      
      // For rich mode, recreate the editor with new content
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
          console.error('Error loading content:', error);
          if (onError) onError(new Error(`Error loading content: ${error.message}`));
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
  }, [initialValue]);
  
  // Auto-save to localStorage on an interval
  useEffect(() => {
    if (autoSaveInterval <= 0) return;
    
    const interval = setInterval(() => {
      if (typeof content === 'string') {
        localStorage.setItem('semantic-composer-content', content);
        if (debug) {
          console.log('Auto-saved content');
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
  }, [handleSave]);
  
  // Formatting handlers
  const insertMarkdownSyntax = (syntax, placeholder = '') => {
    if (mode !== 'edit') return;
    
    if (view === 'rich' && crepeRef.current) {
      // For rich editor, we need to append text then recreate
      try {
        const current = content || '';
        const newContent = current + '\n' + syntax + placeholder;
        
        // Update state
        setContent(newContent);
        if (onChange) onChange(newContent);
        
        // Recreate editor
        crepeRef.current.destroy();
        crepeRef.current = null;
        
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      } catch (error) {
        console.error('Error inserting markdown:', error);
        if (onError) onError(new Error(`Error inserting markdown: ${error.message}`));
      }
    } else if (view === 'raw') {
      // For raw editor, just update state
      const newContent = (content || '') + '\n' + syntax + placeholder;
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