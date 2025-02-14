import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import '@/app/globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';

const poppins = Poppins({ weight: ['200', '400', '600'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rupee Script',
  description: 'Be a step ahead in your financial journey.',
};

// applicable to all the pages & groups
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased bg-gray-50 flex flex-col h-screen`}
      >
        <Header />
        <div className="flex-1 container mx-auto h-full py-4">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
