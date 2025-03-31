
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatFileSize } from "@/utils/fileUtils";
import JSZip from "jszip";

interface ZipEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  content?: string;
  children?: ZipEntry[];
}

interface ZipViewerProps {
  file: File;
  onReset: () => void;
}

const ZipViewer = ({ file, onReset }: ZipViewerProps) => {
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<ZipEntry | null>(null);

  useEffect(() => {
    const extractZip = async () => {
      try {
        setLoading(true);
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        const entriesMap = new Map<string, ZipEntry>();
        const rootEntries: ZipEntry[] = [];
        
        // Process all files and directories
        for (const [path, zipEntry] of Object.entries(contents.files)) {
          const isDirectory = path.endsWith('/');
          const name = path.split('/').pop() || path;
          const size = zipEntry._data ? zipEntry._data.uncompressedSize : 0;
          
          const entry: ZipEntry = {
            name,
            path,
            isDirectory,
            size,
            children: isDirectory ? [] : undefined,
          };
          
          entriesMap.set(path, entry);
          
          // Determine parent path
          const parentPath = path.split('/').slice(0, -1).join('/') + (path.split('/').length > 1 ? '/' : '');
          
          if (parentPath === '') {
            // This is a root entry
            rootEntries.push(entry);
          } else {
            // Add as a child to its parent
            const parent = entriesMap.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(entry);
            }
          }
        }
        
        setEntries(rootEntries);
        setLoading(false);
      } catch (err) {
        console.error("Error extracting ZIP:", err);
        setError("Failed to extract ZIP file contents");
        setLoading(false);
      }
    };
    
    extractZip();
  }, [file]);

  const handleFileClick = async (entry: ZipEntry) => {
    if (entry.isDirectory) return;
    
    try {
      if (!entry.content) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        const zipObject = contents.file(entry.path);
        
        if (zipObject) {
          // Try to read as text first
          try {
            const content = await zipObject.async("string");
            entry.content = content;
          } catch (err) {
            entry.content = "This file cannot be displayed (binary content)";
          }
        }
      }
      
      setSelectedFile(entry);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  const renderFileTree = (entries: ZipEntry[], level = 0) => {
    return entries.sort((a, b) => {
      // Directories first, then sort alphabetically
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    }).map((entry, index) => (
      <div key={`${entry.path}-${index}`} className="pl-4">
        {entry.isDirectory ? (
          <Accordion type="single" collapsible>
            <AccordionItem value={entry.path} className="border-0">
              <AccordionTrigger className="py-1 hover:no-underline">
                <div className="flex items-center text-sm">
                  <Folder className="mr-2 h-4 w-4 text-blue-500" />
                  {entry.name}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {entry.children && renderFileTree(entry.children, level + 1)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div 
            className={`flex items-center py-1 pl-4 text-sm cursor-pointer hover:bg-gray-100 rounded ${selectedFile?.path === entry.path ? 'bg-blue-100' : ''}`}
            onClick={() => handleFileClick(entry)}
          >
            <FileText className="mr-2 h-4 w-4 text-gray-500" />
            <span className="flex-1 truncate">{entry.name}</span>
            <span className="text-xs text-gray-400">{formatFileSize(entry.size)}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[60vh]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{file.name}</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Upload Another
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Extracting ZIP contents...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full border rounded-lg overflow-hidden">
          <div className="border-r">
            <ScrollArea className="h-[calc(60vh-80px)]">
              <div className="p-2">
                <p className="font-medium mb-2 text-sm">Files</p>
                {renderFileTree(entries)}
              </div>
            </ScrollArea>
          </div>
          
          <div className="col-span-2">
            <ScrollArea className="h-[calc(60vh-80px)]">
              {selectedFile ? (
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <FileText className="mr-2 h-4 w-4" />
                    <h4 className="font-medium">{selectedFile.name}</h4>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                    {selectedFile.content}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Select a file to view its contents</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipViewer;
