# Simplified Migration Plan: Crepe to Pure Milkdown

## 1. Background

The current `SemanticComposer` component uses `@milkdown/crepe`, a higher-level abstraction over the Milkdown editor. This doesn't provide the level of extensibility needed. We'll transition to using the core Milkdown framework directly for more control and extensibility.

## 2. Required Package Changes

### Current Dependencies:
- `@milkdown/crepe`: Higher-level abstraction to be replaced

### New Dependencies to Add:
- `@milkdown/react`: React integration for Milkdown
- `@milkdown/kit`: Core editor functionality
- `@milkdown/preset-commonmark`: For basic markdown features
- `@milkdown/preset-gfm` (optional): For GitHub Flavored Markdown features
- `@milkdown/plugin-listener`: For listening to editor changes
- Optional consideration for a theme: `@milkdown/theme-nord` or custom styling

## 3. Key Implementation Changes

### Editor Initialization
Replace Crepe initialization:
```typescript
const crepe = new Crepe({
  root: editorRef.current,
  defaultValue: content || '',
});

crepe.create()
  .then(() => {
    crepeRef.current = crepe;
    crepe.setReadonly(mode === 'read' || readOnly);
    
    crepe.on((listener: any) => {
      listener.markdownUpdated((markdown: string) => {
        setContent(markdown);
        if (onChange) onChange(markdown);
      });
    });
  });
```

With Milkdown initialization:
```typescript
useEditor((root) => {
  return Editor
    .make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, content || '');
      // Configure readonly state
      ctx.update(editorViewOptionsCtx, (prev) => ({
        ...prev,
        editable: () => !(mode === 'read' || readOnly),
      }));
    })
    .use(commonmark)
    .use(gfm)
    .use(listener)
}, [content, mode, readOnly]);

// Add listener for content changes
useInstance((instance) => {
  if (!instance) return;

  const listener = instance.ctx.get(listenerCtx);
  const removeListener = listener.updated((ctx, doc) => {
    const markdown = instance.ctx.get(markdownCtx)?.serializerManager?.transformDoc(doc);
    if (markdown && markdown !== content) {
      setContent(markdown);
      if (onChange) onChange(markdown);
    }
  });

  return removeListener;
}, [content, onChange]);
```

### Core Feature Replacements

| Crepe Feature | Milkdown Equivalent |
|---------------|---------------------|
| `crepe.setReadonly()` | Update `editorViewOptionsCtx` with `editable` function |
| `crepe.getMarkdown()` | Use `markdownCtx` to transform document |
| `crepe.on()` | Use `listenerCtx` with specific events |
| Editor creation | `useEditor` hook from `@milkdown/react` |
| Editor reference | `useInstance` hook for accessing editor instance |

### CSS Changes
Replace:
```typescript
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
```

With:
```typescript
// Either use a theme or custom styling
import '@milkdown/theme-nord/style.css'; // Optional
// Add custom CSS for editor appearance
```

## 4. Implementation Steps

1. Add required Milkdown packages:
   ```bash
   npm install @milkdown/react @milkdown/kit @milkdown/preset-commonmark @milkdown/preset-gfm @milkdown/plugin-listener
   ```

2. Create a simplified `MilkdownEditor` component that implements:
   - Editor initialization with plugins
   - Read/edit mode toggling
   - Content retrieval/setting

3. Update `SemanticComposer` to use the new Milkdown implementation:
   - Replace Crepe-specific code
   - Maintain the same functionality (toggle views, modes, etc.)
   - Ensure localStorage integration continues to work

4. Add desired extensions for improved functionality:
   - Custom nodes if needed
   - Additional plugins for specific requirements

## 5. Implementation Notes

- Focus on simplicity - keep the implementation as straightforward as possible
- No need for backward compatibility - can make clean breaks
- Avoid over-engineering - implement only what's needed
- Add custom functionality incrementally after the base migration