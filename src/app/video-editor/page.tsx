'use client';

import React, { useState } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';
import FileUpload from '../../components/FileUpload';
import { editVideo, generateDownloadURL, downloadFile } from '../../utils/fileProcessor';

export default function VideoEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Editing options
  const [trimOptions, setTrimOptions] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [rotateAngle, setRotateAngle] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const handleFileSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const videoFile = selectedFiles[0];
      setFile(videoFile);
      setProcessedFile(null);
      setError(null);
      
      // Get video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
        setTrimOptions({ start: 0, end: video.duration });
      };
      video.src = URL.createObjectURL(videoFile);
    }
  };

  const handleTrimStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTrimOptions(prev => ({ ...prev, start: value }));
  };

  const handleTrimEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTrimOptions(prev => ({ ...prev, end: value }));
  };

  const handleRotateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRotateAngle(parseInt(e.target.value));
  };

  const handleEdit = async () => {
    if (!file) {
      setError('Please select a video file to edit.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Process the file
      const editOptions = {
        trim: trimOptions,
        rotate: rotateAngle,
      };
      
      const editedVideo = await editVideo(file, editOptions);
      
      // Generate download URL
      const filename = `edited_${file.name}`;
      const url = generateDownloadURL(editedVideo, filename);
      
      setProcessedFile({
        url,
        name: filename,
      });
    } catch (err) {
      setError('An error occurred while editing the video. Please try again.');
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen py-12">
      <AnimatedBackground variant="video" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Video Editor</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Trim, rotate, and edit your videos online. Upload a video file and use our simple tools to make quick edits.
            </p>
          </div>
          
          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            {/* File Upload */}
            <div className="mb-8">
              <FileUpload
                acceptedFileTypes="video/*,.mp4,.webm,.mov,.avi"
                maxFileSize={100}
                maxFiles={1}
                onFileSelect={handleFileSelect}
                color="#303F9F"
                multiple={false}
                label="Upload Video"
              />
            </div>
            
            {/* Editing Options */}
            {file && (
              <div className="space-y-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Editing Options</h3>
                
                {/* Trim Video */}
                <div>
                  <h4 className="font-medium mb-2">Trim Video</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Start Time: {formatTime(trimOptions.start)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={videoDuration}
                        step="0.1"
                        value={trimOptions.start}
                        onChange={handleTrimStartChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        End Time: {formatTime(trimOptions.end)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={videoDuration}
                        step="0.1"
                        value={trimOptions.end}
                        onChange={handleTrimEndChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Rotate Video */}
                <div>
                  <h4 className="font-medium mb-2">Rotate Video</h4>
                  <select
                    value={rotateAngle}
                    onChange={handleRotateChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#303F9F]"
                  >
                    <option value="0">No Rotation</option>
                    <option value="90">Rotate 90° Clockwise</option>
                    <option value="180">Rotate 180°</option>
                    <option value="270">Rotate 90° Counter-Clockwise</option>
                  </select>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleEdit}
                    disabled={isProcessing}
                    style={{ backgroundColor: '#303F9F', opacity: isProcessing ? 0.7 : 1 }}
                  >
                    {isProcessing ? 'Processing...' : 'Process Video'}
                  </button>
                  
                  {processedFile && (
                    <button
                      className="btn"
                      onClick={handleDownload}
                      style={{ backgroundColor: '#4CAF50', color: 'white' }}
                    >
                      Download Edited Video
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {processedFile && !error && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                Your video has been successfully edited! Click the download button to save the file.
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to Edit Videos</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Upload a video file using the upload area above.</li>
              <li>Use the trim sliders to select the portion of the video you want to keep.</li>
              <li>Choose a rotation option if needed.</li>
              <li>Click the &quot;Process Video&quot; button to apply your edits.</li>
              <li>Once processing is complete, download your edited video.</li>
            </ol>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                <li>Maximum file size: 100MB</li>
                <li>Supported formats: MP4, WEBM, MOV, AVI</li>
                <li>All processing happens in your browser - your videos are never uploaded to our servers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 