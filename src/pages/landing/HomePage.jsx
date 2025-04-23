import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Heart,
    Users,
    ImageIcon,
    Shield,
    Star,
    Clock,
    Gift,
    BookOpen,
    ChartCandlestick
} from "lucide-react"
import { Link } from "react-router-dom"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { server } from "@/server"
import { assetServer } from "@/assetServer"
import logo from "../../assets/flame.png"
import Hero from "@/components/landing/Hero"

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
        description: "Choose from a variety of elegant themes to customize the memorial."
    },
    {
        icon: Clock,
        title: "Easy to Create",
        description: "Our intuitive tools make it simple to create a memorial in minutes."
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
        description: "Enter information about your loved one, including their name, dates, and a biography."
    },
    {
        icon: ImageIcon,
        title: "Upload Photos",
        description: "Add photos to create a visual tribute to their life and legacy."
    },
    {
        icon: Heart,
        title: "Share the Memorial",
        description: "Invite family and friends to view and contribute to the memorial."
    }
]

const testimonials = [
    {
        name: "John Smith",
        year: 2022,
        content: "Creating a memorial for my father was a beautiful way to honor his life. The platform was easy to use, and the support team was incredibly helpful during this difficult time."
    },
    {
        name: "Emily Johnson",
        year: 2023,
        content: "I was able to create a lasting tribute to my mother and share it with family and friends around the world. It brought us all closer together when we needed it most."
    },
    {
        name: "David Brown",
        year: 2023,
        content: "The memorial page is a wonderful way to keep my wife's memory alive. I appreciate the ability to add photos, stories, and memories that capture her beautiful spirit."
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
           <main className="flex-1 pt-16 sm:pt-0">
                <Hero />
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


function FeaturesSection() {
    return (
        <section id="features" className="bg-[#f8f4f0] py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Honor Their Memory
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Our platform provides all the tools you need to create a lasting tribute.
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
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-[#786f66] mb-4" />
                <h3 className="text-xl font-medium mb-2 text-[#2a3342]">{title}</h3>
                <p className="text-[#4a5568]">{description}</p>
            </CardContent>
        </Card>
    )
}

function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-white py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        How It Works
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Creating a memorial is simple and meaningful. Follow these steps to get started.
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
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-[#f8f4f0]">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-[#786f66] mb-4" />
                <h3 className="text-xl font-medium mb-2 text-[#2a3342]">
                    {title}
                </h3>
                <p className="text-[#4a5568]">{description}</p>
            </CardContent>
        </Card>
    )
}

function FeaturedMemorialsSection({ memorials }) {
    return (
        <section id="featured-memorials" className="py-24 bg-[#f0ece6]">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Featured Memorials
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
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
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
            <img
                src={
                    `${assetServer}/images/people/${memorial.image}` || "/placeholder.svg"
                }
                alt={`${memorial.first_name} ${memorial.last_name}`}
                className="h-48 w-full object-cover"
            />
            <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2 text-[#2a3342]">
                    {memorial.first_name} {memorial.last_name}
                </h3>
                <p className="text-sm text-[#64748b] mb-4">
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
                <p className="text-[#4a5568] mb-4 line-clamp-3">
                    {memorial.quote}
                </p>
                <Link
                    to={`${memorial.theme}/${memorial.id}/${memorial.title}`}
                >
                    <Button className="w-full bg-[#786f66] hover:bg-[#645a52] text-white">
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
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        What Families Say
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
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
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-[#f8f4f0]">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#786f66] flex items-center justify-center text-white font-medium text-xl">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-[#2a3342]">{name}</p>
                        <p className="text-sm text-[#64748b]">
                            Created memorial in {year}
                        </p>
                    </div>
                </div>
                <p className="text-[#4a5568] italic">"{content}"</p>
            </CardContent>
        </Card>
    )
}

function DonationSection() {
    return (
        <section id="donation" className="bg-[#f0ece6] py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Support a Cause
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Accept donations for a cause, for the family, or towards the memorial.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="bg-[#786f66] hover:bg-[#645a52] text-white px-8"
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
        <section className="relative overflow-hidden py-24 bg-[#2a3342] text-white">
            <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl mb-6">
                        Ready to Create a Lasting Tribute?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
                        Join thousands of families who have created beautiful online memorials.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button
                            size="lg"
                            className="bg-white text-[#2a3342] hover:bg-gray-100 px-8"
                        >
                            Create Memorial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 px-8"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}