"use client";

import { useState } from 'react';

export default function ReviewPanel({ code, language }) {
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReview = async () => {
    if (!code.trim()) {
      setError('Please provide some code to review');
      return;
    }

    setIsLoading(true);
    setError('');
    setReview('');

    try {
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: code.trim(),
          language: language || 'javascript'
        }),
      });

      // Check if response is HTML (shouldn't happen with proper API setup)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('API endpoint returned HTML instead of JSON. Check your API route.');
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      if (!responseData.review) {
        throw new Error('No review content received from API');
      }

      setReview(responseData.review);

    } catch (err) {
      console.error('Review generation failed:', err);
      setError(err.message || 'Failed to generate code review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatReviewContent = (reviewText) => {
    // Convert markdown-like formatting to HTML
    return reviewText
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h4 key={index} className="review-heading">{line.substring(2)}</h4>;
        } else if (line.startsWith('## ')) {
          return <h5 key={index} className="review-subheading">{line.substring(3)}</h5>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="review-list-item">{line.substring(2)}</li>;
        } else if (line.startsWith('```')) {
          return null; // Skip code block markers
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="review-paragraph">{line}</p>;
        }
      });
  };

  return (
    <div className="review-panel">
      <div className="panel-header">
        <h3>🔍 AI Code Review</h3>
        <button 
          onClick={generateReview} 
          disabled={isLoading || !code.trim()}
          className="generate-btn"
        >
          {isLoading ? '🧠 Analyzing Code...' : '📋 Review Code'}
        </button>
      </div>

      <div className="code-info">
        <small>
          Language: <strong>{language || 'unknown'}</strong> • 
          Lines: <strong>{code.trim().split('\n').length}</strong>
        </small>
      </div>

      {error && (
        <div className="error-message">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing your code with Gemini AI...</p>
        </div>
      )}

      {review && (
        <div className="review-content">
          <div className="review-header">
            <h4>📊 Review Results</h4>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(review);
                alert('Review copied to clipboard!');
              }}
              className="copy-btn"
            >
              📋 Copy
            </button>
          </div>
          <div className="review-text">
            {formatReviewContent(review)}
          </div>
        </div>
      )}

      {!review && !isLoading && !error && (
        <div className="placeholder">
          <div className="placeholder-icon">👨‍💻</div>
          <p>Ready to analyze your code</p>
          <small>Click "Review Code" to get AI-powered insights</small>
        </div>
      )}
    </div>
  );
}