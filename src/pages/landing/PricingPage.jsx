"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckIcon, XIcon } from "lucide-react"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Link } from "react-router-dom";

// Based on the 'Tribute Plan Comparison Table' document [cite: 1]
const plans = [
    {
        title: "Free Plan", // Mapped from 'Free Plan'
        price: "₦0",
        description: "Start simple, honour sincerely. Limited features and duration.",
        features: [
            "Up to 2 tributes",
            "Upload 20 photos & 3 videos",
            "Family members, memories, timeline",
            "3 event posts",
            "Basic customization",
        ],
    },
    {
        title: "Premium Plan", // Mapped from 'Premium Plan' [cite: 50]
        price: "₦1,000",
        description: "Full flexibility and ongoing support with unlimited features",
        features: [
            "Create up to 3 tributes",
            "Unlimited photos & videos",
            "Donation collection enabled",
            "Privacy control & background music",
            "Priority support",
        ],
        popular: true,
    },
    {
        title: "One-Time Plan", // Mapped from 'One-Time Plan' [cite: 34]
        price: "₦1,500", // (once) [cite: 35]
        duration: "30 days",
        description: "Temporary tribute with all premium features, valid for 30 days",
        features: [
            "1 tribute valid for 30 days",
            "Unlimited media uploads",
            "Donation collection enabled",
            "All premium design tools",
            "Privacy settings included",
        ],
    },
    {
        title: "Lifetime Plan", // New plan added from the document [cite: 2]
        price: "₦15,000", // (once) [cite: 3]
        duration: "never expires",
        description: "A tribute that lasts forever with a one-time payment",
        features: [
            "1 tribute that never expires",
            "Unlimited media + all features",
            "Donation collection enabled",
            "Guestbook, privacy, RSVP, music",
            "Custom user roles",
        ],
    },
]

const corporatePlan = {
    title: "Community / Corporate Plan", // Matches the document's 'Community/Corporate plan'
    price: "Custom Pricing",
    description: "For organizations managing multiple memorials with a custom domain and features ",
    features: [
        "Unlimited memorial pages (implied)",
        "White-label option (implied)",
        "API access (implied)",
        "Priority support (implied)",
        "Analytics dashboard (implied)",
        "Custom Domain ",
    ],
}

// Features are based on the comparison table in the document
const comparisonFeatures = [
    {
        name: "Number of Tributes",
        free: "2 ",
        premium: "3 ",
        oneTime: "1 ",
        lifetime: "1 ",
        corporate: "Custom (Implied)",
    },
    {
        name: "Themes",
        free: "Free Themes ",
        premium: "Premium Themes ",
        oneTime: "Premium Themes ",
        lifetime: "Premium Themes ",
        corporate: "Custom (Implied)",
    },
    {
        name: "Photo Gallery",
        free: "Up to 20 photos ",
        premium: true, // Unlimited
        oneTime: true, // Unlimited
        lifetime: true, // Unlimited
        corporate: true,
    },
    {
        name: "Videos",
        free: "Up to 3 videos ",
        premium: true, // Unlimited
        oneTime: true, // Unlimited
        lifetime: true, // Unlimited
        corporate: true,
    },
    {
        name: "Audio Uploads",
        free: true, // ✅
        premium: true, // Unlimited
        oneTime: true, // Unlimited
        lifetime: true, // Unlimited
        corporate: true,
    },
    {
        name: "Basic Customisation",
        free: true,
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Share Memories",
        free: true,
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Event Posts",
        free: "Up to 3 events ",
        premium: true, // Unlimited
        oneTime: true, // Unlimited
        lifetime: true, // Unlimited
        corporate: true,
    },
    {
        name: "Visitor Guestbook",
        free: true,
        premium: "Managed ",
        oneTime: "Managed ",
        lifetime: "Managed ",
        corporate: true,
    },
    {
        name: "Timeline of Events",
        free: true,
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Family Members",
        free: true,
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Milestones",
        free: true,
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Donation Collection",
        free: false, // ❌
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "RSVPs for Events",
        free: false, // ❌
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Technical Support",
        free: false, // ❌
        premium: "Priority ",
        oneTime: true, // ✅
        lifetime: "Priority ",
        corporate: true,
    },
    {
        name: "Privacy Controls",
        free: false, // ❌
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Background Music",
        free: false, // ❌
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Custom User Roles",
        free: false, // ❌
        premium: true,
        oneTime: true,
        lifetime: true,
        corporate: true,
    },
    {
        name: "Tribute Duration",
        free: "N/A", // Not explicitly stated as permanent, so N/A is safest
        premium: "Monthly subscription ",
        oneTime: "30 days only ",
        lifetime: "Never Expires ",
        corporate: "Custom (Implied)",
    },
    {
        name: "Custom Domain",
        free: false, // ❌
        premium: false, // ❌
        oneTime: false, // ❌
        lifetime: false, // ❌
        corporate: true,
    },
]

export default function PricingPage() {
    // Removed billingPeriod state and logic as the document's plans don't use it
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                <HeroSection />
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
                <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-tight">Choose Your Plan</h1>
                <p className="text-2xl md:text-3xl text-gray-200 font-light mb-8">
                    Select the perfect plan to Honour and remember your loved ones.
                </p>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0 transform translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
                    <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>
        </section>
    )
}

function PricingSection() {
    // Removed billingPeriod state and toggle
    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="container px-6 mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-medium tracking-wide text-gray-900">Our Pricing Plans</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Flexible options to meet your needs</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-8 md:grid-cols-4"> {/* Changed to grid-cols-4 for the 4 standard plans */}
                    {plans.map((plan) => (
                        <PricingCard key={plan.title} plan={plan} />
                    ))}
                </div>

                {/* Corporate Plan Section */}
                <div className="mt-16 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-8 md:col-span-1 bg-gray-50">
                            <h3 className="text-2xl font-medium text-gray-900 mb-2">{corporatePlan.title}</h3>
                            <div className="text-4xl font-bold text-gray-900 mb-4">{corporatePlan.price}</div>
                            <p className="text-gray-600 mb-6">{corporatePlan.description}</p>
                            <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-black" size="lg">
                                <Link to="/contact-sales">Contact Sales</Link>
                            </Button>
                        </div>
                        <div className="p-8 md:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {corporatePlan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckIcon className="h-5 w-5 text-yellow-400 mr-3" />
                                        <span className="text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Simplified PricingCard to remove billingPeriod logic
function PricingCard({ plan }) {
    const isOneTimeOrLifetime = plan.title === "One-Time Plan" || plan.title === "Lifetime Plan"
    const isMonthly = plan.title === "Premium Plan"

    const billingLabel = isMonthly ? "/monthly" : (isOneTimeOrLifetime ? " (one-time)" : "")
    const durationLabel = plan.duration ? ` - ${plan.duration}` : ""

    return (
        <Card className={`border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            plan.popular
                ? "bg-white relative before:absolute before:top-0 before:right-0 before:-translate-y-1/2 before:content-['Popular'] before:bg-yellow-400 before:text-white before:py-1 before:px-4 before:rounded-full before:text-sm"
                : "bg-white"
        }`}>
            <CardContent className="p-8">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium text-gray-900 mb-2">{plan.title}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                        {plan.price}
                        <span className="text-base font-normal text-gray-500 ml-1">
              {billingLabel}{durationLabel}
            </span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button
                    className={`w-full ${
                        plan.popular
                            ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                            : "bg-white border border-yellow-400 text-yellow-500 hover:bg-yellow-50"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                >
                    <Link to="/signup">{plan.title === "Free Plan" ? "Start for Free" : "Get Started"}</Link>
                </Button>
            </CardContent>
        </Card>
    )
}

function ComparisonSection() {
    return (
        <section id="comparison" className="py-20 bg-gray-50">
            <div className="container px-6 mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-medium tracking-wide text-gray-900">Feature Comparison</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Compare our plans to find the right fit for your needs.</p>
                </div>
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="w-full table-auto border-collapse bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left text-gray-800 font-medium">Feature</th>
                            {/* Updated table headers to match document plans */}
                            <th className="p-4 text-center text-gray-800 font-medium">Free Plan</th>
                            <th className="p-4 text-center text-gray-800 font-medium bg-yellow-50">Premium Plan</th>
                            <th className="p-4 text-center text-gray-800 font-medium">One-Time Plan</th>
                            <th className="p-4 text-center text-gray-800 font-medium">Lifetime Plan</th>
                            <th className="p-4 text-center text-gray-800 font-medium">Community/Corporate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comparisonFeatures.map((feature, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="p-4 border-t border-gray-200 text-gray-700">{feature.name}</td>
                                {/* Free Plan */}
                                <td className="p-4 border-t border-gray-200 text-center text-gray-700">
                                    {typeof feature.free === "boolean" ? (
                                        feature.free ? <CheckIcon className="h-5 w-5 text-yellow-400 mx-auto" /> : <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                    ) : feature.free}
                                </td>
                                {/* Premium Plan */}
                                <td className="p-4 border-t border-gray-200 text-center text-gray-700 bg-yellow-50">
                                    {typeof feature.premium === "boolean" ? (
                                        feature.premium ? <CheckIcon className="h-5 w-5 text-yellow-400 mx-auto" /> : <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                    ) : feature.premium}
                                </td>
                                {/* One-Time Plan */}
                                <td className="p-4 border-t border-gray-200 text-center text-gray-700">
                                    {typeof feature.oneTime === "boolean" ? (
                                        feature.oneTime ? <CheckIcon className="h-5 w-5 text-yellow-400 mx-auto" /> : <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                    ) : feature.oneTime}
                                </td>
                                {/* Lifetime Plan (New Column) */}
                                <td className="p-4 border-t border-gray-200 text-center text-gray-700">
                                    {typeof feature.lifetime === "boolean" ? (
                                        feature.lifetime ? <CheckIcon className="h-5 w-5 text-yellow-400 mx-auto" /> : <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                    ) : feature.lifetime}
                                </td>
                                {/* Community/Corporate Plan */}
                                <td className="p-4 border-t border-gray-200 text-center text-gray-700">
                                    {typeof feature.corporate === "boolean" ? (
                                        feature.corporate ? <CheckIcon className="h-5 w-5 text-yellow-400 mx-auto" /> : <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
                                    ) : feature.corporate}
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
        <section className="py-20 bg-gray-900 text-white">
            <div className="container px-6 mx-auto max-w-4xl text-center">
                <h2 className="text-4xl font-serif font-medium tracking-wide mb-6">Ready to Create a Lasting Memorial?</h2>
                <p className="mb-8 text-xl text-gray-300">Choose a plan today and begin your journey of remembrance.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8" asChild>
                        <Link to="/signup">Get Started</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}