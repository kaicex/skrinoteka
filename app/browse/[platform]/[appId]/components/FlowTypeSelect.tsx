'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FlowTypeSelectProps {
  flowTypes: Array<{ name: string }>;
  selectedFlowType: string;
}

export function FlowTypeSelect({ flowTypes, selectedFlowType }: FlowTypeSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "Все флоу") {
      params.delete('flowType')
    } else {
      params.set('flowType', value)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-zinc-500">Фильтр по флоу</div>
      <Select
        value={selectedFlowType}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full h-8 text-sm">
          <SelectValue placeholder="Выберите тип флоу" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Все флоу">
            Все флоу
          </SelectItem>
          {flowTypes.map((flowType) => (
            <SelectItem key={flowType.name} value={flowType.name}>
              {flowType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
