import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-8', text: 'text-xl' },
    md: { container: 'h-10', text: 'text-2xl' },
    lg: { container: 'h-14', text: 'text-4xl' },
  };

  const { container, text } = sizes[size];

  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 group ${className}`}
      aria-label="Ikagi Home"
    >
      {/* Logo Icon - Shopping bag with affiliate symbol */}
      <div className={`${container} aspect-square relative flex items-center justify-center bg-gradient-primary rounded-xl shadow-elevation-2 group-hover:shadow-elevation-3 transition-all duration-300 group-hover:scale-105`}>
        {/* Shopping bag */}
        <svg 
          className="w-3/5 h-3/5 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
          />
        </svg>
        
        {/* Sparkle effect - indicates affiliate/deals */}
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <svg 
            className="w-full h-full text-yellow-400 animate-pulse" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${text} font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent group-hover:from-brand-700 group-hover:to-blue-700 transition-all duration-300`}>
            Ikagi
          </span>
          <span className="text-[0.6em] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Insightful Guides & Deals
          </span>
        </div>
      )}
    </Link>
  );
}
