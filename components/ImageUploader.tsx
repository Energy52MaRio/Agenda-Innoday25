
import React, { useCallback, useState } from 'react';
import { UploadIcon, SpinnerIcon, WarningIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        if (base64) {
          onImageUpload(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
    
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-10 sm:mt-20">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-800/50'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="text-center">
            <SpinnerIcon className="mx-auto h-12 w-12 text-cyan-400 animate-spin" />
            <p className="mt-4 text-lg font-semibold text-white">Analysiere Finanzdaten...</p>
            <p className="text-sm text-gray-400">Die KI liest und strukturiert die Daten. Dies kann einen Moment dauern.</p>
          </div>
        ) : (
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-semibold text-white">Bild von GuV, Bilanz & Cashflow hochladen</p>
            <p className="text-sm text-gray-400">Datei hierher ziehen oder <span className="font-semibold text-cyan-400">klicken</span></p>
            <p className="mt-2 text-xs text-gray-500">Unterstützt werden JPG, PNG, GIF</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 w-full bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-start space-x-3">
          <WarningIcon className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Fehler</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
