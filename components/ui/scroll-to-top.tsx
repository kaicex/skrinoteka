'use client'

import { useState, useEffect } from 'react'
import { ChevronsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Показываем кнопку, когда прокрутили на 300px вниз
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 p-3 rounded-full bg-white shadow-lg border border-zinc-200 hover:bg-zinc-50 transition-all duration-300 z-50',
        'opacity-0 invisible flex items-center gap-2',
        isVisible && 'opacity-100 visible'
      )}
      aria-label="Прокрутить наверх"
    >
      <ChevronsUp className="w-5 h-5 text-zinc-600" />
      <span className="text-sm text-zinc-600 pr-1">Наверх</span>
    </button>
  )
}
