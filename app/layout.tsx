import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// --- THIS IS THE UPDATED METADATA ---
export const metadata: Metadata = {
  title: 'LTU Code Generator | Alya Nursalma Ridwan',
  description: 'A tool to generate HTML components for La Trobe University assignments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

