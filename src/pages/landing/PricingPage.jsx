"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckIcon, XIcon } from "lucide-react"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

const plans = [
    {
        title: "Basic",
        price: "Free",
        description: "For individuals creating a single memorial",
        features: [
            "1 memorial page",
            "Basic customization",
            "Photo gallery (up to 50 photos)",
            "Visitor guestbook",
            "Share on social media"
        ]
    },
    {
        title: "Premium",
        price: "$9.99",
        description: "For families wanting enhanced features",
        features: [
            "Up to 5 memorial pages",
            "Advanced customization",
            "Unlimited photos and videos",
            "Timeline of life events",
            "Donation collection",
            "Remove ads"
        ],
        popular: true
    },
    {
        title: "Professional",
        price: "$29.99",
        description: "For organizations managing multiple memorials",
        features: [
            "Unlimited memorial pages",
            "White-label option",
            "API access",
            "Priority support",
            "Analytics dashboard",
            "Custom domain"
        ]
    }
]

const comparisonFeatures = [
    {
        name: "Memorial Pages",
        basic: "1",
        premium: "Up to 5",
        professional: "Unlimited"
    },
    {
        name: "Customization",
        basic: "Basic",
        premium: "Advanced",
        professional: "Advanced"
    },
    {
        name: "Photo Gallery",
        basic: "Up to 50 photos",
        premium: "Unlimited",
        professional: "Unlimited"
    },
    {
        name: "Video Support",
        basic: false,
        premium: true,
        professional: true
    },
    {
        name: "Timeline of Life Events",
        basic: false,
        premium: true,
        professional: true
    },
    {
        name: "Donation Collection",
        basic: false,
        premium: true,
        professional: true
    },
    {
        name: "Ad-free Experience",
        basic: false,
        premium: true,
        professional: true
    },
    {
        name: "White-label Option",
        basic: false,
        premium: false,
        professional: true
    },
    {
        name: "API Access",
        basic: false,
        premium: false,
        professional: true
    },
    {
        name: "Analytics Dashboard",
        basic: false,
        premium: false,
        professional: true
    },
    {
        name: "Custom Domain",
        basic: false,
        premium: false,
        professional: true
    }
]

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">
                {/*<HeroSection />*/}
                <PricingSection />
                <ComparisonSection />
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
                        Choose Your Plan
                    </h1>

                    <p className="text-lg md:text-xl text-[#4a5568] font-light max-w-2xl mx-auto leading-relaxed">
                        Select the perfect plan to honor and remember your loved ones
                    </p>
                </div>
            </div>
        </section>
    )
}

function PricingSection() {
    return (
        <section id="pricing" className="bg-[#f8f4f0] py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Our Pricing Plans
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Flexible options to meet your needs
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <PricingCard key={plan.title} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function PricingCard({ plan }) {
    return (
        <Card className={`border-none shadow-md hover:shadow-lg transition-shadow duration-300 ${
            plan.popular
                ? "bg-white relative before:absolute before:top-0 before:right-0 before:-translate-y-1/2 before:content-['Popular'] before:bg-[#786f66] before:text-white before:py-1 before:px-4 before:rounded-full before:text-sm"
                : "bg-white"
        }`}>
            <CardContent className="p-8">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium text-[#2a3342] mb-2">{plan.title}</h3>
                    <div className="text-4xl font-bold text-[#2a3342] mb-2">{plan.price}</div>
                    <p className="text-[#4a5568]">{plan.description}</p>
                </div>
                <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-[#786f66] mr-3 flex-shrink-0" />
                            <span className="text-[#4a5568]">{feature}</span>
                        </div>
                    ))}
                </div>
                <Button
                    className={`w-full ${
                        plan.popular
                            ? "bg-[#786f66] hover:bg-[#645a52] text-white"
                            : "bg-white border-[#786f66] text-[#786f66] hover:bg-[#f5f0ea]"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                >
                    Select Plan
                </Button>
            </CardContent>
        </Card>
    )
}

function ComparisonSection() {
    return (
        <section id="comparison" className="bg-white py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Feature Comparison
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Compare our plans to find the right fit for your needs
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
                        <thead>
                        <tr className="bg-[#f8f4f0] border-b border-gray-200">
                            <th className="p-4 text-left text-[#2a3342] font-medium">Feature</th>
                            <th className="p-4 text-center text-[#2a3342] font-medium">Basic</th>
                            <th className="p-4 text-center text-[#2a3342] font-medium bg-[#f0ece6]">Premium</th>
                            <th className="p-4 text-center text-[#2a3342] font-medium">Professional</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comparisonFeatures.map((feature, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#faf8f6]"}>
                                <td className="p-4 border-t border-gray-200 text-[#4a5568]">{feature.name}</td>
                                <td className="p-4 border-t border-gray-200 text-center text-[#4a5568]">
                                    {typeof feature.basic === "boolean" ? (
                                        feature.basic ? (
                                            <CheckIcon className="h-5 w-5 text-[#786f66] mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                        )
                                    ) : (
                                        feature.basic
                                    )}
                                </td>
                                <td className="p-4 border-t border-gray-200 text-center text-[#4a5568] bg-[#f0ece6]">
                                    {typeof feature.premium === "boolean" ? (
                                        feature.premium ? (
                                            <CheckIcon className="h-5 w-5 text-[#786f66] mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                        )
                                    ) : (
                                        feature.premium
                                    )}
                                </td>
                                <td className="p-4 border-t border-gray-200 text-center text-[#4a5568]">
                                    {typeof feature.professional === "boolean" ? (
                                        feature.professional ? (
                                            <CheckIcon className="h-5 w-5 text-[#786f66] mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                        )
                                    ) : (
                                        feature.professional
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                        Ready to Create a Lasting Memorial?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
                        Choose a plan today and begin your journey of remembrance.
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
                            Compare Plans
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}