"use client";

import { useState } from 'react';

export default function DocumentationPanel({ code, language, onInsertDocs }) {
  const [documentation, setDocumentation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fallback mock documentation generator
  const generateMockDocumentation = () => {
    return `/**
 * Auto-generated documentation
 * 
 * Language: ${language}
 * 
 * This is a placeholder documentation.
 * Set up your AI documentation API to get real documentation.
 */
 
// TODO: Add proper documentation using an AI service
// You'll need to set up an API endpoint at /api/generate-docs`;
  };

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

      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        // API endpoint likely doesn't exist, use mock data
        console.warn('API endpoint not found, using mock documentation');
        setDocumentation(generateMockDocumentation());
        setIsLoading(false);
        return;
      }

      // If we get here, we likely have a JSON response
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to generate documentation');
      }

      setDocumentation(responseData.documentation);
    } catch (err) {
      // If fetch fails completely (network error, etc.), use mock data
      console.warn('API request failed, using mock documentation:', err.message);
      setDocumentation(generateMockDocumentation());
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
          <strong>Error:</strong> {error}
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
          <p className="note">
            <small>
              Note: You need to set up the API endpoint at <code>/api/generate-docs</code> for AI-powered documentation.
              Currently using mock data.
            </small>
          </p>
        </div>
      )}
    </div>
  );
}