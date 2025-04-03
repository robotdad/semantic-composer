# Semantic Composer API Design

## Implemented Solution

The Semantic Composer component now properly supports document identity with the following enhancements:

1. **Enhanced API**: Document ID is now a first-class concept
   - `setContent(content, documentId)` - Set content with optional document ID
   - `getCurrentContent()` - Returns `{ content, documentId }` object
   - `getDocumentId()` - Get current document ID
   - `getStorageKey()` - Get current storage key based on document ID
   - `loadDocument(content, docId)` - Shorthand for setContent with document ID (for backward compatibility)

2. **Storage Management**:
   - Each document has its own storage key: `${storageKeyPrefix}:${documentId}`
   - Current document ID is tracked in `${storageKeyPrefix}:current-document-id`
   - The component maintains only one active document at a time

3. **Auto-save Enhancements**:
   - Auto-save correctly targets the current document's storage key
   - `onSave` callback includes the document ID: `onSave(content, documentId)`

4. **Improved Configuration**:
   - `initialDocumentId` prop instead of `storageKey`
   - `storageKeyPrefix` prop for customizing storage namespace
   - `makeStorageKey` utility function for consistent key generation

5. **Reset Enhancement**:
   - `reset()` method now supports `resetToDefaultDocument` option

## Usage Examples

Loading content with document identity:
```javascript
// Set content with document ID
editorRef.current.setContent(markdownContent, "document-123");

// Or use loadDocument shorthand (backward compatible)
editorRef.current.loadDocument(markdownContent, "document-123");
```

Getting content with document identity:
```javascript
// Get content object with document ID
const { content, documentId } = editorRef.current.getCurrentContent();
console.log(`Content from document ${documentId}: ${content.substring(0, 30)}...`);
```

Resetting the editor:
```javascript
// Clear everything and reset to default document
editorRef.current.reset({
  clearContent: true,
  clearAllStorage: true,
  resetToDefaultDocument: true
});
```

## Implementation Details

The implementation:
1. Uses React state to track the current document ID
2. Derives storage keys from document IDs using a consistent pattern
3. Updates the storage key when document ID changes
4. Ensures all operations (auto-save, manual save, raw editing) use the current document's storage key
5. Maintains backward compatibility with existing API methods
6. Uses smart reset functionality that properly reinitializes the editor
7. Handles edge cases like mode switching with correct content preservation

This implementation allows for multiple documents to be managed without collision, while maintaining a simple API for clients to use.

## Important Technical Details

- The editor is reinitialized when content or document ID changes to ensure state consistency
- We use React's useEffect and useImperativeHandle hooks to manage the component lifecycle
- The document ID is the source of truth for determining storage keys
- All save operations use the current document ID to derive the storage key
- The reset method destroys and recreates the editor instance to ensure a clean state