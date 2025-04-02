import React, { useState } from 'react';
import './App.css';
import SemanticComposer from './components/SemanticComposer';

function App() {
  const [markdown, setMarkdown] = useState('# Welcome to Semantic Composer Demo\n\nThis is a **demo** of the AI-powered markdown editor component.\n\n## Features\n\n- Edit/Read mode toggle\n- Rich/Raw markdown toggle\n- Code block support with syntax highlighting\n\n```javascript\nfunction hello() {\n  console.log("Hello, world!");\n}\n```\n\n| Feature | Status |\n| ------- | ------ |\n| Basic Formatting | ✅ |\n| Code Blocks | ✅ |\n| Tables | ✅ |\n');
  const [theme, setTheme] = useState('light');

  const handleChange = (value) => {
    setMarkdown(value);
    console.log('Markdown updated:', value);
  };

  const handleSave = (value) => {
    console.log('Saving markdown:', value);
    localStorage.setItem('markdown-content', value);
    alert('Content saved to localStorage');
  };

  const loadSaved = () => {
    const saved = localStorage.getItem('markdown-content');
    if (saved) {
      setMarkdown(saved);
      alert('Content loaded from localStorage');
    } else {
      alert('No saved content found');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app" data-theme={theme}>
      <header className="app-header">
        <h1>Semantic Composer Demo</h1>
        <div className="action-buttons">
          <button onClick={loadSaved}>Load Saved</button>
          <button onClick={() => handleSave(markdown)}>Save</button>
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>
      <main className="app-main">
        <SemanticComposer
          initialValue={markdown}
          onChange={handleChange}
          onSave={handleSave}
          theme={theme}
          width="100%"
        />
      </main>
      <footer className="app-footer">
        <p>Semantic Composer: AI-Powered Markdown Editor Component</p>
      </footer>
    </div>
  );
}

export default App;