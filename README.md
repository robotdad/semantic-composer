# Semantic Composer

A markdown editor component built with React and Milkdown/Crepe, designed for easy integration into various web applications.

**[🚀 Try it live!](https://robotdad.github.io/semantic-composer)**

## Features

- Toggle between Edit and Read modes
- Toggle between Rich text and Raw markdown modes
- Support for all standard markdown features:
  - Headings
  - Lists
  - Code blocks with syntax highlighting
  - Tables
  - Links and images
- Document management with localStorage persistence
- Export markdown content to file
- Light and dark theme support
- Word count display
- Keyboard shortcuts (Ctrl+S/Cmd+S to save)

## Getting Started

### Installation

```bash
npm install
```

### Running the Demo

```bash
npm start
```

This will start a development server at http://localhost:3000 where you can see the Semantic Composer component in action.

## Usage

```jsx
import React, { useRef } from 'react';
import SemanticComposer from './components/SemanticComposer';

function MyApp() {
  const editorRef = useRef(null);
  
  const handleChange = (markdown) => {
    console.log('Markdown updated:', markdown);
  };
  
  const handleSave = (markdown) => {
    // Save markdown to database or file
    saveToDatabase(markdown);
  };
  
  const loadExternalContent = (content) => {
    // Use the component API to load new content
    if (editorRef.current?.setContent) {
      editorRef.current.setContent(content);
    }
  };
  
  return (
    <div className="app">
      <h1>My Markdown Editor</h1>
      <button onClick={() => loadExternalContent('# New Content')}>
        Load Content
      </button>
      <button onClick={() => editorRef.current.loadDocument('# New Document', 'doc-123')}>
        Load Document
      </button>
      <SemanticComposer
        ref={editorRef}
        initialValue="# Welcome to Semantic Composer"
        initialDocumentId="default"
        onChange={handleChange}
        onSave={handleSave}
        onError={(error) => console.error('Editor error:', error)}
        theme="light" // or "dark"
        width="100%"
        autoSaveInterval={5000} // Set to 0 to disable autosave
        storageKeyPrefix="editor" // Prefix for localStorage keys
      />
    </div>
  );
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialValue | string | '' | Initial markdown content |
| initialDocumentId | string | 'default' | Initial document ID for persistence |
| defaultMode | 'edit' \| 'read' | 'edit' | Initial editor mode |
| defaultView | 'rich' \| 'raw' | 'rich' | Initial view mode (rich text or raw markdown) |
| onChange | function | undefined | Callback when content changes |
| onSave | function | undefined | Callback when save is triggered with (content, documentId) |
| onError | function | undefined | Callback for error handling |
| onModeChange | function | undefined | Callback when mode changes |
| onViewChange | function | undefined | Callback when view changes |
| theme | 'light' \| 'dark' | 'light' | Editor theme |
| width | string \| number | '100%' | Editor width |
| placeholder | string | 'Start writing...' | Placeholder text for empty editor |
| readOnly | boolean | false | Set editor to read-only mode |
| autoFocus | boolean | true | Auto-focus on load |
| spellCheck | boolean | true | Enable spell check |
| autoSaveInterval | number | 5000 | Auto-save interval in ms (0 to disable) |
| debug | boolean | false | Enable debug logging |
| storageKeyPrefix | string | 'editor' | Prefix for localStorage keys |

## Component API

When using a ref, the following methods are available:

| Method | Description |
|--------|-------------|
| getCurrentContent() | Get the current markdown content and document ID |
| setContent(markdown, documentId) | Update the editor content with optional document ID |
| loadDocument(content, documentId) | Load content with a specific document ID |
| getDocumentId() | Get the current document ID |
| getCurrentView() | Get current view mode ('rich' or 'raw') |
| getCurrentMode() | Get current edit mode ('edit' or 'read') |
| toggleEditorView() | Toggle between rich and raw modes |
| toggleEditorMode() | Toggle between edit and read modes |
| reset(options) | Reset the editor with options for clearing content and storage |
| getCrepeInstance() | Get the underlying Crepe instance |
| getStorageKey() | Get the current storage key being used |

## Reset Options

The `reset()` method accepts an options object with the following properties:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| clearContent | boolean | true | Clear editor content |
| clearCurrentStorage | boolean | true | Clear current document storage |
| clearAllStorage | boolean | false | Clear all editor-related storage |
| resetToDefaultDocument | boolean | false | Reset document ID to default |

## Document Management

The component maintains document content in localStorage using the following pattern:
- Each document has a unique ID (defaulting to 'default')
- Storage keys are created as `${storageKeyPrefix}:${documentId}`
- The current document ID is tracked in `${storageKeyPrefix}:current-document-id`
- The `loadDocument()` method provides the easiest way to switch between documents
