'use client'

import { useState, useCallback, useMemo } from "react"
import { FlowModal } from "./FlowModal"
import { ChevronRight } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface Screen {
  id: string
  name: string
  image: {
    url: string
  }
  platform: { name: string }[]
  flowType?: {
    name: string
  }
}

interface DesktopFlowsViewProps {
  screens: Screen[]
  flowTypes: { name: string }[]
  appName: string
  isDesktop?: boolean
}

const LazyImage = ({ src, alt, className, priority = false }: { 
  src: string
  alt: string
  className: string
  priority?: boolean 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        sizes="(max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  );
};

const DesktopFlowsView = ({ 
  screens, 
  flowTypes, 
  appName,
  isDesktop = true 
}: DesktopFlowsViewProps) => {
  const [selectedFlow, setSelectedFlow] = useState<{
    screens: { url: string; id: string }[]
    type: string
  } | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const updateURL = useCallback((flowType: string | null, index: number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (flowType !== null && index !== null) {
      params.set('tab', 'flows')
      params.set('flowType', flowType)
      params.set('flow', (index + 1).toString())
    } else {
      params.delete('flow')
      params.delete('flowType')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  const handleNext = useCallback(() => {
    if (selectedFlow && currentIndex < selectedFlow.screens.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      updateURL(selectedFlow.type, newIndex)
    }
  }, [selectedFlow, currentIndex, updateURL])

  const handlePrev = useCallback(() => {
    if (selectedFlow && currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      updateURL(selectedFlow.type, newIndex)
    }
  }, [selectedFlow, currentIndex, updateURL])

  const handleCloseModal = useCallback(() => {
    setSelectedFlow(null)
    setCurrentIndex(0)
    updateURL(null, null)
  }, [updateURL])

  const handleFlowClick = useCallback((flowType: string, flowScreens: Screen[], index: number = 0) => {
    setSelectedFlow({
      screens: flowScreens.map(s => ({ 
        url: s.image.url, 
        id: s.id 
      })),
      type: flowType
    })
    setCurrentIndex(index)
    updateURL(flowType, index)
  }, [updateURL])

  const groupedScreens = useMemo(() => {
    return flowTypes.map(flowType => ({
      type: flowType.name,
      screens: screens.filter(screen => 
        screen.flowType?.name === flowType.name &&
        screen.image?.url &&
        screen.image.url.trim() !== ''
      )
    }))
  }, [flowTypes, screens])

  if (!flowTypes || flowTypes.length === 0 || !screens || screens.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-500">No flows available</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-4xl font-semibold text-zinc-900">Flows</h2>
      <div className="space-y-12">
        {groupedScreens.map((group) => {
          if (group.screens.length === 0) return null

          return (
            <div key={`flow-${group.type}`}>
              <div
                className="mb-4 flex items-center justify-between cursor-pointer"
                onClick={() => handleFlowClick(group.type, group.screens, 0)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFlowClick(group.type, group.screens, 0)
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center group">
                    <h3 className="text-xl font-semibold text-zinc-900">{group.type}</h3>
                    <ChevronRight className="w-5 h-5 text-zinc-400 ml-1 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                  </div>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-500">{group.screens.length} screens</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {group.screens.map((screen, index) => (
                  <div
                    key={`${group.type}-${screen.id}-${index}`}
                    className="relative aspect-[16/9] cursor-pointer group"
                    onClick={() => handleFlowClick(group.type, group.screens, index)}
                    role="listitem"
                    aria-label={`${appName} ${group.type} screen ${index + 1}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleFlowClick(group.type, group.screens, index)
                      }
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors shadow-sm">
                      <LazyImage
                        src={screen.image.url}
                        alt={`${appName} ${group.type} screen ${index + 1}`}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {selectedFlow && (
          <FlowModal
            isOpen={true}
            onClose={handleCloseModal}
            screens={selectedFlow.screens}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            flowType={selectedFlow.type}
            appName={appName}
            platform={isDesktop ? 'desktop' : 'mobile'}
          />
        )}
      </div>
    </div>
  )
}

DesktopFlowsView.displayName = 'DesktopFlowsView'
export default DesktopFlowsView
