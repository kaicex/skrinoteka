'use client';

import { redirect } from 'next/navigation';
import { useDesktopApps, useMobileApps } from '@/hooks/use-apps';
import { useEffect } from 'react';

export default function Page({
  params
}: {
  params: { platform: string; appId: string }
}) {
  const { data: desktopApps = [] } = useDesktopApps();
  const { data: mobileApps = [] } = useMobileApps();
  const baseUrl = `/browse/${params.platform}/${params.appId}`;

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

  return null; // Компонент всегда будет перенаправлять
}
