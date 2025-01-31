'use client'

import { memo } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  onLoad?: () => void
  isFirst?: boolean
}

export const LazyImage = memo(({ 
  src, 
  alt, 
  className, 
  priority = false, 
  onLoad,
  isFirst = false
}: LazyImageProps) => {
  // Если это первое изображение в списке или priority явно установлен в true,
  // устанавливаем priority для оптимизации LCP
  const shouldPrioritize = isFirst || priority

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        loading={shouldPrioritize ? 'eager' : 'lazy'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={shouldPrioritize}
        onLoad={onLoad}
      />
    </div>
  )
})

LazyImage.displayName = 'LazyImage'
