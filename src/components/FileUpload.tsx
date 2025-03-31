
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UploadZone from "./UploadZone";
import { useToast } from "@/components/ui/use-toast";

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    // Check if it's a zip file
    if (!file.name.toLowerCase().endsWith('.zip')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Simulate upload process with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // This is where you would normally send the file to a server
      console.log("File uploaded:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");
      
      setUploadSuccess(true);
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded`,
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
        <UploadZone 
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadSuccess={uploadSuccess}
          resetUpload={resetUpload}
        />
      </CardContent>
    </Card>
  );
};

export default FileUpload;
