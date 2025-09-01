"use client";

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CodeEditor from '@/components/CodeEditor';
import StatusBar from '@/components/StatusBar';
import DocumentationPanel from '@/components/DocumentationPanel';
import TestPanel from '@/components/TestPanel';
import ReviewPanel from '@/components/ReviewPanel';
import ContextMenu from '@/components/ContextMenu';
import RenameModal from '@/components/RenameModal';
import NewItemModal from '@/components/NewItemModal';
import { fileSystem } from '@/lib/fileSystem';
import './globals.css';

export default function Home() {
  // ===============================
  // State
  // ===============================
  const [files, setFiles] = useState([]); // Empty array instead of example files

  const [activeFileId, setActiveFileId] = useState(null);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [contextMenu, setContextMenu] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    item: null, 
    items: [] 
  });
  const [renameModal, setRenameModal] = useState({ isOpen: false, item: null });
  const [newItemModal, setNewItemModal] = useState({ isOpen: false, parentId: null });
  
  const fileHandles = useRef(new Map());

  // ===============================
  // Helpers
  // ===============================
  // Find File function
  const findFile = (id, items = files) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children && item.children.length > 0) {
        const found = findFile(id, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const detectLanguage = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
     const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'c': 'c',
      'h': 'c',
      'java': 'java',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext'
    };
    return languageMap[extension] || 'plaintext';
  };
  
  // Helper function to get default content for a language
  const getDefaultContent = (language) => {
    const defaultContent = {
      javascript: '// JavaScript file\nconsole.log("Hello, world!");',
      python: '# Python file\nprint("Hello, world!")',
      cpp: '// C++ file\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}',
      java: '// Java file\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}',
      html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>New Document</title>\n</head>\n<body>\n    <h1>Hello, world!</h1>\n</body>\n</html>',
      css: '/* CSS file */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}',
      plaintext: 'Plain text file'
    };
    
    return defaultContent[language] || `// ${language} file`;
  };

  // ===============================
  // File Operations (fixed versions)
  // ===============================

  // Handle creating new files
const handleNewFile = (language = 'javascript') => {
  const getFileExtension = (lang) => {
    const extensionMap = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'cpp': 'cpp',
      'java': 'java',
      'html': 'html',
      'css': 'css',
      'markdown': 'md',
      'plaintext': 'txt'
    };
    return extensionMap[lang] || 'txt';
  };

  const extension = getFileExtension(language);
  const content = getDefaultContent(language);

  // Count how many files of this type already exist
  const sameTypeCount = files.filter(file => 
    file.name.endsWith(`.${extension}`)
  ).length;
  
  const newFile = {
    id: Date.now().toString(),
    name: `newfile.${extension}`,
    type: 'file',
    language: language, // Ensure this is always a string
    content: content,
    handle: null
  };

  setFiles(prevFiles => [...prevFiles, newFile]);
  setActiveFileId(newFile.id);
};

  // Handle opening files
  const handleOpenFile = async () => {
    try {
      const fileData = await fileSystem.openFile();
      if (!fileData) return; // User cancelled
      
      // Check if file already exists by content and name
      const existingFileIndex = files.findIndex(f => 
        f.name === fileData.name && f.content === fileData.content
      );
      
      if (existingFileIndex >= 0) {
        // Switch to existing file
        setActiveFileId(files[existingFileIndex].id);
      } else {
        // Create new file entry
        const language = detectLanguage(fileData.name);
        
        const newFile = {
          id: Date.now().toString(),
          name: fileData.name,
          type: 'file',
          language: language,
          content: fileData.content,
          handle: fileData.handle
        };
        
        setFiles(prevFiles => [...prevFiles, newFile]);
        setActiveFileId(newFile.id);
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open file: ' + error.message);
    }
  };
    
  // Handle saving files
  const handleSaveFile = async () => {
    try {
      const activeFile = findFile(activeFileId);
      if (!activeFile) {
        alert('No active file to save');
        return;
      }
      
      const result = await fileSystem.saveFile(
        activeFile.content,
        activeFile.name,
        activeFile.handle
      );
      
      if (result) {
        // Update the file with the new handle
        setFiles(prevFiles => 
          prevFiles.map(file => 
            file.id === activeFileId 
              ? { ...file, handle: result.handle, name: result.name }
              : file
          )
        );
        alert(`File "${result.name}" saved successfully!`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file: ' + error.message);
    }
  };

  // Handle save as
  const handleSaveAs = async () => {
    try {
      const activeFile = findFile(activeFileId);
      if (!activeFile) {
        alert('No active file to save');
        return;
      }
      
      const result = await fileSystem.saveFile(
        activeFile.content,
        activeFile.name
      );
      
      if (result) {
        // Update the file with the new handle and name
        setFiles(prevFiles => 
          prevFiles.map(file => 
            file.id === activeFileId 
              ? { ...file, handle: result.handle, name: result.name }
              : file
          )
        );
        alert(`File saved as "${result.name}"!`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file: ' + error.message);
    }
  };

  // Handle editor changes
  const handleEditorChange = (newCode) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, content: newCode }
          : file
      )
    );
  };

  // Handle file operations
  const handleRename = (itemId, newName) => {
    const updatedFiles = files.map(file => {
      if (file.id === itemId) {
        return { ...file, name: newName };
      }
      return file;
    });
    setFiles(updatedFiles);
  };

  const handleDelete = (itemId) => {
    const updatedFiles = files.filter(file => file.id !== itemId);
    setFiles(updatedFiles);
    
    // If the active file was deleted, set a new active file
    if (activeFileId === itemId && updatedFiles.length > 0) {
      setActiveFileId(updatedFiles[0].id);
    } else if (updatedFiles.length === 0) {
      setActiveFileId(null);
    }
  };

  const handleNewItem = (type, name, parentId) => {
    const newItem = {
      id: Date.now().toString(),
      name: name,
      type: type,
      ...(type === 'file' ? { 
        language: 'javascript', 
        content: '// New file' 
      } : { children: [] })
    };
    
    if (!parentId) {
      // Add to root
      setFiles([...files, newItem]);
    } else {
      // Add to a folder
      const updatedFiles = files.map(file => {
        if (file.id === parentId && file.type === 'folder') {
          return {
            ...file,
            children: [...(file.children || []), newItem]
          };
        }
        return file;
      });
      setFiles(updatedFiles);
    }
  };

  // ===============================
  // Other UI Handlers (unchanged)
  // ===============================
  const handleFileSelect = (fileId) => setActiveFileId(fileId);
  const handleRunCode = () => { 
    const activeFile = findFile(activeFileId);
    if (activeFile) {
      console.log('Running:', activeFile.content); 
    }
  };
  const toggleDocumentation = () => setShowDocumentation(!showDocumentation);
  const toggleTests = () => setShowTests(!showTests);
  const toggleReview = () => setShowReview(!showReview);

  // ===============================
  // Render
  // ===============================
  const activeFile = findFile(activeFileId);

  return (
    <div className="container">
      <Header
        onNewFile={handleNewFile}
        onSaveFile={handleSaveFile}
        onSaveAs={handleSaveAs}
        onOpenFile={handleOpenFile}
        onRunCode={handleRunCode}
        onToggleDocumentation={toggleDocumentation}
        onToggleTests={toggleTests}
        onToggleReview={toggleReview}
        showDocumentation={showDocumentation}
        showTests={showTests}
        showReview={showReview}
      />

      <div className="main-container">
        <Sidebar
          files={files}
          activeFileId={activeFileId}
          onFileSelect={handleFileSelect}
          onRename={handleRename}
          onDelete={handleDelete}
          onNewItem={(parentId) => setNewItemModal({ isOpen: true, parentId })}
          setContextMenu={setContextMenu}
        />

        <div className="editor-area">
          {activeFile ? (
            <CodeEditor
              key={activeFileId}
              code={activeFile.content}
              language={activeFile.language}
              onCodeChange={handleEditorChange}
            />
          ) : (
            <div className="editor-placeholder">
              <h3>Welcome to Codeinone</h3>
              <p>Create a new file or open an existing one to start coding and testing.</p>
            </div>
          )}

          {showDocumentation && activeFile && <DocumentationPanel code={activeFile.content} language={activeFile.language} />}
          {showTests && activeFile && <TestPanel code={activeFile.content} language={activeFile.language} />}
          {showReview && activeFile && <ReviewPanel code={activeFile.content} language={activeFile.language} />}
    
        </div>
      </div>

      <StatusBar language={activeFile?.language || 'plaintext'} />

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={contextMenu.items}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
      />
      
      <RenameModal
        item={renameModal.item}
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false, item: null })}
        onRename={handleRename}
      />
      
      <NewItemModal
        isOpen={newItemModal.isOpen}
        onClose={() => setNewItemModal({ isOpen: false, parentId: null })}
        onCreate={handleNewItem}
        parentId={newItemModal.parentId}
      />
    </div>
  );}
