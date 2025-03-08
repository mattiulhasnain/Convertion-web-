'use client';

import React, { useState } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';
import FileUpload from '../../components/FileUpload';
import { extractAudioFromVideo, generateDownloadURL, downloadFile } from '../../utils/fileProcessor';

export default function VideoToAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [audioFormat, setAudioFormat] = useState<string>('mp3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Available audio formats
  const audioFormats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'ogg', label: 'OGG' },
    { value: 'm4a', label: 'M4A' },
  ];

  const handleFileSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setProcessedFile(null);
      setError(null);
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAudioFormat(e.target.value);
    setProcessedFile(null);
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please select a video file to extract audio from.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Process the file
      const extractedAudio = await extractAudioFromVideo(file, audioFormat);
      
      // Generate download URL
      const filename = `${file.name.split('.')[0]}.${audioFormat}`;
      const url = generateDownloadURL(extractedAudio, filename);
      
      setProcessedFile({
        url,
        name: filename,
      });
    } catch (err) {
      setError('An error occurred while extracting audio. Please try again.');
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
      <AnimatedBackground variant="audio" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Video to Audio Converter</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Extract audio tracks from video files. Convert to MP3, WAV, OGG, and other audio formats.
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
                color="#7B1FA2"
                multiple={false}
                label="Upload Video"
              />
            </div>
            
            {/* Format Selection */}
            {file && (
              <div className="mb-8">
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Output Audio Format:
                </label>
                <div className="flex items-center gap-4">
                  <select
                    value={audioFormat}
                    onChange={handleFormatChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                  >
                    {audioFormats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    className="btn btn-primary"
                    onClick={handleExtract}
                    disabled={isProcessing || !file}
                    style={{ backgroundColor: '#7B1FA2', opacity: isProcessing || !file ? 0.7 : 1 }}
                  >
                    {isProcessing ? 'Extracting...' : 'Extract Audio'}
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
                  Download Audio
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
                Audio has been successfully extracted! Click the download button to save the file.
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to Extract Audio from Video</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Upload a video file using the upload area above.</li>
              <li>Select the audio format you want for the output.</li>
              <li>Click the &quot;Extract Audio&quot; button.</li>
              <li>Once processing is complete, download your audio file.</li>
            </ol>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Supported Audio Formats:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                <li>MP3 - Most common audio format, good compression</li>
                <li>WAV - Uncompressed audio, highest quality</li>
                <li>OGG - Free and open container format</li>
                <li>M4A - Advanced audio coding format</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                <li>Maximum video file size: 100MB</li>
                <li>Supported video formats: MP4, WEBM, MOV, AVI</li>
                <li>All processing happens in your browser - your files are never uploaded to our servers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 