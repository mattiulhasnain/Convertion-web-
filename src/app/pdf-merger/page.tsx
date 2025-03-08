'use client';

import React, { useState, useEffect } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';
import FileUpload from '../../components/FileUpload';
import { mergePDFs, generateDownloadURL, downloadFile } from '../../utils/fileProcessor';

export default function PDFMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [reorderMode, setReorderMode] = useState(false);

  // Simulate progress during processing
  useEffect(() => {
    if (isProcessing) {
      setProcessingProgress(0);
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else {
      setProcessingProgress(0);
    }
  }, [isProcessing]);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setProcessedFile(null);
    setError(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Process the files
      const mergedPDF = await mergePDFs(files);
      
      // Generate download URL
      const url = generateDownloadURL(mergedPDF, 'merged.pdf');
      
      setProcessedFile({
        url,
        name: 'merged.pdf',
      });
      setProcessingProgress(100);
    } catch (err) {
      setError('An error occurred while merging the PDF files. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedFile) {
      downloadFile(processedFile.url, processedFile.name);
    }
  };

  const reorderFiles = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [removed] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, removed);
    setFiles(newFiles);
  };

  const moveFileUp = (index: number) => {
    if (index > 0) {
      reorderFiles(index, index - 1);
    }
  };

  const moveFileDown = (index: number) => {
    if (index < files.length - 1) {
      reorderFiles(index, index + 1);
    }
  };

  return (
    <div className="relative min-h-screen py-12">
      <AnimatedBackground variant="pdf" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with animated gradient border */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 -m-4 rounded-3xl blur-sm bg-gradient-to-r from-red-500/30 via-orange-400/30 to-red-600/30 animate-gradient-x"></div>
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">PDF Merger</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Combine multiple PDF files into a single document. Upload your files, arrange them in the desired order, and merge.
              </p>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            {/* File Upload */}
            <div className="mb-8">
              <FileUpload
                acceptedFileTypes=".pdf,application/pdf"
                maxFileSize={50}
                maxFiles={10}
                onFileSelect={handleFileSelect}
                color="#D32F2F"
                multiple={true}
                label="Upload PDF Files"
              />
            </div>
            
            {/* File Order Controls */}
            {files.length >= 2 && (
              <div className="mb-8 fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-red-600">Arrange Your PDFs</h3>
                  <button
                    className="text-sm px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    onClick={() => setReorderMode(!reorderMode)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {reorderMode ? 'Done Arranging' : 'Arrange Order'}
                  </button>
                </div>
                
                {reorderMode && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-2 fadeIn">
                    <p className="text-sm text-gray-500 mb-3">Drag to reorder files or use the arrows. The files will be merged in the order shown below.</p>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold mr-3">
                              {index + 1}
                            </div>
                            <span className="font-medium truncate max-w-xs">{file.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => moveFileUp(index)} 
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => moveFileDown(index)} 
                              disabled={index === files.length - 1}
                              className={`p-1 rounded ${index === files.length - 1 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <button
                className="btn btn-primary w-full md:w-auto px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:shadow-none flex items-center justify-center"
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                style={{ 
                  background: 'linear-gradient(45deg, #D32F2F, #FF5722)',
                  opacity: isProcessing || files.length < 2 ? 0.7 : 1 
                }}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Merging... {Math.round(processingProgress)}%
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
                    </svg>
                    Merge PDFs
                  </>
                )}
              </button>
              
              {processedFile && (
                <button
                  className="btn w-full md:w-auto px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center fadeIn"
                  onClick={handleDownload}
                  style={{ background: 'linear-gradient(45deg, #4CAF50, #8BC34A)', color: 'white' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Merged PDF
                </button>
              )}
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {/* Success Message */}
            {processedFile && !error && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Your PDFs have been successfully merged! Click the download button to save the file.</span>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-red-600 dark:text-red-500">How to Merge PDF Files</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Upload PDF Files</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Upload two or more PDF files using the upload area above. You can drag and drop files or browse your computer.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Arrange File Order</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click &quot;Arrange Order&quot; to change the order of your PDFs. The documents will be merged in the sequence shown.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Merge Files</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click the &quot;Merge PDFs&quot; button to combine all your files into a single PDF document.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Download Result</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Once processing is complete, download your merged PDF file to save it to your device.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Notes:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm ml-6">
                <li>Maximum file size: <span className="font-medium">50MB</span> per file</li>
                <li>Maximum number of files: <span className="font-medium">10</span></li>
                <li>Supported format: <span className="font-medium">PDF</span> files only</li>
                <li>All processing happens in your browser - your files are never uploaded to our servers</li>
                <li>For larger files, processing may take a few moments to complete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 