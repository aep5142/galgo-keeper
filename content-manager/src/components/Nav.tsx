'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard', icon: '⊞', color: 'gray' },
  { href: '/content', label: 'Content', icon: '◉', color: 'blue' },
  { href: '/books', label: 'Books', icon: '▤', color: 'violet' },
  { href: '/videos', label: 'Videos', icon: '▶', color: 'amber' },
]

const activeClasses: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-900',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
}

const hoverClasses: Record<string, string> = {
  gray: 'hover:bg-gray-50 hover:text-gray-900',
  blue: 'hover:bg-blue-50/50 hover:text-blue-700',
  violet: 'hover:bg-violet-50/50 hover:text-violet-700',
  amber: 'hover:bg-amber-50/50 hover:text-amber-700',
}

const mobileActiveClasses: Record<string, string> = {
  gray: 'text-gray-900',
  blue: 'text-blue-600',
  violet: 'text-violet-600',
  amber: 'text-amber-600',
}

export default function Nav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-gray-200 bg-gray-50/50 p-4 fixed h-full">
        <Link href="/" className="font-semibold text-lg px-3 mb-6">
          Galgo Keeper
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? `font-medium ${activeClasses[link.color]}`
                    : `text-gray-500 ${hoverClasses[link.color]}`
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {links.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                  isActive
                    ? `font-medium ${mobileActiveClasses[link.color]}`
                    : 'text-gray-400'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
