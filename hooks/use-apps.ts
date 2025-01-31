import { getApps, getAppById } from '@/lib/contentful';
import { useQuery } from '@tanstack/react-query';

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: getApps,
  });
}

export function useApp(id: string) {
  return useQuery({
    queryKey: ['app', id],
    queryFn: () => getAppById(id),
    enabled: !!id,
  });
}
