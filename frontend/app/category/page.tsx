import axios from "axios"
import Link from "next/link"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react"

async function fetchCategories() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/categories/")
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function CategoryPage() {
  const categories = await fetchCategories()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-extrabold mb-12 text-center">
        Categories
      </h1>
      {categories.length === 0 ? (
        <p className="text-center text-xl text-muted-foreground">
          No categories available. Please check back later.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
             <ul>
        {categories.map((category: {slug:any, key: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }) => (
          <li key={category.key}>
            {/* Ensure the href is a proper string */}
            <Link href={`/category/${category.name}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
        </div>
      )}
    </div>
  )
}
