'use client';

import { redirect } from 'next/navigation';
import { useDesktopApps, useMobileApps } from '@/hooks/use-apps';
import { useEffect, Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

export default function Page({
  params
}: {
  params: { platform: string; appId: string }
}) {
  const { data: desktopApps = [], isLoading: isDesktopLoading } = useDesktopApps();
  const { data: mobileApps = [], isLoading: isMobileLoading } = useMobileApps();
  const baseUrl = `/browse/${params.platform}/${params.appId}`;
  const isLoading = isDesktopLoading || isMobileLoading;
  const app = params.platform === 'desktop'
    ? desktopApps.find(app => app.id === params.appId)
    : mobileApps.find(app => app.id === params.appId);

  useEffect(() => {
    // Проверяем существование приложения для соответствующей платформы
    const appExists = params.platform === 'desktop'
      ? desktopApps.some(app => app.id === params.appId)
      : mobileApps.some(app => app.id === params.appId);

    if (!appExists) {
      // Если приложение не существует для данной платформы, перенаправляем на список приложений
      redirect(`/browse/${params.platform}`);
    } else {
      // Если приложение существует, перенаправляем на flows
      redirect(`${baseUrl}/flows`);
    }
  }, [params.platform, params.appId, desktopApps, mobileApps, baseUrl]);

  if (isLoading || !app) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {null} // Компонент всегда будет перенаправлять
    </Suspense>
  );
}
