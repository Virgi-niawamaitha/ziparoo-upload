
import FileUpload from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">ZipaRoo</h1>
          <p className="text-xl text-white/90">Simple ZIP file uploads made easy</p>
        </div>
        <FileUpload />
      </div>
    </div>
  );
};

export default Index;
