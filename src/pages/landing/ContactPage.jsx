"use client"
import { useState } from "react"
import Header from "@/components/landing/Header"
import {Footer} from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Mail,
    Phone,
    Clock,
    MessageSquare,
    Send,
    CheckCircle,
    ArrowRight,
    Users,
    Heart,
    Star,
} from "lucide-react"

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
                <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-tight">Get in Touch</h1>
                <p className="text-2xl md:text-3xl text-gray-200 font-light mb-8">
                    We're here to help. Whether you have questions about our services or want to share your thoughts, feel free to reach out.
                </p>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0 transform translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f8f4f0">
                    <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>
        </section>
    )
}

export default function ContactUsPage() {
    const [formStatus, setFormStatus] = useState("initial")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        setFormStatus("submitting")

        // Simulate form submission
        setTimeout(() => {
            setFormStatus("success")
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f4f0]">
            <Header />
            <main className="flex-1">
                <HeroSection />

                {/* Contact Form & Options */}
                <section className="py-20">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-10">
                            {/* Contact Info Cards */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-serif mb-6 text-gray-900">Contact Information</h2>

                                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                    <CardContent className="p-6 flex items-start space-x-4">
                                        <Mail className="w-6 h-6 text-yellow-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Email Us</h3>
                                            <p className="text-gray-600">support@rememberedalways.org</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                    <CardContent className="p-6 flex items-start space-x-4">
                                        <Phone className="w-6 h-6 text-yellow-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Call Us</h3>
                                            <p className="text-gray-600">+234 123 456 7890</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                    <CardContent className="p-6 flex items-start space-x-4">
                                        <Clock className="w-6 h-6 text-yellow-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Working Hours</h3>
                                            <p className="text-gray-600">Mon - Fri: 8 AM - 6 PM<br />Sat - Sun: Closed</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Form + Chat Option */}
                            <div className="md:col-span-2">
                                <Tabs defaultValue="message" className="w-full">
                                    <TabsList className="inline-flex p-1 bg-gray-100 rounded-full mb-8">
                                        <TabsTrigger
                                            value="message"
                                            className="px-5 py-2 text-sm font-medium rounded-full transition-colors data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
                                        >
                                            <MessageSquare className="mr-2 h-4 w-4" /> Send a Message
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="chat"
                                            className="px-5 py-2 text-sm font-medium rounded-full transition-colors data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
                                        >
                                            <Users className="mr-2 h-4 w-4" /> Live Chat
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="message" className="mt-0">
                                        {formStatus === "success" ? (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mx-auto mb-8 animate-pulse">
                                                    <CheckCircle className="h-10 w-10 text-white" />
                                                </div>
                                                <h3 className="text-3xl font-semibold mb-4 text-gray-900">Message Sent Successfully!</h3>
                                                <p className="text-lg text-gray-600 leading-relaxed">
                                                    Thank you for reaching out to us. Our team will review your message and get back to you within 24 hours.
                                                </p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <Input
                                                        placeholder="Your Name"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, name: e.target.value })
                                                        }
                                                        className="py-6 text-base border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                                                    />
                                                    <Input
                                                        type="email"
                                                        placeholder="Your Email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, email: e.target.value })
                                                        }
                                                        className="py-6 text-base border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                                                    />
                                                </div>
                                                <Input
                                                    placeholder="Subject"
                                                    required
                                                    value={formData.subject}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, subject: e.target.value })
                                                    }
                                                    className="py-6 text-base border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                                                />
                                                <Textarea
                                                    rows={6}
                                                    placeholder="Your Message..."
                                                    required
                                                    value={formData.message}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, message: e.target.value })
                                                    }
                                                    className="py-4 text-base border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20 resize-none"
                                                />
                                                <Button
                                                    type="submit"
                                                    className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                                                    disabled={formStatus === "submitting"}
                                                >
                                                    {formStatus === "submitting" ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Send Message <Send className="ml-2 h-5 w-5" />
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="chat" className="mt-0">
                                        <Card className="border-none shadow-md bg-white">
                                            <CardContent className="p-8">
                                                <div className="text-center mb-6">
                                                    <Heart className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Live Chat Support</h3>
                                                    <p className="text-gray-600">
                                                        Talk to a support agent in real-time during working hours.
                                                    </p>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <Card className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gray-50">
                                                        <CardContent className="p-6 text-center">
                                                            <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center mx-auto mb-4">
                                                                <Star className="h-6 w-6" />
                                                            </div>
                                                            <h4 className="text-lg font-medium text-gray-900 mb-2">Support Team</h4>
                                                            <p className="text-gray-600 mb-4">Available Mon-Fri, 8 AM – 6 PM.</p>
                                                            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                                                                Start Chat Now
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gray-50">
                                                        <CardContent className="p-6 text-center">
                                                            <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center mx-auto mb-4">
                                                                <Users className="h-6 w-6" />
                                                            </div>
                                                            <h4 className="text-lg font-medium text-gray-900 mb-2">Community Forum</h4>
                                                            <p className="text-gray-600 mb-4">Connect with others who've created tributes.</p>
                                                            <Button asChild variant="outline" className="w-full border-yellow-400 text-yellow-500 hover:bg-yellow-50">
                                                                <a href="/community">Join Community</a>
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ & CTA Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container max-w-5xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">Still Have Questions?</h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Explore our frequently asked questions or reach out directly for personalized assistance.
                        </p>
                        <Button size="lg" asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8 rounded-full">
                            <a href="/faq">View FAQs <ArrowRight className="ml-2 h-5 w-5" /></a>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}