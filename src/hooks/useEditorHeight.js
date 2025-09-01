"use client";

import { useEffect } from 'react';

export const useEditorHeight = (code, editorRef) => {
  useEffect(() => {
    if (editorRef.current) {
      // Force a layout update after a short delay
      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [code, editorRef]);
};