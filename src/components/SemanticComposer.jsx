import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Crepe } from '@milkdown/crepe';
import { FiEdit, FiEye, FiType, FiCode, FiSave, FiDownload } from 'react-icons/fi';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import './SemanticComposer.css';


/**
 * Semantic Composer - A markdown editor component with rich/raw editing modes
 * 
 * IMPORTANT:
 * This component uses React's forwardRef and useImperativeHandle to expose its API.
 * Always call methods directly without checking method existence or using Object.keys:
 * 
 * - ref.setContent(content, documentId)
 * - ref.loadDocument(content, documentId)
 * - ref.getCurrentContent()
 * - ref.getDocumentId()
 * - ref.reset(options)
 * 
 * @param {Object} props - Component props
 * @param {string} [props.initialValue=''] - Initial markdown content
 * @param {string} [props.initialDocumentId='default'] - Initial document ID for persistence
 * @param {string} [props.defaultMode='edit'] - Default mode ('edit' or 'read')
 * @param {string} [props.defaultView='rich'] - Default view ('rich' or 'raw')
 * @param {Function} [props.onChange] - Callback for content changes
 * @param {Function} [props.onSave] - Callback for save operations with signature (content, documentId)
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
 * @param {string} [props.storageKeyPrefix='editor'] - Prefix for localStorage keys
 */
const SemanticComposer = forwardRef((props, ref) => {
  const {
    initialValue = '',
    initialDocumentId = 'default',
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
    storageKeyPrefix = 'editor',
  } = props;
  
  // Make a consistent storage key format
  const makeStorageKey = (docId) => `${storageKeyPrefix}:${docId}`;
  
  // Get the document ID from localStorage or props
  const savedDocId = localStorage.getItem(`${storageKeyPrefix}:current-document-id`);
  const startingDocId = savedDocId || initialDocumentId;
  
  // Determine the initial content to use
  let startingContent = '';
  if (startingDocId) {
    // Try to load the document's content if available
    const docContent = localStorage.getItem(makeStorageKey(startingDocId));
    if (docContent) {
      startingContent = docContent;
      if (debug) {
        console.log(`RESTORED DOCUMENT: ${startingDocId} (length: ${docContent.length})`);
      }
    }
  }
  
  // Fallback to the provided initialValue if no document content
  if (!startingContent) {
    startingContent = typeof initialValue === 'string' ? initialValue : '';
  }
  
  // Simple state setup with correct initial content
  const [mode, setMode] = useState(defaultMode);
  const [view, setView] = useState(defaultView);
  const [content, setContent] = useState(startingContent);
  const [documentId, setDocumentId] = useState(startingDocId);
  const editorRef = useRef(null);
  const crepeRef = useRef(null);
  
  // Content key derived from document ID
  const contentKeyRef = useRef(makeStorageKey(startingDocId));
  
  // Log the documentId for debugging
  useEffect(() => {
    if (debug) {
      console.log(`COMPONENT RENDER: documentId=${documentId}`);
    }
  }, [documentId, debug]);
  
  // Update content key when document ID changes (and ONLY then)
  useEffect(() => {
    contentKeyRef.current = makeStorageKey(documentId);
    
    if (debug) {
      console.log(`DOCUMENT ID CHANGED: ${documentId}`);
      console.log(`STORAGE KEY SET TO: ${contentKeyRef.current}`);
    }
    
    // Persist the current document ID
    localStorage.setItem(`${storageKeyPrefix}:current-document-id`, documentId);
  }, [documentId, debug, storageKeyPrefix]);
  
  // Expose methods to parent component via ref
  // IMPORTANT: This creates getters/setters that don't show up in typical property enumeration
  useImperativeHandle(ref, () => ({
    // Get current editor view state
    getCurrentView: () => view,
    
    // Get current editor mode
    getCurrentMode: () => mode,
    
    // Get crepe instance
    getCrepeInstance: () => crepeRef.current,
    
    // Get current document ID
    getDocumentId: () => documentId,
    
    // Get current content directly from editor instance with document ID
    getCurrentContent: () => {
      let currentContent;
      
      // Get content from the correct source
      if (crepeRef.current && view === 'rich') {
        try {
          currentContent = crepeRef.current.getMarkdown();
        } catch (error) {
          if (debug) console.error('Error getting content from editor:', error);
          currentContent = content;
        }
      } else {
        currentContent = content;
      }
      
      // Return an object with both content and document ID
      return {
        content: currentContent,
        documentId: documentId
      };
    },
    
    // ENHANCED API: Set content with optional document ID
    setContent: (newContent, newDocumentId = null) => {
      if (debug) console.log(`setContent called with${newDocumentId ? ' new document: ' + newDocumentId : ' content update'}`);
      
      try {
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
            if (debug) console.error('Editor cleanup error:', error);
            if (onError) onError(new Error(`Editor cleanup error: ${error.message}`));
          }
        }
        
        // 3. Handle document ID change if provided
        if (newDocumentId) {
          // Set new document ID
          setDocumentId(newDocumentId);
          
          // Update the storage key (through the useEffect)
          contentKeyRef.current = makeStorageKey(newDocumentId);
          
          // Save the document ID to localStorage
          localStorage.setItem(`${storageKeyPrefix}:current-document-id`, newDocumentId);
          
          if (debug) {
            console.log(`DOCUMENT ID UPDATED: ${newDocumentId}`);
            console.log(`NEW STORAGE KEY: ${contentKeyRef.current}`);
          }
        }
        
        // 4. Update content state
        setContent(cleanedContent);
        
        // 5. Save to localStorage with current key (which may have been updated)
        const storageKey = contentKeyRef.current;
        localStorage.setItem(storageKey, cleanedContent);
        
        if (debug) {
          console.log(`CONTENT SAVED TO: ${storageKey}`);
        }
        
        // 6. The editor will be reinitialized via useEffect with the new content
        
        return true;
      } catch (error) {
        if (debug) console.error('Content update failed:', error);
        if (onError) onError(new Error(`Content update failed: ${error.message}`));
        return false;
      }
    },
    
    // Load document - simplified API that calls setContent with document ID
    loadDocument: (newContent, docId) => {
      if (!docId) {
        if (debug) console.error('loadDocument called without document ID');
        return false;
      }
      
      if (debug) console.log(`LOAD DOCUMENT: ${docId}`);
      
      // Directly call our enhanced setContent implementation
      try {
        // Clean up any HTML artifacts 
        const cleanedContent = typeof newContent === 'string' ? 
          cleanupBrTags(newContent) : '';
        
        // Update document ID and content
        setDocumentId(docId);
        contentKeyRef.current = makeStorageKey(docId);
        setContent(cleanedContent);
        
        // Save to localStorage
        localStorage.setItem(makeStorageKey(docId), cleanedContent);
        localStorage.setItem(`${storageKeyPrefix}:current-document-id`, docId);
        
        if (debug) {
          console.log(`DOCUMENT LOADED: ${docId}`);
          console.log(`STORAGE KEY: ${makeStorageKey(docId)}`);
        }
        
        return true;
      } catch (error) {
        if (debug) console.error('Document load failed:', error);
        if (onError) onError(new Error(`Document load failed: ${error.message}`));
        return false;
      }
    },
    
    // ENHANCED RESET API: Reset editor state with document ID support
    reset: (options = {}) => {
      const {
        clearContent = true,         // Clear editor content
        clearCurrentStorage = true,  // Clear current document storage
        clearAllStorage = false,     // Clear all editor-related storage
        resetToDefaultDocument = false // Reset document ID to default
      } = options;
      
      try {
        // 1. Clean up editor instance first to prevent state issues
        if (crepeRef.current) {
          try {
            crepeRef.current.destroy();
            crepeRef.current = null;
            
            if (editorRef.current) {
              editorRef.current.innerHTML = '';
            }
          } catch (error) {
            if (debug) console.error('Error destroying editor instance:', error);
          }
        }
        
        // 2. Clear all editor storage if requested
        if (clearAllStorage) {
          // Find all keys with storageKeyPrefix
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${storageKeyPrefix}:`)) {
              keysToRemove.push(key);
            }
          }
          
          // Remove all found keys
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          if (debug) console.log(`Cleared ${keysToRemove.length} editor storage keys`);
        }
        // Otherwise just clear current document's storage
        else if (clearCurrentStorage) {
          localStorage.removeItem(contentKeyRef.current);
          if (debug) console.log(`Cleared storage for ${contentKeyRef.current}`);
        }
        
        // 3. Reset document ID if requested
        if (resetToDefaultDocument) {
          // Update storage key reference first
          contentKeyRef.current = makeStorageKey('default');
          
          // Then set document ID (triggers the useEffect)
          setDocumentId('default');
          
          // Update localStorage
          localStorage.setItem(`${storageKeyPrefix}:current-document-id`, 'default');
          
          if (debug) {
            console.log('Reset to default document');
            console.log(`New storage key: ${contentKeyRef.current}`);
          }
        }
        
        // 4. Clear content if requested
        if (clearContent) {
          // Set empty content
          setContent('');
          
          // Also clear localStorage for current document
          localStorage.removeItem(contentKeyRef.current);
        }
        
        // 5. Return success
        return true;
      } catch (error) {
        if (debug) console.error('Error resetting editor:', error);
        if (onError) onError(new Error(`Error resetting editor: ${error.message}`));
        return false;
      }
    },
    
    // Toggle view
    toggleEditorView: () => toggleView(),
    
    // Toggle mode
    toggleEditorMode: () => toggleMode(),
    
    // Get the current storage key being used
    getStorageKey: () => contentKeyRef.current
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
            content ? content.substring(0, 30) + '...' : 'empty');
        }
        
        // Only log in debug mode to reduce console noise
        if (debug) {
          console.log('EDITOR INIT - ContentKeyRef:', contentKeyRef.current);
          console.log('EDITOR INIT - Content available:', !!content);
          console.log('EDITOR INIT - Content length:', content?.length || 0);
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
            if (debug) console.error('Editor creation failed:', error);
            if (onError) onError(new Error(`Editor creation failed: ${error.message}`));
            crepeRef.current = null;
          });
      } catch (error) {
        if (debug) console.error('Editor initialization failed:', error);
        if (onError) onError(new Error(`Editor initialization failed: ${error.message}`));
      }
    }
    
    return () => {
      // Clean up editor instance
      if (crepeRef.current) {
        try {
          crepeRef.current.destroy();
        } catch (error) {
          if (debug) console.error('Editor cleanup error:', error);
        } finally {
          crepeRef.current = null;
        }
      }
      
      // NOTE: We don't automatically remove localStorage on unmount because
      // this is persistence across sessions. Clients should call reset() to clear storage.
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, startingContent, mode, readOnly, debug, onChange, onError]);
  
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
        if (debug) console.error('Error transitioning from raw to read:', error);
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
              console.log('RICH TO READ - Content cleaned and saved to state');
            }
          }
        } catch (error) {
          if (debug) console.error('Error getting content during mode toggle:', error);
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
            localStorage.setItem(contentKeyRef.current, cleanedContent);
            
            if (debug) {
              console.log(`Saved content to ${contentKeyRef.current} for raw mode transition`);
            }
          } catch (error) {
            if (debug) console.error('Error saving content during view toggle:', error);
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
        if (debug) console.error('Error switching to raw view:', error);
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
    
    // Save to localStorage for persistence
    try {
      // Get storage key from document ID
      const storageKey = makeStorageKey(documentId);
      localStorage.setItem(storageKey, newContent);
      
      if (debug) {
        console.log(`RAW EDITOR SAVE TO: ${storageKey}`);
      }
    } catch (error) {
      if (debug) console.error('Error saving raw editor content:', error);
    }
  };
  
  // Save handler - memoized to avoid dependency loops
  const handleSave = useCallback(() => {
    // Get content from appropriate source
    let contentToSave;
    
    if (view === 'rich' && crepeRef.current) {
      try {
        contentToSave = crepeRef.current.getMarkdown();
      } catch (error) {
        if (debug) console.error('Error getting content for save:', error);
        contentToSave = content;
      }
    } else {
      contentToSave = content;
    }
    
    // Ensure content is a string before saving
    contentToSave = typeof contentToSave === 'string' ? contentToSave : '';
    
    // Get key from document ID using the utility function
    const storageKey = makeStorageKey(documentId);
    
    if (debug) {
      console.log(`MANUAL SAVE TO: ${storageKey}`);
    }
    
    // Store in localStorage using current key
    try {
      localStorage.setItem(storageKey, contentToSave);
    } catch (error) {
      if (debug) console.error('Error saving content:', error);
      if (onError) onError(new Error(`Error saving content: ${error.message}`));
    }
    
    // Call onSave if provided (AFTER saving locally) - include document ID
    if (onSave) onSave(contentToSave, documentId);
  }, [content, onSave, debug, onError, documentId, storageKeyPrefix, view]);
    
  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // React to external initialValue changes
  useEffect(() => {
    // Process the new initial value
    const newContent = typeof initialValue === 'string' ? initialValue : '';
    
    if (debug) {
      console.log('InitialValue changed, updating content:', 
        newContent ? newContent.substring(0, 30) + '...' : 'empty');
    }
    
    // Update content state
    setContent(newContent);
    
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
        if (debug) console.error('Error updating content:', error);
        if (onError) onError(new Error(`Error updating content: ${error.message}`));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);
  
  // Auto-save functionality (active by default)
  useEffect(() => {
    // Skip if disabled (interval set to 0)
    if (autoSaveInterval === 0) return;
    
    const interval = setInterval(() => {
      // Skip auto-save if component is being unmounted
      if (!contentKeyRef.current) return;
      
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
          // Always use the current documentId from component state
          const storageKey = makeStorageKey(documentId);
          
          if (debug) {
            console.log(`AUTO-SAVE TO: ${storageKey} (docId: ${documentId})`);
          }
          
          // Save to localStorage
          localStorage.setItem(storageKey, currentContent);
          
          // Notify parent with both content and document ID
          if (onSave) onSave(currentContent, documentId);
        }
      } catch (error) {
        if (debug) console.error('Auto-save error:', error);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveInterval, debug, view, content, onSave, documentId, storageKeyPrefix]);
  
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
                if (debug) console.error('Error exporting markdown:', error);
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
        ) : null /* Raw read mode is prevented in toggleMode */}
      </div>
    </div>
  );
});

export default SemanticComposer;