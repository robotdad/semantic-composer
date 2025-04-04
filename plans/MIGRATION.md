# Migration from Crepe to Pure Milkdown

This document outlines the migration from the high-level Crepe editor to using the underlying Milkdown framework directly for improved extensibility.

## Migration Summary

We've replaced the `@milkdown/crepe` editor with the core Milkdown packages, providing a more flexible implementation that allows for deeper customization. The migration includes:

1. **Package Changes:**
   - Added core Milkdown packages:
     - `@milkdown/react`: React integration
     - `@milkdown/kit`: Core functionalities
     - `@milkdown/preset-commonmark`: Common markdown features
     - `@milkdown/preset-gfm`: GitHub Flavored Markdown features
     - `@milkdown/plugin-listener`: Event handling
     - `@milkdown/theme-nord`: Nord theme styling

2. **Implementation Changes:**
   - Created a new `MilkdownEditor` component using Milkdown's native APIs
   - Integrated with `SemanticComposer` maintaining the same functionality
   - Replaced Crepe-specific methods with Milkdown equivalents
   - Added custom styling for the editor

## Technical Implementation

The implementation uses:

- `useEditor` hook from `@milkdown/react` to initialize the editor instance
- `useInstance` to access the editor for direct manipulation
- Standard event listeners for content changes
- Custom methods for getting/setting content and editor state

## API Equivalents

| Crepe Method | Milkdown Method |
|--------------|-----------------|
| `crepe.setReadonly()` | Update ProseMirror view editable state |
| `crepe.getMarkdown()` | Get content via editor transformers or doc text |
| `crepe.on()` | Use the listener plugin or direct state observation |
| `crepe.create()` | Editor created via the `useEditor` hook |

## Benefits

1. **Extensibility**: Access to the full Milkdown/ProseMirror API
2. **Performance**: More direct control over the editor's lifecycle
3. **Customization**: Ability to add custom plugins, nodes, and marks
4. **Maintainability**: Cleaner integration with React's component model

## Future Improvements

- Add support for custom nodes and marks
- Implement more advanced markdown features
- Improve the content transformation between formats
- Add collaborative editing capabilities
- Customize the toolbar and menu systems

This migration lays the foundation for more advanced editing capabilities while maintaining the current features of the Semantic Composer.