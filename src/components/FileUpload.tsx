'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { getReadableFileSize } from '../utils/helpers';

interface FileUploadProps {
  acceptedFileTypes: string;
  maxFileSize?: number; // In MB
  maxFiles?: number;
  onFileSelect: (files: File[]) => void;
  color?: string;
  className?: string;
  multiple?: boolean;
  label?: string;
  showPreview?: boolean; // New prop to show file preview
  theme?: 'light' | 'dark' | 'auto'; // New prop for theming
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedFileTypes,
  maxFileSize = 100, // Default 100MB
  maxFiles = 10,
  onFileSelect,
  color = '#6A1B9A',
  className = '',
  multiple = false,
  label = 'Upload Files',
  showPreview = true,
  theme = 'auto',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [filePreviews, setFilePreviews] = useState<{url: string, type: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Determine actual theme based on system preference if set to auto
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(theme === 'auto' ? 'light' : theme);

  // Listen for system theme changes if theme is set to auto
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setActualTheme(theme);
    }
  }, [theme]);

  // Reset progress when files change
  useEffect(() => {
    setUploadProgress(selectedFiles.map(() => 100));
    
    // Generate previews for files
    if (showPreview) {
      // Clean up previous previews
      filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      
      const previews = selectedFiles.map(file => {
        const url = URL.createObjectURL(file);
        const type = file.type.split('/')[0]; // 'image', 'video', 'audio', etc.
        return { url, type };
      });
      
      setFilePreviews(previews);
    }
    
    return () => {
      // Clean up object URLs on unmount
      if (showPreview) {
        filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      }
    };
  }, [selectedFiles, showPreview]);

  // Create animation for upload area
  useEffect(() => {
    if (dragActive) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [dragActive]);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let errorMsg = null;

    // Check number of files
    if (fileArray.length + selectedFiles.length > maxFiles) {
      errorMsg = `You can only upload up to ${maxFiles} files at once.`;
      return validFiles;
    }

    // Validate each file
    for (const file of fileArray) {
      // Check file type
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      // Create array of accepted types for easier checking
      const acceptedTypes = acceptedFileTypes.split(',').map(type => type.trim());
      
      const isAcceptedType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // Check by extension
          return fileExtension === type;
        } else if (type.includes('/*')) {
          // Check by MIME type group (e.g., "image/*")
          const typeGroup = type.split('/')[0];
          return fileType.startsWith(`${typeGroup}/`);
        } else {
          // Check exact MIME type
          return fileType === type;
        }
      });

      if (!isAcceptedType) {
        errorMsg = `File type not accepted. Please upload ${acceptedFileTypes} files only.`;
        continue;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errorMsg = `File size exceeds the ${maxFileSize}MB limit.`;
        continue;
      }

      validFiles.push(file);
    }

    setError(errorMsg);
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        const validFiles = validateFiles(e.dataTransfer.files);
        if (validFiles.length > 0) {
          if (multiple) {
            const newFiles = [...selectedFiles, ...validFiles];
            setSelectedFiles(newFiles);
            onFileSelect(newFiles);
          } else {
            setSelectedFiles([validFiles[0]]);
            onFileSelect([validFiles[0]]);
          }
        }
        setIsProcessing(false);
      }, 800);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        const validFiles = validateFiles(e.target.files!);
        if (validFiles.length > 0) {
          if (multiple) {
            const newFiles = [...selectedFiles, ...validFiles];
            setSelectedFiles(newFiles);
            onFileSelect(newFiles);
          } else {
            setSelectedFiles([validFiles[0]]);
            onFileSelect([validFiles[0]]);
          }
        }
        setIsProcessing(false);
      }, 800);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
    
    // Also remove preview if it exists
    if (showPreview && filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index].url);
      const newPreviews = [...filePreviews];
      newPreviews.splice(index, 1);
      setFilePreviews(newPreviews);
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (['mp4', 'webm', 'avi', 'mov', 'wmv'].includes(extension)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      );
    } else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    } else if (['pdf'].includes(extension)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  // Render file preview
  const renderFilePreview = (file: File, index: number) => {
    if (!showPreview || !filePreviews[index]) return null;
    
    const { url, type } = filePreviews[index];
    
    if (type === 'image') {
      return (
        <div className="relative w-full h-24 overflow-hidden rounded-lg mb-2">
          <img 
            src={url} 
            alt={file.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else if (type === 'video') {
      return (
        <div className="relative w-full h-24 overflow-hidden rounded-lg mb-2">
          <video 
            src={url} 
            className="w-full h-full object-cover" 
            controls={false}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      );
    } else if (type === 'audio') {
      return (
        <div className="w-full mb-2">
          <audio src={url} className="w-full" controls />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={dropAreaRef}
        className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-8 text-center 
          ${dragActive ? 'border-opacity-100 scale-[1.02]' : 'border-opacity-60'} 
          ${isProcessing ? 'bg-opacity-10' : ''} 
          ${isAnimating ? 'shadow-lg' : 'shadow-md'}
          ${actualTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
          transition-all duration-300 ease-out hover:shadow-lg`}
        style={{ 
          borderColor: color,
          background: dragActive ? `${color}08` : '',
          boxShadow: dragActive ? `0 0 20px ${color}40` : ''
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Animated ripple effect when dragging */}
        {dragActive && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-opacity-5 animate-pulse" style={{ backgroundColor: color }}></div>
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping"
                  style={{ 
                    backgroundColor: `${color}${20 - i * 5}`,
                    width: `${300 + i * 100}px`,
                    height: `${300 + i * 100}px`,
                    animationDuration: `${1.5 + i * 0.5}s`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Upload icon and text */}
        <div className={`relative z-10 flex flex-col items-center justify-center ${selectedFiles.length > 0 ? 'mb-6' : ''}`}>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFileTypes}
          onChange={handleFileChange}
            className="hidden"
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4">
                <svg className="animate-spin w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-lg font-medium">Processing files...</p>
            </div>
          ) : (
            <>
              <div 
                className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${dragActive ? 'scale-110' : 'scale-100'}`}
                style={{ backgroundColor: `${color}20` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke={color}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
              <h3 className="text-xl font-semibold mb-2">{label}</h3>
              
              <p className={`mb-4 ${actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Drag & drop your files here, or{' '}
                  <button
                    type="button"
                    onClick={handleButtonClick}
                  className="font-medium underline focus:outline-none"
                  style={{ color }}
                  >
                  browse
                  </button>
              </p>
              
              <p className={`text-sm ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {multiple ? `Up to ${maxFiles} files` : 'Single file'} • Max {maxFileSize}MB • {acceptedFileTypes.replace(/,/g, ', ')}
              </p>
                </>
              )}
      </div>

        {/* Error message */}
      {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
              {error}
            </p>
        </div>
      )}

        {/* Selected files list */}
      {selectedFiles.length > 0 && (
          <div className={`mt-6 border-t ${actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
            <h4 className="text-lg font-medium mb-3">Selected Files</h4>
          <ul className="space-y-3">
            {selectedFiles.map((file, index) => (
                <li 
                  key={`${file.name}-${index}`} 
                  className={`relative flex flex-col p-3 rounded-lg transition-all duration-200 ${actualTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {renderFilePreview(file, index)}
                  
                  <div className="flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                      {getFileIcon(file.name)}
                      <div className="overflow-hidden">
                        <p className="font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className={`text-xs ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {getReadableFileSize(file.size)}
                        </p>
                    </div>
                    </div>
                  
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                      className={`ml-2 p-1 rounded-full ${actualTheme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-300'} transition-colors duration-200`}
                    aria-label="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-gray-300 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${uploadProgress[index]}%`,
                        backgroundColor: color
                      }}
                    ></div>
                  </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
};

export default FileUpload; 