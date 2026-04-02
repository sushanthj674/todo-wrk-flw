import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todo App - Next.js',
  description: 'A simple todo app with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="app">
          {children}
        </div>
      </body>
    </html>
  )
}
