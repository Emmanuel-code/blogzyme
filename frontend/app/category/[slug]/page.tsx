'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import axios from 'axios'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogPostImage } from "@/components/blog-post-image"

interface Post {
  id: number
  title: string
  content: string
  slug: string
  image_url?: string
  category: string
  created_at: string
}

export default function CategoryPostsPage({ params }: { params: { slug: string } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  async function fetchPostsByCategory(slug: string) {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/posts/category/${slug}/`)
      console.log("Posts fetched:", response.data)
      return response.data
    } catch (error) {
      console.error("Error fetching posts:", error)
      throw error
    }
  }

  useEffect(() => {
    loadPosts()
  }, [params.slug]) // Load posts when slug changes

  async function loadPosts() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPostsByCategory(params.slug)
      setPosts(data)
      setHasMore(!!data.next)
      setPage(2)
    } catch (err) {
      setError('Failed to load posts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  async function loadMorePosts() {
    if (loading) return
    setLoading(true)
    try {
      const data = await fetchPostsByCategory(params.slug)
      setPosts(prevPosts => [...prevPosts, ...data])
      setHasMore(!!data.next)
      setPage(prevPage => prevPage + 1)
    } catch (err) {
      setError('Failed to load more posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load more posts when scrolling to the bottom
  useEffect(() => {
    if (inView) {
      loadMorePosts()
    }
  }, [inView])

  return (
    <div className="container mx-auto px-4 py-16 space-y-8">
      <h1 className="text-5xl font-extrabold text-center capitalize">
        {params.slug} Posts
      </h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!posts.length && !loading && !error ? (
        <p className="text-center text-xl text-muted-foreground">
          No posts found in this category.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
              <Link href={`/blog/${post.id}`} className="overflow-hidden">
                <div className="aspect-video relative">
                  <BlogPostImage
                    src={post.image_url || "/placeholder.svg?height=200&width=400"}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="object-cover w-fill transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-xl font-bold">
                  <Link href={`/blog/${post.id}`} className="hover:text-purple-500 transition-colors duration-200">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                  {post.category}
                </Badge>
                <time className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </time>
              </CardFooter>
            </Card>
          ))}
          {loading && Array.from({ length: 3 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      )}
      
      {hasMore && (
        <div ref={ref} className="flex justify-center">
          <Button onClick={loadMorePosts} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}