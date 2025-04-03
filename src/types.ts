export type EditorView = 'rich' | 'raw';
export type EditorMode = 'edit' | 'read';
export type EditorTheme = 'light' | 'dark';

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
  initialValue?: string;
  initialDocumentId?: string;
  defaultMode?: EditorMode;
  defaultView?: EditorView;
  onChange?: (value: string) => void;
  onSave?: (value: string, docId: string) => void;
  onModeChange?: (mode: EditorMode) => void;
  onViewChange?: (view: EditorView) => void;
  onError?: (error: Error) => void;
  theme?: EditorTheme;
  width?: string;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
  autoSaveInterval?: number;
  debug?: boolean;
  storageKeyPrefix?: string;
}

export interface SemanticComposerRef {
  getCurrentView: () => EditorView;
  getCurrentMode: () => EditorMode;
  getCrepeInstance: () => any; // Crepe type from @milkdown/crepe
  getDocumentId: () => string;
  getCurrentContent: () => { content: string; documentId: string };
  setContent: (newContent: string, newDocumentId?: string | null) => boolean;
  loadDocument: (newContent: string, docId: string) => boolean;
  reset: (options?: ResetOptions) => boolean;
  toggleEditorView: () => void;
  toggleEditorMode: () => void;
  getStorageKey: () => string;
}