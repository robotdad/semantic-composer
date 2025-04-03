import { FluentProvider } from '@fluentui/react-components';

export type EditorView = 'rich' | 'raw';
export type EditorMode = 'edit' | 'read';
// Theme is handled by Fluent context
export type EditorSize = 'small' | 'medium' | 'large';
export type EditorAppearance = 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';

export interface DocumentToLoad {
  id: string;
  content: string;
}

export interface ResetOptions {
  clearContent?: boolean;
  clearCurrentStorage?: boolean;
  clearAllStorage?: boolean;
  resetToDefaultDocument?: boolean;
}

export interface SemanticComposerProps {
  // Core functionality
  initialValue?: string;
  initialDocumentId?: string;
  defaultMode?: EditorMode;
  defaultView?: EditorView;
  
  // Event handlers
  onChange?: (value: string) => void;
  onSave?: (value: string, docId: string) => void;
  onModeChange?: (mode: EditorMode) => void;
  onViewChange?: (view: EditorView) => void;
  onError?: (error: Error) => void;
  
  // Visual customization
  width?: string;
  appearance?: EditorAppearance;
  size?: EditorSize;
  
  // Behavior customization
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
  autoSaveInterval?: number;
  
  // Advanced options
  debug?: boolean;
  storageKeyPrefix?: string;
  
  // Fluent UI integration
  useFluentProvider?: boolean;
  fluentProviderProps?: Partial<React.ComponentProps<typeof FluentProvider>>;
}

export interface SemanticComposerRef {
  // State accessors
  getCurrentView: () => EditorView;
  getCurrentMode: () => EditorMode;
  getCrepeInstance: () => any; // Crepe type from @milkdown/crepe
  getDocumentId: () => string;
  getCurrentContent: () => { content: string; documentId: string };
  
  // Content manipulation
  setContent: (newContent: string, newDocumentId?: string | null) => boolean;
  loadDocument: (newContent: string, docId: string) => boolean;
  reset: (options?: ResetOptions) => boolean;
  
  // UI control
  toggleEditorView: () => void;
  toggleEditorMode: () => void;
  
  // Utilities
  getStorageKey: () => string;
}