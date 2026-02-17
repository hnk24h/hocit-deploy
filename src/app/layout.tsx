import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './prism-tomorrow.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { StructuredData } from '@/components/StructuredData'
import AdSenseScript from '@/components/ads/AdSenseScript'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hocit.vercel.app'),
  title: {
    default: 'Ikagi - Học Lập Trình',
    template: '%s | Ikagi',
  },
  description: 'Technical blog về lập trình, SQL, JavaScript và nhiều hơn nữa',
  keywords: ['lập trình', 'programming', 'SQL', 'JavaScript', 'tutorial', 'học lập trình'],
  authors: [{ name: 'Ikagi' }],
  creator: 'Ikagi',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'Ikagi - Học Lập Trình',
    description: 'Technical blog về lập trình, SQL, JavaScript và nhiều hơn nữa',
    siteName: 'Ikagi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ikagi - Học Lập Trình',
    description: 'Technical blog về lập trình, SQL, JavaScript và nhiều hơn nữa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <StructuredData type="Website" data={{}} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAnalytics />
        <AdSenseScript />
        {/* Skip to main content - Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  )
}
