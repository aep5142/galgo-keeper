import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import Nav from '@/components/Nav'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Galgo Keeper',
  description: 'Track articles, books, movies, TV shows, and more',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-gray-900">
        <AppProvider>
          <Nav />
          {/* Offset for sidebar on desktop, bottom bar on mobile */}
          <main className="md:ml-56 px-6 py-8 pb-24 md:pb-8">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  )
}
