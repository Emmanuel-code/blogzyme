import Link from "next/link"
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlogPostImage } from "@/components/blog-post-image"

async function getPosts() {
  try {
    const response = await axios.get('http://localhost:8000/api/posts/', {
      headers: {
        'Accept': 'application/json',
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
        Latest Blog Posts
      </h1>
      {posts.length === 0 ? (
        <p className="text-center text-xl text-muted-foreground">
          No posts found. Please check back later.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
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
                    {post.title.replace(/#{1,6}\s|\`\`\`[\s\S]*?\`\`\`|\[.*?\]$$.*?$$/g, "")}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{post.content.replace(/#{1,6}\s|\`\`\`[\s\S]*?\`\`\`|\[.*?\]$$.*?$$/g, "")}</p>
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
        </div>
      )}
    </div>
  )
}

