'use client';

import React, { useState } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';
import FileUpload from '../../components/FileUpload';
import { combineAudioWithMedia, generateDownloadURL, downloadFile } from '../../utils/fileProcessor';

export default function AudioVideo() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('mp4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Available output formats
  const outputFormats = [
    { value: 'mp4', label: 'MP4 Video' },
    { value: 'webm', label: 'WebM Video' },
    { value: 'gif', label: 'Animated GIF' },
  ];

  const handleAudioFileSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setAudioFile(selectedFiles[0]);
      setProcessedFile(null);
      setError(null);
    }
  };

  const handleMediaFileSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setMediaFile(selectedFiles[0]);
      setProcessedFile(null);
      setError(null);
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputFormat(e.target.value);
    setProcessedFile(null);
  };

  const handleCombine = async () => {
    if (!audioFile) {
      setError('Please select an audio file.');
      return;
    }

    if (!mediaFile) {
      setError('Please select an image or video file.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Process the files
      const combinedMedia = await combineAudioWithMedia(audioFile, mediaFile, outputFormat);
      
      // Generate download URL
      const filename = `combined_${mediaFile.name.split('.')[0]}_${audioFile.name.split('.')[0]}.${outputFormat}`;
      const url = generateDownloadURL(combinedMedia, filename);
      
      setProcessedFile({
        url,
        name: filename,
      });
    } catch (err) {
      setError('An error occurred while combining the files. Please try again.');
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

  return (
    <div className="relative min-h-screen py-12">
      <AnimatedBackground variant="audioVideo" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Audio + Video Combiner</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Combine audio files with images or videos. Create slideshows with music or add soundtracks to videos.
            </p>
          </div>
          
          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Step 1: Upload Audio</h3>
                <FileUpload
                  acceptedFileTypes="audio/*,.mp3,.wav,.ogg,.m4a"
                  maxFileSize={50}
                  maxFiles={1}
                  onFileSelect={handleAudioFileSelect}
                  color="#C2185B"
                  multiple={false}
                  label="Upload Audio File"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Step 2: Upload Media</h3>
                <FileUpload
                  acceptedFileTypes="image/*,video/*,.jpg,.jpeg,.png,.gif,.mp4,.webm"
                  maxFileSize={100}
                  maxFiles={1}
                  onFileSelect={handleMediaFileSelect}
                  color="#7B1FA2"
                  multiple={false}
                  label="Upload Image or Video"
                />
              </div>
            </div>
            
            {/* Format Selection */}
            {audioFile && mediaFile && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Step 3: Choose Output Format</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <select
                    value={outputFormat}
                    onChange={handleFormatChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2185B]"
                  >
                    {outputFormats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    className="btn btn-primary"
                    onClick={handleCombine}
                    disabled={isProcessing || !audioFile || !mediaFile}
                    style={{ backgroundColor: '#C2185B', opacity: isProcessing || !audioFile || !mediaFile ? 0.7 : 1 }}
                  >
                    {isProcessing ? 'Processing...' : 'Combine Files'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Actions */}
            {processedFile && (
              <div className="flex justify-center mt-6">
                <button
                  className="btn w-full md:w-auto"
                  onClick={handleDownload}
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                >
                  Download Combined File
                </button>
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
                Your files have been successfully combined! Click the download button to save the file.
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to Combine Audio with Images or Videos</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Upload an audio file (MP3, WAV, OGG, etc.).</li>
              <li>Upload an image or video file.</li>
              <li>Select the desired output format.</li>
              <li>Click the &quot;Combine Files&quot; button.</li>
              <li>Once processing is complete, download your combined file.</li>
            </ol>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">What You Can Create:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                <li>Add background music to videos</li>
                <li>Create slideshows with music from static images</li>
                <li>Replace the audio track in a video</li>
                <li>Create animated GIFs with sound</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                <li>Maximum file size: 50MB for audio, 100MB for images/videos</li>
                <li>If the audio is longer than the video, the video will loop or be extended</li>
                <li>If the video is longer than the audio, the audio will be looped or cut</li>
                <li>All processing happens in your browser - your files are never uploaded to our servers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 