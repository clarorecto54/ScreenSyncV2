import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import { GlobalContextProvider } from '@/components/hooks/useGlobals'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScreenSync',
  description: 'TUPC Screen Mirroring Solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
      </body>
    </html>
  )
}
