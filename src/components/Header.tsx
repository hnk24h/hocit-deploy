import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
            Ikagi
          </Link>
          <div className="flex items-center gap-6">
            <ul className="flex space-x-8">
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
                  href="/categories" 
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors relative link-underline"
                >
                  Danh mục
                </Link>
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
        </div>
      </nav>
    </header>
  )
}
