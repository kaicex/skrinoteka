'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useApp } from '@/hooks/use-apps'

const ScreensView = dynamic(() => import('./components/ScreensView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Loading screens...</div>
    </div>
  ),
  ssr: false
})

export default function ScreensPage() {
  const params = useParams()
  const { data: app, isLoading } = useApp(params.appId as string)
  const isDesktop = params.platform === 'desktop'

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScreensView screens={filteredScreens} appName={app.name} />
    </Suspense>
  )
}
