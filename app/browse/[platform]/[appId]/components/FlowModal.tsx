'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, ArrowDown, ClipboardCopy, Check, Download } from "lucide-react"
import JSZip from 'jszip'
import { pluralizeScreens } from '@/lib/utils/pluralize'

interface FlowModalProps {
  isOpen: boolean
  onClose: () => void
  screens: {
    url: string
    id: string
  }[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  flowType: string
  appName: string
  platform?: string
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
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
      aria-label="Copy link"
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

function DownloadButton({ screens, appName, flowType }: { screens: { url: string }[], appName: string, flowType: string }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder(`${appName}_${flowType}`.replace(/\s+/g, '_'))
      
      // Download all images
      const downloads = await Promise.all(
        screens.map(async (screen, index) => {
          const response = await fetch(screen.url)
          const blob = await response.blob()
          return { blob, index }
        })
      )
      
      // Add to zip
      downloads.forEach(({ blob, index }) => {
        folder?.file(`screen_${index + 1}.png`, blob)
      })
      
      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = url
      link.download = `${appName}_${flowType}.zip`.replace(/\s+/g, '_')
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading flow:', error)
    }
    setDownloading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer rounded-full px-3 py-1.5 bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Download flow"
    >
      <ArrowDown className="w-4 h-4 text-zinc-800" />
      <span className="text-zinc-800 text-sm">
        {downloading ? 'Загрузка...' : 'Скачать флоу'}
      </span>
    </button>
  )
}

export function FlowModal({ 
  isOpen, 
  onClose, 
  screens, 
  currentIndex,
  onNext,
  onPrev,
  flowType,
  appName,
  platform = 'mobile'
}: FlowModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const modalId = useRef(`flow-${flowType}-${Date.now()}`)

  // Check and update arrows visibility
  const updateArrowsVisibility = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const hasMultipleScreens = screens && screens.length > 1
    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth

    // Show right arrow if there are multiple screens and not at the end
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1
    const isAtStart = scrollLeft < 1

    setShowRightArrow(hasMultipleScreens && !isAtEnd)
    setShowLeftArrow(hasMultipleScreens && !isAtStart)
  }

  // Reset and initialize arrows when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset states first
      setShowLeftArrow(false)
      setShowRightArrow(false)

      // Wait for next frame to ensure DOM is ready
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current
        if (container) {
          const hasMultipleScreens = screens && screens.length > 1
          
          // Initial state
          setShowRightArrow(hasMultipleScreens)

          // Add scroll listener
          container.addEventListener('scroll', updateArrowsVisibility)

          // Create a ResizeObserver to handle container size changes
          const resizeObserver = new ResizeObserver(() => {
            updateArrowsVisibility()
          })
          resizeObserver.observe(container)

          // Check after images load
          const images = container.getElementsByTagName('img')
          Array.from(images).forEach(img => {
            if (img.complete) {
              updateArrowsVisibility()
            } else {
              img.onload = updateArrowsVisibility
            }
          })

          // Multiple checks to ensure proper initialization
          const timeouts = [
            setTimeout(updateArrowsVisibility, 100),
            setTimeout(updateArrowsVisibility, 300),
            setTimeout(updateArrowsVisibility, 500)
          ]

          return () => {
            container.removeEventListener('scroll', updateArrowsVisibility)
            resizeObserver.disconnect()
            timeouts.forEach(clearTimeout)
          }
        }
      })
    }
  }, [isOpen, screens])

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })

    // Update arrows after scroll animation
    setTimeout(updateArrowsVisibility, 300)
  }

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleScroll('left')
      } else if (e.key === 'ArrowRight') {
        handleScroll('right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleDownloadScreen = async (screenUrl: string, index: number) => {
    try {
      const response = await fetch(screenUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${appName}_screen_${index + 1}.png`;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent 
        className="max-w-[calc(100vw-1px)] max-h-[100vh] rounded-xl  overflow-hidden p-0 bg-white"
      >
        <DialogTitle className="sr-only">
          {`${appName} ${flowType} Флоу`}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {`Просмотр флоу ${flowType} из ${appName}`}
        </DialogDescription>
        <div className="h-full flex flex-col ">
          {/* Top panel */}
          <div 
            className="h-12 shrink-0 p-4 flex justify-end items-center"
          >
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-zinc-800" />
            </button>
          </div>

          {/* Main content */}
          <div 
            className="flex-1 flex items-center justify-center relative overflow-hidden [&::-webkit-scrollbar]:hidden"
          >

            {showLeftArrow && (
              <button
                onClick={() => handleScroll('left')}
                className="absolute left-4 z-10 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                aria-label="Предыдущие экраны"
              >
                <ChevronLeft className="w-6 h-6 text-zinc-800" />
              </button>
            )}


            {/* Wrapper for all screens that may have more that one browser screen width */}
            <div 
              className="h-full overflow-x-auto flex items-center [&::-webkit-scrollbar]:hidden gap-4 pl-5 after:content-[''] after:w-1 after:flex-shrink-0"
              ref={scrollContainerRef}
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {screens?.map((screen, idx) => (


                      /* Screen */
                  <div 
                    key={`${modalId.current}-screen-${idx}`}
                    className={`flex-shrink-0 max-h-[64svh] md:max-h-[70svh] ${platform === 'desktop' ? 'aspect-video' : 'aspect-[390/844]'} rounded-2xl outline outline-1 outline-zinc-200 overflow-hidden box-border relative group bg-zinc-200`}
                  >

                    {/* Image */}
                    <div className="w-full h-full hover:overflow-y-auto [&::-webkit-scrollbar]:hidden">
                      <img 
                        src={screen.url} 
                        alt={`${appName} screen ${idx + 1}`}
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay with button */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden md:block">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadScreen(screen.url, idx);
                        }}
                        className="absolute bottom-3 right-3 flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer rounded-full px-3 py-1.5 bg-zinc-100 pointer-events-auto"
                        aria-label="Download screen"
                      >
                        <span className="text-zinc-800 text-sm">Скачать экран</span>
                      </button>

                    </div>



                    
                  </div>
                ))}
            </div>

            {showRightArrow && (
              <button
                onClick={() => handleScroll('right')}
                className="absolute right-4 z-10 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                aria-label="Следующие экраны"
              >
                <ChevronRight className="w-6 h-6 text-zinc-800" />
              </button>
            )}

          </div>

          {/* Bottom panel */}
          <div className="shrink-0 flex flex-col md:flex-row items-center justify-between p-4 gap-4 ">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-zinc-800 text-sm font-medium">{appName}</span>
                <span className="text-zinc-400 text-sm">•</span>
                <span className="text-zinc-400 text-sm">{flowType}</span>
                <span className="text-zinc-400 text-sm">•</span>
                <span className="text-zinc-400 text-sm">{pluralizeScreens(screens.length)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton url={window.location.href} />
              <DownloadButton screens={screens} appName={appName} flowType={flowType} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
