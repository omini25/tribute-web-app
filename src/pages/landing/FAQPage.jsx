"use client"
import { useState, useMemo } from "react"
import Header from "@/components/landing/Header"
import {Footer} from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Search,
    Mail,
    Phone,
    Heart,
    HelpCircle,
    Sparkles,
    Shield,
    Settings,
    Users,
    CreditCard,
} from "lucide-react"

// FAQ Data
const faqData = {
    about: [
        {
            question: "What is Remembered Always?",
            answer:
                "Remembered Always is an internet platform that allows people to make beautiful memorial pages to remember their loved ones. Share images, films, and memories, plan memorial activities, collect money, and connect with others—all in one safe and courteous environment.",
            icon: Heart,
        },
        {
            question: "Who can use Remembered Always?",
            answer:
                "Everyone! Whether you're celebrating a family member, friend, coworker, or community leader, our platform is intended for you, families, churches, non-governmental organisations, and corporations.",
            icon: Users,
        },
        {
            question: "Is Remembered Always free?",
            answer:
                "Yes! Begin with our Free Plan to build a simple tribute page with photographs and text. Upgrade to our Premium or Community/Corporate Plans to access enhanced tools such as event planning and donations.",
            icon: Sparkles,
        },
    ],
    plans: [
        {
            question: "What plans do you offer?",
            answer: `• Free Plan: Basic tribute page with up to 10 photos and text.\n• Premium Plan (₦5,000/month): Add events, RSVPs, video uploads, donation links, and unlimited gallery space.\n• Community/Corporate Plan (Custom Pricing): Perfect for churches, NGOs, or businesses needing multiple tributes, bulk event management, and donation tracking.`,
            icon: CreditCard,
        },
        {
            question: "How do I upgrade my plan?",
            answer:
                "Go to Account Settings > Upgrade Plan, select your plan, and complete the purchase. Upgrades will take effect immediately!",
            icon: Sparkles,
        },
        {
            question: "What payment methods do you accept?",
            answer: `We accept:\n• Debit and credit cards (Visa, MasterCard).\n• Bank transfers in Naira only.\n• Mobile wallets (Opay, Paga, PalmPay).`,
            icon: CreditCard,
        },
    ],
    features: [
        {
            question: "Can I host a memorial event on Remembered Always?",
            answer:
                "Yes! The platform allows users to create events, send email or SMS invitations, monitor RSVPs, and share real-time updates.",
            icon: Settings,
        },
        {
            question: "How do donations work?",
            answer:
                "Upgrade to premium plan to enable this feature. Funds are transferred directly to designed account for a tribute or a verified Nigerian charity.",
            icon: Heart,
        },
        {
            question: "What types of files can I upload?",
            answer: `• Photos (JPEG, PNG).\n• Videos (MP4, MOV, up to 10 minutes).\n• Audio recordings (MP3, e.g., voice notes or hymns).`,
            icon: Settings,
        },
        {
            question: "How many tribute pages can I create?",
            answer: `• Free Plan: 1 tribute.\n• Premium/Corporate Plans: Unlimited tributes.`,
            icon: Users,
        },
    ],
    privacy: [
        {
            question: "Can I make my tribute page private?",
            answer: "Yes! Choose between Public (accessible to everyone) and Private (viewable only by invited guests).",
            icon: Shield,
        },
        {
            question: "Can I edit my tribute after publishing?",
            answer: "Definitely! You can update photos, events, or articles at any time, even after you've shared the page.",
            icon: Settings,
        },
        {
            question: "How do I delete a tribute?",
            answer: "Go to Account Settings > Manage Tributes > Delete. Note: Deletion is permanent and cannot be undone.",
            icon: Settings,
        },
        {
            question: "Is my data safe?",
            answer: `We prioritise your privacy.\n• We adhere to Nigeria's Data Protection Regulation (NDPR).\n• No third-party data sharing.`,
            icon: Shield,
        },
    ],
    support: [
        {
            question: "How do I reach customer support?",
            answer: `• Email: support@rememberedalways.org\n• Live Chat: Click the 💬 icon on our website.\n• Phone: +234 123 456 7890 (Lagos office, Mon-Fri, 8 AM – 6 PM).`,
            icon: HelpCircle,
        },
        {
            question: "Do you offer refunds?",
            answer:
                "Yes! Request a full refund within 3 days of purchasing a paid plan, provided no services have been used.",
            icon: CreditCard,
        },
        {
            question: "How can I share feedback?",
            answer:
                "We value your feedback! Submit thoughts using our Feedback Form or tag us on social media (@RememberedAlwaysNG).",
            icon: HelpCircle,
        },
    ],
}

// Category Metadata
const categoryMeta = {
    about: { title: "About", color: "from-blue-500 to-blue-600" },
    plans: { title: "Plans & Pricing", color: "from-green-500 to-green-600" },
    features: { title: "Features", color: "from-purple-500 to-purple-600" },
    privacy: { title: "Privacy & Security", color: "from-orange-500 to-orange-600" },
    support: { title: "Support", color: "from-red-500 to-red-600" },
}

// Flatten all FAQs
const allFaqs = Object.entries(faqData).flatMap(([category, faqs]) =>
    faqs.map((faq) => ({ ...faq, category }))
)

function HeroSection({ searchQuery, setSearchQuery }) {
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
                <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-tight">Frequently Asked Questions</h1>
                <p className="text-2xl md:text-3xl text-gray-200 font-light mb-8">
                    Find answers to common questions about Remembered Always and how we help you Honour your loved ones.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto group">
                    <Input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-10 py-6 text-lg text-gray-900 bg-white/90 border-none rounded-full shadow-md focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
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

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    // Filtered FAQs
    const filteredFaqs = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase()
        if (!normalizedQuery) return allFaqs
        return allFaqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(normalizedQuery) ||
                faq.answer.toLowerCase().includes(normalizedQuery)
        )
    }, [searchQuery])

    // Display based on tab
    const displayFaqs =
        activeTab === "all" ? filteredFaqs : filteredFaqs.filter((faq) => faq.category === activeTab)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* FAQ Content */}
                <section className="py-20 bg-white">
                    <div className="container max-w-6xl mx-auto px-6">
                        {/* Tabs */}
                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-6 gap-2 mb-10 bg-gray-100 p-1 rounded-full">
                                <TabsTrigger
                                    value="all"
                                    className="px-4 py-2 text-sm font-medium rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
                                >
                                    All
                                </TabsTrigger>
                                <TabsTrigger
                                    value="about"
                                    className="px-4 py-2 text-sm font-medium rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                >
                                    About
                                </TabsTrigger>
                                <TabsTrigger
                                    value="plans"
                                    className="px-4 py-2 text-sm font-medium rounded-full data-[state=active]:bg-green-500 data-[state=active]:text-white"
                                >
                                    Plans
                                </TabsTrigger>
                                <TabsTrigger
                                    value="features"
                                    className="px-4 py-2 text-sm font-medium rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                                >
                                    Features
                                </TabsTrigger>
                                <TabsTrigger
                                    value="privacy"
                                    className="px-4 py-2 text-sm font-medium rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                                >
                                    Privacy
                                </TabsTrigger>
                                <TabsTrigger
                                    value="support"
                                    className="px-4 py-2 text-sm font-medium rounded-full data-[state=active]:bg-red-500 data-[state=active]:text-white"
                                >
                                    Support
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Search Results Count */}
                        {searchQuery.trim() !== "" && (
                            <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                                Found{" "}
                                <span className="font-semibold">{displayFaqs.length}</span> result
                                {displayFaqs.length !== 1 ? "s" : ""}
                                &nbsp;for "{searchQuery}"
                            </div>
                        )}

                        {/* No Results Message */}
                        {displayFaqs.length === 0 && (
                            <div className="text-center py-16">
                                <Search className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-medium text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-500 mb-6">Try different keywords or browse by category.</p>
                                <Button variant="outline" onClick={() => setSearchQuery("")}>
                                    Clear Search
                                </Button>
                            </div>
                        )}

                        {/* FAQ Accordions */}
                        {displayFaqs.length > 0 && (
                            <div className="space-y-6">
                                {activeTab === "all" &&
                                    Object.entries(categoryMeta).map(([categoryKey, meta]) => {
                                        const categoryFaqs = filteredFaqs.filter((faq) => faq.category === categoryKey)
                                        if (categoryFaqs.length === 0) return null
                                        return (
                                            <div key={categoryKey}>
                                                <h2 className={`text-xl font-medium mb-4 text-${meta.color.split(" ")[0].replace("from-", "")}`}>
                                                    {meta.title}
                                                </h2>
                                                {categoryFaqs.map((faq, index) => (
                                                    <FAQAccordion key={`${categoryKey}-${index}`} faq={faq} />
                                                ))}
                                            </div>
                                        )
                                    })}

                                {activeTab !== "all" &&
                                    displayFaqs.map((faq, index) => (
                                        <FAQAccordion key={`${activeTab}-${index}`} faq={faq} />
                                    ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Need Help Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container max-w-5xl mx-auto px-6 text-center">
                        <h2 className="text-4xl font-serif mb-6">Still Need Help?</h2>
                        <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
                            Our support team is ready to assist you every step of the way.
                        </p>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <Mail className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />
                                <h3 className="text-xl font-medium mb-2">Email Support</h3>
                                <p className="text-gray-600 mb-4">Send us a message anytime and we'll respond within 24 hours.</p>
                                <a href="mailto:support@rememberedalways.org" className="text-yellow-500 hover:underline">
                                    support@rememberedalways.org
                                </a>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <Phone className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />
                                <h3 className="text-xl font-medium mb-2">Phone Support</h3>
                                <p className="text-gray-600 mb-4">Available Monday to Friday, 8 AM – 6 PM (Lagos time).</p>
                                <a href="tel:+2341234567890" className="text-yellow-500 hover:underline">
                                    +234 123 456 7890
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

function FAQAccordion({ faq }) {
    const IconComponent = faq.icon
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={faq.question} className="border border-gray-200 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                            <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-gray-900">{faq.question}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 whitespace-pre-line">{faq.answer}</AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}