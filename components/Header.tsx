'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/about', label: '소개' },
  { href: '/assignments', label: '과제' },
  { href: '/team', label: '팀 프로젝트' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header>
      <div className="container">
        <Link href="/" className="logo">
          Yoojin's Portfolio
        </Link>
        <nav>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={pathname.startsWith(n.href) ? 'active' : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
