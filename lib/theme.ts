'use client'

import { useEffect, useState } from 'react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Prefer system theme on first load
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const initial = mq.matches
    setDark(initial)
    document.documentElement.classList.toggle('dark', initial)
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
      setDark(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => {
    setDark((d) => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  return { dark, toggle }
}