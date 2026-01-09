'use client'

import { clsx } from 'clsx'

type ProgressProps = {
  value: number
  className?: string
  indicatorClassName?: string
}

export function Progress({ 
  value, 
  className,
  indicatorClassName
}: ProgressProps) {
  return (
    <div 
      className={clsx(
        'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
    >
      <div
        className={clsx(
          'h-full w-full flex-1 bg-primary transition-all',
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
}