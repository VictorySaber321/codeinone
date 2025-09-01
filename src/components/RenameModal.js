"use client";

import { useState, useEffect } from 'react';

export default function RenameModal({ item, isOpen, onClose, onRename }) {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (isOpen && item) {
      setNewName(item.name);
    }
  }, [isOpen, item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() && newName !== item.name) {
      onRename(item.id, newName);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Rename {item.type}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}