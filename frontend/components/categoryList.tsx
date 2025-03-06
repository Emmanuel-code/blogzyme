// components/CategoryList.tsx
"use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"

const CATEGORIES = [
  'Entertainment',
  'Lifestyle',
  'Politics',
  'Travel',
  'Sports',
  'Technology',
  'Health',
  'Science'
]

export function CategoryList() {
  const pathname = usePathname()

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      <Link href="/blog" className="no-underline">
        <Badge 
          variant="outline" 
          className={`cursor-pointer px-4 py-2 ${
            pathname === "/blog"
              ? "bg-purple-500 text-white"
              : "hover:bg-purple-100 dark:hover:bg-purple-900"
          }`}
        >
          All Posts
        </Badge>
      </Link>
      {CATEGORIES.map((category) => (
        <Link 
          key={category} 
          href={`/blog/categories/${category.toLowerCase()}`}
          className="no-underline"
        >
          <Badge 
            variant="outline" 
            className={`cursor-pointer px-4 py-2 ${
              pathname === `/blog/categories/${category.toLowerCase()}`
                ? "bg-purple-500 text-white"
                : "hover:bg-purple-100 dark:hover:bg-purple-900"
            }`}
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  )
}

// app/blog/layout.tsx
