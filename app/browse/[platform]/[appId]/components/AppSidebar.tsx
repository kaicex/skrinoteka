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
  params
}: AppSidebarProps) {
  const baseUrl = `/browse/${params.platform}/${params.appId}`
  const isDesktop = params.platform === 'desktop'
  
  // Фильтруем экраны в зависимости от isDesktop
  const filteredScreens = app.screens.filter(screen => {
    if (isDesktop) {
      return screen.isDesktop === true;
    } else {
      return screen.isDesktop === false || screen.isDesktop === undefined;
    }
  });

  // Получаем уникальные типы флоу из отфильтрованных экранов
  const filteredFlowTypes = Array.from(new Set(
    filteredScreens
      .filter(screen => screen.flowType?.name)
      .map(screen => screen.flowType?.name)
  ));

  const platformScreensCount = filteredScreens.length;
  const platformFlowCount = filteredFlowTypes.length;
  
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="md:sticky md:top-0">
        <div className="pt-4 md:pt-6 mb-6">
          <Link
            href={`/browse/${params.platform}`}
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к приложениям
          </Link>

          <div className="mb-4">
            <div className="hidden md:flex md:flex-col gap-3">
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
                <h1 className="text-lg font-semibold">{app.name}</h1>
                <div className="text-sm text-zinc-500">
                  {app.category}
                </div>
              </div>
            </div>

            {/* Мобильная версия */}
            <div className="flex md:hidden items-center gap-3">
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
                <h1 className="text-lg font-semibold">{app.name}</h1>
                <div className="text-sm text-zinc-500">
                  {app.category}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {hasFlows && (
            <div className="space-y-3 mb-6">
              <nav className="flex gap-1 bg-gray-200 p-1 rounded-lg">
                <Link
                  href={`${baseUrl}/flows`}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-sm text-center rounded-md transition-colors",
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
                    "flex-1 px-3 py-1.5 text-sm text-center rounded-md transition-colors",
                    currentTab === 'screens'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Экраны
                </Link>
                <Link
                  href={`${baseUrl}/videos`}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-sm text-center rounded-md transition-colors",
                    currentTab === 'videos'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Видео
                </Link>
              </nav>

              {currentTab === 'flows' && (
                <div className="pt-3">
                  <FlowTypeSelect 
                    flowTypes={app.flowTypes || []} 
                    screens={app.screens} 
                  />
                </div>
              )}
            </div>
          )}

          {app.description && (
            <p className="text-sm text-zinc-500 mb-6">{app.description}</p>
          )}

          {/* Статистика */}
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-zinc-500">Всего экранов</div>
              <div className="font-medium">
                {pluralizeScreens(platformScreensCount)}
              </div>
            </div>

            {hasFlows && (
              <div>
                <div className="text-zinc-500">Всего флоу</div>
                <div className="font-medium">{platformFlowCount}</div>
              </div>
            )}

            {app.videos && app.videos.length > 0 && (
              <div>
                <div className="text-zinc-500">Всего видео</div>
                <div className="font-medium">{app.videos?.length || 0}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
