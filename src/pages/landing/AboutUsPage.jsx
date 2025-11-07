"use client"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import {
    Heart,
    Users,
    BookOpen,
    ArrowRight,
    Image as ImageIcon,
} from "lucide-react"
import { Link } from "react-router-dom";

export default function AboutUsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <HeroSection />

                {/* Founder's Story */}
                <FounderStorySection />

                {/* Our Mission */}
                <MissionSection />

                {/* Why We Exist */}
                <WhyWeExistSection />

                {/* Call to Action */}
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
                <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-tight">About Remembered Always</h1>
                <p className="text-2xl md:text-3xl text-gray-200 font-light mb-8">
                    Honouring Lives, Celebrating Legacies
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

function FounderStorySection() {
    return (
        <section className="py-20 bg-white">
            <div className="container max-w-5xl mx-auto px-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-gray-100 p-8 flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-200">
                                <ImageIcon className="w-full h-full text-gray-300 bg-gray-200 p-4" />
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8 md:p-12">
                            <h2 className="text-2xl font-medium text-gray-900 mb-6">Our Founder's Story</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                A few years ago, I lost my father—a man whose quiet strength, endless sacrifices, and boundless love shaped every part of my life.
                                As grief settled in, I found myself clinging to fragments of his memory: photos, books, and shared moments. But I wanted more.
                                I wanted a space where his legacy could live on, where future generations could meet the man who gave me life.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Then in 2021, a close friend asked me to create a tribute for her mother, who had touched countless lives.
                                We built a beautiful page filled with testimonials from family and friends. When she saw it, she wept.
                                “I finally feel like she’s still here,” she said. That moment changed everything.
                            </p>
                            <p className="text-gray-600 leading-relaxed font-medium italic">
                                So, we created Remembered Always—a platform where love, sacrifice, and the magic of human lives are preserved forever.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function MissionSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex p-3 bg-yellow-100 rounded-full mb-4">
                        <Heart className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-gray-900">Our Mission</h2>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        We believe every life is a story worth telling. Whether it's a father who taught resilience through silence, a mother whose laughter filled a room,
                        or a friend whose kindness changed your path—their essence shouldn’t fade with time.
                    </p>
                </div>

                <div className="mb-16">
                    <p className="text-xl text-gray-600 leading-relaxed mb-10 text-center">
                        Remembered Always is more than a tribute site. It's a living archive:
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Share Stories",
                                description: "Upload photos, videos, letters, and voice notes.",
                                icon: <BookOpen className="h-8 w-8 text-yellow-500" />,
                            },
                            {
                                title: "Celebrate Together",
                                description: "Host virtual or in-person memorial events with RSVPs and live updates.",
                                icon: <Users className="h-8 w-8 text-yellow-500" />,
                            },
                            {
                                title: "Inspire Others",
                                description: "Let strangers discover recipes, wartime letters, or wisdom passed down.",
                                icon: <Heart className="h-8 w-8 text-yellow-500" />,
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex justify-center mb-4">{item.icon}</div>
                                <h3 className="text-xl font-medium mb-3 text-gray-900">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function WhyWeExistSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-gray-900">Why We Exist</h2>
                </div>

                <div className="bg-gray-50 rounded-lg shadow-md p-8 mb-12 border border-gray-100">
                    <ul className="space-y-6">
                        {[
                            "For the daughter who wishes to explain why Grandpa's hands were always tough.",
                            "For the friend who wishes the world remembered their loved one's quirky laugh, not just their illness.",
                            "For the communities left stronger because someone's light still guides them.",
                        ].map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-yellow-500 mr-4 text-xl">•</span>
                                <p className="text-gray-700">{item}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 text-center">
                        <p className="text-xl italic text-yellow-600">Here, grief becomes gratitude. Loss becomes legacy.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

function CallToActionSection() {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="container max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-8">Join Us</h2>
                <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12">
                    Create a tribute today. Let's ensure the people who shaped us are never reduced to a memory—but remain a force that inspires, comforts, and connects us all.
                </p>
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8 rounded-full">
                    <Link href="/signup">Create a Tribute</Link> <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="mt-16 pt-8 border-t border-gray-700">
                    <p className="text-lg text-gray-400 italic">
                        In loving memory of my father, Emmanuel, and every unsung hero whose story deserves to be told.
                    </p>
                </div>
            </div>
        </section>
    )
}