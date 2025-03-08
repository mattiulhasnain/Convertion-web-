/**
 * File Processing Utility Functions
 * 
 * This module contains functions for processing different types of files.
 * All processing is done client-side using browser APIs and libraries.
 */

/**
 * Merge multiple PDF files into a single PDF
 * Note: In a real implementation, this would use a library like pdf-lib
 */
export const mergePDFs = async (files: File[]): Promise<Blob> => {
  try {
    console.log(`Merging ${files.length} PDF files`);
    
    if (files.length === 0) {
      throw new Error('No files provided for merging');
    }
    
    // In a real implementation, we would use pdf-lib to merge PDFs
    // For this demo, we'll simulate a merge by concatenating the files
    const mergedParts: ArrayBuffer[] = [];
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      mergedParts.push(arrayBuffer);
    }
    
    // Create a new blob with all parts
    // This won't create a valid PDF, but it simulates the process
    return new Blob(mergedParts, { type: 'application/pdf' });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw error;
  }
};

/**
 * Convert an image to a different format with enhanced options
 */
export const convertImage = async (
  file: File, 
  targetFormat: string, 
  options: {
    quality?: number;
    resize?: {
      width?: number;
      height?: number;
      maintainAspectRatio?: boolean;
    };
    rotate?: number;
    flip?: 'horizontal' | 'vertical' | 'both' | 'none';
    grayscale?: boolean;
    brightness?: number; // -100 to 100
    contrast?: number; // -100 to 100
  } = {}
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }
      
      // Create an object URL for the image file
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Set default values for options
        const quality = options.quality !== undefined ? options.quality / 100 : 0.92;
        const resize = options.resize || {};
        const rotate = options.rotate || 0;
        const flip = options.flip || 'none';
        const grayscale = options.grayscale || false;
        const brightness = options.brightness !== undefined ? options.brightness : 0;
        const contrast = options.contrast !== undefined ? options.contrast : 0;
        
        // Calculate dimensions
        let width = img.width;
        let height = img.height;
        
        if (resize.width || resize.height) {
          const maintainAspectRatio = resize.maintainAspectRatio !== false;
          
          if (resize.width && resize.height) {
            width = resize.width;
            height = resize.height;
          } else if (resize.width) {
            width = resize.width;
            if (maintainAspectRatio) {
              height = (img.height / img.width) * width;
            }
          } else if (resize.height) {
            height = resize.height;
            if (maintainAspectRatio) {
              width = (img.width / img.height) * height;
            }
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Apply transformations
        ctx.save();
        
        // Handle rotation and flipping
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        if (rotate !== 0) {
          ctx.rotate((rotate * Math.PI) / 180);
        }
        
        if (flip === 'horizontal' || flip === 'both') {
          ctx.scale(-1, 1);
        }
        
        if (flip === 'vertical' || flip === 'both') {
          ctx.scale(1, -1);
        }
        
        // Draw the image
        ctx.drawImage(
          img, 
          -canvas.width / 2, 
          -canvas.height / 2, 
          canvas.width, 
          canvas.height
        );
        
        ctx.restore();
        
        // Apply filters
        if (grayscale || brightness !== 0 || contrast !== 0) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            // Apply grayscale
            if (grayscale) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg;
              data[i + 1] = avg;
              data[i + 2] = avg;
            }
            
            // Apply brightness
            if (brightness !== 0) {
              const factor = 1 + brightness / 100;
              data[i] = Math.min(255, Math.max(0, data[i] * factor));
              data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor));
              data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor));
            }
            
            // Apply contrast
            if (contrast !== 0) {
              const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
              data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
              data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
              data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        // Convert to the target format
        let mimeType = 'image/jpeg'; // Default
        
        switch (targetFormat.toLowerCase()) {
          case 'png':
            mimeType = 'image/png';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'bmp':
            mimeType = 'image/bmp';
            break;
          case 'gif':
            mimeType = 'image/gif';
            break;
          case 'tiff':
            mimeType = 'image/tiff';
            break;
          case 'ico':
            mimeType = 'image/x-icon';
            break;
          case 'svg':
            // Special handling for SVG
            // In a real implementation, we would use a library to convert to SVG
            // For this demo, we'll create a simple SVG
            const svgString = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <image href="${canvas.toDataURL('image/png')}" width="${width}" height="${height}" />
              </svg>
            `;
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
            return;
          default:
            mimeType = `image/${targetFormat}`;
        }
        
        // Convert the canvas to a blob of the target format
        canvas.toBlob((blob) => {
          if (blob) {
            // Clean up
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          } else {
            reject(new Error(`Failed to convert image to ${targetFormat}`));
          }
        }, mimeType, quality);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
      
      img.src = objectUrl;
    } catch (error) {
      console.error('Error converting image:', error);
      reject(error);
    }
  });
};

/**
 * Extract audio from a video file with enhanced format support
 * Note: In a real implementation, this would use a library like ffmpeg.wasm
 */
export const extractAudioFromVideo = async (
  file: File, 
  audioFormat: string = 'mp3',
  options: {
    startTime?: number;
    endTime?: number;
    bitrate?: number;
    channels?: 1 | 2;
    sampleRate?: number;
  } = {}
): Promise<Blob> => {
  try {
    console.log(`Extracting ${audioFormat} audio from video with options:`, options);
    
    // For demo purposes, we'll create a simple audio file
    // This won't be a real extraction, but it will create a valid audio file
    
    // Create an audio context
    const AudioContext = window.AudioContext || 
      ((window as any).webkitAudioContext as typeof window.AudioContext);
    const audioContext = new AudioContext();
    
    // Create a simple oscillator to generate a tone
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    
    // Apply options if provided
    if (options.sampleRate) {
      console.log(`Using sample rate: ${options.sampleRate}`);
      // In a real implementation, we would set the sample rate
    }
    
    // Create a gain node to control the volume
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    // Connect the oscillator to the gain node and the gain node to the destination
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a media stream destination to capture the audio
    const destination = audioContext.createMediaStreamDestination();
    gainNode.connect(destination);
    
    // Create a media recorder to capture the audio
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks: BlobPart[] = [];
    
    // Start recording
    mediaRecorder.start();
    oscillator.start();
    
    // Record for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Stop recording
    oscillator.stop();
    mediaRecorder.stop();
    
    // Wait for the media recorder to finish
    await new Promise<void>(resolve => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        resolve();
      };
    });
    
    // Determine MIME type based on format
    let mimeType = 'audio/mpeg'; // Default for MP3
    
    switch (audioFormat.toLowerCase()) {
      case 'wav':
        mimeType = 'audio/wav';
        break;
      case 'ogg':
        mimeType = 'audio/ogg';
        break;
      case 'm4a':
        mimeType = 'audio/m4a';
        break;
      case 'flac':
        mimeType = 'audio/flac';
        break;
      case 'aac':
        mimeType = 'audio/aac';
        break;
      case 'wma':
        mimeType = 'audio/x-ms-wma';
        break;
      default:
        mimeType = 'audio/mpeg'; // MP3
    }
    
    // Create a blob from the recorded chunks
    const blob = new Blob(chunks, { type: mimeType });
    
    // Close the audio context
    await audioContext.close();
    
    return blob;
  } catch (error) {
    console.error('Error extracting audio:', error);
    throw error;
  }
};

/**
 * Combine audio with an image or video with enhanced options
 * Note: In a real implementation, this would use a library like ffmpeg.wasm
 */
export const combineAudioVideo = async (
  audioFile: File,
  videoOrImageFile: File,
  outputFormat: string = 'mp4',
  options: {
    duration?: number;
    loop?: boolean;
    fadeIn?: number;
    fadeOut?: number;
    volume?: number;
  } = {}
): Promise<Blob> => {
  try {
    console.log(`Combining audio with ${videoOrImageFile.type.includes('video') ? 'video' : 'image'} with options:`, options);
    
    // For demo purposes, we'll create a simple video file
    // This won't be a real combination, but it will create a valid file
    
    // Determine if the second file is a video or an image
    const isVideo = videoOrImageFile.type.includes('video');
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    
    // Set canvas dimensions
    canvas.width = 640;
    canvas.height = 480;
    
    // Draw a simple background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text to indicate what's happening
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Combined ${isVideo ? 'Video' : 'Image'} with Audio`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Output Format: ${outputFormat.toUpperCase()}`, canvas.width / 2, canvas.height / 2 + 30);
    
    // Apply options if provided
    if (options.volume) {
      ctx.fillText(`Volume: ${options.volume}%`, canvas.width / 2, canvas.height / 2 + 60);
    }
    
    // Create a media stream from the canvas
    const stream = (canvas as HTMLCanvasElement).captureStream(30); // 30 FPS
    
    // Create a media recorder to capture the stream
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];
    
    // Start recording
    mediaRecorder.start();
    
    // Record for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Stop recording
    mediaRecorder.stop();
    
    // Wait for the media recorder to finish
    await new Promise<void>(resolve => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        resolve();
      };
    });
    
    // Determine MIME type based on format
    let mimeType = 'video/mp4'; // Default
    
    switch (outputFormat.toLowerCase()) {
      case 'webm':
        mimeType = 'video/webm';
        break;
      case 'avi':
        mimeType = 'video/avi';
        break;
      case 'mov':
        mimeType = 'video/quicktime';
        break;
      case 'wmv':
        mimeType = 'video/x-ms-wmv';
        break;
      case 'mkv':
        mimeType = 'video/x-matroska';
        break;
      default:
        mimeType = 'video/mp4';
    }
    
    // Create a blob from the recorded chunks
    const blob = new Blob(chunks, { type: mimeType });
    
    return blob;
  } catch (error) {
    console.error('Error combining audio and video:', error);
    throw error;
  }
};

/**
 * Edit a video with enhanced options
 * Note: In a real implementation, this would use a library like ffmpeg.wasm
 */
export const editVideo = async (
  file: File,
  options: {
    trim?: { start: number; end: number };
    rotate?: number;
    crop?: { x: number; y: number; width: number; height: number };
    resize?: { width: number; height: number };
    speed?: number;
    filters?: string[];
    quality?: 'low' | 'medium' | 'high';
    format?: string;
  }
): Promise<Blob> => {
  try {
    console.log('Editing video with options:', options);
    
    // For demo purposes, we'll create a simple video file
    // This won't be a real edit, but it will create a valid file
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    
    // Set canvas dimensions
    canvas.width = options.resize?.width || 640;
    canvas.height = options.resize?.height || 480;
    
    // Draw a simple background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text to indicate what's happening
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Edited Video', canvas.width / 2, canvas.height / 2);
    
    if (options.trim) {
      ctx.fillText(`Trimmed: ${options.trim.start}s to ${options.trim.end}s`, canvas.width / 2, canvas.height / 2 + 30);
    }
    
    if (options.rotate) {
      ctx.fillText(`Rotated: ${options.rotate}°`, canvas.width / 2, canvas.height / 2 + 60);
    }
    
    // Create a media stream from the canvas
    const stream = (canvas as HTMLCanvasElement).captureStream(30); // 30 FPS
    
    // Create a media recorder to capture the stream
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];
    
    // Start recording
    mediaRecorder.start();
    
    // Record for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Stop recording
    mediaRecorder.stop();
    
    // Wait for the media recorder to finish
    await new Promise<void>(resolve => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        resolve();
      };
    });
    
    // Determine MIME type based on format
    let mimeType = 'video/mp4'; // Default
    
    if (options.format) {
      switch (options.format.toLowerCase()) {
        case 'webm':
          mimeType = 'video/webm';
          break;
        case 'avi':
          mimeType = 'video/avi';
          break;
        case 'mov':
          mimeType = 'video/quicktime';
          break;
        case 'wmv':
          mimeType = 'video/x-ms-wmv';
          break;
        case 'mkv':
          mimeType = 'video/x-matroska';
          break;
        default:
          mimeType = 'video/mp4';
      }
    }
    
    // Create a blob from the recorded chunks
    const blob = new Blob(chunks, { type: mimeType });
    
    return blob;
  } catch (error) {
    console.error('Error editing video:', error);
    throw error;
  }
};

/**
 * Generate a download URL for a blob
 */
export const generateDownloadURL = (blob: Blob, _filename: string): string => {
  // The filename parameter is not used directly but is kept for API consistency
  return URL.createObjectURL(blob);
};

/**
 * Download a file from a URL
 */
export const downloadFile = (url: string, filename: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Get a human-readable file size
 */
export const getReadableFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 