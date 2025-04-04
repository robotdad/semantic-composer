# Semantic Composer

A markdown editor component built with React and Milkdown, designed for easy integration into various web applications.

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
- Fluent UI integration
- Responsive design with different sizing options
- Various appearance styles
- Word count display
- Keyboard shortcuts (Ctrl+S/Cmd+S to save)

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# For Fluent UI integration
npm install @fluentui/react-components @fluentui/react-icons

# Milkdown dependencies
npm install @milkdown/react @milkdown/kit @milkdown/preset-commonmark @milkdown/preset-gfm @milkdown/plugin-listener @milkdown/theme-nord
```

### Running the Demo

```bash
npm start
```

### TypeScript Support

This project is built with TypeScript, providing:
- Type definitions for component props, refs, and state
- Improved editor integration with autocompletion
- Better error detection at compile time
- Enhanced developer experience

TypeScript-specific scripts:
```bash
# Type checking
npm run typecheck

# Linting TypeScript files
npm run lint
```

The development server will start at http://localhost:3000 where you can see the Semantic Composer component in action.

## Usage

### Basic Usage

```tsx
import React, { useRef } from 'react';
import { SemanticComposer } from './components';
import type { SemanticComposerRef } from './types';

function MyApp() {
  const editorRef = useRef<SemanticComposerRef>(null);
  
  const handleChange = (markdown: string) => {
    console.log('Markdown updated:', markdown);
  };
  
  const handleSave = (markdown: string, documentId: string) => {
    // Save markdown to database or file
    saveToDatabase(markdown);
  };
  
  const loadExternalContent = (content: string) => {
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
      <button onClick={() => editorRef.current?.loadDocument('# New Document', 'doc-123')}>
        Load Document
      </button>
      <SemanticComposer
        ref={editorRef}
        initialValue="# Welcome to Semantic Composer"
        initialDocumentId="default"
        onChange={handleChange}
        onSave={handleSave}
        onError={(error) => console.error('Editor error:', error)}
        width="100%"
        appearance="outline" // or "underline", "filled-darker", "filled-lighter"
        size="medium" // or "small", "large"
        autoSaveInterval={5000} // Set to 0 to disable autosave
        storageKeyPrefix="editor" // Prefix for localStorage keys
        useFluentProvider={true} // Wrap with FluentProvider
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
| width | string \| number | '100%' | Editor width |
| appearance | 'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter' | 'outline' | Visual style of the component |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Size variant of the component |
| placeholder | string | 'Start writing...' | Placeholder text for empty editor |
| readOnly | boolean | false | Set editor to read-only mode |
| autoFocus | boolean | true | Auto-focus on load |
| spellCheck | boolean | true | Enable spell check |
| autoSaveInterval | number | 5000 | Auto-save interval in ms (0 to disable) |
| debug | boolean | false | Enable debug logging |
| storageKeyPrefix | string | 'editor' | Prefix for localStorage keys |
| useFluentProvider | boolean | true | Wrap component with FluentProvider |
| fluentProviderProps | object | {} | Props to pass to FluentProvider |

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
| getEditorInstance() | Get the underlying Milkdown editor instance |
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

## Fluent UI Integration

### Dialog Component

The package includes a `SemanticComposerDialog` component for modal editing experiences:

```tsx
import { SemanticComposerDialog } from './components';

function MyApp() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setOpen(true)}>Edit Content</button>
      
      <SemanticComposerDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Document"
        initialContent="# My Document"
        appearance="filled-lighter"
        onSave={(content) => {
          console.log('Saved:', content);
          // Process saved content
        }}
      />
    </>
  );
}
```

### Styling Options

The component comes with multiple appearance options:

- `outline`: Standard bordered style (default)
- `underline`: Bottom border only
- `filled-darker`: Darker background fill
- `filled-lighter`: Lighter background fill

And size variants:

- `small`: Compact view with smaller text
- `medium`: Standard size (default)
- `large`: Larger text and spacing

### Theming

The component inherits themes from your Fluent UI theme context. If `useFluentProvider` is true (default), it creates its own FluentProvider. To use your application's theme context, set `useFluentProvider={false}`.

## Milkdown Integration

The editor uses [Milkdown](https://milkdown.dev/), a composable and extensible markdown editor framework.

### Architecture

- **MilkdownEditor**: A React component that integrates Milkdown with our custom UI
- **Editor Initialization**: Uses the official Milkdown React hooks (`useEditor`)
- **Content Flow**: 
  - Markdown content flows from the parent component to Milkdown
  - Changes from Milkdown are captured and propagated back up
  - Content is preserved when switching between Rich and Raw view modes

### Extending the Editor

You can extend the editor with additional Milkdown plugins:

1. Add the plugins to your project:
   ```bash
   npm install @milkdown/plugin-table @milkdown/plugin-tooltip
   ```

2. Create a custom component that extends MilkdownEditor:
   ```tsx
   import { table } from '@milkdown/plugin-table';
   import { tooltip } from '@milkdown/plugin-tooltip';
   import { MilkdownEditor } from './components';

   const EnhancedEditor = (props) => {
     // Add custom plugins or functionality
     const customPlugins = [table, tooltip];
     
     return <MilkdownEditor {...props} plugins={customPlugins} />;
   };
   ```

### Technical Details

- Uses Milkdown's React integration with `MilkdownProvider` and `useEditor` hook
- Preserves line breaks and formatting during view transitions
- Implements a ref-based API for external control
- Handles content synchronization between rich and raw modes
