import type { Metadata } from 'next';
import { Archivo, Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Path 11 — Cinema for the world\'s most inspired places',
  description: 'Path 11 is a production studio crafting cinematic films for luxury hotels, resorts, and real estate. London · Dubai · New York · Sydney.',
  openGraph: {
    title: 'Path 11',
    description: 'Cinema for the world\'s most inspired places.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="font-display grain">
        {children}
      </body>
    </html>
  );
}
