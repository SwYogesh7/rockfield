'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

export interface ImageWithFallbackProps extends ImageProps {
  fallback?: string
}

export function ImageWithFallback({ 
  src, 
  fallback = '/placeholders/shoe.svg', 
  alt,
  ...props 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  // Intercept stale Unsplash URLs from localStorage (or elsewhere)
  // before next/image crashes due to unconfigured host.
  const isUnsplash = typeof src === 'string' && src.includes('unsplash.com')
  const finalSrc = error || isUnsplash ? fallback : src

  return (
    <Image
      src={finalSrc}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  )
}
