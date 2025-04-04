# Migration Guide: From Crepe to Milkdown

This guide provides instructions for migrating from the Crepe-based version of Semantic Composer to the new Milkdown implementation.

## Why We Migrated

We migrated from `@milkdown/crepe` to pure Milkdown because:

1. **Greater Extensibility**: Direct access to Milkdown's API allows for more customization
2. **Better Performance**: Reduced abstraction layers for improved rendering performance
3. **Enhanced Stability**: More direct control over content flow between editor states
4. **Future-Proofing**: Aligning with Milkdown's recommended integration patterns

## Package Changes

### Previous Dependencies:
```json
{
  "@milkdown/crepe": "^7.7.0"
}
```

### New Dependencies:
```json
{
  "@milkdown/react": "^7.7.0",
  "@milkdown/kit": "^7.7.0",
  "@milkdown/preset-commonmark": "^7.7.0",
  "@milkdown/preset-gfm": "^7.7.0",
  "@milkdown/plugin-listener": "^7.7.0",
  "@milkdown/theme-nord": "^7.7.0"
}
```

## API Changes

Most API methods remain the same, with a few enhancements:

| Old Method | New Method | Notes |
|------------|------------|-------|
| `getCrepeInstance()` | `getEditorInstance()` | Both methods still work for backward compatibility |

## CSS Changes

If you were importing Crepe CSS files directly:

```typescript
// Old imports
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
```

Replace with:

```typescript
// New imports
import '@milkdown/theme-nord/style.css';
```

## Usage Changes

The component usage remains the same. All props, event handlers, and ref methods continue to work as before:

```tsx
<SemanticComposer
  ref={editorRef}
  initialValue="# Hello World"
  onChange={handleChange}
  onSave={handleSave}
  // All other props work the same
/>
```

## Advanced Customization

With the migration to pure Milkdown, you now have more options for extending the editor with plugins:

```tsx
import { table } from '@milkdown/plugin-table';
import { SemanticComposer } from './components';

function MyApp() {
  return (
    <SemanticComposer
      plugins={[table]}
      // Other props
    />
  );
}
```

## Troubleshooting

If you encounter any issues during migration:

1. Check console for any errors related to Milkdown initialization
2. Ensure you've added all required dependencies
3. Verify that any custom CSS is compatible with the new implementation
4. If using custom plugins, make sure they're compatible with Milkdown v7.7.0

For more detailed information, see the updated [README.md](./README.md).