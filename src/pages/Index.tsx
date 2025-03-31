
import FileUpload from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">CodeView</h1>
          <p className="text-xl text-white/90">View and explore your code with ease</p>
        </div>
        <FileUpload />
      </div>
    </div>
  );
};

export default Index;
