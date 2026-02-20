'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  HiUser, 
  HiArrowRightOnRectangle, 
  HiChevronDown,
  HiChatBubbleLeftRight,
  HiBookmark,
  HiArrowLeftOnRectangle,
  HiSun,
  HiMoon
} from 'react-icons/hi2'

export default function UserMenu() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  useEffect(() => {
    // Check current theme
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <HiArrowRightOnRectangle className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </Link>
        <Link
          href="/register"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 rounded-lg transition-colors"
        >
          <HiUser className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng ký</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
            {(user.name || user.username).charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:inline max-w-[120px] truncate">
          {user.name || user.username}
        </span>
        <HiChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fadeInScale">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name || user.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @{user.username}
            </p>
          </div>

          {/* Menu Items */}
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiUser className="w-4 h-4" />
            Trang cá nhân
          </Link>

          <Link
            href="/profile/comments"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiChatBubbleLeftRight className="w-4 h-4" />
            Bình luận của tôi
          </Link>

          <Link
            href="/profile/favorites"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiBookmark className="w-4 h-4" />
            Bài viết yêu thích
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? (
              <>
                <HiSun className="w-4 h-4" />
                Chế độ sáng
              </>
            ) : (
              <>
                <HiMoon className="w-4 h-4" />
                Chế độ tối
              </>
            )}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiArrowLeftOnRectangle className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}
