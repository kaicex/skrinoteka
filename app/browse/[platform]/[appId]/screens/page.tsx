'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useApp } from '@/hooks/use-apps'
import { Loading } from '@/components/ui/loading'

const ScreensView = dynamic(() => import('./components/ScreensView'), {
  loading: () => <Loading message="Загрузка экранов..." />,
  ssr: false
})

export default function ScreensPage() {
  const params = useParams()
  const { data: app, isLoading } = useApp(params.appId as string)
  const isDesktop = params.platform === 'desktop'

  if (isLoading || !app) {
    return <Loading />;
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
    <Suspense fallback={<Loading message="Загрузка экранов..." />}>
      <ScreensView screens={filteredScreens} appName={app.name} />
    </Suspense>
  )
}
