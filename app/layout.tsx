import { Metadata } from 'next';
import MainNav from '@/components/ui/MainNav';
import Footer from '@/components/ui/footer';
import { Toaster } from '@/components/ui/toaster';
import { PropsWithChildren } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { Providers } from './providers';

const title = 'Skreenoteka - UX вдохновение';
const description = 'Brought to you by Skreenoteka';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/favicon.svg'
  },
  openGraph: {
    title: title,
    description: description
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>

          
          <MainNav />
          
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)]"
          >
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
