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

  // Фильтруем экраны в зависимости от isDesktop
  const filteredScreens = app.screens.filter(screen => {
    if (isDesktop) {
      return screen.isDesktop === true;
    } else {
      return screen.isDesktop === false || screen.isDesktop === undefined;
    }
  });

  return (
    <Suspense fallback={<Loading message="Загрузка экранов..." />}>
      <ScreensView 
        screens={filteredScreens} 
        appName={app.name} 
        screenTypes={app.screenTypes || []}
      />
    </Suspense>
  )
}
