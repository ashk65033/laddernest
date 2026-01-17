import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { SimpleSessionProvider } from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'laddernest - Find Your Dream Job',
  description: 'Discover thousands of job listings from top companies. Your career journey starts here.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body suppressHydrationWarning>
        <SimpleSessionProvider>
          {children}
        </SimpleSessionProvider>
      </body>
    </html>
  )
}
