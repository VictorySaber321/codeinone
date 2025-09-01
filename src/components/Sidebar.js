"use client";

import { useState } from 'react';

export default function Sidebar({ 
  files, 
  activeFileId, 
  onFileSelect, 
  onRename, 
  onDelete, 
  setContextMenu 
}) {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();

    const contextMenuItems = [
      {
        label: 'Rename',
        icon: '✏️',
        action: () => {
          setRenamingId(item.id);
          setRenameValue(item.name);
        }
      },
      {
        label: 'Delete',
        icon: '🗑️',
        action: () => onDelete(item.id)
      }
    ];

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item,
      items: contextMenuItems
    });
  };

  const handleRenameSubmit = (id) => {
    if (renameValue.trim() !== "") {
      onRename(id, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const renderFileTree = (items) => {
    return items.map((item) => (
      <div key={item.id}>
        <div
          className={`file-tree-item ${activeFileId === item.id ? 'active' : ''}`}
          onClick={() => item.type === 'file' && onFileSelect(item.id)}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          <span 
            className="file-icon" 
            onClick={() => item.type === 'folder' && toggleFolder(item.id)}
          >
            {item.type === 'folder' ? (expandedFolders[item.id] ? '📂' : '📁') : '📄'}
          </span>

          {renamingId === item.id ? (
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRenameSubmit(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit(item.id);
                if (e.key === "Escape") {
                  setRenamingId(null);
                  setRenameValue("");
                }
              }}
              autoFocus
              className="rename-input"
            />
          ) : (
            <span className="file-name">{item.name}</span>
          )}
        </div>

        {item.type === 'folder' && expandedFolders[item.id] && item.children && (
          <div className="folder-children">
            {renderFileTree(item.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="sidebar">
      <div className="file-explorer">
        <div className="explorer-header">
          <h3>EXPLORER</h3>
        </div>
        <div className="file-tree">
          {renderFileTree(files)}
        </div>
      </div>

      <div className="file-explorer">
        <h3>AI TOOLS</h3>
        <div className="file-tree">
          <div className="file-tree-item">
            <span className="file-icon">🤖</span>
            <span className="file-name">Document</span>
          </div>
          <div className="file-tree-item">
            <span className="file-icon">🧪</span>
            <span className="file-name">Test</span>
          </div>
          <div className="file-tree-item">
            <span className="file-icon">🔍</span>
            <span className="file-name">Review</span>
          </div>
        </div>
      </div>
    </div>
  );
}
