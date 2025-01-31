'use client'

import { lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { App } from '@/lib/types'
import { useEffect, useState } from 'react';

const ScreensView = dynamic(() => import('./ScreensView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Loading screens...</div>
    </div>
  ),
  ssr: false
})

const FlowsView = dynamic(() => import('./FlowsView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Loading flows...</div>
    </div>
  ),
  ssr: false
})

const DesktopFlowsView = dynamic(() => import('./DesktopFlowsView'), {
  loading: () => (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-zinc-400 text-lg">Loading flows...</div>
    </div>
  ),
  ssr: false
})

interface TabContentProps {
  currentTab: string;
  app: App;
  selectedFlowType: string;
}

export function TabContent({
  currentTab,
  app,
  selectedFlowType
}: TabContentProps) {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const isDesktop = params.platform === 'desktop';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Автоматически переключаемся на таб flows если есть flowType в URL
  useEffect(() => {
    if (!mounted) return;

    const searchParams = new URLSearchParams(window.location.search);
    const flowType = searchParams.get('flowType');
    if (flowType && currentTab !== 'flows') {
      router.replace(`/browse/${params.platform}/${params.appId}?tab=flows&flowType=${flowType}`);
    }
  }, [mounted, currentTab, params.platform, params.appId]);

  if (currentTab === 'flows' && isDesktop) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <DesktopFlowsView
          screens={app.screens}
          flowTypes={app.flowTypes || []}
          appName={app.name}
          isDesktop={true}
          selectedFlowType={selectedFlowType}
        />
      </Suspense>
    )
  }

  if (currentTab === 'flows') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <FlowsView
          screens={app.screens}
          flowTypes={app.flowTypes || []}
          appName={app.name}
          isDesktop={false}
          selectedFlowType={selectedFlowType}
        />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScreensView screens={app.screens} appName={app.name} />
    </Suspense>
  )
}
