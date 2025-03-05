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

const features = [
    {
        icon: Heart,
        title: "Personalized Memorials",
        description:
            "Create beautiful, customized memorial pages that truly reflect the life and legacy of your loved ones."
    },
    {
        icon: Users,
        title: "Collaborative Tributes",
        description:
            "Invite family and friends to contribute their own stories, photos, and memories to create a rich, shared history."
    },
    {
        icon: ImageIcon,
        title: "Multimedia Galleries",
        description:
            "Upload and showcase unlimited photos and videos to create a vibrant visual history of cherished moments."
    },
    {
        icon: Calendar,
        title: "Interactive Timelines",
        description:
            "Build interactive timelines to highlight key moments and milestones in your loved one's life journey."
    },
    {
        icon: Gift,
        title: "Virtual Candles & Gifts",
        description:
            "Allow visitors to light virtual candles or leave symbolic gifts as gestures of remembrance and support."
    },
    {
        icon: Lock,
        title: "Privacy Controls",
        description:
            "Manage who can view and contribute to the memorial with advanced privacy settings and moderation tools."
    },
    {
        icon: Globe,
        title: "Worldwide Accessibility",
        description:
            "Share your memorial page with friends and family around the world, allowing global access to cherished memories."
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description:
            "Our dedicated support team is available around the clock to assist you with any questions or concerns."
    }
]

const howItWorks = [
    {
        icon: Gift,
        title: "Create an Account",
        description: "Sign up for free and choose your memorial plan."
    },
    {
        icon: ImageIcon,
        title: "Build Your Memorial",
        description: "Add photos, stories, and details about your loved one's life."
    },
    {
        icon: Users,
        title: "Share and Collaborate",
        description: "Invite others to view and contribute to the memorial."
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
        <section className="relative min-h-[50vh] bg-[#f5f0ea]">
            {/* Animated cloud background - use multiple layers for parallax effect */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Background cloud layer - slowest moving */}
                <div className="absolute inset-0 bg-repeat-x animate-cloud-slow"
                     style={{
                         backgroundImage: "url('/images/cloud-bg-layer1.png')",
                         backgroundPosition: "0 80%",
                         backgroundSize: "1200px auto",
                     }}
                />

                {/* Middle cloud layer - medium speed */}
                <div className="absolute inset-0 bg-repeat-x animate-cloud-medium"
                     style={{
                         backgroundImage: "url('/images/cloud-bg-layer2.png')",
                         backgroundPosition: "0 60%",
                         backgroundSize: "1000px auto",
                         opacity: 0.7,
                     }}
                />

                {/* Foreground cloud layer - fastest moving */}
                <div className="absolute inset-0 bg-repeat-x animate-cloud-fast"
                     style={{
                         backgroundImage: "url('/images/cloud-bg-layer3.png')",
                         backgroundPosition: "0 90%",
                         backgroundSize: "800px auto",
                         opacity: 0.5,
                     }}
                />

                <style jsx="true">{`
                    @keyframes cloud-move-slow {
                        0% { background-position: 0% 80%; }
                        100% { background-position: 1200px 80%; }
                    }
                    @keyframes cloud-move-medium {
                        0% { background-position: 0% 60%; }
                        100% { background-position: 1000px 60%; }
                    }
                    @keyframes cloud-move-fast {
                        0% { background-position: 0% 90%; }
                        100% { background-position: 800px 90%; }
                    }
                    .animate-cloud-slow {
                        animation: cloud-move-slow 60s linear infinite;
                    }
                    .animate-cloud-medium {
                        animation: cloud-move-medium 40s linear infinite;
                    }
                    .animate-cloud-fast {
                        animation: cloud-move-fast 30s linear infinite;
                    }
                `}</style>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0ea]/80 to-[#f5f0ea]/60 flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-4xl mx-auto space-y-8 relative">
                    <h1 className="text-5xl md:text-6xl font-serif text-[#2a3342] tracking-wide">
                        Our Features
                    </h1>

                    <p className="text-lg md:text-xl text-[#4a5568] font-light max-w-2xl mx-auto leading-relaxed">
                        Discover the tools and features that make our memorial pages unique and meaningful
                    </p>

                    <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-[#786f66] hover:bg-[#645a52] text-white border-none font-medium px-8"
                        >
                            Get Started
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-[#786f66] text-[#786f66] hover:bg-[#f5f0ea] hover:text-[#645a52] font-medium px-8"
                        >
                            View Examples
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

function FeaturesSection() {
    return (
        <section id="features" className="bg-[#f8f4f0] py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Our Features
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Discover the tools and features that make our memorial pages unique and meaningful
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
            <div
                className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                {step}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
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
                        Join thousands of families who have created beautiful online memorials with our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button
                            size="lg"
                            className="bg-white text-[#2a3342] hover:bg-gray-100 px-8"
                        >
                            Get Started
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