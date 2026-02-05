import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Ikagi</h3>
            <p className="text-sm">
              Blog chia sẻ kiến thức lập trình từ cơ bản đến nâng cao. 
              Học SQL, JavaScript và nhiều công nghệ khác.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Ủng hộ</h3>
            <p className="text-sm mb-4">
              Nếu bạn thấy nội dung hữu ích, hãy ủng hộ chúng tôi!
            </p>
            <a
              href="https://www.buymeacoffee.com/hoankjp93"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {currentYear} Ikagi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
