import React from 'react'
import { cn } from '../utils/cn'

export function Input({ variant = 'default', icon, className, ...props }) {
  const baseClasses = 'w-full px-3 py-2 border rounded-md bg-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors'
  
  if (variant === 'withIcon' && icon) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          className={cn(baseClasses, 'pl-10', className)}
          {...props}
        />
      </div>
    )
  }

  return (
    <input
      className={cn(baseClasses, className)}
      {...props}
    />
  )
}