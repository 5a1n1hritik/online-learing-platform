import React from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  Star,
  Download,
  Play,
  Calendar,
  Smartphone,
  Landmark,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import heroImage1 from "@/assets/1.png";
import mobileAppSS from "@/assets/mobile-app-ss.png";
import HomePopularTest from "@/components/HomePopularTest";
import {
  platformFuture,
  examCategoris,
  freeStudyMaterials,
  latestJobs,
  mentorsData,
  SuccessStories,
} from "@/data/homePageData";

const Home = () => {
  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Hero Section - Government Exam Focused */}
        <section className="w-full py-12 sm:py-16 md:py-14 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
          {/* Animated Blobs */}
          <div className="blob" style={{ top: "30%", left: "20%" }}></div>
          <div
            className="blob"
            style={{ top: "60%", left: "70%", animationDelay: "-5s" }}
          ></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 sm:gap-14 lg:gap-16">
              {/* Text Section */}
              <div className="space-y-6 text-left animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300">
                    <Landmark className="h-5 w-5 mr-2" />
                    India's #1 Government Exam Platform
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Crack Your Dream Government Job
                  </h1>
                  <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl sm:max-w-lg md:max-w-2xl">
                    Join 50,000+ aspirants preparing for SSC, UPSC, Banking,
                    Railways & Teaching exams. Get expert guidance, unlimited
                    mock tests, and guaranteed success.
                  </p>
                </div>

                <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>98% Success Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>50,000+ Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span>Expert Faculty</span>
                  </div>
                </div>

                <div
                  className="flex flex-col sm:flex-row justify-start gap-4 pt-2 animate-slide-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 btn-pulse"
                    >
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full"
                    >
                      Create Free Account
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex justify-center animate-float">
                <div className="relative w-full max-w-[95%] sm:max-w-[600px] lg:max-w-xl aspect-[3/2] rounded-2xl shadow-2xl">
                  <img
                    src={heroImage1}
                    alt="Government Exam Preparation"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {/* Top-right badge */}
                  <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                    Live Classes
                  </div>
                  {/* Bottom-left badge */}
                  <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                    Mock Tests
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Updated Features Section - Exam Specific */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-lg max-w-2xl mx-auto">
                Everything you need to succeed in government exams, all in one
                place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platformFuture.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Categories Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Choose Your Exam Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-lg">
                Comprehensive preparation for all major government exams
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {examCategoris.map((exam, index) => (
                <Card
                  key={exam.name}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`bg-gradient-to-r ${exam.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-2xl">{exam.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{exam.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {exam.courses}
                    </p>
                    <Link to="/globalExams">
                      <Button size="sm" variant="outline" className="w-full">
                        Start Preparing
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mock Tests & Paper Sets */}
        <HomePopularTest />

        {/* Study Materials Highlights */}
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Free Study Materials
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-lg">
                Download comprehensive study resources for your exam preparation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freeStudyMaterials.map((material, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div
                      className={`bg-gradient-to-r ${material.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{material.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {material.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{material.type}</Badge>
                        <span className="text-gray-500">{material.size}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Download className="h-4 w-4" />
                        <span>{material.downloads}</span>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Free
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Job Alerts Section */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container px-4 sm:px-6 md:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Latest Job Alerts
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Don&apos;t miss any government job opportunity
                </p>
              </div>
              <Button variant="outline">
                <Link to="/jobs">View All Jobs</Link>
              </Button>
            </div>

            {/* Swiper Carousel */}
            <Swiper
              modules={[Autoplay]}
              loop
              speed={700}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-2"
            >
              {latestJobs.map((job, index) => (
                <SwiperSlide key={index}>
                  <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <Badge
                            variant={
                              job.status === "New" ? "default" : "secondary"
                            }
                            className="mb-1"
                          >
                            {job.status}
                          </Badge>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Last Date: {job.lastDate}</span>
                            </div>
                          </div>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {job.department}
                        </p>
                        <div className="text-sm font-medium text-blue-600 mb-4">
                          {job.posts}
                        </div>
                      </div>
                      <Button className="w-full mt-auto">
                        <Link to="/jobs/apply-link">Apply Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Top Instructors Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Learn from Expert Mentors
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-lg">
                Get guidance from experienced faculty and successful candidates
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentorsData.map((instructor, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <CardContent className="p-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage
                        src={instructor.image || "/placeholder.svg"}
                        alt={instructor.name}
                      />
                      <AvatarFallback>
                        {instructor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold mb-1">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {instructor.subject}
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{instructor.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{instructor.experience}</span>
                      <span>•</span>
                      <span>{instructor.students} Students</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Ask Doubt
                      </Button>
                      <Button size="sm" className="flex-1">
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories / Toppers Wall */}
        <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Success Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-lg">
                Real stories from students who achieved their dreams
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SuccessStories.map((story, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarImage
                        src={story.image || "/placeholder.svg"}
                        alt={story.name}
                      />
                      <AvatarFallback>
                        {story.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold mb-1">{story.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {story.exam}
                      </Badge>
                      <Badge variant="secondary">{story.rank}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                      "{story.testimonial}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Free vs Paid Plan Comparison */}
        <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-lg">
                Start free or upgrade for unlimited access
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">Free Plan</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    ₹0
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Forever free
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>5 Mock Tests per month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Basic study materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Job alerts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Community support</span>
                  </div>
                  <Button className="w-full mt-6" variant="outline">
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">Premium Plan</CardTitle>
                  <div className="text-4xl font-bold text-blue-600">₹999</div>
                  <p className="text-gray-600 dark:text-gray-400">Per year</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Unlimited mock tests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>All study materials & PDFs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Video lectures</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Priority job alerts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>1-on-1 mentor support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Detailed analytics</span>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mobile App Promo */}
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Study On-the-Go
                </h2>
                <p className="text-gray-600 dark:text-gray-400 md:text-lg mb-6">
                  Download our mobile app and prepare for exams anytime,
                  anywhere
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Offline mock tests and study materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Push notifications for job alerts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Sync progress across all devices</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    <Play className="h-5 w-5 mr-2" />
                    Google Play
                  </Button>
                  <Button variant="outline">
                    <Smartphone className="h-5 w-5 mr-2" />
                    App Store
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  alt="Mobile App Screenshots"
                  className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-sm rounded-2xl shadow-2xl"
                  src={mobileAppSS}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
          {/* Animated blobs */}
          <div className="blob" style={{ top: "30%", left: "30%" }}></div>
          <div className="blob" style={{ top: "40%", left: "40%" }}></div>
          <div className="blob" style={{ top: "50%", left: "50%" }}></div>

          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container px-4 sm:px-6 md:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Join 50,000+ Students Preparing for Their Dream Jobs
              </h2>
              <p className="text-lg sm:text-xl mb-2 text-blue-100">
                100% Exam-Focused. Safe & Verified Content.
              </p>
              <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-200">
                Start your government job preparation journey today with
                India&apos;s most trusted platform
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 text-base sm:text-lg"
                  >
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-blue-500 hover:bg-white/10 px-6 py-3 text-base sm:text-lg"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Money Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
