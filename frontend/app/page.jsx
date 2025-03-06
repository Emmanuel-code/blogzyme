"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Slider from "react-slick"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Import CSS files for react-slick
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const features = [
  {
    title: "AI-Powered Content",
    description: "Cutting-edge AI algorithms generate fresh, engaging content across various topics.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Personalized Recommendations",
    description: "Smart recommendation system tailors content to your interests and reading habits.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Interactive Discussions",
    description: "Engage with a vibrant community through comments and discussions on every post.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Multi-platform Support",
    description: "Enjoy seamless reading experience across desktop, tablet, and mobile devices.",
    image: "/placeholder.svg?height=400&width=600"
  }
]

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-foreground">
            Welcome to <span className="text-primary">Blogzyme</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Ride the wave of fresh content. Dive into a sea of AI-generated articles spanning various topics, curated just for you.
          </p>
        </div>

        {mounted && (
          <div className="mb-12">
            <Slider {...settings}>
              {features.map((feature, index) => (
                <div key={index} className="px-2">
                  <Card className="bg-card h-full">
                    <CardContent className="flex flex-col items-center p-6 h-full">
                      <div className="relative w-full aspect-video mb-4">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-card-foreground">{feature.title}</h2>
                      <p className="text-center text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/blog">Read Latest Posts</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
            <Link href="/category">Explore Categories</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

