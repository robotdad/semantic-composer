# Milkdown Architecture in Semantic Composer

This document explains the architecture of the Milkdown integration in Semantic Composer, which replaces the Crepe editor.

## Component Structure

The Milkdown integration follows a layered architecture:

1. **SemanticComposer**: Top-level component that provides all features and integrates with the application
2. **MilkdownEditor**: React component that wraps Milkdown and exposes a controlled interface
3. **MilkdownProvider**: Context provider for Milkdown from the `@milkdown/react` package
4. **Milkdown Core**: The underlying editor framework using ProseMirror

## Component Communication

```
┌─────────────────────────────┐
│      SemanticComposer       │
│                             │
│  ┌─────────────────────┐    │
│  │   MilkdownEditor    │    │
│  │                     │    │
│  │  ┌───────────────┐  │    │
│  │  │MilkdownContent│  │    │
│  │  │               │  │    │
│  │  │ ┌───────────┐ │  │    │
│  │  │ │ Milkdown  │ │  │    │
│  │  │ └───────────┘ │  │    │
│  │  └───────────────┘  │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

## Key Features

1. **Content Management**:
   - Uses a combination of React state and refs to track content
   - Ensures stable content updates during editing
   - Provides reliable serialization to markdown

2. **Editor Controls**:
   - Read/Edit mode toggling
   - Rich/Raw view switching
   - Content importing/exporting

3. **Persistence**:
   - LocalStorage integration for saving content
   - Document ID-based storage system
   - Auto-save functionality

## API Implementation

The `MilkdownEditor` component exposes these key methods through a ref:

- `getMarkdown()`: Get the current markdown content
- `setContent(markdown)`: Update the editor content
- `focus()`: Focus the editor

## Event Flow

1. User edits content in Milkdown → DOM mutation → Content change detected
2. Content change triggers `onChange` in MilkdownEditor
3. SemanticComposer receives change → Updates state → Saves to localStorage
4. Updates flow back to Milkdown when needed (mode changes, content resets)

## Extension Points

The pure Milkdown implementation enables several extension opportunities:

1. **Custom Nodes**: Add specialized content blocks beyond standard markdown
2. **Custom Marks**: Enhance inline formatting capabilities
3. **Plugins**: Add behavior like autocomplete, collaborative editing
4. **Commands**: Create custom editor commands

## Customization

The editor can be customized through:

1. **CSS**: Styling controls in MilkdownEditor.css
2. **Themes**: Replace Nord theme with custom themes
3. **Presets**: Add more Milkdown presets beyond commonmark and gfm

## Future Improvements

1. **Performance Optimization**: More efficient content change detection
2. **Markdown Transformation**: Better handling of markdown parsing/serialization
3. **Collaborative Editing**: Integration with collaborative editing systems
4. **Advanced Plugins**: Additional editor capabilities

## Technical Debt Considerations

1. The mutation observer approach for content changes is a temporary solution
2. Type safety could be improved with better TypeScript typing
3. Error boundaries should be added for better error handling