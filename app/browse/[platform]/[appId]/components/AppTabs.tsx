'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AppTabsProps {
  currentTab: string;
  hasFlows: boolean;
  onTabChange: (tab: string) => void;
}

export function AppTabs({ currentTab, hasFlows, onTabChange }: AppTabsProps) {
  if (!hasFlows) {
    return null;
  }

  return (
    <Tabs 
      value={currentTab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger 
          value="flows" 
          className="flex-1 w-full text-center"
        >
          Флоу
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
