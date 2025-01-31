'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { App } from '@/lib/types'
import { cn } from '@/lib/utils'
import { FlowTypeSelect } from '../flows/components/FlowTypeSelect'
import { pluralizeScreens } from '@/lib/utils/pluralize'

interface AppSidebarProps {
  app: App
  currentTab: string
  hasFlows: boolean
  totalScreens: number
  platformNames: string[]
  params: {
    platform: string
    appId: string
  }
}

export function AppSidebar({
  app,
  currentTab,
  hasFlows,
  totalScreens,
  platformNames,
  params
}: AppSidebarProps) {
  const baseUrl = `/browse/${params.platform}/${params.appId}`
  
  // Фильтруем экраны в зависимости от платформы
  const filteredScreens = app.screens.filter(screen => {
    const screenPlatforms = screen.platform.map(p => p.name.toLowerCase());
    if (params.platform === 'desktop') {
      return screenPlatforms.includes('web');
    } else {
      return screenPlatforms.includes('ios') || screenPlatforms.includes('android');
    }
  });

  const platformScreensCount = filteredScreens.length;
  
  return (
    <aside className="w-full md:w-72 md:mt-8 flex-shrink-0 sticky top-8">
      <div>
        <div className="mb-8">
          <Link
            href={`/browse/${params.platform}`}
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к приложениям
          </Link>

          <div className="mb-4">
            <div className="hidden md:flex md:flex-col gap-4">
              {app.logo && (
                <div className="w-full aspect-square rounded-lg border border-zinc-200 overflow-hidden relative">
                  <Image
                    src={app.logo.url}
                    alt={app.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold">{app.name}</h1>
                <div className="text-sm text-zinc-500">
                  {app.category}
                </div>
              </div>
            </div>

            {/* Мобильная версия */}
            <div className="flex md:hidden items-center gap-4">
              {app.logo && (
                <div className="w-12 aspect-square rounded-lg border border-zinc-200 overflow-hidden relative flex-shrink-0">
                  <Image
                    src={app.logo.url}
                    alt={app.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold">{app.name}</h1>
                <div className="text-sm text-zinc-500">
                  {app.category}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {hasFlows && (
            <div className="space-y-4 mb-8">
              <nav className="flex gap-2 bg-gray-200 p-1 rounded-lg">
                <Link
                  href={`${baseUrl}/flows`}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm text-center rounded-md transition-colors",
                    currentTab === 'flows'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Флоу
                </Link>
                <Link
                  href={`${baseUrl}/screens`}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm text-center rounded-md transition-colors",
                    currentTab === 'screens'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Экраны
                </Link>
              </nav>

              {currentTab === 'flows' && (
                <div className="border-t border-zinc-200 pt-4">
                  <FlowTypeSelect 
                    flowTypes={app.flowTypes || []} 
                    screens={app.screens} 
                  />
                </div>
              )}
            </div>
          )}

          {app.description && (
            <p className="text-sm text-zinc-500 mb-8">{app.description}</p>
          )}

          {/* Статистика */}
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-zinc-500">Всего экранов</div>
              <div className="font-medium">
                {pluralizeScreens(platformScreensCount)}
              </div>
            </div>

            {hasFlows && (
              <div>
                <div className="text-zinc-500">Всего флоу</div>
                <div className="font-medium">
                  {app.flowTypes?.length || 0}
                </div>
              </div>
            )}

            <div>
              <div className="text-zinc-500">Платформы</div>
              <div className="font-medium">
                {platformNames.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
