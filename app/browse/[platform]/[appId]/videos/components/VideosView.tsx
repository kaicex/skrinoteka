'use client';

import { useState, useRef, useEffect } from 'react';
import { LazyImage } from '@/components/LazyImage';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';
import { useParams } from 'next/navigation';
import './VideosView.css';

interface Video {
  id: string;
  title: string;
  video: {
    url: string;
  };
  isDesktop?: boolean;
}

interface VideosViewProps {
  videos: Video[];
  appName: string;
}

const VideosView = ({ videos, appName }: VideosViewProps) => {
  const [loadingStates, setLoadingStates] = useState<boolean[]>(new Array(videos.length).fill(true));
  const [playingStates, setPlayingStates] = useState<boolean[]>(new Array(videos.length).fill(false));
  const [errorStates, setErrorStates] = useState<boolean[]>(new Array(videos.length).fill(false));
  const [showControls, setShowControls] = useState<boolean[]>(new Array(videos.length).fill(false));
  const [isFullscreen, setIsFullscreen] = useState<boolean[]>(new Array(videos.length).fill(false));
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const params = useParams();
  const platform = params.platform as string;
  const isDesktop = platform === 'desktop';

  // Фильтруем видео в зависимости от платформы
  const filteredVideos = videos.filter(video => 
    isDesktop ? video.isDesktop === true : (video.isDesktop === false || video.isDesktop === undefined)
  );

  useEffect(() => {
    // Инициализируем массив refs
    videoRefs.current = videoRefs.current.slice(0, filteredVideos.length);
  }, [filteredVideos]);

  const handleImageLoad = (index: number) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const handleError = (index: number) => {
    setErrorStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const togglePlay = async (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    try {
      if (video.paused) {
        // Останавливаем все остальные видео
        videoRefs.current.forEach((v, i) => {
          if (i !== index && v && !v.paused) {
            v.pause();
            setPlayingStates(prev => {
              const newStates = [...prev];
              newStates[i] = false;
              return newStates;
            });
          }
        });

        await video.play();
        setPlayingStates(prev => {
          const newStates = [...prev];
          newStates[index] = true;
          return newStates;
        });
      } else {
        video.pause();
        setPlayingStates(prev => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }
    } catch (error) {
      console.error('Error playing video:', error);
      handleError(index);
    }
  };

  const toggleFullScreen = async (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем запуск видео
    const container = containerRefs.current[index];
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(prev => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      } else {
        await container.requestFullscreen();
        setIsFullscreen(prev => {
          const newStates = [...prev];
          newStates[index] = true;
          return newStates;
        });
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Слушаем изменения fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(prev => prev.map(() => false));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVideos.map((video, index) => (
        <div
          key={video.id}
          ref={(el) => {
            containerRefs.current[index] = el;
          }}
          className={`relative rounded-2xl overflow-hidden bg-zinc-100 group ${
            isDesktop ? 'aspect-[16/10]' : 'aspect-[390/844]'
          } ${isFullscreen[index] ? 'fullscreen-container' : ''}`}
          onMouseEnter={() => {
            setShowControls(prev => {
              const newStates = [...prev];
              newStates[index] = true;
              return newStates;
            });
          }}
          onMouseLeave={() => {
            setShowControls(prev => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          }}
        >
          {!errorStates[index] && showControls[index] && (
            <>
              <button
                onClick={() => togglePlay(index)}
                className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 group-hover:bg-black/40 transition-colors"
              >
                {playingStates[index] ? (
                  <Pause className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Play className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
              <button
                onClick={(e) => toggleFullScreen(index, e)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/60 transition-colors"
              >
                {isFullscreen[index] ? (
                  <Minimize className="w-5 h-5 text-white" />
                ) : (
                  <Maximize className="w-5 h-5 text-white" />
                )}
              </button>
            </>
          )}

          {video.video?.url && !errorStates[index] ? (
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={video.video.url}
              className={`w-full h-full ${isFullscreen[index] ? 'object-contain' : 'object-cover'}`}
              title={video.title || `${appName} - Видео ${index + 1}`}
              onLoadedData={() => handleImageLoad(index)}
              onError={() => handleError(index)}
              preload="metadata"
              controls={false}
              loop
              playsInline
              muted={!playingStates[index]}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100">
              <p className="text-zinc-400">
                {errorStates[index] ? 'Ошибка загрузки видео' : 'Видео недоступно'}
              </p>
            </div>
          )}

          {loadingStates[index] && !errorStates[index] && (
            <Skeleton className="absolute inset-0 bg-zinc-100" />
          )}

          {/* Заголовок видео */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-medium">
              {video.title || `${appName} - Видео ${index + 1}`}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

VideosView.displayName = 'VideosView';
export default VideosView;
