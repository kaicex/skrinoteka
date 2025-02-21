'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ScreenModal } from './ScreenModal';
import { LazyImage } from '@/components/LazyImage';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { ScreenTypeSelect } from './ScreenTypeSelect';
import { Screen } from '@/lib/types';

interface ScreensViewProps {
  screens: Screen[];
  appName: string;
  screenTypes: Array<{ name: string }>;
}

const ScreensView = ({ screens, appName, screenTypes }: ScreensViewProps) => {
  const searchParams = useSearchParams();
  // Фильтруем экраны, исключая те, которые помечены как duplicatedScreen
  const filteredScreens = screens.filter(screen => {
    if (screen.duplicatedScreen) return false;
    
    const screenTypeParam = searchParams.get('screenType');
    if (screenTypeParam && screenTypeParam !== 'all') {
      return screen.screenType?.some(st => st.name === screenTypeParam);
    }
    
    return true;
  });
  
  const [selectedScreenIndex, setSelectedScreenIndex] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const platform = params.platform as string;
  const isDesktop = platform === 'desktop';

  useEffect(() => {
    const screenParam = searchParams.get('screen');
    
    if (screenParam) {
      try {
        const index = parseInt(screenParam) - 1;
        if (index >= 0 && index < filteredScreens.length) {
          setSelectedScreenIndex(index);
        } else {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('screen');
          router.replace(`${pathname}?${params.toString()}`);
        }
      } catch {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('screen');
        router.replace(`${pathname}?${params.toString()}`);
      }
    } else {
      setSelectedScreenIndex(null);
    }
  }, [searchParams, filteredScreens.length, pathname, router]);

  const updateURL = useCallback((index: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (index !== null && index >= 0 && index < filteredScreens.length) {
      params.set('screen', (index + 1).toString());
    } else {
      params.delete('screen');
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router, filteredScreens.length]);

  const handleNext = () => {
    if (selectedScreenIndex !== null && selectedScreenIndex < filteredScreens.length - 1) {
      const newIndex = selectedScreenIndex + 1;
      setSelectedScreenIndex(newIndex);
      updateURL(newIndex);
    }
  };

  const handlePrev = () => {
    if (selectedScreenIndex !== null && selectedScreenIndex > 0) {
      const newIndex = selectedScreenIndex - 1;
      setSelectedScreenIndex(newIndex);
      updateURL(newIndex);
    }
  };

  const handleScreenClick = (index: number) => {
    if (index >= 0 && index < filteredScreens.length) {
      setSelectedScreenIndex(index);
      updateURL(index);
    }
  };

  const handleClose = () => {
    setSelectedScreenIndex(null);
    updateURL(null);
  };

  const [loadingStates, setLoadingStates] = useState<boolean[]>(new Array(filteredScreens.length).fill(true));

  const handleImageLoad = (index: number) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-2 ${isDesktop ? 'lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'} gap-4`}>
        {filteredScreens.map((screen, index) => {
          if (!screen.image?.url) return null;
          
          return (
            <div
              key={`screen-${screen.id}-${index}`}
              className={`relative ${isDesktop ? 'aspect-video' : 'aspect-[390/844]'} cursor-pointer group`}
              onClick={() => handleScreenClick(index)}
              role="listitem"
              aria-label={`${appName} screen ${index + 1}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleScreenClick(index)
                }
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors shadow-sm">
                {loadingStates[index] && (
                  <Skeleton className="absolute inset-0 z-10" />
                )}
                <LazyImage
                  src={screen.image.url}
                  alt={`${appName} screen ${index + 1}`}
                  className="w-full h-full object-cover object-top"
                  priority={index === 0}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {selectedScreenIndex !== null && (
        <ScreenModal
          isOpen={true}
          onClose={handleClose}
          screens={filteredScreens.map(s => ({ url: s.image.url, id: s.id }))}
          currentIndex={selectedScreenIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          appName={appName}
          platform={isDesktop ? 'desktop' : 'mobile'}
        />
      )}
    </div>
  );
};

ScreensView.displayName = 'ScreensView';
export default ScreensView;
