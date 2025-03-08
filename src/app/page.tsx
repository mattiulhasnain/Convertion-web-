'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ToolCard from '../components/ToolCard';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set loaded state after component mounts for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Tool data for the homepage with new tools added
  const tools = [
    {
      title: 'PDF Merger',
      description: 'Combine multiple PDF files into a single document. Rearrange pages, add bookmarks, and more.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      href: '/pdf-merger',
      color: '#D32F2F',
      isNew: false,
    },
    {
      title: 'Format Converter',
      description: 'Convert images and documents between different formats. Support for JPG, PNG, WEBP, GIF, SVG, BMP and more.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/format-converter',
      color: '#00796B',
      isNew: false,
      badge: 'Enhanced',
    },
    {
      title: 'Video Editor',
      description: 'Trim, crop, rotate, and add effects to videos. Create professional-looking videos with our advanced tools.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      href: '/video-editor',
      color: '#303F9F',
      isNew: false,
      badge: 'Enhanced',
    },
    {
      title: 'Video to Audio',
      description: 'Extract audio tracks from video files. Convert to MP3, WAV, OGG, FLAC, and other audio formats.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      href: '/video-to-audio',
      color: '#7B1FA2',
      isNew: false,
    },
    {
      title: 'Audio + Video',
      description: 'Combine audio files with images or videos. Create slideshows with music or add soundtracks to videos.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      href: '/audio-video',
      color: '#C2185B',
      isNew: false,
    },
    {
      title: 'Word Counter',
      description: 'Count words, characters, sentences, and paragraphs in your text. Get detailed statistics about your writing.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      href: '/word-counter',
      color: '#FF5722',
      isNew: true,
    },
    {
      title: 'Letter Counter',
      description: 'Analyze text for letter frequency, special characters, and more. Perfect for linguistic analysis and data processing.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      ),
      href: '/letter-counter',
      color: '#0097A7',
      isNew: true,
    },
    {
      title: 'Document Converter',
      description: 'Convert between document formats like DOCX, PDF, TXT, RTF, and more. Preserve formatting and styles.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/document-converter',
      color: '#689F38',
      isNew: true,
    },
  ];

  // Testimonial data
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Graphic Designer",
      content: "MUHIUM has completely transformed my workflow. The image format converter is incredibly fast and maintains high quality.",
      avatar: "AJ"
    },
    {
      name: "Sarah Williams",
      role: "Content Creator",
      content: "The video editor is intuitive and powerful. I can quickly trim and enhance my videos without any technical knowledge.",
      avatar: "SW"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      content: "PDF Merger saves me hours every week. I can easily combine multiple documents into one professional-looking PDF.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Writer & Editor",
      content: "The word counter tool is a game-changer for my writing. It provides detailed statistics that help me improve my content.",
      avatar: "ER"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "Is MUHIUM completely free to use?",
      answer: "Yes, all MUHIUM tools are completely free to use with no hidden fees or subscriptions."
    },
    {
      question: "Are my files uploaded to your servers?",
      answer: "No, all file processing happens directly in your browser. Your files never leave your device, ensuring complete privacy and security."
    },
    {
      question: "What file formats are supported?",
      answer: "We support a wide range of formats including PDF, JPG, PNG, WEBP, GIF, SVG, BMP, MP4, AVI, MOV, MP3, WAV, FLAC, DOCX, TXT, and many more. Our tools are constantly updated to support new formats."
    },
    {
      question: "Is there a file size limit?",
      answer: "Yes, there is a 100MB limit per file for most tools. This ensures optimal performance while still accommodating most user needs."
    },
    {
      question: "Can I use MUHIUM on mobile devices?",
      answer: "Absolutely! MUHIUM is fully responsive and works on smartphones, tablets, and desktop computers."
    },
    {
      question: "How accurate are the word and letter counting tools?",
      answer: "Our text analysis tools use advanced algorithms to provide highly accurate counts of words, characters, sentences, and paragraphs. They can also detect special characters and provide detailed frequency analysis."
    }
  ];

  // Features data
  const features = [
    {
      title: "Browser-Based Processing",
      description: "All processing happens in your browser. Your files never leave your device, ensuring complete privacy.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "High-Quality Conversion",
      description: "Our advanced algorithms ensure that converted files maintain the highest possible quality.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Completely Free",
      description: "All tools are free to use with no hidden fees, subscriptions, or watermarks on your files.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "No Registration Required",
      description: "Use all tools instantly without creating an account or providing any personal information.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-700">
              Free Online Tools for Everyone
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              MUHIUM provides powerful, browser-based tools for working with files, images, videos, and text. No downloads, no registration, completely free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#tools" className="btn-primary px-8 py-3 text-lg rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                Explore Tools
              </Link>
              <Link href="#features" className="btn-secondary px-8 py-3 text-lg rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 font-medium hover:shadow-lg transition-all duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-purple-500 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-float animation-delay-1000"></div>
        <div className="absolute top-2/3 left-1/4 w-16 h-16 bg-indigo-500 rounded-full opacity-10 animate-float animation-delay-2000"></div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Powerful Tools</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover our collection of free online tools designed to help you work with files, images, videos, and text.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div 
                key={tool.title} 
                className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ToolCard 
                  title={tool.title} 
                  description={tool.description} 
                  icon={tool.icon} 
                  href={tool.href} 
                  color={tool.color}
                  isNew={tool.isNew}
                  badge={tool.badge}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose MUHIUM</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our tools are designed with privacy, quality, and ease of use in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Thousands of users trust MUHIUM for their file conversion and editing needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name} 
                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">&quot;{testimonial.content}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find answers to common questions about MUHIUM and our tools.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Try our free online tools now and see how they can help streamline your workflow.
          </p>
          <Link href="#tools" className="inline-block px-8 py-3 text-lg bg-white text-indigo-700 font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            Explore All Tools
          </Link>
        </div>
      </section>
    </main>
  );
}
