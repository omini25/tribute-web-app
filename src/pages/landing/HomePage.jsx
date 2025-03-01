"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VideoSlider } from "@/components/landing/VideoSlider"
import {
    Heart,
    Users,
    ImageIcon,
    Shield,
    Star,
    Clock,
    Gift,
    BookOpen
} from "lucide-react"
import { Link } from "react-router-dom"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { server } from "@/server"
import { assetServer } from "@/assetServer"

const features = [
    {
        icon: Heart,
        title: "Lasting Tribute",
        description: "Create a permanent online memorial to honor your loved one."
    },
    {
        icon: Users,
        title: "Share with Family",
        description: "Invite family and friends to contribute memories and photos."
    },
    {
        icon: ImageIcon,
        title: "Photo Gallery",
        description: "Upload and share cherished photos in a beautiful gallery."
    },
    {
        icon: Shield,
        title: "Privacy Options",
        description: "Control who can view and contribute to the memorial."
    },
    {
        icon: Star,
        title: "Personalized Themes",
        description: "Choose from a variety of themes to customize the memorial."
    },
    {
        icon: Clock,
        title: "Easy to Create",
        description:
            "Our simple tools make it easy to create a memorial in minutes."
    }
]

const steps = [
    {
        icon: Gift,
        title: "Create an Account",
        description: "Sign up for a free account to get started."
    },
    {
        icon: BookOpen,
        title: "Add Details",
        description:
            "Enter information about your loved one, such as their name, dates, and a biography."
    },
    {
        icon: ImageIcon,
        title: "Upload Photos",
        description: "Add photos to create a visual tribute."
    },
    {
        icon: Heart,
        title: "Share the Memorial",
        description:
            "Invite family and friends to view and contribute to the memorial."
    }
]

const testimonials = [
    {
        name: "John Smith",
        year: 2022,
        content:
            "Creating a memorial for my father was a beautiful way to honor his life. The platform was easy to use, and the support team was incredibly helpful."
    },
    {
        name: "Emily Johnson",
        year: 2023,
        content:
            "I was able to create a lasting tribute to my mother, and share it with family and friends around the world. It brought us all closer together during a difficult time."
    },
    {
        name: "David Brown",
        year: 2023,
        content:
            "The memorial page is a wonderful way to keep my wife's memory alive. I appreciate the ability to add photos, stories, and memories."
    }
]

export default function HomePage() {
    const [memorials, setMemorials] = useState([])

    useEffect(() => {
        axios
            .get(`${server}/tributesing`)
            .then(response => {
                setMemorials(response.data)
            })
            .catch(error => {
                console.error("Error fetching memorials:", error)
            })
    }, [])

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <FeaturedMemorialsSection memorials={memorials} />
                <TestimonialsSection />
                <DonationSection />
                <CallToActionSection />
            </main>
            <Footer />
        </div>
    )
}

function HeroSection() {
    return (
        <section className="relative h-screen">
            <VideoSlider />
            <div className="absolute inset-0 bg-primary bg-opacity-10 flex items-center justify-center">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto space-y-6 text-center text-primary-foreground">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                            Preserve Their Legacy Forever
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl">
                            Create beautiful online memorials to celebrate and remember your
                            loved ones. Share memories, photos, and stories with family and
                            friends.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button
                                size="lg"
                                className="bg-secondary text-secondary-foreground hover:bg-alernatebg/90"
                            >
                                Create Memorial
                            </Button>
                            <a href="#featured-memorials">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-primary-foreground text-primary-foreground hover:bg-primary"
                                >
                                    View Examples
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function FeaturesSection() {
    return (
        <section id="features" className="bg-alernatebg py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary-foreground">
                        Everything You Need to Honor Their Memory
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-secondary-foreground/80 md:text-lg lg:text-xl">
                        Our platform provides all the tools you need to create a lasting
                        tribute.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
                <p className="text-secondary-foreground/80">{description}</p>
            </CardContent>
        </Card>
    )
}

function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-white py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                        How It Works
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-secondary-foreground md:text-lg lg:text-xl">
                        Creating a memorial is simple and meaningful. Follow these steps to
                        get started.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function StepCard({ icon: Icon, title, description }) {
    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-alernatebg">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 text-secondary-foreground">
                    {title}
                </h3>
                <p className="text-secondary-foreground/80">{description}</p>
            </CardContent>
        </Card>
    )
}

function FeaturedMemorialsSection({ memorials }) {
    return (
        <section className="py-24 bg-accent">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-accent-foreground">
                        Featured Memorials
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-accent-foreground/80 md:text-lg lg:text-xl">
                        Explore some of our beautiful memorial pages.
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {memorials.map(memorial => (
                        <MemorialCard key={memorial.id} memorial={memorial} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function MemorialCard({ memorial }) {
    return (
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <img
                src={
                    `${assetServer}/images/people/${memorial.image}` || "/placeholder.svg"
                }
                alt={`${memorial.first_name} ${memorial.last_name}`}
                width={400}
                height={300}
                className="h-48 w-full object-cover"
            />
            <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary">
                    {memorial.first_name} {memorial.last_name}
                </h3>
                <p className="text-sm text-secondary-foreground/80 mb-4">
                    {new Date(memorial.date_of_birth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    })}{" "}
                    -{" "}
                    {new Date(memorial.date_of_death).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    })}
                </p>
                <p className="text-secondary-foreground mb-4 line-clamp-3">
                    {memorial.quote}
                </p>
                <Link
                    to={
                        memorial.theme === "Warm"
                            ? `/elegant/${memorial.id}/${memorial.title}`
                            : "#"
                    }
                >
                    <Button className="w-full" variant="outline">
                        View Memorial
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}

function TestimonialsSection() {
    return (
        <section id="testimonials" className="bg-white py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                        What Families Say
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-secondary-foreground md:text-lg lg:text-xl">
                        Hear from families who have created memorials with us.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function TestimonialCard({ name, year, content }) {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-alernatebg">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <img
                        src="/placeholder.svg"
                        alt={name}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-secondary-foreground">{name}</p>
                        <p className="text-sm text-secondary-foreground/80">
                            Created memorial in {year}
                        </p>
                    </div>
                </div>
                <p className="text-secondary-foreground italic">"{content}"</p>
            </CardContent>
        </Card>
    )
}

function DonationSection() {
    return (
        <section id="donation" className="bg-accent py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-accent-foreground">
                        Support a Cause
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-accent-foreground/80 md:text-lg lg:text-xl">
                        Accept donations for a cause, for the family, or towards the
                        memorial.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Donate Now
                    </Button>
                </div>
            </div>
        </section>
    )
}

function CallToActionSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-primary text-primary-foreground">
            <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                        Ready to Create a Lasting Tribute?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl">
                        Join thousands of families who have created beautiful online
                        memorials.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button
                            size="lg"
                            className="bg-alernatebg text-secondary-foreground hover:bg-alernatebg/90"
                        >
                            Create Memorial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
