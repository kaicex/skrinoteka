import { App } from '@/lib/types';
import { AppCard } from './app-card';
import { ReactNode } from 'react';

interface AppGridProps {
  apps: App[];
  isLoading?: boolean;
  className?: string;
  children?: ReactNode;
}

export function AppGrid({ apps, isLoading = false, className = '', children }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-lg bg-zinc-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!apps.length) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No apps found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4 ${className}`}>
      {children}
    </div>
  );
}
