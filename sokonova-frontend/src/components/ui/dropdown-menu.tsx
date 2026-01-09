'use client'

import * as React from 'react'
import { useState, useRef, useEffect, ReactNode } from 'react'
import { clsx } from 'clsx'

// DropdownMenu component
export function DropdownMenu({ children }: { children: ReactNode }) {
  return <div className="relative inline-block">{children}</div>
}

// DropdownMenuTrigger component
export function DropdownMenuTrigger({ 
  children, 
  asChild,
  className,
  ...props 
}: { 
  children: ReactNode; 
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: clsx(children.props.className, className),
    })
  }
  
  return (
    <button 
      className={clsx("inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </button>
  )
}

// DropdownMenuContent component
export function DropdownMenuContent({ 
  children, 
  align = 'center',
  className
}: { 
  children: ReactNode; 
  align?: 'start' | 'center' | 'end';
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Pass toggle function to parent
  useEffect(() => {
    const trigger = dropdownRef.current?.previousElementSibling
    if (trigger) {
      trigger.addEventListener('click', toggleDropdown)
      return () => {
        trigger.removeEventListener('click', toggleDropdown)
      }
    }
  }, [])

  // Alignment classes
  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  }[align]

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "absolute z-50 mt-2 min-w-[220px] rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md",
        alignmentClasses,
        className
      )}
    >
      {children}
    </div>
  )
}

// DropdownMenuItem component
export function DropdownMenuItem({ 
  children, 
  asChild,
  className,
  ...props 
}: { 
  children: ReactNode; 
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: clsx(
        "relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      ),
    })
  }
  
  return (
    <div
      className={clsx(
        "relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}