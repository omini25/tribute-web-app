"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { ContactForm } from "@/components/ContactForm"
import { ContactInfo } from "@/components/ContactInfo"

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">
                {/*<HeroSection />*/}
                <ContactSection />
                <MapSection />
                <FAQSection />
            </main>
            <Footer />
            <Toaster />
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
                        Contact Us
                    </h1>

                    <p className="text-lg md:text-xl text-[#4a5568] font-light max-w-2xl mx-auto leading-relaxed">
                        We're here to help. Reach out to us with any questions or concerns.
                    </p>
                </div>
            </div>
        </section>
    )
}

function ContactSection() {
    return (
        <section id="contact" className="bg-[#f8f4f0] py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Get In Touch
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Our team is ready to assist you with any questions about our memorial services.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-medium mb-6 text-[#2a3342]">Send Us a Message</h3>
                            <ContactForm />
                        </CardContent>
                    </Card>
                    <div className="space-y-6">
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-medium mb-6 text-[#2a3342]">Contact Information</h3>
                                <ContactInfo />
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-medium mb-6 text-[#2a3342]">Office Hours</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <Clock className="h-5 w-5 text-[#786f66] mt-1" />
                                        <div>
                                            <p className="font-medium text-[#2a3342]">Monday - Friday</p>
                                            <p className="text-[#4a5568]">9:00 AM - 6:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <Clock className="h-5 w-5 text-[#786f66] mt-1" />
                                        <div>
                                            <p className="font-medium text-[#2a3342]">Saturday</p>
                                            <p className="text-[#4a5568]">10:00 AM - 4:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <Clock className="h-5 w-5 text-[#786f66] mt-1" />
                                        <div>
                                            <p className="font-medium text-[#2a3342]">Sunday</p>
                                            <p className="text-[#4a5568]">Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

function MapSection() {
    return (
        <section className="bg-white py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl text-[#2a3342]">
                        Find Us
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] md:text-lg">
                        Visit our office for a personal consultation
                    </p>
                </div>
                <div className="bg-[#f8f4f0] rounded-lg overflow-hidden shadow-md h-[400px]">
                    {/* Replace with actual map implementation */}
                    <div className="w-full h-full flex items-center justify-center bg-[#f0ece6]">
                        <div className="text-center">
                            <MapPin className="h-12 w-12 text-[#786f66] mx-auto mb-4" />
                            <p className="text-[#2a3342] font-medium">123 Memorial Avenue, Suite 101</p>
                            <p className="text-[#4a5568]">New York, NY 10001</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function FAQSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-[#2a3342] text-white">
            <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl md:text-5xl mb-6">
                        Frequently Asked Questions
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                        Can't find the answer you're looking for? Reach out to our support team.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="bg-white/10 backdrop-blur border-none shadow-md">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-medium mb-3 text-white">How quickly can I create a memorial?</h3>
                            <p className="text-white/80">
                                You can create a basic memorial in just a few minutes. Adding more content and customization may take longer, but our platform is designed to be intuitive and easy to use.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/10 backdrop-blur border-none shadow-md">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-medium mb-3 text-white">Can family members contribute to the memorial?</h3>
                            <p className="text-white/80">
                                Yes, you can invite family and friends to contribute stories, photos, and memories to create a more complete memorial experience.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/10 backdrop-blur border-none shadow-md">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-medium mb-3 text-white">How secure is the information I share?</h3>
                            <p className="text-white/80">
                                We take privacy and security seriously. You have full control over who can view and contribute to your memorial through our advanced privacy settings.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/10 backdrop-blur border-none shadow-md">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-medium mb-3 text-white">Can I upgrade my plan later?</h3>
                            <p className="text-white/80">
                                Yes, you can upgrade your plan at any time to access additional features and capabilities as your needs change.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="text-center mt-12">
                    <Button
                        size="lg"
                        className="bg-white text-[#2a3342] hover:bg-gray-100 px-8"
                    >
                        Contact Support
                    </Button>
                </div>
            </div>
        </section>
    )
}