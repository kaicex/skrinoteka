'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AppCardProps {
  app: {
    id: string;
    name: string;
    category: string;
    description?: string;
    screens: Array<{
      id: string;
      title?: string;
      platform?: Array<{ name: string }>;
      flowType?: { name: string };
      image?: {
        url: string;
      };
      thumbnail?: boolean;
    }>;
    logo?: {
      url: string;
    };
  };
  href: string;
}

export function AppCard({ app, href, selectedFlowType }: AppCardProps & { selectedFlowType?: string }) {
  const linkHref = selectedFlowType && selectedFlowType !== "Все" 
    ? `${href}/flows?flowType=${encodeURIComponent(selectedFlowType)}`
    : `${href}/flows`;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);

  // Проверяем наличие screens и фильтруем по мобильным платформам
  const screenImages = useMemo(() => {
    if (!app.screens || !Array.isArray(app.screens)) return [];
    
    return app.screens
      .filter((screen): screen is (typeof app.screens[0] & { image: { url: string } }) => {
        // Проверяем наличие url и thumbnail
        if (!screen?.image?.url) return false;
        
        // Проверяем платформу и thumbnail
        return (screen.platform?.some(p => 
          ['ios', 'android'].includes(p.name.toLowerCase())
        ) ?? false) && screen.thumbnail === true;
      })
      .slice(0, 3);
  }, [app.screens]);

  const handleMouseLeave = () => {
    setSkipTransition(false);
  };

  const handleImageError = () => {
    setImageError(true);
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
    <Link
      href={linkHref}
      className="block"
    >
      <div 
        className="group relative rounded-2xl overflow-hidden bg-white border border-zinc-200 hover:border-zinc-300 transition-colors shadow-sm"
        onMouseLeave={handleMouseLeave}
      >
        {/* App Screenshots */}
        <div className="aspect-[390/844] relative overflow-hidden">
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
                      {screen.image.url && (
                        <Image
                          src={screen.image.url}
                          alt={screen.title || app.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={cn(
                            "object-cover object-top transition-opacity duration-300",
                            isImageLoading && index === currentImageIndex ? "opacity-0" : "opacity-100"
                          )}
                          priority={index === 0}
                          onLoad={() => {
                            if (index === currentImageIndex) {
                              setIsImageLoading(false);
                            }
                          }}
                          onError={handleImageError}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows */}
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
        <div className="p-2">
          <div className="flex items-center gap-2">
            {app.logo?.url && typeof app.logo.url === 'string' && (
              <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-zinc-100">
                <Image
                  src={app.logo.url}
                  alt={`${app.name} logo`}
                  fill
                  sizes="40px"
                  className={cn(
                    "object-contain",
                    isLogoLoading ? "opacity-0" : "opacity-100"
                  )}
                  priority={true}
                  onLoad={() => setIsLogoLoading(false)}
                  onError={handleImageError}
                />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h3 className="font-medium text-base text-zinc-900 truncate">{app.name}</h3>
              <p className="text-xs text-zinc-500 truncate">{app.category}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
