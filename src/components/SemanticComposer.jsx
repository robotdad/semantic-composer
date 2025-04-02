import React, { useState, useEffect, useRef, useCallback } from 'react';
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
const SemanticComposer = ({
  initialValue = '',
  defaultMode = 'edit',
  defaultView = 'rich',
  onChange,
  onSave,
  onModeChange,
  onViewChange,
  theme = 'light',
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
  
  // Initialize Milkdown editor - single instance for both edit and read modes
  useEffect(() => {
    if (editorRef.current && view === 'rich' && !crepeRef.current) {
      // Create Crepe editor with minimal configuration
      const crepe = new Crepe({
        root: editorRef.current,
        defaultValue: content
      });
      
      crepe.create().then(() => {
        crepeRef.current = crepe;
        
        // Set initial read-only state
        crepe.setReadonly(mode === 'read' || readOnly);
        
        // Set up content change listener
        const editorDOM = editorRef.current.querySelector('.milkdown');
        if (editorDOM) {
          // Listen for content changes
          editorDOM.addEventListener('input', () => {
            try {
              const markdown = crepe.getMarkdown();
              setContent(markdown);
              if (onChange) onChange(markdown);
            } catch (error) {
              // Silently handle error
            }
          });
        }
      });
      
      return () => {
        if (crepeRef.current) {
          crepeRef.current.destroy();
          crepeRef.current = null;
        }
      };
    }
  }, [view, content, readOnly, mode, onChange]);
  
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
        if (markdown) {
          setContent(markdown);
          if (onChange) onChange(markdown);
        }
      } catch (error) {
        // Silent error handling
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
    
    // If switching from rich to raw, get content
    if (view === 'rich' && crepeRef.current) {
      try {
        const markdown = crepeRef.current.getMarkdown();
        if (markdown) {
          setContent(markdown);
          if (onChange) onChange(markdown);
        }
      } catch (error) {
        // Silent error handling
      }
    }
    
    // Toggle view mode
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
  
  // Save handler - memoized to avoid dependency loops
  const handleSave = useCallback(() => {
    // If in rich mode, ensure we have the latest content
    if (view === 'rich' && crepeRef.current) {
      try {
        const markdown = crepeRef.current.getMarkdown();
        if (markdown) {
          setContent(markdown);
          if (onSave) onSave(markdown);
          localStorage.setItem('semantic-composer-content', markdown);
          return;
        }
      } catch (error) {
        // Silently handle error
      }
    }
    
    // Use current content state
    if (onSave) onSave(content);
    
    // Store in localStorage
    localStorage.setItem('semantic-composer-content', content);
  }, [view, content, onSave]);
  
  // Load from localStorage if available
  const handleLoad = () => {
    const savedContent = localStorage.getItem('semantic-composer-content');
    if (savedContent) {
      // Update state
      setContent(savedContent);
      if (onChange) onChange(savedContent);
      
      // Update editor if in rich mode
      if (view === 'rich' && crepeRef.current) {
        try {
          crepeRef.current.setMarkdown(savedContent);
        } catch (error) {
          console.log('Could not update editor content');
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
    setContent(initialValue);
    
    // Update editor content if it exists
    if (view === 'rich' && crepeRef.current) {
      try {
        crepeRef.current.setMarkdown(initialValue);
      } catch (error) {
        // Silently handle error
      }
    }
  }, [initialValue, view]);
  
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
        crepeRef.current.setMarkdown(newContent);
        setContent(newContent);
        if (onChange) onChange(newContent);
      } catch (error) {
        console.log('Could not insert markdown in rich editor');
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
            {content.split(/\s+/).filter(Boolean).length} words
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
            value={content}
            onChange={handleRawChange}
            placeholder={placeholder}
            spellCheck={spellCheck}
            autoFocus={autoFocus}
            readOnly={readOnly}
            style={{ height: content.split('\n').length * 1.6 + 'em' }} // Auto-grow based on content
          />
        ) : (
          // Fallback for read mode when view is raw (should never happen in normal usage)
          <div className="raw-preview">{content}</div>
        )}
      </div>
    </div>
  );
};

export default SemanticComposer;