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
  defaultValue?: string;
  screens: Screen[];
}

export function FlowTypeSelect({ flowTypes, defaultValue, screens }: FlowTypeSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = useParams()
  const isDesktop = params.platform === 'desktop'
  const initialFlowType = searchParams.get('flowType') || defaultValue || 'Все флоу'
  const [selectedType, setSelectedType] = useState(initialFlowType)

  // Фильтруем типы флоу, которые есть в экранах текущей платформы
  const filteredFlowTypes = flowTypes.filter(flowType => {
    return screens.some(screen => {
      const isCorrectPlatform = isDesktop 
        ? screen.isDesktop === true
        : screen.isDesktop === false || screen.isDesktop === undefined;
      
      return isCorrectPlatform && screen.flowType?.name === flowType.name;
    });
  });

  const getFlowScreenCount = (flowName: string) => {
    return screens.filter(screen => {
      const isCorrectPlatform = isDesktop 
        ? screen.isDesktop === true
        : screen.isDesktop === false || screen.isDesktop === undefined;
      
      return isCorrectPlatform && screen.flowType?.name === flowName;
    }).length;
  };

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "Все флоу") {
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
          <SelectItem value="Все флоу">
            Все флоу
          </SelectItem>
          {filteredFlowTypes.map((flowType) => (
            <SelectItem key={flowType.name} value={flowType.name}>
              <span className="flex items-center gap-2">
                <span>{flowType.name}</span>
                <span className="text-zinc-400">{getFlowScreenCount(flowType.name)}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
