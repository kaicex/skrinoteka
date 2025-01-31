'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { App } from '@/lib/types'
import { AppTabs } from './AppTabs'
import { FlowTypeSelect } from './FlowTypeSelect'
import { pluralizeScreens } from '@/lib/utils/pluralize'

interface AppSidebarProps {
  app: App
  currentTab: string
  hasFlows: boolean
  selectedFlowType: string
  totalScreens: number
  platformNames: string[]
  onTabChange: (tab: string) => void
  params: {
    platform: string
  }
}

export function AppSidebar({
  app,
  currentTab,
  hasFlows,
  selectedFlowType,
  totalScreens,
  platformNames,
  onTabChange,
  params
}: AppSidebarProps) {
  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <div className="sticky top-8">
        <div className="mb-8">
          <Link
            href={`/browse/${params.platform}`}
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к приложениям
          </Link>

          <div className="mb-4">
            <div className="flex items-center gap-4">
              {app.logo && (
                <div className="w-12 md:w-full aspect-square rounded-lg border border-zinc-200 overflow-hidden relative">
                  <Image
                    src={app.logo.url}
                    alt={app.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="md:hidden">
                <h1 className="text-xl font-semibold">{app.name}</h1>
                <div className="text-sm text-zinc-500">{app.category}</div>
              </div>
            </div>
            <div className="hidden md:block mt-4">
              <h1 className="text-xl font-semibold mb-1">{app.name}</h1>
              <div className="text-sm text-zinc-500">{app.category}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-4 mb-8">
            <AppTabs
              currentTab={currentTab}
              hasFlows={hasFlows}
              onTabChange={onTabChange}
            />

            {currentTab === 'flows' && hasFlows && (
              <FlowTypeSelect
                flowTypes={app.flowTypes || []}
                selectedFlowType={selectedFlowType}
              />
            )}
          </div>

          {app.description && (
            <p className="text-sm text-zinc-500 mb-8">{app.description}</p>
          )}

          {/* Статистика */}
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-zinc-500">Всего экранов</div>
              <div className="font-medium">
                {pluralizeScreens(totalScreens)}
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
