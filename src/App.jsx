import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import SemanticComposer from './components/SemanticComposer';

function App() {
  // Check for saved content first
  const contentKey = 'demo-content:content';
  const savedContent = localStorage.getItem(contentKey);
  
  // Initial state setup - simple
  const [markdown, setMarkdown] = useState(savedContent || '');
  const [theme, setTheme] = useState('light');
  const [debugMode, setDebugMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);
  
  // Simple default content loading
  useEffect(() => {
    // Only try to load default.md if no saved content
    if (!savedContent) {
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
          }
        });
    }
  }, [savedContent]);

  const handleChange = (value) => {
    setMarkdown(value);
  };

  const handleSave = (value) => {
    try {
      console.log("Saving content:", value?.substring(0, 30) + "...");
      
      // Get the component's current storage key
      const componentsKey = 'demo-content';
      const contentKey = `${componentsKey}:content`;
      
      // Save to localStorage with the correct key
      localStorage.setItem(contentKey, value);
      console.log('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };
  
  const handleError = (error) => {
    console.error('Semantic Composer error:', error);
    // In a real application, you might use a toast notification or error boundary
    // alert(`Editor error: ${error.message}`);
  };
  
  // Diagnostic button handlers
  const printLocalStorage = () => {
    console.group('localStorage Diagnostic');
    
    // Current component storage key
    const componentsKey = 'demo-content';
    const contentKey = `${componentsKey}:content`;
    
    // Print current storage
    console.log(`${contentKey}:`, localStorage.getItem(contentKey));
    
    // Print all keys with component prefix (to catch any we might have missed)
    const keysWithPrefix = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${componentsKey}:`) && key !== contentKey) {
        keysWithPrefix.push(key);
      }
    }
    
    if (keysWithPrefix.length > 0) {
      console.log('Other component keys found:');
      keysWithPrefix.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`- ${key}:`, value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : 'null');
      });
    }
    
    // Print editor state information
    if (editorRef.current) {
      console.log('Editor state:', {
        'View mode': editorRef.current.getCurrentView(),
        'Edit mode': editorRef.current.getCurrentMode(),
        'Storage key': editorRef.current.getStorageKey?.() || componentsKey
      });
    }
    
    console.groupEnd();
  };

  const printEditorState = () => {
    if (editorRef.current) {
      console.group('Editor State Diagnostic');
      console.log('View mode:', editorRef.current.getCurrentView());
      console.log('Edit mode:', editorRef.current.getCurrentMode());
      try {
        console.log('Current content:', editorRef.current.getCurrentContent());
      } catch (e) {
        console.error('Error accessing editor content:', e);
      }
      console.groupEnd();
    } else {
      console.error('Editor reference not available - critical error');
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
  
  const clearLocalStorageAndReset = () => {
    // Clear localStorage
    try {
      localStorage.removeItem('demo-content:content');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    
    // Reset with empty string (shows placeholder)
    setMarkdown('');
  };

  const loadSaved = () => {
    const componentsKey = 'demo-content';
    const contentKey = `${componentsKey}:content`;
    
    try {
      const saved = localStorage.getItem(contentKey);
      
      if (saved) {
        // Reset the editor with saved content
        if (editorRef.current?.reset) {
          editorRef.current.reset(saved);
          console.log('Content loaded from localStorage');
        } else {
          console.error('Editor reset method not available');
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
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // Read the file
                const reader = new FileReader();
                reader.onload = (event) => {
                  // Set content directly
                  setMarkdown(event.target.result);
                };
                
                reader.onerror = (error) => {
                  console.error('Error reading file:', error);
                };
                
                // Read the file as text
                reader.readAsText(file);
                
                // Reset the input so selecting the same file again still triggers onChange
                e.target.value = '';
              }
            }}
          />
          
          <button onClick={() => document.getElementById('file-upload').click()}>
            Load File
          </button>
          
          <button onClick={() => {
            // Always get the current markdown directly from Crepe - simplest approach
            if (editorRef.current?.getCrepeInstance) {
              const crepe = editorRef.current.getCrepeInstance();
              if (crepe) {
                try {
                  // Get the content from crepe
                  const markdown = crepe.getMarkdown();
                  console.log("Content at save:", markdown.substring(0, 50));
                  handleSave(markdown);
                } catch (e) {
                  console.error("Error getting markdown from editor:", e);
                  if (handleError) handleError(new Error(`Failed to get content from editor: ${e.message}`));
                }
              } else {
                console.error("No Crepe instance available");
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
            onChange={handleChange}
            onSave={handleSave}
            onError={handleError}
            theme={theme}
            width="100%"
            debug={debugMode}
            autoSaveInterval={5000}
            storageKey="demo-content"
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
              onClick={clearLocalStorageAndReset}
              style={{ padding: '8px 12px', background: '#ff5722', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Clear & Reset
            </button>
            <button 
              onClick={() => {
                // Clear all localStorage and reload page
                localStorage.clear();
                console.log('Cleared all localStorage');
                window.location.reload();
              }}
              style={{ padding: '8px 12px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Force Reload
            </button>
            <button 
              onClick={() => {
                console.group("Direct Content Test");
                if (editorRef.current) {
                  // Only test direct editor access - React state is not a source of truth
                  try {
                    console.log("getCurrentContent():", editorRef.current.getCurrentContent());
                  } catch (e) {
                    console.error("Error accessing editor content:", e);
                  }
                  
                  if (editorRef.current.getCrepeInstance) {
                    const crepe = editorRef.current.getCrepeInstance();
                    if (crepe) {
                      try {
                        console.log("Direct getMarkdown():", crepe.getMarkdown());
                      } catch (e) {
                        console.error("Error accessing Crepe instance:", e);
                      }
                    } else {
                      console.error("No Crepe instance available - critical error");
                    }
                  }
                } else {
                  console.error("No editor reference available - critical error");
                }
                console.groupEnd();
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