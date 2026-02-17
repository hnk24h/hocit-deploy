'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import SearchBar from './SearchBar'
import { useState, useEffect, useRef } from 'react'
import { 
  HiNewspaper,
  HiShoppingBag,
  HiFire,
  HiInformationCircle,
  HiChevronDown,
  HiBars3,
  HiXMark,
  HiBookOpen,
  HiComputerDesktop,
  HiAdjustmentsHorizontal
} from 'react-icons/hi2'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAboutMenuOpen(false)
      }
    }

    if (aboutMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [aboutMenuOpen])

  // Keyboard navigation for dropdown
  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setAboutMenuOpen(false)
      buttonRef.current?.focus()
    } else if (e.key === 'ArrowDown' && !aboutMenuOpen) {
      e.preventDefault()
      setAboutMenuOpen(true)
    }
  }

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-elevation-2 sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SiteNavigationElement',
            'name': 'Main Navigation',
            'hasPart': [
              { '@type': 'WebPage', 'name': 'Blog', 'url': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hocit.vn'}/blog` },
              { '@type': 'WebPage', 'name': 'Sản phẩm', 'url': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hocit.vn'}/products` },
              { '@type': 'WebPage', 'name': 'Deals', 'url': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hocit.vn'}/deals` },
            ],
          }),
        }}
      />
      
      <nav className="max-w-7xl mx-auto px-4 py-3.5" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center gap-4">
          {/* Logo - Compact */}
          <div className="flex-shrink-0">
            <Logo size="md" showText={true} />
          </div>
          
          {/* Desktop Search Bar - Primary Focus */}
          <div className="hidden lg:flex lg:flex-1 lg:max-w-5xl">
            <SearchBar />
          </div>
          
          {/* Desktop Menu - Modern Inline Style */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex items-center space-x-5" aria-label="Primary navigation">
              <Link 
                href="/blog" 
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative group hover:text-brand-600 dark:hover:text-brand-400 ${
                  pathname?.startsWith('/blog') || pathname?.startsWith('/articles') 
                    ? 'text-brand-600 dark:text-brand-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <HiNewspaper className="w-4 h-4" />
                <span>Blog</span>
                {(pathname?.startsWith('/blog') || pathname?.startsWith('/articles')) && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
                )}
              </Link>
              
              <Link 
                href="/products" 
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative group hover:text-brand-600 dark:hover:text-brand-400 ${
                  pathname?.startsWith('/products') 
                    ? 'text-brand-600 dark:text-brand-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <HiShoppingBag className="w-4 h-4" />
                <span>Sản phẩm</span>
                {pathname?.startsWith('/products') && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
                )}
              </Link>
              
              {/* Deals - CTA Button */}
              <Link 
                href="/deals" 
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/deals'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-elevation-3 scale-105'
                    : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-600 dark:text-red-400 hover:shadow-elevation-2 hover:scale-105'
                }`}
              >
                <HiFire className="w-4 h-4" />
                <span>Deals</span>
                <span className="animate-pulse text-[10px] font-bold">HOT</span>
              </Link>

              {/* About + Resources Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={buttonRef}
                  onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                  onKeyDown={handleDropdownKeyDown}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors touch-target hover:text-brand-600 dark:hover:text-brand-400 ${
                    pathname === '/about' || pathname === '/library' || pathname === '/best-laptops' || pathname === '/laptop-comparison' 
                      ? 'text-brand-600 dark:text-brand-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  aria-expanded={aboutMenuOpen}
                  aria-haspopup="true"
                  aria-label="About menu"
                >
                  <HiInformationCircle className="w-4 h-4" />
                  <span>Về chúng tôi</span>
                  <HiChevronDown className={`w-4 h-4 transition-transform ${aboutMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-card shadow-elevation-4 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 ${aboutMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-2">
                    <Link 
                      href="/about"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
                      role="menuitem"
                      onClick={() => setAboutMenuOpen(false)}
                    >
                      <HiInformationCircle className="w-4 h-4" />
                      <span>Về Chúng Tôi</span>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tài nguyên
                    </div>
                    <Link 
                      href="/library"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setAboutMenuOpen(false)}
                    >
                      <HiBookOpen className="w-4 h-4" />
                      <span>Thư viện</span>
                    </Link>
                    <Link 
                      href="/best-laptops"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setAboutMenuOpen(false)}
                    >
                      <HiComputerDesktop className="w-4 h-4" />
                      <span>Best Laptops 2026</span>
                    </Link>
                    <Link 
                      href="/laptop-comparison"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setAboutMenuOpen(false)}
                    >
                      <HiAdjustmentsHorizontal className="w-4 h-4" />
                      <span>Laptop Comparison</span>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <Link 
                      href="/affiliate-disclosure"
                      className="block px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setAboutMenuOpen(false)}
                      rel="nofollow"
                    >
                      Affiliate Disclosure
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
            
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <HiXMark className="w-6 h-6" />
              ) : (
                <HiBars3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 animate-fadeIn">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar compact={true} />
            </div>
            
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/blog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  <HiNewspaper className="w-5 h-5" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  <HiShoppingBag className="w-5 h-5" />
                  <span>Sản phẩm</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/deals" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl font-semibold text-red-600 dark:text-red-400 hover:shadow-elevation-2 transition-all"
                >
                  <HiFire className="w-5 h-5" />
                  <span>Deals Hôm Nay</span>
                  <span className="ml-auto badge-hot text-xs">
                    HOT
                  </span>
                </Link>
              </li>
              
              {/* About + Resources Section */}
              <li className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  <HiInformationCircle className="w-5 h-5" />
                  <span>Về Chúng Tôi</span>
                </Link>
                <div className="mt-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Tài nguyên
                  </div>
                  <div className="space-y-2">
                    <Link 
                      href="/library" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2 pl-4"
                    >
                      <HiBookOpen className="w-4 h-4" />
                      <span>Thư viện</span>
                    </Link>
                    <Link 
                      href="/best-laptops" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2 pl-4"
                    >
                      <HiComputerDesktop className="w-4 h-4" />
                      <span>Best Laptops 2026</span>
                    </Link>
                    <Link 
                      href="/laptop-comparison" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2 pl-4"
                    >
                      <HiAdjustmentsHorizontal className="w-4 h-4" />
                      <span>Laptop Comparison</span>
                    </Link>
                  </div>
                </div>
              </li>
              
              <li className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/affiliate-disclosure" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2"
                  rel="nofollow"
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
