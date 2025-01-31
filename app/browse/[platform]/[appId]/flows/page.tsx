'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useSearchParams } from 'next/navigation'
import { useApp } from '@/hooks/use-apps'
import { Screen } from '@/lib/types'

const FlowsView = dynamic(() => import('./components/FlowsView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Loading flows...</div>
    </div>
  ),
  ssr: false
})

const DesktopFlowsView = dynamic(() => import('./components/DesktopFlowsView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Loading flows...</div>
    </div>
  ),
  ssr: false
})

export default function FlowsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { data: app, isLoading } = useApp(params.appId as string)
  const isDesktop = params.platform === 'desktop'
  
  const selectedFlowType = searchParams.get('flowType') || 'Все флоу'

  if (isLoading || !app) {
    return <div>Loading...</div>
  }

  // Фильтруем экраны в зависимости от платформы
  const filteredScreens = app.screens.filter(screen => {
    const screenPlatforms = screen.platform.map(p => p.name.toLowerCase());
    if (isDesktop) {
      return screenPlatforms.includes('web');
    } else {
      return screenPlatforms.includes('ios') || screenPlatforms.includes('android');
    }
  });

  if (isDesktop) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <DesktopFlowsView
          screens={filteredScreens}
          flowTypes={app.flowTypes || []}
          appName={app.name}
          isDesktop={true}
          selectedFlowType={selectedFlowType}
        />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlowsView
        screens={filteredScreens}
        flowTypes={app.flowTypes || []}
        appName={app.name}
        isDesktop={false}
        selectedFlowType={selectedFlowType}
      />
    </Suspense>
  )
}
