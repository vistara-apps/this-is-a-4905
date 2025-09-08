import React from 'react'
import { cn } from '../utils/cn'

const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200 focus:ring-gray-500',
  outline: 'border border-gray-300 bg-surface text-text-primary hover:bg-gray-50 focus:ring-gray-500',
  ghost: 'text-text-primary hover:bg-gray-100 focus:ring-gray-500',
  destructive: 'bg-error text-white hover:bg-red-600 focus:ring-red-500',
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  disabled,
  ...props 
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}