import React from 'react';
import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  isNew?: boolean;
  badge?: string;
}

const ToolCard = ({ title, description, icon, href, color, isNew, badge }: ToolCardProps) => {
  // Set gradient colors based on the main color
  const gradientStyle = {
    background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
    borderTop: `3px solid ${color}`,
  };

  return (
    <Link href={href} className="block h-full group">
      <div 
        className="card h-full flex flex-col p-4 sm:p-6 hover:translate-y-[-5px] relative overflow-hidden transition-all duration-300" 
        style={gradientStyle}
      >
        {/* Animated background glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ 
            background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
            transform: 'scale(1.5)'
          }}
        ></div>
        
        {/* Card content */}
        <div className="relative z-10">
          <div 
            className="mb-4 text-2xl sm:text-3xl p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
            style={{ 
              color: color,
              background: `${color}20`
            }}
          >
            {icon}
          </div>
          
          <div className="flex items-center mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
            
            {isNew && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse">
                NEW
              </span>
            )}
            
            {badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: `${color}30`, color: color }}>
                {badge}
              </span>
            )}
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex-grow">{description}</p>
          <div className="mt-4 flex items-center text-sm font-medium transition-all duration-300 group-hover:translate-x-2" style={{ color: color }}>
            Try now
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </div>
        </div>

        {/* Focus outline for accessibility */}
        <div className="absolute inset-0 border-2 border-transparent group-focus-visible:border-blue-500 rounded-lg pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default ToolCard; 