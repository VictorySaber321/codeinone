export const languageExtensions = {
  // Programming languages
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'py': 'python',
  'cpp': 'cpp',
  'cc': 'cpp',
  'cxx': 'cpp',
  'c': 'c',
  'h': 'cpp',
  'hpp': 'cpp',
  'java': 'java',
  'rb': 'ruby',
  'go': 'go',
  'rs': 'rust',
  'php': 'php',
  'swift': 'swift',
  'kt': 'kotlin',
  'scala': 'scala',
  
  // Web technologies
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  
  // Data formats
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',
  'csv': 'csv',
  
  // Documentation
  'md': 'markdown',
  'markdown': 'markdown',
  'txt': 'plaintext',
  
  // Config files
  'ini': 'ini',
  'conf': 'ini',
  'cfg': 'ini',
  'toml': 'toml',
  
  // Shell scripts
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  'fish': 'shell',
  
  // SQL
  'sql': 'sql',
  'mysql': 'sql',
  'pgsql': 'sql'
};

export function detectLanguage(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return languageExtensions[extension] || 'plaintext';
}

export function getFileExtension(language) {
  const extensionMap = {
    'javascript': 'js',
    'typescript': 'ts',
    'python': 'py',
    'cpp': 'cpp',
    'c': 'c',
    'java': 'java',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'markdown': 'md'
  };
  
  return extensionMap[language] || 'txt';
}