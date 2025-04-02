# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm start` - Run development server
- Test: `npm test` - Run all tests
- Test single: `npm test -- --testNamePattern="test name"` 
- Build for production: `npm run build`

## Dependencies
- React 18+
- Milkdown v7.7.0 using the @milkdown/crepe package
- Required CSS: '@milkdown/crepe/theme/common/style.css' and '@milkdown/crepe/theme/frame.css'

## Code Guidelines
- **Style**: React functional components with hooks
- **Imports**: Group imports (React, Milkdown libraries, local)
- **Formatting**: 2-space indentation, JSX uses self-closing tags
- **Types**: Use prop destructuring with defaults
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Use try/catch blocks with console.error
- **Component Structure**: Props destructuring, hooks, handlers, JSX return
- **State Management**: useState for local state, props for data flow
- **Event Handlers**: Prefix with 'handle', e.g., handleClick

## Component Pattern
- Initialize Milkdown Crepe in useEffect
- Use refs to maintain editor instance
- Follow existing pattern in SemanticComposer.jsx
- Implement dual view (rich/raw) toggle
- Implement edit/preview mode toggle