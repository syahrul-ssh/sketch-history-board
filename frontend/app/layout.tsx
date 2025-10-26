import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sketch History Board',
  description: 'Draw sketches and save versions with history',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}