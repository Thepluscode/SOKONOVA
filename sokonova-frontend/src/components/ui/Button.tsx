'use client'

import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

export function Button({ className, variant = 'primary', size = 'md', asChild = false, ...props }: Props) {
  const Comp = asChild ? Slot : 'button'
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-accent text-accent-foreground hover:opacity-90',
    ghost: 'bg-transparent hover:bg-muted text-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
    outline: 'border border-border bg-transparent hover:bg-muted text-foreground'
  }[variant]

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl'
  }[size]

  return (
    <Comp
      className={clsx('inline-flex items-center justify-center font-medium transition-colors', variantStyles, sizeStyles, className)}
      {...props}
    />
  )
}