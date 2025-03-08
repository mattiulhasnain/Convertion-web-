import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/pdf-merger', label: 'PDF Merger' },
    { href: '/format-converter', label: 'Format Converter' },
    { href: '/video-editor', label: 'Video Editor' },
    { href: '/video-to-audio', label: 'Video to Audio' },
    { href: '/audio-video', label: 'Audio + Video' },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#1A237E] via-[#6A1B9A] to-[#D81B60] text-transparent bg-clip-text">
              MUHIUM
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The ultimate online suite for file and media conversion. Convert, merge, and edit your files with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#6A1B9A] dark:hover:text-[#EC407A] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Have questions or feedback?
            </p>
            <a
              href="mailto:m.mattiulhasnain@gmail.com"
              className="text-[#6A1B9A] dark:text-[#EC407A] hover:underline"
            >
              m.mattiulhasnain@gmail.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>© {currentYear} MUHIUM. All rights reserved.</p>
          <p className="mt-1">Contact: <a href="mailto:m.mattiulhasnain@gmail.com" className="text-[#6A1B9A] dark:text-[#EC407A] hover:underline">m.mattiulhasnain@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 