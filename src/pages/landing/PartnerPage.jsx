"use client"
import { useState } from "react"
import Header from "@/components/landing/Header"
import {Footer} from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Heart,
    Users,
    Lightbulb,
    Handshake,
    Globe,
    Shield,
    Settings,
    CheckCircle,
    Mail,
    Phone,
    ArrowRight,
} from "lucide-react"

export default function PartnerPage() {
    const [activeTab, setActiveTab] = useState("vision")

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-b from-[#2a3342] to-[#3a4454] text-white py-24 overflow-hidden">
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

                    {/* Floating icons */}
                    {/*<div className="absolute inset-0 overflow-hidden pointer-events-none">*/}
                    {/*    <Heart className="absolute top-1/4 left-1/4 w-6 h-6 text-yellow-300 animate-pulse" />*/}
                    {/*    <Users className="absolute bottom-1/4 right-1/4 w-8 h-8 text-yellow-300 animate-pulse delay-1000" />*/}
                    {/*</div>*/}

                    <div className="container max-w-5xl mx-auto px-6 relative z-10 text-center">
                        <h1 className="text-5xl md:text-6xl font-serif mb-6 tracking-tight">Partner With Us</h1>
                        <p className="text-2xl md:text-3xl text-white/90 mb-8">
                            Together, We Keep Legacies Alive
                        </p>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                            At Remembered Always, we believe honouring lives is a shared journey. Together, we turn sadness into grace and memories into action.
                        </p>
                    </div>

                    {/* Wave Divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f8f4f0">
                            <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                        </svg>
                    </div>
                </section>

                {/* Why Partner Section */}
                <section className="py-20 bg-white">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="max-w-3xl mx-auto mb-16 text-center">
                            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">Why Partner With Us?</h2>
                            <p className="text-lg text-gray-600">
                                Every life leaves ripples—in families, communities, and beyond. By joining forces, we amplify those ripples into waves of connection, healing, and hope. Partnering with us means:
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Heart className="h-8 w-8 text-yellow-500" />,
                                    text: "Empowering people to celebrate lives with dignity and creativity.",
                                },
                                {
                                    icon: <Users className="h-8 w-8 text-yellow-500" />,
                                    text: "Transforming how societies remember, moving beyond silence to shared storytelling.",
                                },
                                {
                                    icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
                                    text: "Building tools that bridge traditions and technology, past and future.",
                                },
                            ].map((item, index) => (
                                <Card key={index} className="border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-8">
                                        <div className="mb-4">{item.icon}</div>
                                        <p className="text-lg text-gray-700">{item.text}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision and How We Work Tabs */}
                <section className="py-20 bg-gray-50">
                    <div className="container max-w-6xl mx-auto px-6">
                        <Tabs defaultValue="vision" onValueChange={setActiveTab}>
                            <div className="flex justify-center mb-12">
                                <TabsList className="inline-flex p-1 bg-white rounded-full shadow-sm">
                                    <TabsTrigger
                                        value="vision"
                                        className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                                            activeTab === "vision"
                                                ? "bg-yellow-400 text-white"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        Our Vision
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="how"
                                        className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                                            activeTab === "how"
                                                ? "bg-yellow-400 text-white"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        How We Work
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="vision" className="mt-0">
                                <div className="max-w-3xl mx-auto text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">Our Vision for Collaboration</h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        We partner with organizations of all kinds—businesses, nonprofits, innovators, and changemakers—who share our belief that no legacy should fade uncelebrated. Together, we can:
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                    {[
                                        "Co-create solutions for communities navigating loss.",
                                        "Design inclusive programs that honour cultural, spiritual, and personal traditions.",
                                        "Pioneer resources that turn grief into a catalyst for connection.",
                                    ].map((item, index) => (
                                        <div key={index} className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 mx-auto rounded-full bg-yellow-400 text-white flex items-center justify-center mb-4 font-semibold">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-700">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="how" className="mt-0">
                                <div className="max-w-3xl mx-auto text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">How We Work with Partners</h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Our partnership approach is built on mutual respect, shared goals, and flexible collaboration models.
                                    </p>
                                </div>
                                <div className="max-w-4xl mx-auto">
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {[
                                            {
                                                title: "Shared Values",
                                                icon: <Handshake className="h-10 w-10 text-yellow-500 mb-4" />,
                                                desc: "Align with our mission to preserve legacies with compassion and innovation.",
                                            },
                                            {
                                                title: "Flexible Models",
                                                icon: <Settings className="h-10 w-10 text-yellow-500 mb-4" />,
                                                desc: "Collaborate through sponsorships, co-branded initiatives, technology integrations, or community outreach.",
                                            },
                                            {
                                                title: "Mutual Growth",
                                                icon: <Globe className="h-10 w-10 text-yellow-500 mb-4" />,
                                                desc: "Gain visibility while making a tangible difference in how the world remembers.",
                                            },
                                        ].map((item, index) => (
                                            <div key={index} className="text-center">
                                                <div className="flex justify-center">{item.icon}</div>
                                                <h3 className="text-xl font-medium mb-2 text-gray-900">{item.title}</h3>
                                                <p className="text-gray-600">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-white">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">Benefits of Partnership</h2>
                            <p className="text-lg text-gray-600">
                                Join us and experience the many advantages of being part of our mission.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
                            {[
                                {
                                    title: "Impact at Scale",
                                    icon: <Globe className="h-6 w-6 text-yellow-500" />,
                                    desc: "Reach millions seeking meaningful ways to Honour loved ones.",
                                },
                                {
                                    title: "Innovation",
                                    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
                                    desc: "Access a platform redefining memorialization in the digital age.",
                                },
                                {
                                    title: "Trust",
                                    icon: <Shield className="h-6 w-6 text-yellow-500" />,
                                    desc: "Align with a brand trusted by families, communities, and thought leaders.",
                                },
                                {
                                    title: "Custom Solutions",
                                    icon: <Settings className="h-6 w-6 text-yellow-500" />,
                                    desc: "Tailor partnerships to your goals—whether social impact, CSR, or product integration.",
                                },
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="mt-1">{benefit.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-medium mb-2 text-gray-900">{benefit.title}</h3>
                                        <p className="text-gray-600">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Join a Movement */}
                <section className="py-20 bg-gray-50">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">Join a Movement</h2>
                            <p className="text-xl italic mb-8 text-yellow-600">“Alone, we grieve. Together, we heal.”</p>
                            <p className="text-lg text-gray-600 mb-8">
                                Your expertise, resources, or vision can help us:
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <ul className="space-y-6">
                                {[
                                    "Provide free tributes to underserved communities.",
                                    "Develop AI tools to preserve voices and stories.",
                                    "Host global campaigns that celebrate unsung heroes.",
                                    "And much more—let's dream bigger.",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
                                        <p className="text-lg text-gray-700">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Start Collaborating */}
                <section className="py-20 bg-gray-900 text-white">
                    <div className="container max-w-5xl mx-auto px-6">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-serif mb-6">Start Collaborating</h2>
                            <p className="text-lg text-white/80 mb-8">
                                Take the first step toward a meaningful partnership.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
                            {[
                                {
                                    title: "Connect Directly",
                                    icon: <Mail className="h-10 w-10 mb-4 text-white" />,
                                    desc: "Email us at partners@rememberedalways.org",
                                    action: (
                                        <Button asChild size="lg" className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black">
                                            <a href="mailto:partners@rememberedalways.org">
                                                Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                                            </a>
                                        </Button>
                                    ),
                                },
                            ].map((item, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-8 text-center flex flex-col items-center">
                                    {item.icon}
                                    <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                                    <p className="text-white/80 mb-4">{item.desc}</p>
                                    {item.action}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What Partners Say - Placeholder */}
                <section className="py-20 bg-white">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">What Partners Say</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Hear from organizations that have partnered with us.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[1, 2, 3].map((_, index) => (
                                <Card key={index} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                                        <img
                                            src="/placeholder.svg?height=160&width=320"
                                            alt="Partner logo"
                                            width={160}
                                            height={80}
                                            className="object-contain"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <p className="italic text-gray-600 mb-4">
                                            “Partnering with Remembered Always has been transformative for our community outreach efforts.”
                                        </p>
                                        <div className="flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900">Partner Name</p>
                                                <p className="text-sm text-gray-500">Organization</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 bg-gray-50">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900">
                                Let's Rewrite the Story of Grief — Together
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Ready to make a difference? Reach out to our partnership team today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
                                <a
                                    href="mailto:support@rememberedalways.org"
                                    className="flex items-center text-yellow-500 hover:text-yellow-600 transition-colors"
                                >
                                    <Mail className="mr-2 h-5 w-5" /> support@rememberedalways.org
                                </a>
                                <a
                                    href="tel:+2348000000000"
                                    className="flex items-center text-yellow-500 hover:text-yellow-600 transition-colors"
                                >
                                    <Phone className="mr-2 h-5 w-5" /> +234 80 xxxxxxxxx
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}