"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CodeEditor from '@/components/CodeEditor';
import StatusBar from '@/components/StatusBar';
import Terminal from '@/components/Terminal';
import DocumentationPanel from '@/components/DocumentationPanel';
import './globals.css';

export default function Home() {
  const [files, setFiles] = useState([
    { 
      name: 'index.html', 
      language: 'html', 
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to CodeFlow Studio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Hello, Developer!</h1>
    <p>Welcome to your personalized coding environment.</p>
    
    <script>
        console.log('CodeFlow Studio is running!');
    <\/script>
</body>
</html>` 
    },
    { 
      name: 'styles.css', 
      language: 'css', 
      content: '/* CSS file content would appear here */\nbody { background: #1e1e1e; }' 
    },
    { 
      name: 'script.js', 
      language: 'javascript', 
      content: '// JavaScript file content would appear here\nconsole.log("Hello from JS");' 
    },
  ]);

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const activeFile = files[activeFileIndex];

  // Handler functions
  const handleEditorChange = (value) => {
    const updatedFiles = [...files];
    updatedFiles[activeFileIndex].content = value;
    setFiles(updatedFiles);
  };

  const handleFileSelect = (fileName) => {
    const index = files.findIndex(file => file.name === fileName);
    if (index !== -1) {
      setActiveFileIndex(index);
    }
  };

  const handleNewFile = () => {
    const newFileName = `newfile-${files.length + 1}.js`;
    const newFiles = [
      ...files,
      {
        name: newFileName,
        language: 'javascript',
        content: '// New file\nconsole.log("Hello, world!");'
      }
    ];
    setFiles(newFiles);
    setActiveFileIndex(newFiles.length - 1);
  };

  const handleSaveFile = () => {
    alert(`File "${activeFile.name}" saved successfully!`);
  };

  const handleRunCode = () => {
    setShowTerminal(true);
    console.log('Running code:', activeFile.content);
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  const toggleDocumentation = () => {
    setShowDocumentation(!showDocumentation);
  };

  const handleInsertDocumentation = (docs) => {
    // Insert documentation at the beginning of the file
    const updatedFiles = [...files];
    updatedFiles[activeFileIndex].content = `/*\n${docs}\n*/\n\n${activeFile.content}`;
    setFiles(updatedFiles);
  };

  return (
    <div className="container">
      <Header 
        onNewFile={handleNewFile} 
        onSaveFile={handleSaveFile} 
        onRunCode={handleRunCode}
        onToggleTerminal={toggleTerminal}
        onToggleDocumentation={toggleDocumentation}
        showTerminal={showTerminal}
        showDocumentation={showDocumentation}
      />
      
      <div className="main-container">
        <Sidebar 
          files={files} 
          activeFile={activeFile.name} 
          onFileSelect={handleFileSelect} 
        />
        
        <div className="editor-area">
          <CodeEditor 
            code={activeFile.content} 
            language={activeFile.language} 
            onCodeChange={handleEditorChange} 
          />
          
          {showDocumentation && (
            <div className="documentation-panel-container">
              <DocumentationPanel 
                code={activeFile.content}
                language={activeFile.language}
                onInsertDocs={handleInsertDocumentation}
              />
            </div>
          )}
          
          {showTerminal && (
            <div className="terminal-panel">
              <Terminal />
            </div>
          )}
        </div>
      </div>
      
      <StatusBar language={activeFile.language} />
    </div>
  );
}