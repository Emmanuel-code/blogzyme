import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogPostImage } from "@/components/blog-post-image"
 
interface Product {
  id: number;
  name: string;
  keywords: string[];
  description?: string;
  price?: number;
  image_url?: string;
  affiliate_link?: string;
}

interface BlogContent {
  id: number;
  content: string;
  keywords?: string[];
}



class ContentMatcher {
  // Extract main topics and keywords from content
  static extractTopics(content: string): string[] {
    // Clean the content
    const cleanContent = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');

    // Get word frequency
    const wordFreq = new Map<string, number>();
    const words = cleanContent.split(' ');
    
    words.forEach(word => {
      if (word.length > 3 && !this.isStopWord(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });

    // Get most frequent meaningful words as topics
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Calculate semantic similarity between two texts
  static calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(this.cleanAndTokenize(text1));
    const words2 = new Set(this.cleanAndTokenize(text2));

    // Get shared words
    const intersection = new Set([...words1].filter(x => words2.has(x)));

    // Calculate Jaccard similarity
    const similarity = intersection.size / (words1.size + words2.size - intersection.size);
    return similarity;
  }

  // Clean and tokenize text
  private static cleanAndTokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3 && !this.isStopWord(word));
  }

  // Basic stop words list
  private static isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
      'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
      'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
      'which', 'go', 'me'
    ]);
    return stopWords.has(word);
  }

  // Match products to content
  static findRelevantProducts(content: string, products: Product[]): Product[] {
    const contentTopics = this.extractTopics(content);
    console.log('Content topics:', contentTopics);

    return products
      .map(product => {
        // Combine product keywords and description for better matching
        const productText = [
          ...product.keywords,
          product.name,
          product.description || ''
        ].join(' ');

        // Calculate relevance score
        const relevanceScore = this.calculateSimilarity(
          contentTopics.join(' '), 
          productText
        );

        return {
          ...product,
          relevanceScore
        };
      })
      .filter(product => product.relevanceScore > 0.1) // Minimum relevance threshold
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }
}



// Function to clean and normalize text
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

// Enhanced function to extract meaningful keywords from blog content
function extractKeywords(content: string): string[] {
  // Remove markdown syntax and special characters
  const cleanContent = content.replace(/#{1,6}\s|\`\`\`[\s\S]*?\`\`\`|\[.*?\]|\(.*?\)/g, "");
  
  // Split into words, convert to lowercase, and remove duplicates
  const words = cleanContent.toLowerCase()
    .split(/\W+/)
    .filter(word => 
      // Filter out common words and ensure minimum length
      word.length > 3 && 
      !['this', 'that', 'with', 'from', 'your', 'have', 'more', 'will'].includes(word)
    );
  
  return Array.from(new Set(words));
}

// Function to parse keywords from either string or array
function parseKeywords(keywords: string | string[]): string[] {
  if (Array.isArray(keywords)) {
    return keywords.map(k => normalizeText(k));
  }
  // If keywords is a string, split by comma and clean
  return keywords.split(',').map(k => normalizeText(k));
}

// Improved matching function with stricter matching criteria
function matchProductsWithKeywords(products: Product[], contentKeywords: string[]): Product[] {
  console.log('Content Keywords:', contentKeywords); // Debug log

  return products.filter(product => {
    const productKeywords = parseKeywords(product.keywords);
    console.log(`Product: ${product.name}, Keywords:`, productKeywords); // Debug log
    
    // Check if any product keyword matches any content keyword
    const matches = productKeywords.filter(prodKeyword =>
      contentKeywords.some(contentKeyword => 
        contentKeyword.includes(prodKeyword) || prodKeyword.includes(contentKeyword)
      )
    );
    
    console.log(`Matches found for ${product.name}:`, matches); // Debug log
    
    // Return true only if there are actual matches
    return matches.length > 0;
  });
}

// Helper function to format price (keep existing implementation)
function formatPrice(price: string | number | undefined): string {
  if (!price) return '';
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numericPrice) ? `$${numericPrice.toFixed(2)}` : '';
}

async function getPost(slug: string) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/posts/${slug}/`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getRecommendedPosts() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/posts/?limit=5", {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    return [];
  }
} 
 


async function getAffiliateProducts() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/affiliate/', {
      headers: {
        'Accept': 'application/json',
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching affiliate products:', error);
    return [];
  }
}

 

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const affiliateProducts = await getAffiliateProducts();
  const recommendedPosts = await getRecommendedPosts(); 
  if (!post) {
    notFound();
  }    


 // Match products using NLP
  const matchedProducts = ContentMatcher.findRelevantProducts(
    post.content, 
    affiliateProducts
  );

  // Extract keywords and match products
//   const contentKeywords = extractKeywords(post.content);
//   console.log('Extracted content keywords:', contentKeywords); // Debug log
  
//  const matchedProducts = matchProductsWithKeywords(affiliateProducts, contentKeywords);
//   console.log('Number of matched products:', matchedProducts.length); // Debug log
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
 
          {/* Main Content */}
          <article className="lg:w-[70%] ">
          <BlogPostImage
            src={post.image_url || "/placeholder.svg?height=400&width=400"}
            alt={post.title}
            width={400}
            height={400}
            className="rounded-lg mb-8 object-cover md:w-full h-[400px] shadow-lg"
          />
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  {post.category}
                </Badge>
                <time className="text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </time>
              </div>
            </header>
            <div className="prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-pink-400 hover:prose-a:text-pink-300 prose-strong:text-gray-100 prose-code:text-pink-300 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="bg-gray-800 rounded px-1 py-0.5" {...props} />
                    ) : (
                      <pre className="bg-gray-800 rounded p-4 overflow-x-auto">
                        <code {...props} />
                      </pre>
                    ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
            {/* Recommended Posts */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-purple-400">Recommended Posts</h2>
              <ScrollArea className="h-[400px] rounded-md border border-gray-700 p-4">
                <div className="space-y-4">
                  {recommendedPosts.map((recPost: any) => (
                    <Link key={recPost.id} href={`/blog/${recPost.slug}`}>
                      <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-200">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2 text-gray-100">{recPost.title}</h3>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 mb-2">
                            {recPost.category}
                          </Badge>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {recPost.content.replace(/#{1,6}\s|\`\`\`[\s\S]*?\`\`\`|\[.*?\]$$.*?$$/g, "")}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </section>

            {/* Recommended Products */}
            
 {/* Matched Products Section */}
 <section>
              <h2 className="text-2xl font-bold mb-6 text-pink-400">Related Products</h2>
              <ScrollArea className="h-[600px] rounded-md border border-gray-700 p-4">
                <div className="space-y-6">
                  {matchedProducts.map((product) => (
                    <Card key={product.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        {product.image_url && (
                          <div className="relative w-full h-48 mb-4">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        )}
                        <h3 className="font-semibold text-lg mb-2 text-gray-100">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                            {product.description} 
 
                          </p>
                          
                        )}
                        {product.price && (
                          <p className="text-lg font-bold text-purple-400 mb-4">
                            {formatPrice(product.price)}
                          </p>
                        )}
                        {product.affiliate_link && (
                          <Button
                            className="w-full bg-pink-500 hover:bg-pink-600"
                            asChild
                          >
                            <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer">
                              Learn More
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {matchedProducts.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No related products found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

