# Semantic Composer Default Content

This content is loaded from a static markdown file to demonstrate external content loading.

## Features Showcase

### Text Formatting

You can create **bold text** and *italic text* easily. You can also use ~~strikethrough~~ when needed.

### Lists

Unordered lists:
- Item one
- Item two
- Item three with **bold** text

Ordered lists:
1. First item
2. Second item
3. Third item with *italic* text

### Code

Inline code: `const value = 42;`

Code blocks with syntax highlighting:

```javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

// Example usage
const cart = [
  { name: 'Notebook', price: 4.99, quantity: 2 },
  { name: 'Pen', price: 1.99, quantity: 5 }
];
const total = calculateTotal(cart);
console.log(`Cart total: $${total.toFixed(2)}`);
```

### Tables

| Feature               | Status | Notes                         |
|-----------------------|--------|-------------------------------|
| WYSIWYG Editor        | ✅     | Full rich-text editing        |
| Raw Markdown Mode     | ✅     | Direct markdown editing       |
| Read Mode             | ✅     | Disable editing, keep styling |
| Auto-save             | ✅     | Saves to localStorage         |
| Export                | ✅     | Download as markdown file     |
| Customizable Toolbar  | ✅     | Show/hide buttons as needed   |

### Blockquotes

> Semantic Composer makes markdown editing intuitive while preserving the power and simplicity of markdown syntax.
>
> — Documentation Team

### Links

Visit the [project repository](https://github.com/example/semantic-composer) for more information.

## Implementation

This component is built with React and Milkdown/Crepe. It provides a flexible interface for editing markdown content with multiple view modes:

1. Rich editing (WYSIWYG)
2. Raw markdown editing
3. Read-only viewing

Each mode preserves content and styling consistency for a seamless user experience.