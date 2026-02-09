'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import { useState, useEffect, useRef } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false)
      }
    }

    if (resourcesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [resourcesOpen])

  // Keyboard navigation for dropdown
  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setResourcesOpen(false)
      buttonRef.current?.focus()
    } else if (e.key === 'ArrowDown' && !resourcesOpen) {
      e.preventDefault()
      setResourcesOpen(true)
    }
  }

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-elevation-2 sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Logo size="md" showText={true} />
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors relative link-underline"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors relative link-underline"
                >
                  📝 Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors relative link-underline"
                >
                  Danh mục
                </Link>
              </li>
              
              {/* Products - Affiliate */}
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors relative link-underline"
                >
                  🛍️ Sản phẩm
                </Link>
              </li>
              
              {/* Deals - Highlighted */}
              <li>
                <Link 
                  href="/deals" 
                  className="relative text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors flex items-center gap-2"
                >
                  🔥 Deals
                  <span className="badge-hot">
                    HOT
                  </span>
                </Link>
              </li>

              {/* Resources Dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button
                  ref={buttonRef}
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  onKeyDown={handleDropdownKeyDown}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors touch-target"
                  aria-expanded={resourcesOpen}
                  aria-haspopup="true"
                  aria-label="Resources menu"
                >
                  Tài nguyên
                  <svg 
                    className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-card shadow-elevation-4 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 ${resourcesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-2">
                    <Link 
                      href="/library"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      📚 Thư viện
                    </Link>
                    <Link 
                      href="/best-laptops"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      💻 Best Laptops 2026
                    </Link>
                    <Link 
                      href="/laptop-comparison"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      ⚖️ Laptop Comparison
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <Link 
                      href="/admin"
                      className="block px-4 py-3 text-sm text-brand-600 dark:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      🎛️ Admin Panel
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <Link 
                      href="/affiliate-disclosure"
                      className="block px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Affiliate Disclosure
                    </Link>
                  </div>
                </div>
              </li>

              <li>
                <Link 
                  href="/about" 
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors relative link-underline"
                >
                  Giới thiệu
                </Link>
              </li>
            </ul>
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 animate-fadeIn">
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  📝 Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  Danh mục
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  🛍️ Sản phẩm
                </Link>
              </li>
              <li>
                <Link 
                  href="/deals" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  <span className="flex items-center gap-2">
                    🔥 Deals
                    <span className="badge-hot">
                      HOT
                    </span>
                  </span>
                </Link>
              </li>
              
              {/* Resources Section */}
              <li className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Tài nguyên
                </div>
                <div className="space-y-2">
                  <Link 
                    href="/library" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2 pl-4"
                  >
                    📚 Thư viện
                  </Link>
                  <Link 
                    href="/best-laptops" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2 pl-4"
                  >
                    💻 Best Laptops 2026
                  </Link>
                  <Link 
                    href="/laptop-comparison" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2 pl-4"
                  >
                    ⚖️ Laptop Comparison
                  </Link>
                  <Link 
                    href="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold transition-colors py-2 pl-4"
                  >
                    🎛️ Admin Panel
                  </Link>
                </div>
              </li>

              <li>
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
                >
                  Giới thiệu
                </Link>
              </li>
              
              <li className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/affiliate-disclosure" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2"
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
