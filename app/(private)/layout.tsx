import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { redirect } from 'next/navigation';

import '@/app/globals.css';
import { auth } from '@/auth';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SideBar } from '@/components/side-bar';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer';

const poppins = Poppins({ weight: ['200', '400', '600'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rupee Script',
  description: 'Be a step ahead in your financial journey.',
};

// applicable to private groups
// making sure the user is authenticated
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // redirect to the home if the user is not authenticated
  if (!session) {
    return redirect('/');
  }

  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased bg-gray-50 flex flex-col h-screen`}
      >
        <SidebarProvider>
          <SideBar />
          <SidebarInset className="bg-gray-50">
            <div className="flex flex-col h-full">
              <main className="flex-1">
                <div className="flex">
                  <SidebarTrigger />
                  <Separator orientation="vertical" />
                </div>
                <Separator />

                {children}
              </main>
              <Footer />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
