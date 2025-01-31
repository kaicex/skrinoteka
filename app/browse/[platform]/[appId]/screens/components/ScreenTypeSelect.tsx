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

interface ScreenTypeSelectProps {
  screenTypes: Array<{ name: string }>;
  screens: Screen[];
}

export function ScreenTypeSelect({ screenTypes, screens }: ScreenTypeSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = useParams()
  const isDesktop = params.platform === 'desktop'
  const initialScreenType = searchParams.get('screenType') || 'all'
  const [selectedType, setSelectedType] = useState(initialScreenType)

  // Фильтруем типы экранов, которые есть в экранах текущей платформы
  const filteredScreenTypes = screenTypes.filter(screenType => {
    return screens.some(screen => {
      const isCorrectPlatform = isDesktop 
        ? screen.isDesktop === true
        : screen.isDesktop === false || screen.isDesktop === undefined;
      
      return isCorrectPlatform && screen.screenType?.name === screenType.name;
    });
  });

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete('screenType')
    } else {
      params.set('screenType', value)
    }
    router.push(`${pathname}?${params.toString()}`)
    setSelectedType(value)
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-zinc-500">Фильтр по типу экрана</div>
      <Select
        value={selectedType}
        onValueChange={(value) => {
          handleValueChange(value)
        }}
      >
        <SelectTrigger className="w-full h-8 text-sm">
          <SelectValue placeholder="Выберите тип экрана" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            Все типы
          </SelectItem>
          {filteredScreenTypes.map((screenType) => (
            <SelectItem key={screenType.name} value={screenType.name}>
              {screenType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
