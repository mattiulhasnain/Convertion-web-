'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';
import FileUpload from '../../components/FileUpload';
import { convertImage, generateDownloadURL, downloadFile, getReadableFileSize } from '../../utils/fileProcessor';

export default function FormatConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<{ url: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [quality, setQuality] = useState(85);
  const [resizeOptions, setResizeOptions] = useState({
    enabled: false,
    width: 800,
    height: 600,
    maintainAspectRatio: true
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Available formats for conversion with detailed info
  const imageFormats = [
    { value: 'png', label: 'PNG', description: 'Lossless format with transparency support', extensions: ['.png'] },
    { value: 'jpg', label: 'JPG', description: 'Best for photos with small file size', extensions: ['.jpg', '.jpeg'] },
    { value: 'webp', label: 'WEBP', description: 'Modern format with excellent compression', extensions: ['.webp'] },
    { value: 'gif', label: 'GIF', description: 'Supports animation and transparency', extensions: ['.gif'] },
    { value: 'bmp', label: 'BMP', description: 'Uncompressed bitmap format', extensions: ['.bmp'] },
    { value: 'tiff', label: 'TIFF', description: 'High-quality format for printing', extensions: ['.tiff', '.tif'] },
    { value: 'ico', label: 'ICO', description: 'Icon format for websites', extensions: ['.ico'] },
    { value: 'svg', label: 'SVG', description: 'Vector format for scalable graphics', extensions: ['.svg'] },
  ];

  // Generate preview images when files are selected
  useEffect(() => {
    // Clean up previous previews
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    if (files.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setActivePreviewIndex(0);

    return () => {
      // Clean up object URLs on unmount
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  // Format-specific options based on selected format
  const getFormatSpecificOptions = () => {
    switch (targetFormat) {
      case 'jpg':
        return (
          <div className="mt-4 space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
              JPEG Quality ({quality}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Lower Quality (Smaller File)</span>
              <span>Higher Quality (Larger File)</span>
            </div>
          </div>
        );
      case 'webp':
        return (
          <div className="mt-4 space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
              WebP Quality ({quality}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        );
      case 'png':
        return (
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="png-transparency"
                checked={true}
                className="mr-2"
                disabled
              />
              <label htmlFor="png-transparency" className="text-gray-700 dark:text-gray-300 text-sm">
                Preserve transparency
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setProcessedFiles([]);
    setError(null);
    setConversionProgress(0);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetFormat(e.target.value);
    setProcessedFiles([]);
  };

  const updatePreviewWithOptions = () => {
    if (previewUrls.length === 0 || !previewCanvasRef.current) return;
    
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      let drawWidth = img.width;
      let drawHeight = img.height;
      
      if (resizeOptions.enabled) {
        if (resizeOptions.maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          if (img.width > img.height) {
            drawWidth = Math.min(resizeOptions.width, img.width);
            drawHeight = drawWidth / aspectRatio;
          } else {
            drawHeight = Math.min(resizeOptions.height, img.height);
            drawWidth = drawHeight * aspectRatio;
          }
        } else {
          drawWidth = resizeOptions.width;
          drawHeight = resizeOptions.height;
        }
      }
      
      canvas.width = drawWidth;
      canvas.height = drawHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
    };
    img.src = previewUrls[activePreviewIndex];
  };
  
  useEffect(() => {
    updatePreviewWithOptions();
  }, [activePreviewIndex, resizeOptions, previewUrls]);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to convert.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setProcessedFiles([]);
      setConversionProgress(0);
      
      const convertedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Process the file
        const convertedImage = await convertImage(file, targetFormat);
        
        // Generate download URL
        const filename = `${file.name.split('.')[0]}.${targetFormat}`;
        const url = generateDownloadURL(convertedImage, filename);
        
        convertedFiles.push({
          url,
          name: filename,
        });
        
        // Update progress
        setConversionProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      setProcessedFiles(convertedFiles);
    } catch (err) {
      setError('An error occurred while converting the file. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    if (processedFiles.length > 0) {
      // Create zip file in real implementation
      // For now, download each file individually
      processedFiles.forEach(file => {
        downloadFile(file.url, file.name);
      });
    }
  };

  const handleDownload = (index: number) => {
    if (processedFiles[index]) {
      downloadFile(processedFiles[index].url, processedFiles[index].name);
    }
  };

  return (
    <div className="relative min-h-screen py-12">
      <AnimatedBackground variant="format" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-25"></div>
              <h1 className="relative bg-white dark:bg-gray-800 rounded-lg py-2 px-6 text-3xl md:text-4xl font-bold mb-4 z-10">
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Advanced Format Converter
                </span>
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Convert your images between different formats with advanced options. Adjust quality, resize, and batch process multiple files at once.
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-[#00796B]">Source Files</h2>
                
                {/* File Upload */}
                <div className="mb-6">
                  <FileUpload
                    acceptedFileTypes="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.svg,.ico"
                    maxFileSize={20}
                    onFileSelect={handleFileSelect}
                    color="#00796B"
                    multiple={true}
                    label="Upload Images"
                  />
                </div>
                
                {/* Selected Files Info */}
                {files.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected {files.length} File(s)</h3>
                    <div className="flex flex-wrap gap-2">
                      {previewUrls.map((url, index) => (
                        <div 
                          key={index} 
                          className={`w-16 h-16 rounded-md overflow-hidden border-2 cursor-pointer ${index === activePreviewIndex ? 'border-teal-500 shadow-md' : 'border-gray-200 dark:border-gray-700'}`}
                          onClick={() => setActivePreviewIndex(index)}
                        >
                          <img 
                            src={url} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Conversion Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-[#00796B]">Conversion Options</h2>
                
                {/* Format Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Target Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={handleFormatChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {imageFormats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Format-specific options */}
                {getFormatSpecificOptions()}
                
                {/* Advanced Options Toggle */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="flex items-center text-sm text-teal-600 hover:text-teal-700"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 mr-1 transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
                  </button>
                  
                  {showAdvancedOptions && (
                    <div className="mt-3 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {/* Resize Options */}
                      <div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="enableResize"
                            checked={resizeOptions.enabled}
                            onChange={(e) => setResizeOptions({...resizeOptions, enabled: e.target.checked})}
                            className="mr-2"
                          />
                          <label htmlFor="enableResize" className="text-gray-700 dark:text-gray-300 font-medium">
                            Resize Image
                          </label>
                        </div>
                        
                        {resizeOptions.enabled && (
                          <div className="ml-6 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                                  Width (px)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={resizeOptions.width}
                                  onChange={(e) => setResizeOptions({...resizeOptions, width: parseInt(e.target.value) || 1})}
                                  className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md px-3 py-1 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                                  Height (px)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={resizeOptions.height}
                                  onChange={(e) => setResizeOptions({...resizeOptions, height: parseInt(e.target.value) || 1})}
                                  className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md px-3 py-1 text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="maintainAspectRatio"
                                checked={resizeOptions.maintainAspectRatio}
                                onChange={(e) => setResizeOptions({...resizeOptions, maintainAspectRatio: e.target.checked})}
                                className="mr-2"
                              />
                              <label htmlFor="maintainAspectRatio" className="text-gray-700 dark:text-gray-300 text-sm">
                                Maintain aspect ratio
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Convert Button */}
                <div className="mt-6">
                  <button
                    className="w-full btn bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    onClick={handleConvert}
                    disabled={isProcessing || files.length === 0}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Converting... {conversionProgress}%
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Convert {files.length > 1 ? 'Images' : 'Image'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {/* Preview Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-[#00796B]">Image Preview</h2>
                
                {files.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center min-h-[300px]">
                      {previewUrls.length > 0 ? (
                        <>
                          <img 
                            src={previewUrls[activePreviewIndex]} 
                            alt="Preview" 
                            className="max-w-full max-h-[400px] object-contain"
                          />
                          <canvas ref={previewCanvasRef} className="hidden"></canvas>
                        </>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400">Loading preview...</div>
                      )}
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{files[activePreviewIndex]?.name}</span> • 
                        <span className="ml-1">{getReadableFileSize(files[activePreviewIndex]?.size || 0)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[300px] flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-teal-600 dark:text-teal-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">No image selected</h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">Upload an image to see a preview here</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Output Section */}
              {processedFiles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#00796B]">Converted Files</h2>
                    
                    {processedFiles.length > 1 && (
                      <button
                        className="flex items-center text-sm text-teal-600 hover:text-teal-700 px-3 py-1 border border-teal-600 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                        onClick={handleDownloadAll}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download All
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {processedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="truncate">
                            <div className="font-medium text-gray-800 dark:text-white truncate max-w-xs">{file.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Converted to {targetFormat.toUpperCase()}</div>
                          </div>
                        </div>
                        <button
                          className="ml-2 text-teal-600 hover:text-teal-700"
                          onClick={() => handleDownload(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="text-teal-600 dark:text-teal-400 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Format Guide</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {imageFormats.map((format) => (
                <div key={format.value} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{format.label}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{format.description}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Extensions: {format.extensions.join(', ')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Privacy Focused</h3>
                  <div className="mt-1 text-sm leading-relaxed">
                    All image conversion happens directly in your browser. Your files never leave your device and are not uploaded to any server.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 