import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

/**
 * Styles for the SemanticComposer component
 * Including Milkdown-specific overrides previously in SemanticComposer.css
 */
export const useStyles = makeStyles({
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
  toolbarSpacer: {
    flexGrow: 1,
  },
  toolbarActions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  toolbarInfo: {
    marginLeft: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  toolbarDivider: {
    width: '1px',
    height: tokens.spacingVerticalM,
    margin: `0 ${tokens.spacingHorizontalXS}`,
    backgroundColor: tokens.colorNeutralStroke1,
  },
  editorContent: {
    padding: 0,
    margin: 0,
  },
  milkdownWrapper: {
    minHeight: '200px',
    '&.readOnly': {
      backgroundColor: tokens.colorNeutralBackground1,
    },
    // CRITICAL MILKDOWN OVERRIDES - Transferred from CSS
    '& .milkdown, & .milkdown-root > div, & .milkdown .editor, & .milkdown > .ProseMirror-focused, & .milkdown .ProseMirror, & .milkdown .ProseMirror-focused, & .editor > .ProseMirror, & .milkdown > div > div, & .milkdown > div > div > div, & .milkdown-root div, & [data-milkdown-root="true"], & [data-editor-root="true"], & [data-milkdown-root="true"] > div': {
      maxWidth: '100% !important',
      padding: '0 !important',
      margin: '0 !important',
    },
    
    // The actual editor content container
    '& .milkdown .ProseMirror, & .milkdown > .editor': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS} !important`,
      margin: '0 !important',
      border: 'none !important',
      maxWidth: '100% !important',
      fontFamily: tokens.fontFamilyBase,
    },
    
    // Milkdown content color from Fluent theme
    '& .milkdown': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground1,
    },
    
    // Read-only styling
    '&.readOnly .milkdown': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    
    // Target ProseMirror directly
    '& .ProseMirror, & .milkdown-editor-wrapper .ProseMirror, & .milkdown .ProseMirror': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS} !important`,
    },
    
    // Headings
    '& .milkdown h1, & .milkdown h2, & .milkdown h3': {
      fontFamily: tokens.fontFamilyBase,
      marginTop: tokens.spacingVerticalS,
      marginBottom: tokens.spacingVerticalS,
    },
    '& .milkdown h1': {
      fontSize: tokens.fontSizeBase600,
      fontWeight: tokens.fontWeightSemibold,
    },
    '& .milkdown h2': {
      fontSize: tokens.fontSizeBase500,
      fontWeight: tokens.fontWeightSemibold,
    },
    '& .milkdown h3': {
      fontSize: tokens.fontSizeBase400,
      fontWeight: tokens.fontWeightSemibold,
    }
  },
  rawEditor: {
    width: '100%',
    minHeight: '200px',
    padding: tokens.spacingHorizontalS,
    ...shorthands.border('none'),
    ...shorthands.outline('none'),
    resize: 'none',
    overflow: 'hidden',
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  small: {
    '& .milkdown, & .milkdown .editor, & .milkdown .ProseMirror, & .rawEditor': {
      fontSize: tokens.fontSizeBase200,
    }
  },
  medium: {
    '& .milkdown, & .milkdown .editor, & .milkdown .ProseMirror, & .rawEditor': {
      fontSize: tokens.fontSizeBase300,
    }
  },
  large: {
    '& .milkdown, & .milkdown .editor, & .milkdown .ProseMirror, & .rawEditor': {
      fontSize: tokens.fontSizeBase400,
    }
  },
  outline: {
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  },
  underline: {
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(0),
  },
  filledDarker: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  filledLighter: {
    backgroundColor: tokens.colorNeutralBackground2,
  }
});