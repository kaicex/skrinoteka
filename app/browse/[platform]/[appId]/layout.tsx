'use client'

import { App } from '@/lib/types'
import { AppSidebar } from './components/AppSidebar'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useApp, useDesktopApps, useMobileApps } from '@/hooks/use-apps'
import { useSearchParams } from 'next/navigation'
import { useMemo, useEffect } from 'react'
import { Container } from '@/components/ui/container'
import { useQueryClient } from '@tanstack/react-query'
import { Loading } from '@/components/ui/loading'

export default function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { platform: string; appId: string }
}) {
  const segment = useSelectedLayoutSegment() || 'flows'
  const { data: app, isLoading } = useApp(params.appId)
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  
  const hasFlows = app ? Boolean(app.flowTypes && app.flowTypes.length > 0) : false
  const selectedFlowType = searchParams.get('flowType') || 'Все'

  // Предварительная загрузка данных приложения
  useEffect(() => {
    // Предзагружаем данные приложений в зависимости от платформы
    if (params.platform === 'desktop') {
      queryClient.prefetchQuery({
        queryKey: ['apps', 'desktop'],
        queryFn: () => import('@/lib/contentful').then(mod => mod.getDesktopApps()),
      })
    } else {
      queryClient.prefetchQuery({
        queryKey: ['apps', 'mobile'],
        queryFn: () => import('@/lib/contentful').then(mod => mod.getMobileApps()),
      })
    }
  }, [queryClient, params.platform])

  if (isLoading || !app) {
    return <Loading />
  }

  const totalScreens = app.screens.length

  return (
    <Container size="xl" className="flex flex-col md:flex-row gap-8 pt-0">
      <AppSidebar
        app={app}
        currentTab={segment}
        hasFlows={hasFlows}
        totalScreens={totalScreens}
        params={params}
      />
      <main className="flex-1 py-6">
        {children}
      </main>
    </Container>
  )
}
