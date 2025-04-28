import React from 'react'
import { ArrowRight, BookOpen, Users, Award, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedCourses from "@/components/FeaturedCourses.jsx"
import Testimonials from "@/components/Testimonials.jsx"

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 animated-bg relative overflow-hidden">
        {/* Animated blobs */}
        <div className="blob" style={{ top: "30%", left: "20%" }}></div>
        <div className="blob" style={{ top: "60%", left: "70%", animationDelay: "-5s" }}></div>

        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none gradient-heading">
                  Learn Without Limits
                </h1>
                <p
                  className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  Discover courses taught by industry experts and expand your knowledge from anywhere, anytime.
                </p>
              </div>
              <div
                className="flex flex-col gap-2 min-[400px]:flex-row animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Link href="/courses">
                  <Button size="lg" className="rounded-full btn-pulse">
                    Browse Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="rounded-full">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center animate-float">
              <img
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-xl"
                src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background pattern-bg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 animate-fade-in">
              <div
                className="inline-block rounded-full bg-secondary px-3 py-1 text-sm animate-bounce-in"
                style={{ animationDelay: "0.2s" }}
              >
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-heading">Why Choose EduLearn?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers a comprehensive learning experience with features designed to help you succeed.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {[
              {
                icon: BookOpen,
                title: "Expert-Led Courses",
                description: "Learn from industry professionals with real-world experience.",
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Connect with peers and instructors for guidance and collaboration.",
              },
              {
                icon: Award,
                title: "Certificates",
                description: "Earn recognized certificates to showcase your achievements.",
              },
              {
                icon: CheckCircle,
                title: "Flexible Learning",
                description: "Study at your own pace with lifetime access to course materials.",
              },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className="card-hover-effect border-none shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4 animate-pulse-soft">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <FeaturedCourses />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 animated-bg relative overflow-hidden">
        {/* Animated blobs */}
        <div className="blob" style={{ top: "50%", left: "50%" }}></div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 animate-fade-in">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-heading">
                Ready to Start Learning?
              </h2>
              <p
                className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                Join thousands of students already learning on our platform.
              </p>
            </div>
            <div
              className="flex flex-col gap-2 min-[400px]:flex-row animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/courses">
                <Button size="lg" className="rounded-full btn-pulse">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="rounded-full">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
