'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { App } from '@/lib/types';

interface DesktopAppCardProps {
  app: App;
  href: string;
}

export function DesktopAppCard({ app, href }: DesktopAppCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Фильтруем только десктопные скриншоты
  const screenImages = app.screens
    .filter(screen => 
      screen.platform?.some(p => 
        ['web', 'desktop'].includes(p.name.toLowerCase())
      )
    )
    .slice(0, 3);

  return (
    <Link href={href} className="block">
      <div className="group relative rounded-2xl overflow-hidden bg-white border border-zinc-200 hover:border-zinc-300 transition-colors">
        {/* App Screenshots */}
        <div className="aspect-video relative overflow-hidden">
          {screenImages.length > 0 && !imageError ? (
            <div className="absolute inset-0">
              <div className="flex h-full">
                {screenImages.map((screen, index) => (
                  <div 
                    key={index}
                    className="w-full h-full flex-none relative"
                  >
                    <Image
                      src={screen.image.url}
                      alt={screen.title || app.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={cn(
                        "object-cover object-top transition-opacity duration-300",
                        isImageLoading ? "opacity-0" : "opacity-100"
                      )}
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setImageError(true)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100">
              <span className="text-zinc-500">Нет скриншотов</span>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            {app.logo?.url && (
              <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-zinc-100">
                <Image
                  src={app.logo.url}
                  alt={`${app.name} logo`}
                  fill
                  sizes="48px"
                  className={cn(
                    "object-contain",
                    isLogoLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setIsLogoLoading(false)}
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h3 className="font-medium text-base text-zinc-900 truncate">{app.name}</h3>
              <p className="text-sm text-zinc-500 truncate">{app.category}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
