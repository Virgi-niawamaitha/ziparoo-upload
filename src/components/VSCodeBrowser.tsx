
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Folder, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { formatFileSize, isTextFile, getFileExtension } from "@/utils/fileUtils";
import { useToast } from "@/components/ui/use-toast";

interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  content?: string;
  children?: FileEntry[];
  expanded?: boolean;
}

interface VSCodeBrowserProps {
  onReset: () => void;
}

const VSCodeBrowser = ({ onReset }: VSCodeBrowserProps) => {
  const [fileTree, setFileTree] = useState<FileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [cursor, setCursor] = useState({ visible: true, line: 0, column: 0 });
  const [editorContent, setEditorContent] = useState<string[]>([]);

  useEffect(() => {
    // Blink cursor every 500ms
    const interval = setInterval(() => {
      setCursor(prev => ({ ...prev, visible: !prev.visible }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const files = Array.from(event.target.files);
    setLoading(true);
    
    try {
      const tree: FileEntry[] = [];
      const processedPaths = new Set<string>();
      
      for (const file of files) {
        const path = file.webkitRelativePath || file.name;
        const pathParts = path.split('/');
        
        let currentLevel = tree;
        let currentPath = '';
        
        // Process each directory in the path
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          currentPath += (currentPath ? '/' : '') + part;
          
          // Skip if we've already processed this path
          if (processedPaths.has(currentPath)) {
            const existingDir = findInTree(currentLevel, part);
            if (existingDir) {
              currentLevel = existingDir.children || [];
            }
            continue;
          }
          
          processedPaths.add(currentPath);
          
          // Check if directory already exists at this level
          let dirEntry = findInTree(currentLevel, part);
          
          if (!dirEntry) {
            // Create new directory entry
            dirEntry = {
              name: part,
              path: currentPath,
              isDirectory: true,
              size: 0,
              children: [],
              expanded: true
            };
            currentLevel.push(dirEntry);
          }
          
          currentLevel = dirEntry.children || [];
        }
        
        // Finally, add the file itself
        const fileName = pathParts[pathParts.length - 1];
        
        // Only add if it's not already in the tree
        if (!findInTree(currentLevel, fileName)) {
          currentLevel.push({
            name: fileName,
            path: path,
            isDirectory: false,
            size: file.size,
            content: undefined // Will be loaded on demand
          });
          
          // Also store the file in a map for quick retrieval
          fileMap.set(path, file);
        }
      }
      
      sortFileTree(tree);
      setFileTree(tree);
      toast({
        title: "Files uploaded",
        description: `${files.length} files have been processed successfully.`
      });
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Upload error",
        description: "There was an error processing your files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Map to store actual File objects for later content retrieval
  const fileMap = new Map<string, File>();

  const findInTree = (entries: FileEntry[], name: string): FileEntry | undefined => {
    return entries.find(entry => entry.name === name);
  };

  const sortFileTree = (entries: FileEntry[]) => {
    entries.sort((a, b) => {
      // Directories first
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
    
    // Sort children recursively
    entries.forEach(entry => {
      if (entry.children) {
        sortFileTree(entry.children);
      }
    });
  };

  const toggleDirectory = (entry: FileEntry) => {
    const updatedTree = [...fileTree];
    toggleDirectoryInTree(updatedTree, entry.path);
    setFileTree(updatedTree);
  };

  const toggleDirectoryInTree = (entries: FileEntry[], path: string) => {
    for (const entry of entries) {
      if (entry.path === path && entry.isDirectory) {
        entry.expanded = !entry.expanded;
        return true;
      }
      
      if (entry.children && toggleDirectoryInTree(entry.children, path)) {
        return true;
      }
    }
    return false;
  };

  const handleFileClick = async (entry: FileEntry) => {
    if (entry.isDirectory) {
      toggleDirectory(entry);
      return;
    }
    
    try {
      if (!entry.content) {
        const file = fileMap.get(entry.path);
        if (file) {
          if (isTextFile(entry.name)) {
            const content = await readFileAsText(file);
            entry.content = content;
            setEditorContent(content.split('\n'));
          } else {
            entry.content = "This file cannot be displayed (binary content)";
            setEditorContent(["This file cannot be displayed (binary content)"]);
          }
        }
      } else {
        setEditorContent(entry.content.split('\n'));
      }
      
      setSelectedFile(entry);
      setCursor({ visible: true, line: 0, column: 0 });
    } catch (err) {
      console.error("Error reading file:", err);
      toast({
        title: "File error",
        description: "Could not read file contents",
        variant: "destructive"
      });
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const renderFileTree = (entries: FileEntry[], level = 0) => {
    return entries.map((entry, index) => (
      <div key={`${entry.path}-${index}`} className="file-entry">
        <div 
          className={`flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-gray-800 rounded ${selectedFile?.path === entry.path ? 'bg-gray-700' : ''}`}
          onClick={() => handleFileClick(entry)}
          style={{ paddingLeft: `${level * 16 + 4}px` }}
        >
          {entry.isDirectory ? (
            entry.expanded ? (
              <ChevronDown className="mr-1 h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="mr-1 h-4 w-4 text-gray-400" />
            )
          ) : null}
          
          {entry.isDirectory ? (
            <Folder className="mr-2 h-4 w-4 text-blue-400" />
          ) : (
            <FileText className="mr-2 h-4 w-4 text-gray-400" />
          )}
          
          <span className="flex-1 truncate text-gray-300">{entry.name}</span>
          
          {!entry.isDirectory && (
            <span className="text-xs text-gray-500">{formatFileSize(entry.size)}</span>
          )}
        </div>
        
        {entry.isDirectory && entry.expanded && entry.children && (
          <div className="directory-children">
            {renderFileTree(entry.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="vscode-browser flex flex-col h-[70vh] bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700">
        <h3 className="text-lg font-medium text-gray-200">VS Code Explorer</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700" onClick={onReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
              Upload Folder
            </Button>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
              webkitdirectory="" 
              directory="" 
              multiple 
            />
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 h-full">
        <div className="explorer md:col-span-1 border-r border-gray-700 bg-gray-900">
          <div className="p-2 text-xs font-medium text-gray-400 uppercase">Explorer</div>
          <ScrollArea className="h-[calc(70vh-80px)]">
            <div className="p-1">
              {fileTree.length > 0 ? (
                renderFileTree(fileTree)
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <p>No files uploaded yet</p>
                  <p className="text-xs mt-2">Use the "Upload Folder" button to begin</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="editor md:col-span-3 bg-gray-900">
          <ScrollArea className="h-[calc(70vh-40px)]">
            {selectedFile ? (
              <div className="p-2">
                <div className="file-tab bg-gray-800 text-gray-300 px-3 py-1 border-b border-gray-700 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{selectedFile.name}</span>
                </div>
                <div className="code-editor font-mono text-sm p-2 text-gray-300 bg-gray-900 relative">
                  {editorContent.map((line, lineIndex) => (
                    <div key={lineIndex} className="editor-line flex">
                      <div className="line-number w-8 text-right pr-2 text-gray-500 select-none">
                        {lineIndex + 1}
                      </div>
                      <div className="line-content relative">
                        {line || " "}
                        {cursor.line === lineIndex && cursor.visible && (
                          <span className="absolute top-0 left-0 h-[1.2em] w-[2px] bg-white animate-pulse"
                                style={{ transform: `translateX(${cursor.column * 8}px)` }}></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Select a file to view its contents</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default VSCodeBrowser;
