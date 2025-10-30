'use client'

import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { clsx } from 'clsx'

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', ...props }: Props) {
  const styles = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-accent text-accent-foreground hover:opacity-90',
    ghost: 'bg-transparent hover:bg-muted text-foreground'
  }[variant]

  return (
    <button
      className={clsx('inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors border border-transparent', styles, className)}
      {...props}
    />
  )
}
