// lib/fileSystem.js
class FileSystem {
  constructor() {
    this.fileHandles = new Map();
    this.fileContents = new Map();
  }

  isSupported() {
    return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
  }

  getHandleKey(name, handle = null) {
    return handle ? `${handle.name}-${handle.kind}` : `legacy-${name}`;
  }

  async openFile() {
    try {
      if (!this.isSupported()) {
        return this.openFileLegacy();
      }

      const handles = await window.showOpenFilePicker({
        types: [
          {
            description: 'All Supported Files',
            accept: {
              'text/plain': [
                '.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md',
                '.py', '.java', '.cpp', '.c', '.h', '.hpp', '.cs', '.php', '.rb', '.go', '.rs',
                '.xml', '.yaml', '.yml', '.sql', '.sh', '.bash'
              ],
            },
          },
        ],
        multiple: false
      });

      if (handles.length === 0) return null;

      const fileHandle = handles[0];
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      const handleKey = this.getHandleKey(file.name, fileHandle);
      this.fileHandles.set(handleKey, fileHandle);
      this.fileContents.set(handleKey, content);
      
      return {
        name: file.name,
        content: content,
        handle: fileHandle
      };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error opening file:', error);
        return this.openFileLegacy();
      }
      return null;
    }
  }

  openFileLegacy() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.js,.jsx,.ts,.tsx,.html,.css,.json,.md,.py,.java,.cpp,.c,.h,.cs,.php,.rb,.go,.rs,.xml,.yaml,.yml,.sql,.sh,.bash';
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const handleKey = this.getHandleKey(file.name);
          this.fileContents.set(handleKey, content);
          
          resolve({
            name: file.name,
            content: content,
            handle: null
          });
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    });
  }

  async saveFile(content, suggestedName = 'untitled.txt', handle = null) {
    try {
      if (!this.isSupported()) {
        return this.saveFileLegacy(content, suggestedName);
      }

      let fileHandle = handle;
      
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: suggestedName,
          types: [
            {
              description: 'Text Files',
              accept: {
                'text/plain': [
                  '.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md',
                  '.py', '.java', '.cpp', '.c', '.h', '.hpp', '.cs', '.php', '.rb', '.go', '.rs'
                ],
              },
            },
          ],
        });
      }

      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      
      const handleKey = this.getHandleKey(fileHandle.name, fileHandle);
      this.fileHandles.set(handleKey, fileHandle);
      this.fileContents.set(handleKey, content);
      
      return {
        name: fileHandle.name,
        handle: fileHandle
      };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error saving file:', error);
        return this.saveFileLegacy(content, suggestedName);
      }
      return null;
    }
  }

  saveFileLegacy(content, suggestedName) {
    return new Promise((resolve) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve({
          name: suggestedName,
          handle: null
        });
      }, 100);
    });
  }
}

export const fileSystem = new FileSystem();