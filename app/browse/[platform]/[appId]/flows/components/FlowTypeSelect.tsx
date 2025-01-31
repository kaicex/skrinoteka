'use client'

import { useRouter, useSearchParams, usePathname, useParams } from 'next/navigation'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Screen } from '@/lib/types'

interface FlowTypeSelectProps {
  flowTypes: Array<{ name: string }>;
  screens: Screen[];
}

export function FlowTypeSelect({ flowTypes, screens }: FlowTypeSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = useParams()
  const isDesktop = params.platform === 'desktop'
  const initialFlowType = searchParams.get('flowType') || 'all'
  const [selectedType, setSelectedType] = useState(initialFlowType)

  // Фильтруем типы флоу, которые есть в экранах текущей платформы
  const filteredFlowTypes = flowTypes.filter(flowType => {
    return screens.some(screen => {
      const screenPlatforms = screen.platform.map(p => p.name.toLowerCase());
      const isCorrectPlatform = isDesktop 
        ? screenPlatforms.includes('web')
        : screenPlatforms.includes('ios') || screenPlatforms.includes('android');
      
      return isCorrectPlatform && screen.flowType?.name === flowType.name;
    });
  });

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete('flowType')
    } else {
      params.set('flowType', value)
    }
    router.push(`${pathname}?${params.toString()}`)
    setSelectedType(value)
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-zinc-500">Фильтр по флоу</div>
      <Select
        value={selectedType}
        onValueChange={(value) => {
          handleValueChange(value)
        }}
      >
        <SelectTrigger className="w-full h-8 text-sm">
          <SelectValue placeholder="Выберите тип флоу" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            Все флоу
          </SelectItem>
          {filteredFlowTypes.map((flowType) => (
            <SelectItem key={flowType.name} value={flowType.name}>
              {flowType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
