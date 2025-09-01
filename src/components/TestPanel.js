"use client";

import React, { useState, useEffect } from "react";

export default function TestPanel({ code: initialCode, language: initialLanguage }) {
  const [code, setCode] = useState(initialCode || "");
  const [language, setLanguage] = useState(initialLanguage || "javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync with parent props
  useEffect(() => {
    setCode(initialCode || "");
    setLanguage(initialLanguage || "javascript");
    setResult(null);
    setError(null);
  }, [initialCode, initialLanguage]);

  const runTests = async () => {
    if (!code) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const responseData = await response.json();
      console.log("API response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to generate tests");
      }

      // Use response directly, not responseData.result
      let parsedResult;
      try {
        parsedResult =
          typeof responseData === "string"
            ? JSON.parse(responseData)
            : responseData;
      } catch (e) {
        throw new Error("AI did not return valid JSON");
      }

      setResult(parsedResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-panel">
      {/* Header */}
      <div className="panel-header">
        <h3>⚡ AI Code Tester</h3>
      </div>

      {/* Code Input */}
      <textarea
        className="tests-text"
        rows={6}
        placeholder="Write or paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {/* Controls */}
      <div className="test-controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>

        <button onClick={runTests} disabled={loading || !code}>
          {loading ? "Running..." : "Run Tests"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Result */}
      {result && (
        <div className="tests-content">
          <pre className="tests-text">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
