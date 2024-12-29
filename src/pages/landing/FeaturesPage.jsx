import { FeatureCard } from "@/components/FeatureCard.jsx"
import { Button } from "@/components/ui/button"
import {
    Heart,
    Users,
    Image,
    Calendar,
    Gift,
    Lock,
    Globe,
    Headphones
} from "lucide-react"
import {Footer} from "@/components/landing/Footer.jsx";
import Header from "@/components/landing/Header.jsx";

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
        icon: Image,
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

export default function FeaturesPage() {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-24 max-w-7xl mt-20">
                <h1 className="text-4xl font-bold text-center mb-4">Our Features</h1>
                <p className="text-xl text-center text-muted-foreground mb-12">
                    Discover the tools and features that make our memorial pages unique and
                    meaningful
                </p>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Create a Lasting Tribute?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join thousands of families who have created beautiful online memorials
                        with our platform.
                    </p>
                    <Button size="lg">Get Started</Button>
                </div>

                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div
                                className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                            <p className="text-muted-foreground">
                                Sign up for free and choose your memorial plan.
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Build Your Memorial</h3>
                            <p className="text-muted-foreground">
                                Add photos, stories, and details about your loved one's life.
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Share and Collaborate
                            </h3>
                            <p className="text-muted-foreground">
                                Invite others to view and contribute to the memorial.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
