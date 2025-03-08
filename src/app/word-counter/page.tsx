'use client';

import React, { useState, useEffect } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    mostFrequentWords: [] as {word: string, count: number}[],
    letterFrequency: {} as Record<string, number>,
  });
  const [showFrequency, setShowFrequency] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state after component mounts for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Analyze text whenever it changes
  useEffect(() => {
    if (text.trim() === '') {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        mostFrequentWords: [],
        letterFrequency: {},
      });
      return;
    }

    // Count characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Count sentences
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;

    // Count paragraphs
    const paragraphs = text.split(/\n+/).filter(paragraph => paragraph.trim().length > 0).length;

    // Calculate reading time (average reading speed: 200-250 words per minute)
    const readingTime = Math.ceil(words / 225);

    // Calculate speaking time (average speaking speed: 150 words per minute)
    const speakingTime = Math.ceil(words / 150);

    // Find most frequent words
    const wordFrequency: Record<string, number> = {};
    text.trim().toLowerCase().split(/\s+/).forEach(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w\s]|_/g, "");
      if (cleanWord.length > 0) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });

    const mostFrequentWords = Object.entries(wordFrequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate letter frequency
    const letterFrequency: Record<string, number> = {};
    text.toLowerCase().split('').forEach(char => {
      if (/[a-z0-9]/.test(char)) {
        letterFrequency[char] = (letterFrequency[char] || 0) + 1;
      }
    });

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      mostFrequentWords,
      letterFrequency,
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
Word Count: ${stats.words}
Character Count: ${stats.characters}
Character Count (no spaces): ${stats.charactersNoSpaces}
Sentence Count: ${stats.sentences}
Paragraph Count: ${stats.paragraphs}
Estimated Reading Time: ${stats.readingTime} minute(s)
Estimated Speaking Time: ${stats.speakingTime} minute(s)
    `;
    
    navigator.clipboard.writeText(statsText.trim())
      .then(() => {
        alert('Statistics copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy stats: ', err);
      });
  };

  return (
    <div className="relative min-h-screen py-12">
      <AnimatedBackground variant="default" />
      
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Word Counter & Text Analyzer
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
            Count words, characters, sentences, and paragraphs. Get detailed statistics about your text.
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
                <h2 className="text-xl font-semibold mb-4">Basic Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Words</span>
                    <span className="text-xl font-bold">{stats.words}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Characters (with spaces)</span>
                    <span className="text-xl font-bold">{stats.characters}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Characters (no spaces)</span>
                    <span className="text-xl font-bold">{stats.charactersNoSpaces}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Sentences</span>
                    <span className="text-xl font-bold">{stats.sentences}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Paragraphs</span>
                    <span className="text-xl font-bold">{stats.paragraphs}</span>
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
                <h2 className="text-xl font-semibold mb-4">Advanced Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Reading Time</span>
                    <span className="text-xl font-bold">{stats.readingTime} min</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Speaking Time</span>
                    <span className="text-xl font-bold">{stats.speakingTime} min</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Most Frequent Words</span>
                      <button 
                        onClick={() => setShowFrequency(!showFrequency)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {showFrequency ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    
                    {showFrequency && stats.mostFrequentWords.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                              <th className="py-1 px-2 text-left">Word</th>
                              <th className="py-1 px-2 text-right">Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.mostFrequentWords.map((item, index) => (
                              <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-1 px-2">{item.word}</td>
                                <td className="py-1 px-2 text-right">{item.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {showFrequency && (
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Letter Frequency</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Object.entries(stats.letterFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .map(([letter, count]) => (
                      <div key={letter} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{letter}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{count} times</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">About Word Counter</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Our word counter tool provides accurate statistics about your text, including word count, character count, sentence count, and paragraph count.
                </p>
                <p>
                  The tool also estimates reading and speaking time based on average reading speed (225 words per minute) and speaking speed (150 words per minute).
                </p>
                <p>
                  For more detailed analysis, you can view the most frequent words in your text and letter frequency distribution.
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