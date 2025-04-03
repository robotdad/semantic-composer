import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import SemanticComposer from './components/SemanticComposer';
import { DocumentToLoad, SemanticComposerRef } from './types';

function App() {
  // Simple initialization - just start with default content
  // We'll handle active document loading properly in the editor component
  const savedContent = localStorage.getItem('editor:default');
  
  // Initial state setup - simple
  const [markdown, setMarkdown] = useState<string>(savedContent || '');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentToLoad, setDocumentToLoad] = useState<DocumentToLoad | null>(null); // Track document to be loaded
  const editorRef = useRef<SemanticComposerRef>(null);
  
  // Simple default content loading
  useEffect(() => {
    // Only try to load default.md if no saved content
    if (!savedContent) {
      setIsLoading(true);
      fetch(`${process.env.PUBLIC_URL}/content/default.md`)
        .then(response => {
          if (response.ok) {
            return response.text();
          }
          // If file not found, return null (don't throw error)
          return null;
        })
        .then(content => {
          // Only update if content was loaded successfully
          if (content) {
            setMarkdown(content);
            
            // Save to localStorage with the correct document ID
            try {
              localStorage.setItem('editor:default', content);
              console.log('Default content saved to localStorage');
            } catch (error) {
              console.error('Error saving default content:', error);
            }
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading default content:', error);
          setIsLoading(false);
        });
    }
  }, [savedContent]);
  
  // New effect to handle document loading when the editor ref is ready
  useEffect(() => {
    // Only proceed if we have a document to load AND editor ref is available
    if (documentToLoad && editorRef.current) {
      const { id, content } = documentToLoad;
      console.log(`LOADING DOCUMENT: ${id} (editor ref is available)`);
      
          // Use setTimeout to ensure the ref is fully available
      setTimeout(() => {
        try {
          console.log(`Loading document with ID: ${id}`);
          editorRef.current?.loadDocument(content, id);
          console.log(`Document loaded: ${id}`);
        } catch (error) {
          console.error(`Error loading document:`, error);
          
          // Fallback - update content state at minimum
          setMarkdown(content);
        }
      }, 50);
      
      // Verify storage key if possible
      try {
        if (typeof editorRef.current.getStorageKey === 'function') {
          const key = editorRef.current.getStorageKey();
          console.log(`Active storage key: ${key}`);
        }
      } catch (err) {
        console.error('Error getting storage key:', err);
      }
      
      // Reset the document to load to avoid repeating
      setDocumentToLoad(null);
    }
  // Don't include editorRef.current in the dependency array - use editorRef instead
  }, [documentToLoad]);

  const handleChange = (value: string) => {
    setMarkdown(value);
  };

  const handleSave = (value: string, docId?: string) => {
    try {
      console.log(`SAVING TO DOCUMENT: ${docId || 'default'}`);
      
      // No need to save to localStorage, the component already did that
      // We'd normally save to server or perform other actions here
      
      // For demo purposes, log the document ID we received
      console.log(`Content received for document: ${docId || 'default'} (length: ${value?.length || 0})`);
    } catch (error) {
      console.error('Error in save handler:', error);
    }
  };
  
  const handleError = (error: Error) => {
    console.error('Semantic Composer error:', error);
    // In a real application, you might use a toast notification or error boundary
    // alert(`Editor error: ${error.message}`);
  };
  
  // Diagnostic button handlers
  const printLocalStorage = () => {
    console.group('localStorage Diagnostic');
    
    // Get all editor-related keys
    const editorKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('editor:')) {
        editorKeys.push(key);
      }
    }
    
    // Print current document info from localStorage
    const currentDocId = localStorage.getItem('editor:current-document-id') || 'default';
    console.log(`Current document ID from localStorage: ${currentDocId}`);
    
    // Print all editor storage keys
    if (editorKeys.length > 0) {
      console.log('Editor storage keys:');
      editorKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`- ${key}: ${value ? `[${value.length} chars]` : 'null'}`);
      });
    }
    
    // Print editor state information directly
    if (editorRef.current) {
      try {
        console.log('Editor state:');
        console.log('- View mode:', editorRef.current.getCurrentView());
        console.log('- Edit mode:', editorRef.current.getCurrentMode());
        console.log('- Document ID:', editorRef.current.getDocumentId());
        console.log('- Storage key:', editorRef.current.getStorageKey());
        
        const content = editorRef.current.getCurrentContent();
        console.log('- Content length:', content.content.length);
      } catch (error) {
        console.error('Error getting editor state:', error);
      }
    }
    
    console.groupEnd();
  };

  const printEditorState = () => {
    if (editorRef.current) {
      console.group('Editor State Diagnostic');
      
      // Simple direct calls
      try {
        console.log('View mode:', editorRef.current.getCurrentView());
        console.log('Edit mode:', editorRef.current.getCurrentMode());
        console.log('Document ID:', editorRef.current.getDocumentId());
        console.log('Storage key:', editorRef.current.getStorageKey());
        
        const content = editorRef.current.getCurrentContent();
        console.log('Content length:', content.content.length);
        console.log('Content first 50 chars:', content.content.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error accessing editor state:', error);
      }
      
      console.groupEnd();
    } else {
      console.error('Editor reference not available');
    }
  };

  const printRawMarkdown = () => {
    if (editorRef.current?.getCrepeInstance?.()) {
      const crepe = editorRef.current.getCrepeInstance();
      console.group('Milkdown/Crepe Diagnostic');
      try {
        const md = crepe.getMarkdown();
        console.log('getMarkdown() output:', md);
        console.log('Output type:', typeof md);
        console.log('Length:', md ? md.length : 0);
        console.log('Contains <br>:', md && (md.includes('<br>') || md.includes('<br />')));
        console.log('Character codes:', [...(md || '')].map(c => c.charCodeAt(0)));
      } catch (e) {
        console.error('Error getting markdown:', e);
      }
      console.groupEnd();
    } else {
      console.warn('Crepe instance not available');
    }
  };
  
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };
  
  const resetEditor = () => {
    // Use the enhanced reset API to clear all editor storage
    if (editorRef.current) {
      try {
        // Reset editor (clear content and all storage)
        editorRef.current.reset({
          clearContent: true,
          clearCurrentStorage: true,
          clearAllStorage: true,
          resetToDefaultDocument: true // Use the new option to reset document ID
        });
        
        console.log("Reset completed");
        
        // Clean up any orphaned menu elements
        document.querySelectorAll('.milkdown-menu').forEach(el => {
          try {
            document.body.removeChild(el);
          } catch (err) {
            console.error("Error removing menu element:", err);
          }
        });
        
        // Load default.md
        setIsLoading(true);
        fetch(`${process.env.PUBLIC_URL}/content/default.md`)
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              console.error("Failed to load default.md");
              return ""; // Empty string if file not found
            }
          })
          .then(content => {
            if (content) {
              // First update our state so component gets the content
              setMarkdown(content);
              
              // Use setContent API with document ID
              // No need for setTimeout, just need to make sure editor is initialized first
              setIsLoading(false);
              requestAnimationFrame(() => {
                if (editorRef.current) {
                  // Use empty string if content is falsy
                  const contentToLoad = content || '';
                  try {
                    // Ensure editor ref is ready before calling methods
                    setTimeout(() => {
                      // Load default content
                      editorRef.current?.loadDocument(contentToLoad, "default");
                      console.log("Default content loaded successfully");
                    }, 50);
                  } catch (error) {
                    console.error("Error loading default content:", error);
                  }
                }
              });
            } else {
              setIsLoading(false);
            }
          })
          .catch(error => {
            console.error("Error loading default content:", error);
            setIsLoading(false);
          });
          
      } catch (error) {
        console.error('Error resetting editor:', error);
      }
    } else {
      console.error('Editor reset method not available');
      
      // Fallback to manual cleanup
      try {
        // Clear all localStorage with editor or demo-content prefix
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('editor:') || key.startsWith('demo-content:'))) {
            keysToRemove.push(key);
          }
        }
        
        // Remove all found keys
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`Cleared ${keysToRemove.length} editor storage keys`);
        
        // Force reload to get the default content
        window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
      } catch (e) {
        console.error("Error in fallback cleanup:", e);
      }
    }
  };

  const loadSaved = () => {
    try {
      // Find all keys with editor prefix
      const keysToLoad: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('editor:')) {
          keysToLoad.push(key);
        }
      }
      
      // Check old format key as well
      const oldContentKey = `demo-content:content`;
      const oldContent = localStorage.getItem(oldContentKey);
      if (oldContent) {
        keysToLoad.push(oldContentKey);
      }
      
      if (keysToLoad.length > 0) {
        // Display the first found document
        const firstKey = keysToLoad[0];
        const content = localStorage.getItem(firstKey);
        
        if (content) {
          console.log(`Loading content from ${firstKey}`);
          
          // Use document ID from storage key
          const docId = firstKey.startsWith('editor:') ? 
            firstKey.substring(7) : // Remove 'editor:' prefix
            'imported-document';
            
          // Use loadDocument API if available
          if (editorRef.current?.loadDocument) {
            editorRef.current.loadDocument(content, docId);
            console.log(`Content loaded using loadDocument API for ${docId}`);
          } else {
            // Fallback to setContent
            if (editorRef.current?.setContent) {
              editorRef.current.setContent(content);
              console.log('Content loaded using setContent fallback');
            } else {
              console.error('No content loading method available');
              setMarkdown(content); // Direct state update as last resort
            }
          }
        }
      } else {
        console.log('No saved content found');
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app" data-theme={theme}>
      <header className="app-header">
        <h1>Semantic Composer Demo</h1>
        <div className="action-buttons">
          {/* File input is hidden, but triggered by the Load File button */}
          <input 
            type="file" 
            id="file-upload" 
            accept=".md, .markdown, .txt" 
            style={{ display: 'none' }} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                setIsLoading(true);
                
                // Read the file
                const reader = new FileReader();
                reader.onload = (event: ProgressEvent<FileReader>) => {
                  try {
                    const docId = file.name || 'imported-document';
                    console.log(`LOADING FILE: ${docId}`);
                    
                    // Update local state first
                    const content = event.target?.result as string;
                    setMarkdown(content);
                    
                    // Wait for the next frame to ensure ref is available
                    setTimeout(() => {
                      // Direct approach - call loadDocument method
                      if (editorRef.current) {
                        console.log('Loading content into editor with document ID:', docId);
                        editorRef.current.loadDocument(content, docId);
                      } else {
                        console.error('Editor ref not available');
                      }
                    }, 50);
                  } catch (error) {
                    console.error('Error loading document:', error);
                  } finally {
                    setIsLoading(false);
                  }
                };
                
                reader.onerror = (error) => {
                  console.error('Error reading file:', error);
                  setIsLoading(false);
                };
                
                // Read file as text
                reader.readAsText(file);
                
                // Reset input for future selections
                e.target.value = '';
              }
            }}
          />
          
          <button onClick={() => document.getElementById('file-upload')?.click()}>
            Load File
          </button>
          
          <button onClick={() => {
            // Always get the current markdown directly from component's API
            if (editorRef.current?.getCurrentContent) {
              try {
                // Get the content using public API - more reliable than direct access to Crepe
                const markdown = editorRef.current.getCurrentContent();
                handleSave(markdown.content, markdown.documentId);
              } catch (e) {
                console.error("Error getting markdown from editor:", e);
                if (handleError) handleError(new Error(`Failed to get content from editor: ${(e as Error).message}`));
              }
            } else {
              console.error("Editor reference not available");
            }
          }}>Save</button>
          
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>
      <main className="app-main">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading content...</p>
          </div>
        ) : (
          <SemanticComposer
            ref={editorRef}
            initialValue={markdown}
            initialDocumentId="default"
            onChange={handleChange}
            onSave={handleSave}
            onError={handleError}
            theme={theme}
            width="100%"
            debug={true} /* Force debug on to see all logs */
            autoSaveInterval={5000}
            storageKeyPrefix="editor"
          />
        )}
        
        {/* Diagnostic Tools Section - Sticky at bottom */}
        <div className="diagnostic-tools" style={{
          marginTop: '10px', 
          padding: '15px', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          position: 'sticky',
          bottom: '0',
          zIndex: '100',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Diagnostic Tools</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              onClick={printLocalStorage}
              style={{ padding: '8px 12px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Print localStorage
            </button>
            <button 
              onClick={printEditorState}
              style={{ padding: '8px 12px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Print Editor State
            </button>
            <button 
              onClick={printRawMarkdown}
              style={{ padding: '8px 12px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Print Raw Markdown
            </button>
            <button 
              onClick={toggleDebugMode}
              style={{ padding: '8px 12px', background: debugMode ? '#4caf50' : '#e0e0e0', color: debugMode ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {debugMode ? 'Debug Mode: ON' : 'Debug Mode: OFF'}
            </button>
            <button 
              onClick={resetEditor}
              style={{ padding: '8px 12px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reset Editor
            </button>
            <button 
              onClick={() => {
                console.group("Document Content Test");
                
                // Use setTimeout to ensure ref is ready
                setTimeout(() => {
                  if (editorRef.current) {
                    try {
                      // Get content safely
                      const result = editorRef.current.getCurrentContent();
                      console.log("Content:", result.content.substring(0, 50) + "...");
                      console.log("Document ID:", result.documentId);
                      
                      // Get other info
                      console.log("Editor view:", editorRef.current.getCurrentView());
                      console.log("Editor mode:", editorRef.current.getCurrentMode());
                      console.log("Storage key:", editorRef.current.getStorageKey());
                    } catch (error) {
                      console.error("Error accessing editor:", error);
                    }
                  } else {
                    console.error("Editor reference not available");
                  }
                  console.groupEnd();
                }, 50);
              }}
              style={{ padding: '8px 12px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Test Get Content
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
            Use these tools to diagnose editor content issues. Results are displayed in the browser console.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;