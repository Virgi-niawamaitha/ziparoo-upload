
import { useState, useRef } from "react";
import { CheckCircle, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadSuccess: boolean;
  resetUpload: () => void;
}

const UploadZone = ({ 
  onUpload, 
  isUploading, 
  uploadSuccess, 
  resetUpload 
}: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadAnother = () => {
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-10 text-center transition-all duration-300 cursor-pointer",
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
        isUploading ? "pointer-events-none opacity-75" : "",
        uploadSuccess ? "bg-green-50 border-green-300" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={uploadSuccess ? undefined : handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".zip"
      />

      {uploadSuccess ? (
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <p className="text-lg font-medium text-green-700">Upload successful!</p>
          <Button onClick={handleUploadAnother}>Upload Another File</Button>
        </div>
      ) : isUploading ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
          <p className="text-lg font-medium text-blue-700">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-16 w-16 text-gray-400" />
          <p className="text-lg font-medium text-gray-700">
            Drag and drop your ZIP file here
          </p>
          <p className="text-sm text-gray-500">
            or click to browse your files
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
