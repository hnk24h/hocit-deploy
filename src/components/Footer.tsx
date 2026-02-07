import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Ikagi Blog</h3>
            <p className="text-sm mb-4">
              Blog chia sẻ kiến thức lập trình, review công cụ và sản phẩm 
              tốt nhất cho developers.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Content - SEO Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Nội dung</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-white transition-colors">
                  📚 Thư viện
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Deals - Affiliate */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Sản phẩm & Deals</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  🛍️ Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-white transition-colors flex items-center gap-2 touch-target">
                  🔥 Deals
                  <span className="badge-hot">HOT</span>
                </Link>
              </li>
              <li>
                <Link href="/best-laptops" className="hover:text-white transition-colors">
                  💻 Best Laptops 2026
                </Link>
              </li>
              <li>
                <Link href="/laptop-comparison" className="hover:text-white transition-colors">
                  ⚖️ So sánh Laptop
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Legal & Hỗ trợ</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
            
            {/* Buy me a coffee */}
            <a
              href="https://www.buymeacoffee.com/hoankjp93"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-5 py-2.5 rounded-button font-medium hover:bg-yellow-400 transition-all text-sm shadow-elevation-2 hover:shadow-elevation-3"
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white text-xl font-bold mb-2">
              📧 Đăng ký nhận tin tức
            </h3>
            <p className="text-sm mb-4">
              Nhận thông báo về bài viết mới, deals hot và tips hữu ích cho developers
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-2.5 text-base rounded-button bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
                aria-label="Your email address"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-primary hover:scale-[1.02] text-white rounded-button font-medium transition-all whitespace-nowrap shadow-elevation-2 hover:shadow-elevation-3"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-center">
          <p className="text-sm mb-2">
            © {currentYear} Ikagi Blog. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with ❤️ by developers, for developers. 
            {' '}
            <Link href="/affiliate-disclosure" className="hover:text-gray-300">
              Some links are affiliate links
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
