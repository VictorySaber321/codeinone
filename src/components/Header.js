"use client";

export default function Header({ 
  onNewFile, 
  onSaveFile, 
  onRunCode, 
  onToggleTerminal, 
  onToggleDocumentation,
  showTerminal, 
  showDocumentation 
}) {
  return (
    <header>
      <div className="logo">CodeFlow Studio</div>
      <div className="toolbar">
        <button id="new-file" onClick={onNewFile}>
          <span>New File</span> +
        </button>
        <button id="save-file" onClick={onSaveFile}>
          <span>Save</span> 💾
        </button>
        <button id="run-code" onClick={onRunCode}>
          <span>Run</span> ▶️
        </button>
        <button 
          id="toggle-documentation" 
          onClick={onToggleDocumentation} 
          className={showDocumentation ? 'active' : ''}
        >
          <span>Document</span> 📝
        </button>
        <button 
          id="toggle-terminal" 
          onClick={onToggleTerminal} 
          className={showTerminal ? 'active' : ''}
        >
          <span>Terminal</span> {showTerminal ? '▼' : '▲'}
        </button>
      </div>
    </header>
  );
}