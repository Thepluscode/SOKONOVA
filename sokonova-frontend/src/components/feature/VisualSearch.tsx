
import { useState, useRef } from 'react';

interface VisualSearchProps {
  onSearch: (imageUrl: string) => void;
  onClose: () => void;
}

export default function VisualSearch({ onSearch, onClose }: VisualSearchProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSearch = () => {
    if (selectedImage) {
      setIsSearching(true);
      setTimeout(() => {
        onSearch(selectedImage);
        setIsSearching(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Visual Search</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors whitespace-nowrap"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <p className="text-gray-600 mb-6">Upload an image to find similar products</p>

        {/* Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          {selectedImage ? (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="text-sm text-teal-600 hover:text-teal-700 whitespace-nowrap"
              >
                Choose different image
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-image-add-line text-3xl text-teal-600"></i>
              </div>
              <p className="text-gray-700 font-medium mb-2">
                Drag and drop an image here
              </p>
              <p className="text-gray-500 text-sm mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors whitespace-nowrap"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Search Button */}
        {selectedImage && (
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full mt-6 px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
          >
            {isSearching ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                Searching...
              </span>
            ) : (
              'Search Similar Products'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
