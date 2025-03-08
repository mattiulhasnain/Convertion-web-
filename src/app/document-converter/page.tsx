'use client';

import React, { useState, useEffect } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';
import FileUpload from '../../components/FileUpload';

export default function DocumentConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [conversionOptions, setConversionOptions] = useState({
    quality: 'high',
    preserveLinks: true,
    preserveImages: true,
    preserveFormatting: true,
    pageSize: 'a4',
    pageOrientation: 'portrait',
  });

  // Set loaded state after component mounts for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const documentFormats = [
    { value: 'pdf', label: 'PDF', description: 'Portable Document Format', extensions: ['.pdf'] },
    { value: 'docx', label: 'DOCX', description: 'Microsoft Word Document', extensions: ['.docx'] },
    { value: 'txt', label: 'TXT', description: 'Plain Text Document', extensions: ['.txt'] },
    { value: 'rtf', label: 'RTF', description: 'Rich Text Format', extensions: ['.rtf'] },
    { value: 'odt', label: 'ODT', description: 'OpenDocument Text', extensions: ['.odt'] },
    { value: 'html', label: 'HTML', description: 'HyperText Markup Language', extensions: ['.html', '.htm'] },
    { value: 'md', label: 'MD', description: 'Markdown Document', extensions: ['.md'] },
  ];

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setProcessedFile(null);
      setError(null);
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetFormat(e.target.value);
  };

  const handleOptionChange = (option: string, value: string | boolean) => {
    setConversionOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file to convert.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // In a real implementation, this would call an API or use a library to convert the document
      // For this demo, we'll simulate a conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a fake download URL (in a real app, this would be the converted file)
      const fileExtension = targetFormat.toLowerCase();
      const originalName = file.name.split('.')[0];
      const newFilename = `${originalName}.${fileExtension}`;
      
      // Create a dummy blob to simulate the converted file
      const dummyContent = `This is a simulated ${targetFormat.toUpperCase()} file converted from ${file.name}`;
      const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      setProcessedFile({
        url,
        name: newFilename,
      });
    } catch (err) {
      setError('An error occurred during conversion. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedFile) {
      const a = document.createElement('a');
      a.href = processedFile.url;
      a.download = processedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Get accepted file types based on available formats
  const getAcceptedFileTypes = () => {
    return documentFormats.map(format => format.extensions.join(',')).join(',');
  };

  // Get format-specific options based on selected format
  const renderFormatOptions = () => {
    switch (targetFormat) {
      case 'pdf':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PDF Quality
              </label>
              <select
                value={conversionOptions.quality}
                onChange={(e) => handleOptionChange('quality', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="low">Low (smaller file size)</option>
                <option value="medium">Medium</option>
                <option value="high">High (better quality)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Size
              </label>
              <select
                value={conversionOptions.pageSize}
                onChange={(e) => handleOptionChange('pageSize', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Orientation
              </label>
              <select
                value={conversionOptions.pageOrientation}
                onChange={(e) => handleOptionChange('pageOrientation', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
        );
      case 'docx':
      case 'odt':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserveFormatting"
                checked={conversionOptions.preserveFormatting}
                onChange={(e) => handleOptionChange('preserveFormatting', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="preserveFormatting" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Preserve formatting (styles, fonts, etc.)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserveImages"
                checked={conversionOptions.preserveImages}
                onChange={(e) => handleOptionChange('preserveImages', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="preserveImages" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Preserve images
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserveLinks"
                checked={conversionOptions.preserveLinks}
                onChange={(e) => handleOptionChange('preserveLinks', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="preserveLinks" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Preserve hyperlinks
              </label>
            </div>
          </div>
        );
      case 'txt':
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic">
            Note: Converting to plain text will remove all formatting, images, and other rich content.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen py-12">
      <AnimatedBackground variant="default" />
      
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Document Converter
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
            Convert documents between different formats while preserving formatting and content.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
              
              <FileUpload
                acceptedFileTypes={getAcceptedFileTypes()}
                maxFileSize={10}
                onFileSelect={handleFileSelect}
                color="#6A1B9A"
                label="Upload Document"
                theme="auto"
              />
              
              {file && (
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Selected File</h3>
                  <p className="text-gray-700 dark:text-gray-300">{file.name}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Conversion Options</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target Format
                    </label>
                    <select
                      value={targetFormat}
                      onChange={handleFormatChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {documentFormats.map((format) => (
                        <option key={format.value} value={format.value}>
                          {format.label} - {format.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-3">Format-Specific Options</h3>
                    {renderFormatOptions()}
                  </div>
                </div>
                
                <button
                  onClick={handleConvert}
                  disabled={!file || isProcessing}
                  className={`mt-6 w-full py-3 rounded-lg font-medium ${
                    !file || isProcessing
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  } transition-colors`}
                >
                  {isProcessing ? 'Converting...' : 'Convert Document'}
                </button>
                
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
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Conversion Result</h2>
                
                {processedFile ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="font-medium text-green-700 dark:text-green-300 mb-1">Conversion Complete</h3>
                      <p className="text-gray-700 dark:text-gray-300">Your file has been converted to {targetFormat.toUpperCase()}</p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">Converted File</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{processedFile.name}</p>
                      
                      <button
                        onClick={handleDownload}
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-center">
                      {file ? 'Click "Convert Document" to start conversion' : 'Upload a document and select conversion options'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">About Document Converter</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Our document converter tool allows you to convert between various document formats while preserving formatting, images, and hyperlinks.
                </p>
                <p>
                  Supported formats include PDF, DOCX, TXT, RTF, ODT, HTML, and Markdown. Each format has specific conversion options to ensure the best results.
                </p>
                <p>
                  All processing happens directly in your browser - your documents are never sent to our servers, ensuring complete privacy and security.
                </p>
                <p>
                  <strong>Note:</strong> This is a demonstration version. In a real implementation, the conversion would be performed using specialized libraries or APIs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 