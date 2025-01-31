import { useQuery } from '@tanstack/react-query';
import { App } from '@/lib/types';

export function useApps() {
  return useQuery<App[]>({
    queryKey: ['apps'],
    queryFn: () => import('@/lib/contentful').then(mod => mod.getApps()),
  });
}

export function useDesktopApps() {
  return useQuery<App[]>({
    queryKey: ['apps', 'desktop'],
    queryFn: () => import('@/lib/contentful').then(mod => mod.getDesktopApps()),
  });
}

export function useMobileApps() {
  return useQuery<App[]>({
    queryKey: ['apps', 'mobile'],
    queryFn: () => import('@/lib/contentful').then(mod => mod.getMobileApps()),
  });
}

export function useApp(appId: string | undefined) {
  return useQuery<App | null>({
    queryKey: ['app', appId],
    queryFn: () => import('@/lib/contentful').then(mod => mod.getAppById(appId)),
    enabled: !!appId,
  });
}
