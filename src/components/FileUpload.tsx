
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UploadZone from "./UploadZone";
import { useToast } from "@/components/ui/use-toast";
import { isZipFile } from "@/utils/fileUtils";
import ZipViewer from "./ZipViewer";

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    // Check if it's a zip file
    if (!isZipFile(file)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    setZipFile(null);

    try {
      // Process the ZIP file
      console.log("File uploaded:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");
      
      // Store the ZIP file for viewing
      setZipFile(file);
      setUploadSuccess(true);
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded and extracted`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadSuccess(false);
    setZipFile(null);
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Upload ZIP File</CardTitle>
        <CardDescription>
          Drop your ZIP file here or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        {zipFile && uploadSuccess ? (
          <ZipViewer file={zipFile} onReset={resetUpload} />
        ) : (
          <UploadZone 
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadSuccess={uploadSuccess}
            resetUpload={resetUpload}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
