'use client'

import { useMemo, useRef, useCallback } from 'react'

interface Screen {
  url: string
  index: number
  flowType?: {
    name: string
  }
}

interface TabsCacheProps {
  initialScreens: Screen[]
  initialFlowTypes: { name: string }[]
  initialFlowScreens: Screen[]
}

interface CachedData {
  screens: Screen[]
  flows: {
    flowTypes: { name: string }[]
    screens: Screen[]
  }
}

// Глобальный кеш для хранения данных между рендерами
const globalCache = new Map<string, CachedData>()

export function useTabsCache({
  initialScreens,
  initialFlowTypes,
  initialFlowScreens,
}: TabsCacheProps) {
  // Используем useRef для хранения предыдущих данных
  const prevDataRef = useRef<CachedData | null>(null)

  // Создаем ключ кеша из данных
  const cacheKey = useMemo(() => {
    return JSON.stringify({
      screens: initialScreens.map(s => s.url),
      flowTypes: initialFlowTypes.map(ft => ft.name),
      flowScreens: initialFlowScreens.map(s => s.url),
    })
  }, [initialScreens, initialFlowTypes, initialFlowScreens])

  // Мемоизируем данные
  const cachedData = useMemo(() => {
    // Проверяем глобальный кеш
    if (globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey)!
    }

    // Проверяем предыдущие данные
    if (prevDataRef.current) {
      return prevDataRef.current
    }

    // Создаем новые данные
    const data: CachedData = {
      screens: initialScreens,
      flows: {
        flowTypes: initialFlowTypes,
        screens: initialFlowScreens,
      },
    }

    // Сохраняем в кеш
    globalCache.set(cacheKey, data)
    prevDataRef.current = data

    return data
  }, [cacheKey, initialScreens, initialFlowTypes, initialFlowScreens])

  // Функция для принудительного обновления кеша
  const invalidateCache = useCallback(() => {
    globalCache.delete(cacheKey)
    prevDataRef.current = null
  }, [cacheKey])

  return { 
    cachedData,
    invalidateCache
  }
}
