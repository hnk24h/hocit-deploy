import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
            Ikagi
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                Danh mục
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                Giới thiệu
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
