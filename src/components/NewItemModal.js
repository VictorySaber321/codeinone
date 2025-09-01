"use client";

import { useState } from 'react';

export default function NewItemModal({ isOpen, onClose, onCreate, parentId }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('file');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name, type, parentId);
      setName('');
      setType('file');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}