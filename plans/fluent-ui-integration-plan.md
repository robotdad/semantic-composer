# Integration Plan for SemanticComposer into the Semantic Workbench

## 1. Dependencies Alignment

```typescript
// Replace react-icons with Fluent UI icons
// FROM:
import { FiEdit, FiEye, FiType, FiCode, FiSave, FiDownload } from 'react-icons/fi';

// TO:
import { 
  Edit24Regular, 
  Eye24Regular, 
  TextFont24Regular, 
  Code24Regular, 
  Save24Regular, 
  ArrowDownload24Regular 
} from '@fluentui/react-icons';
```

## 2. CSS & Styling Transformation

```typescript
// Replace custom CSS with makeStyles pattern
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    width: '100%',
    fontFamily: tokens.fontFamilyBase,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  // ... more styles
});
```

## 3. Component Integration

```typescript
// Replace custom buttons with Fluent UI buttons
import { Button, Tooltip } from '@fluentui/react-components';

// In the component JSX:
<Tooltip content={mode === 'edit' ? 'Switch to Read mode' : 'Switch to Edit mode'}>
  <Button 
    icon={mode === 'edit' ? <Eye24Regular /> : <Edit24Regular />}
    appearance="subtle"
    onClick={toggleMode}
  />
</Tooltip>
```

## 4. Theme Integration

```typescript
// Import Theme provider and tokens
import { useTheme } from '../path/to/Theme';

// In component:
const { theme } = useTheme();
const isDarkTheme = theme === 'dark';

// Dynamically apply proper styling based on theme
useEffect(() => {
  // Apply Fluent theme tokens to Milkdown
  const milkdownTheme = {
    backgroundColor: isDarkTheme ? tokens.colorNeutralBackground1 : tokens.colorNeutralBackground1,
    textColor: isDarkTheme ? tokens.colorNeutralForeground1 : tokens.colorNeutralForeground1,
    // other theme properties
  };
  
  // Apply to editor if available
  if (crepeRef.current) {
    // Apply theme to Milkdown
  }
}, [isDarkTheme]);
```

## 5. Responsive Design

```typescript
// Add responsive tokens for spacing
const styles = useStyles();

// In JSX:
<div className={styles.root} style={{ width }}>
  {/* Make editor responsive with fluid layout */}
  <div className={styles.editorContent}>
    {/* Editor content */}
  </div>
</div>
```

## 6. Accessibility Enhancements

```typescript
// Add aria labels and keyboard navigation support
<Button 
  icon={<Save24Regular />}
  appearance="subtle" 
  onClick={handleSave}
  aria-label="Save content"
  accessKey="s"
/>
```

## 7. Integration with DialogControl (for modal editing)

```typescript
// Create wrapper component to integrate with DialogControl
import { DialogControl } from '../path/to/DialogControl';

export const SemanticComposerDialog = ({ 
  open, 
  onOpenChange,
  title = "Edit Content",
  initialContent,
  onSave,
  ...props 
}) => {
  return (
    <DialogControl
      open={open}
      onOpenChange={onOpenChange}
      title={title}
    >
      <SemanticComposer
        initialValue={initialContent}
        onSave={(content, docId) => {
          onSave?.(content, docId);
          onOpenChange?.(false);
        }}
        {...props}
      />
    </DialogControl>
  );
};
```

## 8. Implementation Tasks

1. Create a fork of the SemanticComposer component in the target project
2. Replace all styling with Fluent makeStyles approach
3. Replace react-icons with Fluent UI icons
4. Integrate with the app's theme system via Theme.ts
5. Replace custom buttons with Fluent UI Button components
6. Ensure responsive design with tokens
7. Add integration with DialogControl for modal editing
8. Support dark/light theme inheritance from app
9. Add documentation on how to use the component within the app

## 9. Migration Steps

1. Install dependencies in the target project:
   - Ensure `@milkdown/crepe` is installed (v7.7.0)
   - Import required Milkdown CSS files
2. Create a new component in the semanticworkbench project
3. Create a new type definition file for the component
4. Integrate the component with existing DebugInspector.tsx
5. Ensure theme tokens are properly applied
6. Add tests for the new component

## Progress Tracking

- [x] Dependencies installed in target project (@fluentui/react-components and @fluentui/react-icons)
- [ ] Fork of SemanticComposer created in target project
- [x] CSS replaced with makeStyles (created SemanticComposer.styles.ts)
- [x] React-icons replaced with Fluent UI icons (using @fluentui/react-icons)
- [x] Theme integration completed (using FluentProvider with webLightTheme/webDarkTheme)
- [x] Custom buttons replaced with Fluent UI components (Button component with icons)
- [x] Responsive design implemented (using Fluent tokens)
- [x] DialogControl integration added (created SemanticComposerDialog.tsx)
- [x] Dark/light theme support added (using FluentProvider)
- [x] Documentation added (created FLUENT_INTEGRATION.md)
- [ ] Integration with DebugInspector.tsx completed
- [ ] Tests added

## Completed Items

1. ✅ Updated types.ts to add Fluent UI specific props:
   - Added EditorSize and EditorAppearance types
   - Added useFluentProvider and fluentProviderProps options
   - Organized props into logical sections
   
2. ✅ Created Fluent UI styles:
   - Created SemanticComposer.styles.ts using makeStyles
   - Added styling for different appearances and sizes
   - Made component theme-aware
   
3. ✅ Replaced custom buttons with Fluent UI Button components:
   - Added Tooltips for better UX
   - Used aria-labels for accessibility
   
4. ✅ Added Fluent theme support:
   - Added FluentProvider with theme switching
   - Made the FluentProvider optional with useFluentProvider prop
   
5. ✅ Component restructuring:
   - Enhanced with proper Fluent component patterns
   - Added responsive design with tokens
   - Added size and appearance customization
   
6. ✅ Created documentation:
   - Added FLUENT_INTEGRATION.md with usage examples
   - Documented new props and features
   - Added integration examples with DialogControl
   
7. ✅ Added DialogControl integration:
   - Created SemanticComposerDialog component 
   - Added dialog-specific styles and behaviors
   - Implemented save/cancel workflow
   - Added barrel file (index.ts) for easier imports

8. ✅ Hybrid CSS approach:
   - Retained original SemanticComposer.css for critical Milkdown styling
   - Added makeStyles in SemanticComposer.styles.ts for Fluent components
   - Used dual class names to ensure both styling systems work together
   - Ensured all required CSS classes for Milkdown DOM elements are present
   
9. ✅ Simplified theming:
   - Removed light/dark theme handling
   - Using Fluent UI's theme context exclusively
   - Removed theme prop from components
   - Updated documentation to reflect changes