'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useSearchParams } from 'next/navigation'
import { useApp } from '@/hooks/use-apps'
import { Screen } from '@/lib/types'
import { Loading } from '@/components/ui/loading'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

const FlowsView = dynamic(() => import('./components/FlowsView'), {
  loading: () => <Loading message="Загрузка флоу..." />,
  ssr: false
})

const DesktopFlowsView = dynamic(() => import('./components/DesktopFlowsView'), {
  loading: () => <Loading message="Загрузка флоу..." />,
  ssr: false
})

export default function FlowsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { data: app, isLoading } = useApp(params.appId as string)
  const isDesktop = params.platform === 'desktop'
  
  const selectedFlowType = searchParams.get('flowType') || 'Все флоу'

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

  if (isDesktop) {
    return (
      <>
        <Suspense fallback={<Loading message="Загрузка флоу..." />}>
          <DesktopFlowsView
            screens={filteredScreens}
            flowTypes={app.flowTypes || []}
            appName={app.name}
            isDesktop={true}
            selectedFlowType={selectedFlowType}
          />
        </Suspense>
        <ScrollToTop />
      </>
    )
  }

  return (
    <>
      <Suspense fallback={<Loading message="Загрузка флоу..." />}>
        <FlowsView
          screens={filteredScreens}
          flowTypes={app.flowTypes || []}
          appName={app.name}
          isDesktop={false}
          selectedFlowType={selectedFlowType}
        />
      </Suspense>
      <ScrollToTop />
    </>
  )
}
