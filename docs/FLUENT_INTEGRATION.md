# Fluent UI Integration for SemanticComposer

This document outlines how to use the Fluent UI-enabled version of the SemanticComposer component in your Fluent UI projects.

## Installation

To integrate the SemanticComposer with your Fluent UI project, ensure you have the following dependencies:

```bash
npm install @milkdown/crepe @fluentui/react-components @fluentui/react-icons
```

You'll also need to include the Milkdown CSS files in your project:

```tsx
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
```

## Basic Usage

```tsx
import { SemanticComposer } from './path-to-component/SemanticComposer';

function MyEditor() {
  return (
    <SemanticComposer 
      initialValue="# Hello World"
      appearance="outline"
      size="medium"
      width="100%"
      useFluentProvider={true}
    />
  );
}
```

## Props

The component accepts the following Fluent UI-specific props:

### Visual Customization

- `appearance`: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter'
- `size`: 'small' | 'medium' | 'large'
- `width`: string (CSS width value, default: '100%')

### Fluent UI Integration

- `useFluentProvider`: boolean (whether to wrap the component in FluentProvider, default: true)
- `fluentProviderProps`: Object (additional props to pass to FluentProvider)

## Integration with DialogControl

For modal editing experiences, you can use the component with DialogControl:

```tsx
import { Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button } from '@fluentui/react-components';
import { SemanticComposer } from './path-to-component/SemanticComposer';

function MarkdownEditorDialog() {
  const [content, setContent] = useState('# Hello World');
  
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>Edit Markdown</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogContent>
            <SemanticComposer
              initialValue={content}
              onChange={setContent}
              useFluentProvider={false} // Dialog is already in a FluentProvider
              width="100%"
              appearance="filled-lighter"
            />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary">Save</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

## Theme Integration

The component automatically inherits from the Fluent UI theme context. When `useFluentProvider` is true, it will create a new FluentProvider context.

If you're using the component within an existing Fluent UI application, you can set `useFluentProvider={false}` to have it inherit the theme from the parent context.

## Size Variants

The component offers three size variants:

- `small`: Compact view with smaller text
- `medium`: Standard size (default)
- `large`: Larger text and spacing

## Appearance Variants

Four appearance styles are available:

- `outline`: Standard bordered style (default)
- `underline`: Bottom border only
- `filled-darker`: Darker background fill
- `filled-lighter`: Lighter background fill

## Usage in Forms

When using the component in forms, you can access the content via the ref:

```tsx
import { useRef } from 'react';
import { SemanticComposer, SemanticComposerRef } from './path-to-component';

function MyForm() {
  const editorRef = useRef<SemanticComposerRef>(null);
  
  const handleSubmit = () => {
    if (editorRef.current) {
      const { content } = editorRef.current.getCurrentContent();
      // Submit content to your API
      console.log(content);
    }
  };
  
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SemanticComposer 
        ref={editorRef}
        initialValue="# Form Content"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </form>
  );
}
```