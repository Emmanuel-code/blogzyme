import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">About Blogzyme</h1>
      <div className="grid gap-8 md:grid-cols-2 items-center mb-12">
        <Image
          src="/placeholder.svg?height=400&width=400"
          alt="Blogzyme Team"
          width={400}
          height={400}
          className="rounded-lg"
        />
        <div className="prose dark:prose-invert">
          <p>
            Blogzyme is a cutting-edge blogging platform that leverages the power of AI to generate
            fresh, engaging content across a wide range of topics. Our mission is to provide readers
            with a constant stream of high-quality articles while pushing the boundaries of whats
            possible with AI-assisted content creation.
          </p>
        </div>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <h2>Our Vision</h2>
        <p>
          We envision a future where AI and human creativity work hand in hand to produce
          content that informs, entertains, and inspires. Blogzyme is at the forefront of this
          revolution, constantly innovating to bring you the best reading experience possible.
        </p>
        <h2>How It Works</h2>
        <p>
          Behind the scenes, Blogzyme utilizes advanced AI models to generate blog post ideas,
          create engaging titles, and even draft full articles. Our team of expert editors then
          reviews and refines this content to ensure it meets our high standards for quality
          and accuracy.
        </p>
        <h2>Join the Wave</h2>
        <p>
          Whether you are a casual reader or a content creator looking to harness the power of AI,
          BlogWave has something for you. Dive into our diverse categories, engage with our
          community, and ride the wave of the future of content creation with us.
        </p>
      </div>
    </div>
  )
}

