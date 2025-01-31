'use client';

import * as React from 'react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Container } from './container';

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-gray-800/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container size="xl">
        <div className="flex items-center h-16">
          {/* Left side - Logo (mobile) */}
          <div className="md:hidden">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Platform Tabs - Centered on mobile, start on desktop */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
            <div className="flex items-center">
              <nav className="flex space-x-6">
                <Link 
                  href="/browse/mobile"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-zinc-900',
                    pathname?.includes('/browse/mobile')
                      ? 'text-zinc-900 font-semibold'
                      : 'text-zinc-500'
                  )}
                >
                  Смартфон
                </Link>
                <Link
                  href="/browse/desktop"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-zinc-900',
                    pathname?.includes('/browse/desktop')
                      ? 'text-zinc-900 font-semibold'
                      : 'text-zinc-500'
                  )}
                >
                  Десктоп
                </Link>
              </nav>
            </div>
          </div>

          {/* Center - Logo (desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}
