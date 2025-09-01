"use client";

import MonacoEditor from '@monaco-editor/react';

// Language configuration mapping
const languageConfig = {
  javascript: 'javascript',
  js: 'javascript',
  jsx: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'typescript',
  python: 'python',
  py: 'python',
  cpp: 'cpp',
  cxx: 'cpp',
  cc: 'cpp',
  h: 'cpp',
  hpp: 'cpp',
  java: 'java',
  html: 'html',
  css: 'css',
  json: 'json',
  markdown: 'markdown',
  md: 'markdown',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  sql: 'sql',
  bash: 'shell',
  sh: 'shell',
  shell: 'shell',
  plaintext: 'plaintext',
  text: 'plaintext'
};

export default function CodeEditor({ code, language, onCodeChange }) {
  // Normalize the language identifier for Monaco
  const normalizedLanguage = languageConfig[language] || language;

  return (
    <div className="editor-container">
      <MonacoEditor
        height="100%"
        language={normalizedLanguage}
        value={code}
        onChange={onCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          lineNumbersMinChars: 3,
          folding: true, // Keep folding enabled for better code navigation
          overviewRulerBorder: false,
          renderFinalNewline: 'off',
          renderLineHighlight: 'all',
          scrollBeyondLastColumn: 0,
          padding: { top: 10, bottom: 10 },
          // Language-specific optimizations
          ...getLanguageSpecificOptions(normalizedLanguage),
        }}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

// Language-specific editor options
function getLanguageSpecificOptions(language) {
  const commonOptions = {
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: true,
  };

  const languageOptions = {
    python: {
      tabSize: 4,
    },
    java: {
      tabSize: 4,
    },
    cpp: {
      tabSize: 2,
    },
    html: {
      tabSize: 2,
      emmet: true, // Enable Emmet for HTML
    },
    css: {
      tabSize: 2,
      emmet: true, // Enable Emmet for CSS
    },
    javascript: {
      tabSize: 2,
    },
    typescript: {
      tabSize: 2,
    },
  };

  return { ...commonOptions, ...(languageOptions[language] || {}) };
}

// Configure Monaco editor before mounting
function handleEditorWillMount(monaco) {
  // Configure default settings for all languages
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    typeRoots: ["node_modules/@types"]
  });

  // Configure Python-specific settings (if needed)
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      // Python-specific autocomplete can be added here
      return { suggestions: [] };
    }
  });

  // Configure C++ specific settings
  monaco.languages.registerCompletionItemProvider('cpp', {
    provideCompletionItems: (model, position) => {
      // C++ specific autocomplete can be added here
      return { suggestions: [] };
    }
  });

  // Configure Java specific settings
  monaco.languages.registerCompletionItemProvider('java', {
    provideCompletionItems: (model, position) => {
      // Java specific autocomplete can be added here
      return { suggestions: [] };
    }
  });
}

// Handle editor after mounting
function handleEditorDidMount(editor, monaco) {
  // Configure editor shortcuts and behaviors
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // Save command - you can hook this into your save functionality
    console.log('Save triggered from editor');
  });

  // Enable format on paste for supported languages
  const formatOnPasteLanguages = ['javascript', 'typescript', 'python', 'java', 'cpp'];
  if (formatOnPasteLanguages.includes(editor.getModel()?.getLanguageId())) {
    editor.onDidPaste(() => {
      setTimeout(() => {
        editor.getAction('editor.action.formatDocument')?.run();
      }, 100);
    });
  }
}

// Helper function to detect language from filename (optional)
export function detectLanguageFromFilename(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return languageConfig[extension] || 'plaintext';
}