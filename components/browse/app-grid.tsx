import { App } from '@/lib/types';
import { AppCard } from './app-card';
import { Search } from 'lucide-react';
import { ReactNode } from 'react';

interface AppGridProps {
  apps: App[];
  children?: ReactNode;
  isLoading?: boolean;
}

export function AppGrid({ apps, children, isLoading = false }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-3 border-4 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
        <p className="text-zinc-400">Загрузка приложений...</p>
      </div>
    );
  }

  if (!apps.length) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">По вашему запросу ничего не нашлось</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
      {children}
    </div>
  );
}
