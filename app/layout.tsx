import './globals.css';
import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-condensed',
});

export const metadata: Metadata = {
  title: 'FCA Derby Manager',
  description: 'Gestion des tirages et activités sportives du FCA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${barlow.variable} ${barlowCondensed.variable} font-body`}>
        <Providers>
          <Navbar />
          <main className="flex flex-col justify-center min-h-screen pt-16 bg-surface">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
