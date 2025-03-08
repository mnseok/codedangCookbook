import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: '스꾸딩 Cookbook'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="">
            <main className="flex-grow">{children}</main>{' '}
            {/* ✅ flex-grow 추가 */}
            <footer className="text-muted mt-4 border-t py-2 text-center text-sm">
              © 2025 SKKUDING.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
