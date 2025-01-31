'use client';

import { Container } from '@/components/ui/container';
import { notFound } from 'next/navigation';
import { useApp } from '@/hooks/use-apps';
import { AppPageProps } from './types';
import { App } from '@/lib/types';
import { Suspense, useMemo, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { AppSidebar } from './components/AppSidebar';
import { TabContent } from './components/TabContent';

export default function AppPage({ params, searchParams }: AppPageProps) {
  const { data: app, isLoading, error } = useApp(params.appId);
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();

  const hasFlows = app ? Boolean(app.flowTypes && app.flowTypes.length > 0) : false;
  
  const selectedFlowType = useMemo(() => {
    if (searchParams.flowType && app?.flowTypes?.some(ft => ft.name === searchParams.flowType)) {
      return searchParams.flowType;
    }
    return 'Все флоу';
  }, [searchParams.flowType, app?.flowTypes]);

  const currentTab = useMemo(() => {
    if (!hasFlows) return 'screens';
    return searchParams.tab || 'flows';
  }, [hasFlows, searchParams.tab]);

  const handleTabChange = useCallback((tab: string) => {
    const newSearchParams = new URLSearchParams(searchParamsObj.toString());
    newSearchParams.set('tab', tab);
    
    if (tab === 'screens') {
      newSearchParams.delete('flowType');
    }
    
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }, [searchParamsObj, pathname, router]);

  useEffect(() => {
    if (hasFlows && !searchParams.tab) {
      handleTabChange('flows');
    }
  }, []);

  const filteredScreens = useMemo(() => {
    if (!app) return [];
    
    if (currentTab === 'flows' && selectedFlowType !== 'Все флоу') {
      return app.screens.filter(screen => screen.flowType?.name === selectedFlowType);
    }
    return app.screens;
  }, [app, currentTab, selectedFlowType]);

  const allowedPlatforms = params.platform === 'mobile' 
    ? ['ios', 'android']
    : ['web', 'desktop'];

  // Отдельный список для статистики (все экраны)
  const allScreensWithPlatform = useMemo(() => {
    if (!app) return [];
    return app.screens.filter(screen => 
      screen.platform?.some(p => allowedPlatforms.includes(p.name.toLowerCase()))
    );
  }, [app, allowedPlatforms]);

  // Список для отображения (фильтруется по флоу)
  const filteredScreensWithPlatform = useMemo(() => {
    let screens = filteredScreens;
    return screens
      .filter(screen => screen.platform?.some(p => 
        allowedPlatforms.includes(p.name.toLowerCase())
      ))
      .map((screen, index) => ({
        ...screen,
        name: screen.title || 'Untitled Screen',
        platform: screen.platform || [],
        createdAt: screen.createdAt || new Date().toISOString(),
        order: screen.order ?? index + 1,
      }));
  }, [filteredScreens, allowedPlatforms]);

  // Получаем список уникальных платформ
  const platformNames = useMemo(() => {
    return Array.from(new Set(
      allScreensWithPlatform.flatMap(screen => 
        screen.platform
          .filter(p => allowedPlatforms.includes(p.name.toLowerCase()))
          .map(p => p.name)
      )
    ));
  }, [allScreensWithPlatform, allowedPlatforms]);

  if (isLoading) {
    return (
      <Container size="xl">
        <div className="flex flex-col md:flex-row gap-6 pt-8">
          <div className="w-56 flex-shrink-0">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-zinc-200 rounded-lg mb-4" />
              <div className="h-6 w-32 bg-zinc-200 rounded mb-2" />
              <div className="h-4 w-24 bg-zinc-200 rounded mb-8" />
              <div className="space-y-4">
                <div className="h-8 w-full bg-zinc-200 rounded" />
                <div className="h-8 w-full bg-zinc-200 rounded" />
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] bg-zinc-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error || !app) {
    notFound();
  }

  if (filteredScreensWithPlatform.length === 0) {
    notFound();
  }

  const appWithFilteredData: App = {
    ...app,
    screens: filteredScreensWithPlatform,
    category: app.category || 'Unknown',
  };

  return (
    <Container size="xl">
      <div className="flex flex-col md:flex-row gap-6 pt-8 min-h-[calc(100vh-64px)]">
        <AppSidebar 
          app={app}
          currentTab={currentTab}
          hasFlows={hasFlows}
          selectedFlowType={selectedFlowType}
          totalScreens={allScreensWithPlatform.length}
          platformNames={platformNames}
          onTabChange={handleTabChange}
          params={params}
        />
        
        <div className="flex-1">
          <TabContent
            currentTab={currentTab}
            app={appWithFilteredData}
            selectedFlowType={selectedFlowType}
          />
        </div>
      </div>
    </Container>
  );
}
