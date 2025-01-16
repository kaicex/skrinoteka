'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, ArrowDown, ClipboardCopy, Check, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { pluralizeScreens } from '@/lib/utils/pluralize'

interface Screen {
  url: string;
  id: string;
}

interface ScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  screens: Screen[];
  currentIndex: number;
  appName: string;
  screenType?: string;
  onNext?: () => void;
  onPrev?: () => void;
  platform?: string;
}

export function ScreenModal({
  isOpen,
  onClose,
  screens,
  currentIndex,
  appName,
  screenType = 'Screen',
  onNext,
  onPrev,
  platform = 'mobile'
}: ScreenModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Предзагрузка следующего и предыдущего изображения
    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    if (currentIndex < screens.length - 1) {
      preloadImage(screens[currentIndex + 1].url);
    }
    if (currentIndex > 0) {
      preloadImage(screens[currentIndex - 1].url);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight' && onNext && currentIndex < screens.length - 1) {
        onNext();
      } else if (event.key === 'ArrowLeft' && onPrev && currentIndex > 0) {
        onPrev();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, currentIndex, screens]);

  const currentScreen = screens[currentIndex];
  const isFirstScreen = currentIndex === 0;
  const isLastScreen = currentIndex === screens.length - 1;
  const totalScreens = screens.length;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()} >
      <DialogContent className="max-w-full p-0 rounded-xl border border-zinc-200 overflow-hidden bg-white">
        <DialogTitle className="sr-only">
          {`${appName} ${screenType} Просмотр`}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {`Просмотр ${screenType.toLowerCase()} из ${appName}`}
        </DialogDescription>
        <div className="h-[96svh] flex flex-col">
          {/* Top panel */}
          <div className="h-12 shrink-0 p-4 flex justify-end items-center">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              aria-label="Закрыть окно"
            >
              <X className="w-5 h-5 text-zinc-800" />
            </button>
          </div>

          {/* Main content */}
          <div className={`${platform === 'desktop' ? 'py-56 md:py-12' : 'py-4'} flex-1 min-h-0 flex items-center justify-center relative`}>
            {onPrev && !isFirstScreen && (
              <button
                onClick={onPrev}
                className="absolute left-4 z-10 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                aria-label="Предыдущий экран"
              >
                <ChevronLeft className="w-6 h-6 text-zinc-800" />
              </button>
            )}

            <div className={`h-full flex items-center ${platform === 'desktop' ? 'aspect-video' : 'aspect-[390/844]'}`}>
              <div className="w-full h-full rounded-2xl border border-zinc-200 overflow-hidden relative">
                {/* Image with custom scroll */}
                <div className="w-full h-full relative">
                  <div 
                    className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden scroll-container"
                    onScroll={(e) => {
                      const container = e.currentTarget;
                      const scrollPercentage = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;
                      const thumbElement = container.parentElement?.querySelector('.custom-scrollbar-thumb') as HTMLElement;
                      if (thumbElement) {
                        thumbElement.style.top = `${scrollPercentage}%`;
                      }
                    }}
                    ref={(el) => {
                      if (el) {
                        const hasScroll = el.scrollHeight > el.clientHeight;
                        const thumbElement = el.parentElement?.querySelector('.custom-scrollbar-thumb') as HTMLElement;
                        const trackElement = el.parentElement?.querySelector('.custom-scrollbar-track') as HTMLElement;
                        
                        if (thumbElement && trackElement) {
                          // Показываем скролл только если он нужен
                          trackElement.style.display = hasScroll ? 'block' : 'none';
                          
                          // Вычисляем размер ползунка пропорционально контенту
                          const thumbHeight = (el.clientHeight / el.scrollHeight) * 100;
                          thumbElement.style.height = `${thumbHeight}%`;
                        }
                      }
                    }}
                  >
                    <img
                      src={currentScreen.url}
                      alt={`${appName} ${screenType.toLowerCase()}`}
                      className="w-full h-auto object-cover"
                      crossOrigin="anonymous"
                      onLoad={(e) => {
                        // Обновляем размер скролла после загрузки изображения
                        const container = (e.target as HTMLElement).parentElement;
                        if (container) {
                          const hasScroll = container.scrollHeight > container.clientHeight;
                          const thumbElement = container.parentElement?.querySelector('.custom-scrollbar-thumb') as HTMLElement;
                          const trackElement = container.parentElement?.querySelector('.custom-scrollbar-track') as HTMLElement;
                          
                          if (thumbElement && trackElement) {
                            trackElement.style.display = hasScroll ? 'block' : 'none';
                            const thumbHeight = (container.clientHeight / container.scrollHeight) * 100;
                            thumbElement.style.height = `${thumbHeight}%`;
                          }
                        }
                      }}
                    />
                  </div>
                  
                  {/* Custom scrollbar */}
                  <div className="custom-scrollbar-track absolute top-0 right-0 w-[6px] h-full bg-transparent rounded-full hidden">
                    <div 
                      className="custom-scrollbar-thumb absolute w-full bg-black/60 rounded-full opacity-100"
                      style={{
                        top: '0%',
                        transition: 'top 0.05s'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {onNext && !isLastScreen && (
              <button
                onClick={onNext}
                className="absolute right-4 z-10 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                aria-label="Следующий экран"
              >
                <ChevronRight className="w-6 h-6 text-zinc-800" />
              </button>
            )}
          </div>

          {/* Bottom panel */}
          <div className="shrink-0 flex flex-col md:flex-row items-center justify-between p-4 gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-zinc-800 text-sm font-medium">{appName}</span>
                <span className="text-zinc-400 text-sm">•</span>
                <span className="text-zinc-400 text-sm">{pluralizeScreens(totalScreens)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton />
              <CopyImageButton screenUrl={currentScreen.url} />
              <DownloadButton url={currentScreen.url} appName={appName} type={screenType} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CopyButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer rounded-full px-3 py-1.5 bg-zinc-100"
      aria-label="Поделиться ссылкой"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-zinc-800" />
          <span className="text-zinc-800 text-sm">Скопировано в буфер</span>
        </>
      ) : (
        <>
          <ClipboardCopy className="w-4 h-4 text-zinc-800" />
          <span className="text-zinc-800 text-sm">Поделиться ссылкой</span>
        </>
      )}
    </button>
  )
}

function CopyImageButton({ screenUrl }: { screenUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyImageToClipboard = async () => {
    try {
      console.log('Starting copy process for:', screenUrl);
      
      // Используем уже загруженное изображение из DOM
      const img = document.querySelector(`.h-full.flex.items-center img[src="${screenUrl}"]`) as HTMLImageElement;
      if (!img) {
        throw new Error('Image not found in DOM');
      }

      // Создаем ImageBitmap из существующего изображения
      const imageBitmap = await createImageBitmap(img);
      
      // Создаем canvas нужного размера
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      
      // Получаем контекст и рисуем изображение
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      ctx.drawImage(imageBitmap, 0, 0);
      console.log('Image drawn to canvas');
      
      // Получаем blob из canvas
      const blob = await new Promise<Blob>((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('Blob created:', blob.type, blob.size);
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png');
        } catch (e) {
          reject(e);
        }
      });

      console.log('Attempting to write to clipboard');
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      console.log('Successfully copied to clipboard');
      setError(null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image:', err);
      setError(err instanceof Error ? err.message : 'Failed to copy image');
      setCopied(false);
    }
  };

  return (
    <button
      onClick={copyImageToClipboard}
      className="hidden md:flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer rounded-full px-3 py-1.5 bg-zinc-100"
      aria-label="Скопировать изображение"
    >
      {error ? (
        <>
          <span className="text-red-500 text-sm">Ошибка копирования</span>
        </>
      ) : copied ? (
        <>
          <Check className="w-4 h-4 text-zinc-800" />
          <span className="text-zinc-800 text-sm">Изображение скопировано</span>
        </>
      ) : (
        <>
          <ClipboardCopy className="w-4 h-4 text-zinc-800" />
          <span className="text-zinc-800 text-sm">Скопировать изображение</span>
        </>
      )}
    </button>
  );
}

function DownloadButton({ url, appName, type = 'Screen' }: { url: string, appName: string, type?: string }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${appName}_${type}.png`.replace(/\s+/g, '_')
      link.click()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
    setDownloading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer rounded-full px-3 py-1.5 bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Скачать ${type.toLowerCase()}`}
    >
      <ArrowDown className="w-4 h-4 text-zinc-800" />
      <span className="text-zinc-800 text-sm">
        {downloading ? 'Загрузка...' : 'Скачать экран'}
      </span>
    </button>
  )
}
