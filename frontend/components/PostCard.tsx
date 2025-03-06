import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Post {
  id: number
  title: string
  content: string
  slug: string
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/blog/${post.slug}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

