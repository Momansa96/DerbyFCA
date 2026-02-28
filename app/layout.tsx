import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FCA Derby Manager',
  description: 'Gestion des tirages et activités sportives du FCA',
  icons: {
    icon: '/images/logo-fca.jpeg',
    shortcut: '/images/logo-fca.jpeg',
    apple: '/images/logo-fca.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="flex flex-col justify-center min-h-screen pt-10 bg-gray-100">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
