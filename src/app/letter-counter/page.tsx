'use client';

import React, { useState, useEffect } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';

export default function LetterCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    totalCharacters: 0,
    letters: 0,
    digits: 0,
    spaces: 0,
    punctuation: 0,
    specialChars: 0,
    uppercase: 0,
    lowercase: 0,
    letterFrequency: {} as Record<string, number>,
    characterTypes: {} as Record<string, number>,
  });
  const [showVisualization, setShowVisualization] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state after component mounts for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Analyze text whenever it changes
  useEffect(() => {
    if (text === '') {
      setStats({
        totalCharacters: 0,
        letters: 0,
        digits: 0,
        spaces: 0,
        punctuation: 0,
        specialChars: 0,
        uppercase: 0,
        lowercase: 0,
        letterFrequency: {},
        characterTypes: {},
      });
      return;
    }

    // Count total characters
    const totalCharacters = text.length;

    // Count different character types
    let letters = 0;
    let digits = 0;
    let spaces = 0;
    let punctuation = 0;
    let specialChars = 0;
    let uppercase = 0;
    let lowercase = 0;

    // Track frequency of each letter
    const letterFrequency: Record<string, number> = {};
    
    // Track character types
    const characterTypes: Record<string, number> = {
      letters: 0,
      digits: 0,
      spaces: 0,
      punctuation: 0,
      specialChars: 0,
    };

    // Analyze each character
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Count by character type
      if (/[a-zA-Z]/.test(char)) {
        letters++;
        characterTypes.letters++;
        
        // Count case
        if (char === char.toUpperCase()) {
          uppercase++;
        } else {
          lowercase++;
        }
        
        // Track letter frequency (case insensitive)
        const lowerChar = char.toLowerCase();
        letterFrequency[lowerChar] = (letterFrequency[lowerChar] || 0) + 1;
      } else if (/\d/.test(char)) {
        digits++;
        characterTypes.digits++;
      } else if (/\s/.test(char)) {
        spaces++;
        characterTypes.spaces++;
      } else if (/[.,!?;:'"()[\]{}]/.test(char)) {
        punctuation++;
        characterTypes.punctuation++;
      } else {
        specialChars++;
        characterTypes.specialChars++;
      }
    }

    setStats({
      totalCharacters,
      letters,
      digits,
      spaces,
      punctuation,
      specialChars,
      uppercase,
      lowercase,
      letterFrequency,
      characterTypes,
    });
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClearText = () => {
    setText('');
  };

  const handleCopyStats = () => {
    const statsText = `
Letter Analysis Results:
Total Characters: ${stats.totalCharacters}
Letters: ${stats.letters} (${stats.uppercase} uppercase, ${stats.lowercase} lowercase)
Digits: ${stats.digits}
Spaces: ${stats.spaces}
Punctuation: ${stats.punctuation}
Special Characters: ${stats.specialChars}
    `;
    
    navigator.clipboard.writeText(statsText.trim())
      .then(() => {
        alert('Statistics copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy stats: ', err);
      });
  };

  // Calculate the maximum frequency for visualization scaling
  const maxFrequency = Object.values(stats.letterFrequency).length > 0 
    ? Math.max(...Object.values(stats.letterFrequency)) 
    : 0;

  return (
    <div className="relative min-h-screen py-12">
      <AnimatedBackground variant="default" />
      
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Letter Counter & Character Analyzer
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
            Analyze text character by character. Get detailed statistics about letters, digits, and special characters.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Enter your text</h2>
                <button 
                  onClick={handleClearText}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
              
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here..."
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Character Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Total Characters</span>
                    <span className="text-xl font-bold">{stats.totalCharacters}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Letters</span>
                    <span className="text-xl font-bold">{stats.letters}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Digits</span>
                    <span className="text-xl font-bold">{stats.digits}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Spaces</span>
                    <span className="text-xl font-bold">{stats.spaces}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Punctuation</span>
                    <span className="text-xl font-bold">{stats.punctuation}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Special Characters</span>
                    <span className="text-xl font-bold">{stats.specialChars}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCopyStats}
                  className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Copy Statistics
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Character Distribution</h2>
                
                {stats.totalCharacters > 0 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Character Types</h3>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex">
                        {stats.totalCharacters > 0 && (
                          <>
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${(stats.letters / stats.totalCharacters) * 100}%` }}
                              title={`Letters: ${stats.letters} (${((stats.letters / stats.totalCharacters) * 100).toFixed(1)}%)`}
                            ></div>
                            <div 
                              className="h-full bg-green-500" 
                              style={{ width: `${(stats.digits / stats.totalCharacters) * 100}%` }}
                              title={`Digits: ${stats.digits} (${((stats.digits / stats.totalCharacters) * 100).toFixed(1)}%)`}
                            ></div>
                            <div 
                              className="h-full bg-gray-400" 
                              style={{ width: `${(stats.spaces / stats.totalCharacters) * 100}%` }}
                              title={`Spaces: ${stats.spaces} (${((stats.spaces / stats.totalCharacters) * 100).toFixed(1)}%)`}
                            ></div>
                            <div 
                              className="h-full bg-yellow-500" 
                              style={{ width: `${(stats.punctuation / stats.totalCharacters) * 100}%` }}
                              title={`Punctuation: ${stats.punctuation} (${((stats.punctuation / stats.totalCharacters) * 100).toFixed(1)}%)`}
                            ></div>
                            <div 
                              className="h-full bg-red-500" 
                              style={{ width: `${(stats.specialChars / stats.totalCharacters) * 100}%` }}
                              title={`Special Characters: ${stats.specialChars} (${((stats.specialChars / stats.totalCharacters) * 100).toFixed(1)}%)`}
                            ></div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap mt-2 text-xs">
                        <div className="flex items-center mr-3 mb-1">
                          <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                          <span>Letters</span>
                        </div>
                        <div className="flex items-center mr-3 mb-1">
                          <div className="w-3 h-3 bg-green-500 mr-1"></div>
                          <span>Digits</span>
                        </div>
                        <div className="flex items-center mr-3 mb-1">
                          <div className="w-3 h-3 bg-gray-400 mr-1"></div>
                          <span>Spaces</span>
                        </div>
                        <div className="flex items-center mr-3 mb-1">
                          <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
                          <span>Punctuation</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 bg-red-500 mr-1"></div>
                          <span>Special</span>
                        </div>
                      </div>
                    </div>
                    
                    {stats.letters > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Letter Case</h3>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(stats.uppercase / stats.letters) * 100}%` }}
                            title={`Uppercase: ${stats.uppercase} (${((stats.uppercase / stats.letters) * 100).toFixed(1)}%)`}
                          ></div>
                          <div 
                            className="h-full bg-purple-500" 
                            style={{ width: `${(stats.lowercase / stats.letters) * 100}%` }}
                            title={`Lowercase: ${stats.lowercase} (${((stats.lowercase / stats.letters) * 100).toFixed(1)}%)`}
                          ></div>
                        </div>
                        <div className="flex flex-wrap mt-2 text-xs">
                          <div className="flex items-center mr-3">
                            <div className="w-3 h-3 bg-indigo-500 mr-1"></div>
                            <span>Uppercase ({stats.uppercase})</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 mr-1"></div>
                            <span>Lowercase ({stats.lowercase})</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Letter Frequency</h3>
                      <button 
                        onClick={() => setShowVisualization(!showVisualization)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {showVisualization && stats.letters > 0 && (
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Letter Frequency Visualization</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Alphabetical Order</h3>
                    <div className="space-y-2">
                      {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
                        <div key={letter} className="flex items-center">
                          <div className="w-6 text-center font-bold">{letter}</div>
                          <div className="flex-1 ml-2">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                style={{ 
                                  width: `${stats.letterFrequency[letter] ? (stats.letterFrequency[letter] / maxFrequency) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-8 text-right text-sm ml-2">
                            {stats.letterFrequency[letter] || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Frequency Order</h3>
                    <div className="space-y-2">
                      {Object.entries(stats.letterFrequency)
                        .sort((a, b) => b[1] - a[1])
                        .map(([letter, count]) => (
                          <div key={letter} className="flex items-center">
                            <div className="w-6 text-center font-bold">{letter}</div>
                            <div className="flex-1 ml-2">
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                  style={{ width: `${(count / maxFrequency) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-8 text-right text-sm ml-2">
                              {count}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">About Letter Counter</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Our letter counter tool provides detailed analysis of text at the character level, including counts of letters, digits, spaces, punctuation, and special characters.
                </p>
                <p>
                  The tool also breaks down letters by case (uppercase vs. lowercase) and provides frequency analysis for each letter in the alphabet.
                </p>
                <p>
                  The visualizations help you understand the distribution of different character types and the relative frequency of each letter in your text.
                </p>
                <p>
                  All processing happens directly in your browser - your text is never sent to our servers, ensuring complete privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 