"use client"

import Image from "next/image"
import { useState } from "react"

interface BlogPostImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function BlogPostImage({ src, alt, width, height, className }: BlogPostImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted ${className}`}
        style={{ width, height }}
      >
        <span className="text-muted-foreground">Image not available</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  )
}

