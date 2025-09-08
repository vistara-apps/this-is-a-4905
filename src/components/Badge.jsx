import React from 'react'
import { cn } from '../utils/cn'

export function Badge({ variant = 'default', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-gray-100 text-gray-800',
        variant === 'outline' && 'border border-gray-300 text-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}