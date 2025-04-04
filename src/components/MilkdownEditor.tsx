import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { defaultValueCtx, Editor, rootCtx, editorViewOptionsCtx } from '@milkdown/kit/core';
import { Milkdown, MilkdownProvider } from '@milkdown/react';
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

const MilkdownEditor = forwardRef<MilkdownEditorRef, MilkdownEditorProps>((props, ref) => {
  const { content, readOnly, onChange, placeholder, autoFocus, debug = false } = props;
  const contentRef = useRef(content);
  const editorRef = useRef<any>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  
  // Keep track of content
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  
  // Initialize editor when component mounts
  useEffect(() => {
    if (rootRef.current && !editorRef.current) {
      if (debug) console.log('Initializing editor with content:', content ? content.substring(0, 50) + '...' : 'empty');
      
      const editor = Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, rootRef.current);
          ctx.set(defaultValueCtx, content);
          ctx.update(editorViewOptionsCtx, (prev) => ({
            ...prev,
            editable: () => !readOnly
          }));
        })
        .config(nord)
        .use(commonmark)
        .use(gfm)
        .use(listener);
      
      editor.create().then((instance) => {
        editorRef.current = instance;
        
        // Set up listener for content changes
        if (onChange) {
          try {
            const listenerManager = instance.ctx.get(listenerCtx);
            listenerManager.markdownUpdated((ctx: any, markdown: string, prevMarkdown: string) => {
              if (markdown !== contentRef.current) {
                contentRef.current = markdown;
                onChange(markdown);
              }
            });
          } catch (error) {
            if (debug) console.error('Error setting up listener:', error);
          }
        }
      }).catch(error => {
        if (debug) console.error('Error creating editor:', error);
      });
      
      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }
  }, [content, readOnly, onChange, debug]);
  
  // Update readOnly state when it changes
  useEffect(() => {
    if (editorRef.current) {
      try {
        const editor = editorRef.current.ctx.get('editor');
        if (editor && editor.view) {
          editor.view.setProps({
            editable: () => !readOnly
          });
        }
      } catch (error) {
        if (debug) console.error('Error updating readOnly state:', error);
      }
    }
  }, [readOnly, debug]);
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getMarkdown: () => {
      // Simplified approach - just return the current content
      // If editorRef is not available, fall back to contentRef
      return contentRef.current;
    },
    
    setContent: (newContent: string) => {
      // Update content ref first
      contentRef.current = newContent;
      
      // Then update editor if available
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
          
          // The editor will be recreated on next render
          if (rootRef.current) {
            const editor = Editor.make()
              .config((ctx) => {
                ctx.set(rootCtx, rootRef.current);
                ctx.set(defaultValueCtx, newContent);
                ctx.update(editorViewOptionsCtx, (prev) => ({
                  ...prev,
                  editable: () => !readOnly
                }));
              })
              .config(nord)
              .use(commonmark)
              .use(gfm)
              .use(listener);
            
            editor.create().then((instance) => {
              editorRef.current = instance;
              
              // Set up listener for content changes again
              if (onChange) {
                try {
                  const listenerManager = instance.ctx.get(listenerCtx);
                  listenerManager.markdownUpdated((ctx: any, markdown: string) => {
                    if (markdown !== contentRef.current) {
                      contentRef.current = markdown;
                      onChange(markdown);
                    }
                  });
                } catch (error) {
                  if (debug) console.error('Error setting up listener:', error);
                }
              }
            });
          }
        } catch (error) {
          if (debug) console.error('Error setting content:', error);
        }
      }
    },
    
    focus: () => {
      if (editorRef.current) {
        try {
          const editor = editorRef.current.ctx.get('editor');
          if (editor && editor.view) {
            editor.view.focus();
          }
        } catch (error) {
          if (debug) console.error('Error focusing editor:', error);
        }
      }
    }
  }));
  
  return (
    <div className="milkdown-wrapper">
      <div ref={rootRef} className="milkdown"></div>
    </div>
  );
});

export default MilkdownEditor;