import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

export async function fetchPostsByCategory(slug: string, page = 1, limit = 9) {
  try {
    const response = await api.get(`/posts/category/${slug}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

