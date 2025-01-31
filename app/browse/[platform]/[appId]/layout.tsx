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

  const platformNames = useMemo(() => {
    if (!app) return []
    const allPlatforms = app.screens.flatMap(screen => screen.platform.map(p => p.name));
    const uniquePlatforms = [...new Set(allPlatforms)];
    
    // Фильтруем платформы в зависимости от текущей платформы
    if (params.platform === 'desktop') {
      return uniquePlatforms.filter(p => p.toLowerCase() === 'web');
    } else {
      return uniquePlatforms.filter(p => ['ios', 'android'].includes(p.toLowerCase()));
    }
  }, [app, params.platform])

  const totalScreens = useMemo(() => {
    if (!app) return 0
    // Фильтруем экраны в зависимости от платформы
    const filteredScreens = app.screens.filter(screen => {
      const screenPlatforms = screen.platform.map(p => p.name.toLowerCase());
      if (params.platform === 'desktop') {
        return screenPlatforms.includes('web');
      } else {
        return screenPlatforms.includes('ios') || screenPlatforms.includes('android');
      }
    });
    return filteredScreens.length;
  }, [app, params.platform])

  if (isLoading) {
    return <Loading />;
  }

  if (!app) {
    return <Loading message="Приложение не найдено" />;
  }

  return (
    <Container size="xl" className="min-h-screen">
      <div className="flex flex-col md:flex-row md:space-x-8 relative">
        <AppSidebar 
          app={app}
          currentTab={segment}
          hasFlows={hasFlows}
          totalScreens={totalScreens}
          platformNames={platformNames}
          params={params}
        />
        <main className="flex-1 py-6">
          <div className="mt-4">
            {children}
          </div>
        </main>
      </div>
    </Container>
  )
}
