"use client";

export default function Sidebar({ files, activeFile, onFileSelect }) {
  return (
    <div className="sidebar">
      <div className="file-explorer">
        <h3>EXPLORER</h3>
        <ul className="file-tree">
          {files.map((file) => (
            <li
              key={file.name}
              className={activeFile === file.name ? 'active' : ''}
              onClick={() => onFileSelect(file.name, file.language)}
            >
              <span className="file-icon">📄</span>
              <span className="file-name">{file.name}</span>
            </li>
          ))}
          <li>
            <span className="file-icon">📁</span>
            <span className="file-name">src</span>
          </li>
          <li>
            <span className="file-icon">📁</span>
            <span className="file-name">public</span>
          </li>
        </ul>
      </div>

      <div className="file-explorer">
        <h3>AI TOOLS</h3>
        <ul className="file-tree">
          <li>
            <span className="file-icon">🤖</span>
            <span className="file-name">Document</span>
          </li>
          <li>
            <span className="file-icon">🧪</span>
            <span className="file-name">Test</span>
          </li>
          <li>
            <span className="file-icon">🔍</span>
            <span className="file-name">Review</span>
          </li>
        </ul>
      </div>
    </div>
  );
}