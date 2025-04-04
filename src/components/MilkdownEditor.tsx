import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { defaultValueCtx, Editor, rootCtx, editorViewOptionsCtx } from '@milkdown/kit/core';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/kit/preset/gfm';
import { nord } from '@milkdown/theme-nord';
import './MilkdownEditor.css';

export interface MilkdownEditorProps {
  content: string;
  readOnly: boolean;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debug?: boolean;
}

export interface MilkdownEditorRef {
  getMarkdown: () => string;
  setContent: (content: string) => void;
  focus: () => void;
}

// Main component with forward ref to expose methods to parent
const MilkdownEditor = forwardRef<MilkdownEditorRef, MilkdownEditorProps>((props, ref) => {
  const { content, readOnly, onChange, placeholder, autoFocus, debug = false } = props;
  const contentRef = useRef<string>(content);
  const editorRef = useRef<any>(null);
  
  // Update contentRef when content prop changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getMarkdown: () => {
      // Simply return the current content - this is kept in sync via listeners
      return contentRef.current;
    },
    
    setContent: (newContent: string) => {
      if (debug) console.log('setContent called with:', newContent ? newContent.substring(0, 30) + '...' : 'empty');
      
      // Update content ref
      contentRef.current = newContent;
    },
    
    focus: () => {
      try {
        // This will be handled by the actual editor when rendered
      } catch (error) {
        if (debug) console.error('Error focusing editor:', error);
      }
    }
  }));

  // This is the actual Milkdown editor component
  const EditorComponent = () => {
    // Use the useEditor hook to initialize the editor
    const editor = useEditor((root) => {
      if (debug) console.log('Initializing editor with content:', content || '');
      
      return Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, content || '');
          ctx.update(editorViewOptionsCtx, (prev) => ({
            ...prev,
            editable: () => !readOnly
          }));
        })
        .config(nord)
        .use(commonmark)
        .use(gfm)
        .use(listener);
    }, [content, readOnly]);

    // Add a listener to observe changes when editor DOM changes
    // This is a simple approach to capture content changes
    useEffect(() => {
      // Wait for Milkdown to be rendered
      const milkdownElement = document.querySelector('.milkdown');
      if (!milkdownElement) return;
      
      const observer = new MutationObserver(() => {
        if (onChange) {
          // Use timeout to allow editor to stabilize
          setTimeout(() => {
            // Extract content directly from the DOM (simple approach)
            const editorElement = document.querySelector('.milkdown');
            if (editorElement) {
              const text = editorElement.textContent || '';
              if (text !== contentRef.current) {
                contentRef.current = text;
                onChange(text);
                if (debug) console.log('Content updated via observer:', text.substring(0, 30) + '...');
              }
            }
          }, 100);
        }
      });
      
      observer.observe(milkdownElement, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });
      
      return () => observer.disconnect();
    }, [onChange, debug]);
    
    return <Milkdown />;
  };
  
  // Return the editor wrapped in MilkdownProvider
  return (
    <div className="milkdown-wrapper">
      <MilkdownProvider>
        <EditorComponent />
      </MilkdownProvider>
    </div>
  );
});

export default MilkdownEditor;