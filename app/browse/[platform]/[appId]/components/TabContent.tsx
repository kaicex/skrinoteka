'use client'

import { useTabsCache } from '../hooks/useTabsCache'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'

const ScreensView = dynamic(() => import('./ScreensView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Загрузка экранов...</div>
    </div>
  ),
  ssr: false
})

const FlowsView = dynamic(() => import('./FlowsView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Загрузка флоу...</div>
    </div>
  ),
  ssr: false
})

const DesktopFlowsView = dynamic(() => import('./DesktopFlowsView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Загрузка флоу...</div>
    </div>
  ),
  ssr: false
})

interface TabData {
  screens: Array<any>;
  flowTypes?: Array<{ name: string }>;
  appName: string;
}

interface DesktopFlowsViewProps {
  screens: TabData['screens'];
  flowTypes: Array<{ name: string }>;
  appName: string;
  isDesktop: boolean;
  selectedFlowType?: string;
}

interface TabContentProps {
  currentTab: string;
  initialScreens: any[];
  initialFlowTypes: Array<{ name: string }>;
  initialFlowScreens: any[];
  appName: string;
  selectedFlowType?: string;
}

export function TabContent({
  currentTab,
  initialScreens,
  initialFlowTypes,
  initialFlowScreens,
  appName,
  selectedFlowType
}: TabContentProps) {
  const params = useParams();
  const platform = params.platform as string;

  // Используем useMemo для подготовки данных активного таба
  const activeTabData = useMemo(() => {
    const allowedPlatforms = platform === 'mobile' 
      ? ['ios', 'android']
      : ['web', 'desktop'];

    // Фильтруем скрины по платформе
    const filterScreensByPlatform = (screens: any[]) => 
      screens.filter(screen =>
        screen.platform?.some((p: any) => 
          allowedPlatforms.includes(p.name.toLowerCase())
        )
      );

    if (currentTab === 'screens') {
      return {
        screens: filterScreensByPlatform(initialScreens),
        appName
      }
    } else {
      return {
        flowTypes: initialFlowTypes,
        screens: filterScreensByPlatform(initialFlowScreens),
        appName
      }
    }
  }, [currentTab, initialScreens, initialFlowTypes, initialFlowScreens, appName, platform])

  // Предзагрузка следующей порции данных
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentTab === 'screens' && initialScreens.length > 20) {
        // Подготавливаем следующие экраны
        const nextScreens = initialScreens.slice(20)
        nextScreens.slice(0, 4).forEach(screen => {
          if (screen?.url && typeof screen.url === 'string') {
            const img = new Image()
            img.src = screen.url
          }
        })
      } else if (initialFlowScreens.length > 20) {
        // Подготавливаем следующие flow экраны
        const nextFlowScreens = initialFlowScreens.slice(20)
        nextFlowScreens.slice(0, 4).forEach(screen => {
          if (screen?.url && typeof screen.url === 'string') {
            const img = new Image()
            img.src = screen.url
          }
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentTab, initialScreens, initialFlowScreens])

  if (currentTab === 'screens') {
    return (
      <ScreensView {...activeTabData} />
    )
  }

  // Используем DesktopFlowsView только для desktop приложений
  if (platform === 'desktop') {
    return (
      <DesktopFlowsView 
        {...activeTabData} 
        flowTypes={activeTabData.flowTypes || []} 
        isDesktop={true}
        selectedFlowType={selectedFlowType}
      />
    )
  }

  return (
    <FlowsView 
      {...activeTabData} 
      flowTypes={activeTabData.flowTypes || []} 
      isDesktop={platform === 'desktop'}
      selectedFlowType={selectedFlowType}
    />
  )
}
