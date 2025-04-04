import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { 
  Button, 
  Tooltip, 
  FluentProvider,
  mergeClasses
} from '@fluentui/react-components';
import {
  Edit24Regular,
  Eye24Regular,
  TextFont24Regular,
  Code24Regular,
  Save24Regular, 
  ArrowDownload24Regular
} from '@fluentui/react-icons';
import './SemanticComposer.css';
import { useStyles } from './SemanticComposer.styles';
import { 
  SemanticComposerProps, 
  SemanticComposerRef, 
  EditorView, 
  EditorMode,
  EditorSize,
  EditorAppearance 
} from '../types';
import MilkdownEditor from './MilkdownEditor';

const SemanticComposer = forwardRef<SemanticComposerRef, SemanticComposerProps>((props, ref) => {
  const {
    // Core functionality
    initialValue = '',
    initialDocumentId = 'default',
    defaultMode = 'edit',
    defaultView = 'rich',
    
    // Event handlers
    onChange,
    onSave,
    onModeChange,
    onViewChange,
    onError,
    
    // Visual customization
    width = '100%',
    appearance = 'outline',
    size = 'medium',
    
    // Behavior customization
    placeholder = 'Start writing...',
    readOnly = false,
    autoFocus = true,
    spellCheck = true,
    autoSaveInterval = 5000,
    
    // Advanced options
    debug = false,
    storageKeyPrefix = 'editor',
    
    // Fluent UI integration
    useFluentProvider = true,
    fluentProviderProps = {},
  } = props;
  
  // Initialize Fluent styles
  const styles = useStyles();
  
  // Make a consistent storage key format
  const makeStorageKey = (docId: string): string => `${storageKeyPrefix}:${docId}`;
  
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
  const [mode, setMode] = useState<EditorMode>(defaultMode);
  const [view, setView] = useState<EditorView>(defaultView);
  const [content, setContent] = useState<string>(startingContent);
  const [documentId, setDocumentId] = useState<string>(startingDocId);
  const editorRef = useRef<HTMLDivElement>(null);
  const milkdownRef = useRef<any>(null);
  
  // Content key derived from document ID
  const contentKeyRef = useRef<string>(makeStorageKey(startingDocId));
  
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
  useImperativeHandle(ref, () => ({
    // Get current editor view state
    getCurrentView: () => view,
    
    // Get current editor mode
    getCurrentMode: () => mode,
    
    // Get editor instance
    getEditorInstance: () => milkdownRef.current,
    
    // Legacy API for backward compatibility
    getCrepeInstance: () => milkdownRef.current,
    
    // Get current document ID
    getDocumentId: () => documentId,
    
    // Get current content directly from editor instance with document ID
    getCurrentContent: () => {
      let currentContent: string;
      
      // Get content from the correct source
      if (milkdownRef.current && view === 'rich') {
        try {
          currentContent = milkdownRef.current.getMarkdown();
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
    setContent: (newContent: string, newDocumentId: string | null = null) => {
      if (debug) console.log(`setContent called with${newDocumentId ? ' new document: ' + newDocumentId : ' content update'}`);
      
      try {
        // 1. Clean up any HTML artifacts - temporarily disabled to debug content flow
        const cleanedContent = typeof newContent === 'string' ? 
          /* cleanupBrTags(newContent) */ newContent : '';
        
        // 2. Handle document ID change if provided
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
        
        // 3. Update content state
        setContent(cleanedContent);
        
        // 4. If in rich mode, update the editor content
        if (view === 'rich' && milkdownRef.current) {
          try {
            milkdownRef.current.setContent(cleanedContent);
          } catch (error) {
            if (debug) console.error('Error updating editor content:', error);
          }
        }
        
        // 5. Save to localStorage with current key
        const storageKey = contentKeyRef.current;
        localStorage.setItem(storageKey, cleanedContent);
        
        if (debug) {
          console.log(`CONTENT SAVED TO: ${storageKey}`);
        }
        
        return true;
      } catch (error) {
        if (debug) console.error('Content update failed:', error);
        if (onError) onError(new Error(`Content update failed: ${(error as Error).message}`));
        return false;
      }
    },
    
    // Load document - simplified API that calls setContent with document ID
    loadDocument: (newContent: string, docId: string) => {
      if (!docId) {
        if (debug) console.error('loadDocument called without document ID');
        return false;
      }
      
      if (debug) console.log(`LOAD DOCUMENT: ${docId}`);
      
      // Directly call our enhanced setContent implementation
      try {
        // Clean up any HTML artifacts - temporarily disabled to debug content flow
        const cleanedContent = typeof newContent === 'string' ? 
          /* cleanupBrTags(newContent) */ newContent : '';
        
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
        if (onError) onError(new Error(`Document load failed: ${(error as Error).message}`));
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
        // 1. Clear all editor storage if requested
        if (clearAllStorage) {
          // Find all keys with storageKeyPrefix
          const keysToRemove: string[] = [];
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
        
        // 2. Reset document ID if requested
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
        
        // 3. Clear content if requested
        if (clearContent) {
          // Set empty content
          setContent('');
          
          // If in rich mode, update the editor content
          if (view === 'rich' && milkdownRef.current) {
            try {
              milkdownRef.current.setContent('');
            } catch (error) {
              if (debug) console.error('Error clearing editor content:', error);
            }
          }
          
          // Also clear localStorage for current document
          localStorage.removeItem(contentKeyRef.current);
        }
        
        // 4. Return success
        return true;
      } catch (error) {
        if (debug) console.error('Error resetting editor:', error);
        if (onError) onError(new Error(`Error resetting editor: ${(error as Error).message}`));
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
  
  // Utility function to clean <br /> tags from table cells and document end
  const cleanupBrTags = (markdown: string): string => {
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

  // Handle content changes from the MilkdownEditor
  const handleEditorChange = (newContent: string) => {
    // Update local state
    setContent(newContent);
    
    // Call onChange if provided
    if (onChange) onChange(newContent);
    
    // Save to localStorage for persistence (if not in auto-save mode)
    if (autoSaveInterval === 0) {
      try {
        const storageKey = makeStorageKey(documentId);
        localStorage.setItem(storageKey, newContent);
        
        if (debug) {
          console.log(`CONTENT SAVED TO: ${storageKey}`);
        }
      } catch (error) {
        if (debug) console.error('Error saving content:', error);
      }
    }
  };
  
  // Toggle between edit and read modes
  const toggleMode = () => {
    const newMode: EditorMode = mode === 'edit' ? 'read' : 'edit';
    
    // If in raw mode and trying to switch to read mode,
    // we need to switch to rich mode first then set readonly
    if (view === 'raw' && newMode === 'read') {
      try {
        if (debug) {
          console.log('Switching from raw to read mode via rich view');
        }
        
        // First switch view to rich
        setView('rich');
        
        // Then mark as read-only in the next render cycle
        setTimeout(() => {
          setMode('read');
        }, 50);
        
        return; // Exit early to avoid setting mode directly
      } catch (error) {
        if (debug) console.error('Error transitioning from raw to read:', error);
        if (onError) onError(new Error(`Error transitioning from raw to read: ${(error as Error).message}`));
      }
    }
    // Normal case - just toggle mode
    else {
      setMode(newMode);
    }
    
    if (onModeChange) onModeChange(newMode);
  };
  
  // Toggle between rich and raw editing modes (edit mode only)
  const toggleView = () => {
    if (mode !== 'edit') return;
    
    // Calculate new view
    const newView: EditorView = view === 'rich' ? 'raw' : 'rich';
    
    if (debug) {
      console.log(`Toggling view from ${view} to ${newView}`);
    }
    
    if (view === 'rich' && milkdownRef.current) {
      try {
        // Get current content from rich editor using proper serialization
        const richContent = milkdownRef.current.getMarkdown();
        
        if (debug) {
          console.log('Rich editor content for raw transition:', 
                      richContent.substring(0, Math.min(100, richContent.length)) + (richContent.length > 100 ? '...' : ''));
          console.log('Line breaks in rich content:', (richContent.match(/\n/g) || []).length);
        }
        
        // Update React state with the content
        setContent(richContent);
        
        // Save to localStorage too
        localStorage.setItem(contentKeyRef.current, richContent);
      } catch (error) {
        if (debug) console.error('Error getting content from rich editor:', error);
      }
    } else if (view === 'raw' && newView === 'rich') {
      // When switching from raw to rich, ensure the editor gets the latest content
      try {
        // Make sure we save the current raw state first
        if (debug) {
          console.log('Raw editor content for rich transition:', 
                   content.substring(0, Math.min(100, content.length)) + (content.length > 100 ? '...' : ''));
          console.log('Line breaks in raw content:', (content.match(/\n/g) || []).length);
        }
        
        // Save to localStorage
        localStorage.setItem(contentKeyRef.current, content);
        
        // First change the view
        setView(newView);
        
        // Then update the editor in the next render cycle
        setTimeout(() => {
          if (milkdownRef.current) {
            milkdownRef.current.setContent(content);
          }
        }, 50);
        
        // Notify parent if needed
        if (onViewChange) onViewChange(newView);
        
        // Early return to prevent the default setView
        return;
      } catch (error) {
        if (debug) console.error('Error transitioning from raw to rich:', error);
      }
    }
    
    // Set the new view state
    setView(newView);
    
    // Notify parent if needed
    if (onViewChange) onViewChange(newView);
  };
  
  // Handle raw editor changes
  // In raw mode, the textarea becomes the temporary source of truth
  const handleRawChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    let contentToSave: string;
    
    if (view === 'rich' && milkdownRef.current) {
      try {
        contentToSave = milkdownRef.current.getMarkdown();
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
      if (onError) onError(new Error(`Error saving content: ${(error as Error).message}`));
    }
    
    // Call onSave if provided (AFTER saving locally) - include document ID
    if (onSave) onSave(contentToSave, documentId);
  }, [content, onSave, debug, onError, documentId, view]);
  
  // Add data-theme for original CSS variables
  useEffect(() => {
    if (editorRef.current) {
      const root = editorRef.current.closest(".semantic-composer");
      if (root) {
        root.setAttribute('data-theme', 'light');
      }
    }
  }, []);
  
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
    
    // For rich mode, update the editor content
    if (view === 'rich' && milkdownRef.current) {
      try {
        milkdownRef.current.setContent(newContent);
      } catch (error) {
        if (debug) console.error('Error updating content:', error);
        if (onError) onError(new Error(`Error updating content: ${(error as Error).message}`));
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
        let currentContent: string;
        
        if (view === 'rich' && milkdownRef.current) {
          // From rich editor
          currentContent = milkdownRef.current.getMarkdown();
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
  }, [autoSaveInterval, debug, view, content, onSave, documentId]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  
  // Get appropriate style class based on appearance
  const getAppearanceClass = useCallback(() => {
    switch (appearance) {
      case 'underline':
        return styles.underline;
      case 'filled-darker':
        return styles.filledDarker;
      case 'filled-lighter':
        return styles.filledLighter;
      case 'outline':
      default:
        return styles.outline;
    }
  }, [appearance, styles]);

  // Get appropriate size class
  const getSizeClass = useCallback(() => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      case 'medium':
      default:
        return styles.medium;
    }
  }, [size, styles]);

  // Handle download action
  const handleDownload = useCallback(() => {
    try {
      // Get current content from appropriate source
      let currentContent = '';
      if (view === 'rich' && milkdownRef.current) {
        currentContent = milkdownRef.current.getMarkdown();
        // Clean up <br> tags when exporting from rich mode - temporarily disabled to debug content flow
        // currentContent = cleanupBrTags(currentContent);
      } else if (view === 'raw') {
        // Raw mode already has clean content
        currentContent = content;
      } else {
        // Read mode - use content from state but ensure it's clean - temporarily disabled to debug content flow
        // currentContent = cleanupBrTags(content);
        currentContent = content;
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
      if (onError) onError(new Error(`Error exporting markdown: ${(error as Error).message}`));
    }
  }, [view, content, debug, onError]);

  // Combine styles for the component
  const rootClassName = mergeClasses(
    styles.root,
    getAppearanceClass(),
    getSizeClass()
  );

  // The editor component
  const editorComponent = (
    <div className={mergeClasses(rootClassName, "semantic-composer")} style={{ width }}>
      <div className={mergeClasses(styles.toolbar, "composer-toolbar")}>
        {/* Empty space on the left */}
        <div className={mergeClasses(styles.toolbarSpacer, "toolbar-spacer")}></div>
        
        {/* Mode toggles & actions on the right */}
        <div className={mergeClasses(styles.toolbarActions, "toolbar-actions")}>
          <Tooltip content={mode === 'edit' ? 'Switch to Read mode' : 'Switch to Edit mode'} relationship="label">
            <Button 
              icon={mode === 'edit' ? <Eye24Regular /> : <Edit24Regular />}
              appearance="subtle" 
              onClick={toggleMode}
              aria-label={mode === 'edit' ? 'Switch to Read mode' : 'Switch to Edit mode'}
            />
          </Tooltip>
          
          {mode === 'edit' && (
            <Tooltip content={view === 'rich' ? 'Switch to Raw markdown' : 'Switch to Rich editor'} relationship="label">
              <Button 
                icon={view === 'rich' ? <Code24Regular /> : <TextFont24Regular />}
                appearance="subtle" 
                onClick={toggleView}
                aria-label={view === 'rich' ? 'Switch to Raw markdown' : 'Switch to Rich editor'}
              />
            </Tooltip>
          )}
          
          <Tooltip content="Save content" relationship="label">
            <Button 
              icon={<Save24Regular />}
              appearance="subtle" 
              onClick={handleSave}
              aria-label="Save content"
            />
          </Tooltip>
          
          <Tooltip content="Export markdown" relationship="label">
            <Button 
              icon={<ArrowDownload24Regular />}
              appearance="subtle" 
              onClick={handleDownload}
              aria-label="Export markdown"
            />
          </Tooltip>
          
          {/* Word count display */}
          <div className={mergeClasses(styles.toolbarInfo, "toolbar-info")}>
            {typeof content === 'string' ? content.split(/\s+/).filter(Boolean).length : 0} words
          </div>
        </div>
      </div>
      
      <div className={mergeClasses(styles.editorContent, "editor-content")}>
        {view === 'rich' ? (
          // Use the new MilkdownEditor for rich mode
          <div className={mergeClasses(
            styles.milkdownWrapper,
            "milkdown-editor-wrapper",
            mode === 'read' ? 'read-only' : ''
          )}>
            {/* Only show editor if we have content */}
            {content && (
              <MilkdownEditor 
                ref={milkdownRef}
                content={content}
                readOnly={mode === 'read' || readOnly}
                onChange={handleEditorChange}
                placeholder={placeholder}
                autoFocus={autoFocus}
                debug={debug}
              />
            )}
            {/* Show loading state if no content */}
            {!content && (
              <div className="milkdown-loading">Loading content...</div>
            )}
          </div>
        ) : mode === 'edit' ? (
          // Raw mode (only available in edit mode)
          <textarea
            className={mergeClasses(styles.rawEditor, "raw-editor")}
            value={typeof content === 'string' ? content : ''}
            onChange={handleRawChange}
            placeholder={placeholder}
            spellCheck={spellCheck}
            autoFocus={autoFocus}
            readOnly={readOnly}
            style={{ 
              height: (typeof content === 'string' ? content.split('\n').length : 1) * 1.6 + 'em' 
            }}
          />
        ) : null /* Raw read mode is prevented in toggleMode */}
      </div>
    </div>
  );

  // Return the editor with or without FluentProvider based on useFluentProvider prop
  return useFluentProvider ? (
    <FluentProvider theme={{ "fontFamilyBase": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" }} {...fluentProviderProps}>
      {editorComponent}
    </FluentProvider>
  ) : editorComponent;
});

// Export as a named export for consistency with barrel file
export { SemanticComposer };