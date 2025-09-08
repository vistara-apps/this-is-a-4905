import React from 'react'
import { cn } from '../utils/cn'

export function Card({ variant = 'default', className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface rounded-lg border transition-all',
        variant === 'featured' && 'shadow-card border-primary/20 ring-1 ring-primary/10',
        variant === 'default' && 'shadow-sm hover:shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pb-3', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pt-3', className)} {...props}>
      {children}
    </div>
  )
}