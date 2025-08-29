"use client";

import { Editor as MonacoEditor } from '@monaco-editor/react';

export default function CodeEditor({ code, language, onCodeChange }) {
  return (
    <div className="editor-container">
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={onCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
}