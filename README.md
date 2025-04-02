# Cortex Composer

An AI-powered markdown editor component built with React and Milkdown, designed for easy integration into various web applications.

## Features

- Toggle between Edit and Read modes
- Toggle between Rich text and Raw markdown modes
- Support for all standard markdown features:
  - Text formatting (bold, italic, etc.)
  - Headings
  - Lists
  - Code blocks with syntax highlighting
  - Tables
  - Links and images
- Light and dark theme support
- Word count display
- Keyboard shortcuts

## Getting Started

### Installation

```bash
npm install
```

### Running the Demo

```bash
npm start
```

This will start a development server at http://localhost:3000 where you can see the Cortex Composer component in action.

## Usage

```jsx
import CortexComposer from './components/CortexComposer';

function MyApp() {
  const handleChange = (markdown) => {
    console.log('Markdown updated:', markdown);
  };
  
  const handleSave = (markdown) => {
    // Save markdown to database or file
    saveToDatabase(markdown);
  };
  
  return (
    <div className="app">
      <h1>My Markdown Editor</h1>
      <CortexComposer
        initialValue="# Welcome to Cortex Composer"
        onChange={handleChange}
        onSave={handleSave}
        theme="light" // or "dark"
        height="600px"
      />
    </div>
  );
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialValue | string | '' | Initial markdown content |
| defaultMode | 'edit' \| 'read' | 'edit' | Initial editor mode |
| defaultView | 'rich' \| 'raw' | 'rich' | Initial view mode (rich text or raw markdown) |
| onChange | function | undefined | Callback when content changes |
| onSave | function | undefined | Callback when save is triggered |
| theme | 'light' \| 'dark' | 'light' | Editor theme |
| height | string \| number | '500px' | Editor height |
| width | string \| number | '100%' | Editor width |
| placeholder | string | 'Start writing...' | Placeholder text for empty editor |
| readOnly | boolean | false | Set editor to read-only mode |
