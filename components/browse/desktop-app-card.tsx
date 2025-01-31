'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { App } from '@/lib/types'; // убедиться, что импорт App из '@/lib/types' корректен

interface DesktopAppCardProps {
  app: App;
  href: string;
}

export function DesktopAppCard({ app, href }: DesktopAppCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);

  // Фильтруем только десктопные скриншоты
  const screenImages = app.screens
    .filter(screen => 
      screen.platform?.some(p => 
        ['web', 'desktop'].includes(p.name.toLowerCase())
      ) && screen.image?.url && screen.thumbnail === true
    )
    .slice(0, 3);

  const handleMouseLeave = () => {
    setSkipTransition(false);
  };

  const handleSlideChange = (direction: 'prev' | 'next') => {
    if (isSliding || screenImages.length <= 1) return;
    
    setIsSliding(true);
    
    const isLastToFirst = direction === 'next' && currentImageIndex === screenImages.length - 1;
    const isFirstToLast = direction === 'prev' && currentImageIndex === 0;
    
    setSkipTransition(isLastToFirst || isFirstToLast);
    
    const newIndex = direction === 'next'
      ? (currentImageIndex + 1) % screenImages.length
      : (currentImageIndex - 1 + screenImages.length) % screenImages.length;
    
    setCurrentImageIndex(newIndex);
    setTimeout(() => {
      setIsSliding(false);
      setSkipTransition(false);
    }, 300);
  };

  return (
    <Link href={href} className="block">
      <div 
        className="group relative rounded-2xl overflow-hidden bg-white border border-zinc-200 hover:border-zinc-300 transition-colors"
        onMouseLeave={handleMouseLeave}
      >
        {/* App Screenshots */}
        <div className="aspect-video relative overflow-hidden">
          {screenImages.length > 0 && !imageError ? (
            <>
              <div className="absolute inset-0">
                <div 
                  className={cn(
                    "flex h-full",
                    skipTransition ? "" : "transition-transform duration-300 ease-in-out"
                  )}
                  style={{ 
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {screenImages.map((screen, index) => (
                    <div 
                      key={screen.id || index}
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

              {/* Navigation Arrows */}
              {screenImages.length > 1 && (
                <>
                  {currentImageIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSlideChange('prev');
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 border border-zinc-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:border-zinc-300 z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 text-zinc-600" />
                    </button>
                  )}
                  {currentImageIndex < screenImages.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSlideChange('next');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 border border-zinc-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:border-zinc-300 z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </button>
                  )}
                </>
              )}

            </>
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
