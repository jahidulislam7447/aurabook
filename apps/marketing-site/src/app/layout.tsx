import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AuraTechIT - All-in-One SaaS Platform',
  description: 'Enterprise-level SaaS platform with CRM, ERP, POS, HR, and more. One platform, multiple business solutions.',
  keywords: ['SaaS', 'CRM', 'ERP', 'POS', 'HR', 'Business Software', 'Enterprise'],
  authors: [{ name: 'AuraTechIT' }],
  openGraph: {
    title: 'AuraTechIT - All-in-One SaaS Platform',
    description: 'Enterprise-level SaaS platform with CRM, ERP, POS, HR, and more.',
    url: 'https://auratechit.com',
    siteName: 'AuraTechIT',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuraTechIT SaaS Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraTechIT - All-in-One SaaS Platform',
    description: 'Enterprise-level SaaS platform with CRM, ERP, POS, HR, and more.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
