import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: '내 포트폴리오',
  description: '웹서버보안프로그래밍 개인 포트폴리오',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>
          <div className="container">{children}</div>
        </main>
        <footer>
          <div className="container">
            © {new Date().getFullYear()} NYJ Webserver Security Portfolio. All
            rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
