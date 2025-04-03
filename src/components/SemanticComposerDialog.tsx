import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTrigger, 
  DialogSurface, 
  DialogBody, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { SemanticComposer } from './SemanticComposer';
import { SemanticComposerRef } from '../types';

// Define dialog styles
const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '400px',
    minWidth: '600px',
    padding: 0,
    margin: 0,
  },
  editorContainer: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  }
});

export interface SemanticComposerDialogProps {
  title?: string;
  initialContent?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (content: string) => void;
  appearance?: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
  triggerButton?: React.ReactElement;
}

// Component definition
const SemanticComposerDialogComponent: React.FC<SemanticComposerDialogProps> = ({
  title = 'Edit Content',
  initialContent = '',
  open,
  onOpenChange,
  onSave,
  appearance = 'filled-lighter',
  triggerButton
}) => {
  const styles = useStyles();
  const editorRef = useRef<SemanticComposerRef>(null);
  const [contentSnapshot, setContentSnapshot] = useState<string>(initialContent);
  const [internalOpen, setInternalOpen] = useState<boolean>(open || false);
  
  // Handle open state from props or internal state
  const handleOpenChange = (event: any, data: { open?: boolean }) => {
    const openState = !!data.open;
    
    if (onOpenChange) {
      onOpenChange(openState);
    } else {
      setInternalOpen(openState);
    }
    
    // If opening, snapshot the initial content
    if (openState) {
      setContentSnapshot(initialContent);
    }
  };
  
  // Determine if open state is controlled externally or internally
  const isOpen = open !== undefined ? open : internalOpen;
  
  // Handle save action
  const handleSave = () => {
    if (editorRef.current) {
      const { content } = editorRef.current.getCurrentContent();
      if (onSave) {
        onSave(content);
      }
      // Close the dialog - create a fake event
      handleOpenChange({} as React.MouseEvent, { open: false });
    }
  };
  
  // Render the trigger inside DialogTrigger
  const renderTrigger = (triggerProps: any) => {
    if (triggerButton) {
      // If a custom trigger was provided, clone it with the necessary props
      return React.cloneElement(triggerButton as React.ReactElement, triggerProps);
    }
    
    // Default trigger button
    return (
      <Button {...triggerProps}>Edit Content</Button>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger disableButtonEnhancement>
        {renderTrigger}
      </DialogTrigger>
      
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          
          <DialogContent className={styles.dialogContent}>
            <div className={styles.editorContainer}>
              <SemanticComposer
                ref={editorRef}
                initialValue={contentSnapshot}
                appearance={appearance}
                useFluentProvider={false} // Already in a Fluent context
                width="100%"
                autoSaveInterval={0} // Disable auto-save in dialog mode
              />
            </div>
          </DialogContent>
          
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              {(triggerProps) => (
                <Button appearance="secondary" {...triggerProps}>Cancel</Button>
              )}
            </DialogTrigger>
            <Button appearance="primary" onClick={handleSave}>Save</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

// Single export at the end
export const SemanticComposerDialog = SemanticComposerDialogComponent;