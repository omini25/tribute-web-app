"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Heart,
    Users,
    Image as ImageIcon,
    Calendar,
    Gift,
    Lock,
    Globe,
    Headphones
} from "lucide-react"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Link } from "react-router-dom";

const features = [
    {
        icon: Heart,
        title: "Personalized Memorials",
        description:
            "Create beautiful, customized memorial pages that truly reflect the life and legacy of your loved ones.",
    },
    {
        icon: Users,
        title: "Collaborative Tributes",
        description:
            "Invite family and friends to contribute their own stories, photos, and memories to create a rich, shared history.",
    },
    {
        icon: ImageIcon,
        title: "Multimedia Galleries",
        description:
            "Upload and showcase unlimited photos and videos to create a vibrant visual history of cherished moments.",
    },
    {
        icon: Calendar,
        title: "Interactive Timelines",
        description:
            "Build interactive timelines to highlight key moments and milestones in your loved one's life journey.",
    },
    {
        icon: Gift,
        title: "Virtual Candles & Gifts",
        description:
            "Allow visitors to light virtual candles or leave symbolic gifts as gestures of remembrance and support.",
    },
    {
        icon: Lock,
        title: "Privacy Controls",
        description:
            "Manage who can view and contribute to the memorial with advanced privacy settings and moderation tools.",
    },
    {
        icon: Globe,
        title: "Worldwide Accessibility",
        description:
            "Share your memorial page with friends and family around the world, allowing global access to cherished memories.",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description:
            "Our dedicated support team is available around the clock to assist you with any questions or concerns.",
    }
]

const howItWorks = [
    {
        icon: Gift,
        title: "Create an Account",
        description: "Sign up for free and choose your memorial plan.",
    },
    {
        icon: ImageIcon,
        title: "Build Your Memorial",
        description: "Add photos, stories, and details about your loved one's life.",
    },
    {
        icon: Users,
        title: "Share and Collaborate",
        description: "Invite others to view and contribute to the memorial.",
    }
]

export default function FeaturesPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CallToActionSection />
            </main>
            <Footer />
        </div>
    )
}

function HeroSection() {
    return (
        <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-24 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0 bg-repeat"
                    style={{
                        backgroundImage: "url('/images/pattern.svg')",
                        backgroundSize: "200px auto",
                    }}
                />
            </div>

            <div className="container max-w-5xl mx-auto px-6 relative z-10 text-center">
                <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-tight">Our Features</h1>
                <p className="text-2xl md:text-3xl text-gray-200 font-light mb-8">
                    Discover the tools and features that make our memorial pages unique and meaningful.
                </p>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0 transform translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f9fafb">
                    <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>
        </section>
    )
}

function FeaturesSection() {
    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="container px-6 mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-gray-900 tracking-wide">Our Features</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the tools and features that make our memorial pages unique and meaningful.
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
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 rounded-lg overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full p-3 bg-yellow-100 text-yellow-500 mb-4">
                    <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </CardContent>
        </Card>
    )
}

function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="container px-6 mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-gray-900 tracking-wide">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Creating a memorial is simple and meaningful. Follow these steps to get started.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {howItWorks.map((step, index) => (
                        <StepCard key={index} step={index + 1} {...step} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function StepCard({ icon: Icon, title, description, step }) {
    return (
        <div className="text-center">
            <div className="bg-yellow-400 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
                {step}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

function CallToActionSection() {
    return (
        <section className="relative py-20 bg-gray-900 text-white">
            <div className="container px-6 mx-auto max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">Ready to Create a Lasting Tribute?</h2>
                <p className="mb-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                    Join thousands of families who have created beautiful online memorials with our platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 rounded-full"
                        asChild
                    >
                        <Link to="/signup">Get Started</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}