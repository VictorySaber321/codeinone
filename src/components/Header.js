// src/components/Header.js
"use client";

import { useState } from 'react';

export default function Header({ 
  onNewFile, 
  onSaveFile, 
  onSaveAs, 
  onOpenFile, 
  onRunCode,
  onToggleDocumentation,
  onToggleTests,
  onToggleReview,
  showDocumentation,
  showTests,
  showReview
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'cpp', name: 'C++', icon: '⚙️' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'html', name: 'HTML', icon: '🌐' },
    { id: 'css', name: 'CSS', icon: '🎨' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' }
  ];

  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-left">
        <div className="logo">Codeinone</div>
      </div>

      {/* Right: All buttons */}
      <div className="header-right">
        <div className="dropdown-container">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="header-btn new-file-btn"
          >
            + New File
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onNewFile(lang.id);
                    setShowDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  <span className="lang-icon">{lang.icon}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={onOpenFile} className="header-btn">
          📂 Open
        </button>
        <button onClick={onSaveFile} className="header-btn">
          💾 Save
        </button>
        <button onClick={onSaveAs} className="header-btn">
          💾 Save As
        </button>

        <button onClick={onToggleDocumentation}className={`header-btn ${showDocumentation ? 'active' : ''}`}>
          📖 Docs
        </button>
        
        <button 
          onClick={onToggleTests} 
          className={`header-btn ${showTests ? 'active' : ''}`}
        >
          🧪 Tests
        </button>
        <button 
          onClick={onToggleReview} 
          className={`header-btn ${showReview ? 'active' : ''}`}
        >
          🔍 Review
        </button>
      </div>
    </header>
  );
}
