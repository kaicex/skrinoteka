'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from "next/navigation"

interface AppTabsProps {
  currentTab: string
  platform: string
  appId: string
}

export function AppTabs({ currentTab, platform, appId }: AppTabsProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleTabChange = (value: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('tab', value)
    router.push(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <Tabs 
      value={currentTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger 
          value="flows" 
          className="flex-1 w-full text-center"
        >
          Потоки
        </TabsTrigger>
        <TabsTrigger 
          value="screens" 
          className="flex-1 w-full text-center"
        >
          Экраны
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
