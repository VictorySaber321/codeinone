"use client";

import { useState } from 'react';

export default function DocumentationPanel({ code, language, onInsertDocs }) {
  const [documentation, setDocumentation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDocumentation = async () => {
    if (!code.trim()) {
      setError('No code to document');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate documentation');
      }

      const data = await response.json();
      setDocumentation(data.documentation);
    } catch (err) {
      setError(err.message);
      console.error('Error generating documentation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (documentation && onInsertDocs) {
      onInsertDocs(documentation);
    }
  };

  return (
    <div className="documentation-panel">
      <div className="panel-header">
        <h3>AI Documentation</h3>
        <button 
          onClick={generateDocumentation} 
          disabled={isLoading}
          className="generate-btn"
        >
          {isLoading ? 'Generating...' : 'Generate Docs'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {documentation && (
        <div className="documentation-content">
          <div className="docs-header">
            <h4>Generated Documentation:</h4>
            <button onClick={handleInsert} className="insert-btn">
              Insert into Code
            </button>
          </div>
          <pre className="docs-text">{documentation}</pre>
        </div>
      )}

      {!documentation && !isLoading && !error && (
        <div className="placeholder">
          <p>Click "Generate Docs" to create documentation for your code</p>
        </div>
      )}
    </div>
  );
}