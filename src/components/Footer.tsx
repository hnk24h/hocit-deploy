import Link from 'next/link'
import { 
  HiHome, 
  HiQueueList, 
  HiBookOpen, 
  HiNewspaper,
  HiHandRaised,
  HiShoppingBag,
  HiFire,
  HiComputerDesktop,
  HiAdjustmentsHorizontal,
  HiDocument,
  HiClipboardDocumentList,
  HiLockClosed,
  HiDocumentText,
  HiEnvelope
} from 'react-icons/hi2'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Nội dung',
      links: [
        { label: 'Trang chủ', href: '/', icon: HiHome },
        { label: 'Danh mục', href: '/categories', icon: HiQueueList },
        { label: 'Thư viện', href: '/library', icon: HiBookOpen },
        { label: 'Blog', href: '/blog', icon: HiNewspaper },
        { label: 'Giới thiệu', href: '/about', icon: HiHandRaised },
      ]
    },
    {
      title: 'Sản phẩm & Deals',
      links: [
        { label: 'Sản phẩm', href: '/products', icon: HiShoppingBag },
        { label: 'Deals HOT', href: '/deals', icon: HiFire },
        { label: 'Best Laptops 2026', href: '/best-laptops', icon: HiComputerDesktop },
        { label: 'So sánh Laptop', href: '/laptop-comparison', icon: HiAdjustmentsHorizontal },
        { label: 'Reader (PDF/Excel)', href: '/reader', icon: HiDocument },
      ]
    },
    {
      title: 'Legal & Hỗ trợ',
      links: [
        { label: 'Affiliate Disclosure', href: '/affiliate-disclosure', icon: HiClipboardDocumentList },
        { label: 'Privacy Policy', href: '/privacy', icon: HiLockClosed },
        { label: 'Terms of Service', href: '/terms', icon: HiDocumentText },
        { label: 'Liên hệ', href: '/contact', icon: HiEnvelope },
      ]
    }
  ]

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/ikagi.site', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Twitter', href: 'https://twitter.com/ikagi.site', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    )},
    { name: 'Facebook', href: 'https://www.facebook.com/ikagi.site', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )},
    { name: 'YouTube', href: 'https://youtube.com/@ikagi_site', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )}
  ]

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black dark:from-gray-950 dark:via-gray-950 dark:to-black text-gray-300 overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Brand Column - Larger on desktop */}
            <div className="lg:col-span-4">
              <div className="flex-shrink-0 inline-block group mb-6">
                <Logo size="md" showText={true} />
              </div>
              <p className="text-gray-400 dark:text-gray-500 mb-6 leading-relaxed text-sm sm:text-base max-w-md">
                Blog chia sẻ kiến thức lập trình, review công cụ và sản phẩm tốt nhất cho developers. 
                Nơi developers tìm inspiration và giải pháp.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3 mb-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800/50 dark:bg-gray-900/50 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-500/20"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Support Button */}
              <a
                href="https://www.buymeacoffee.com/hoankjp93"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-300 text-sm group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">☕</span>
                Buy me a coffee
              </a>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => {
                      const IconComponent = link.icon
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                          >
                            <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Section - Enhanced Design */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-brand-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 sm:p-10">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-block p-3 bg-brand-500/10 rounded-xl mb-4">
                  <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-3">
                  Đăng ký nhận tin tức mới nhất
                </h3>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                  Nhận thông báo về bài viết mới, deals hot và tips hữu ích cho developers 🚀
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="flex-1 px-5 py-3.5 text-base rounded-xl bg-gray-900/50 dark:bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    required
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/30 hover:scale-105 whitespace-nowrap"
                  >
                    Đăng ký ngay
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                  Chúng tôi tôn trọng privacy của bạn. Unsubscribe bất cứ lúc nào.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 dark:border-gray-900/50 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-500">
              © {currentYear} <span className="text-gray-400 font-medium">Ikagi Blog</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-gray-500">
              <Link href="/affiliate-disclosure" className="hover:text-gray-300 transition-colors">
                Affiliate Disclosure
              </Link>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-4">
            Made with <span className="text-red-500 animate-pulse">❤️</span> by developers, for developers
          </p>
        </div>
      </div>
    </footer>
  )
}
