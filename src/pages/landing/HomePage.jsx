import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoSlider } from "@/components/landing/VideoSlider";
import { Heart, Users, ImageIcon, Shield, Star, Clock, Gift, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { server } from "@/server";
import { assetServer } from "@/assetServer";

const features = [
    {
        icon: Heart,
        title: "Personalized Tributes",
        description: "Create beautiful, customized memorial pages that truly reflect their life and legacy.",
    },
    {
        icon: Users,
        title: "Collaborative Memories",
        description: "Invite family and friends to share their own stories, photos, and memories.",
    },
    {
        icon: ImageIcon,
        title: "Unlimited Media",
        description: "Upload unlimited photos and videos to create a rich visual history.",
    },
    {
        icon: Shield,
        title: "Private & Secure",
        description: "Control who can view and contribute to the memorial with advanced privacy settings.",
    },
    {
        icon: Star,
        title: "Premium Features",
        description: "Access advanced features like virtual ceremonies and memory books.",
    },
    {
        icon: Gift,
        title: "Donations Acceptance",
        description: "Accept donations for a cause, for the family, or towards the memorial.",
    },
];

const testimonials = [
    {
        name: "Sarah Johnson",
        year: "2023",
        content: "Creating a memorial helped our family come together and share our memories. It's become a precious space for us to remember and celebrate...",
    },
    {
        name: "Michael Brown",
        year: "2022",
        content: "The process was so easy and the result was beautiful. It's comforting to have a place where we can visit and remember our loved one anytime.",
    },
    {
        name: "Emily Davis",
        year: "2023",
        content: "I was hesitant at first, but creating this online memorial has been incredibly healing. It's a wonderful way to keep memories alive.",
    },
];

const steps = [
    {
        icon: BookOpen,
        title: "Step 1: Create a Memorial",
        description: "Start by setting up a memorial page with basic details about your loved one.",
    },
    {
        icon: ImageIcon,
        title: "Step 2: Add Memories",
        description: "Upload photos, videos, and stories to create a rich tribute.",
    },
    {
        icon: Users,
        title: "Step 3: Invite Loved Ones",
        description: "Invite family and friends to contribute their own memories and messages.",
    },
    {
        icon: Clock,
        title: "Step 4: Preserve Forever",
        description: "Your memorial will remain online forever, accessible to those you choose.",
    },
];

export default function HomePage() {
    const [memorials, setMemorials] = useState([]);

    useEffect(() => {
        axios
            .get(`${server}/tributesing`)
            .then((response) => {
                setMemorials(response.data);
            })
            .catch((error) => {
                console.error("Error fetching memorials:", error);
            });
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <FeaturedMemorialsSection memorials={memorials} />
                <TestimonialsSection />
                <DonationSection />
                <CallToActionSection />
            </main>
            <Footer />
        </div>
    );
}

function HeroSection() {
    return (
        <section className="relative h-screen">
            <VideoSlider />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto space-y-6 text-center text-white">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                            Preserve Their Legacy Forever
                        </h1>
                        <p className="text-lg text-gray-200 md:text-xl lg:text-2xl">
                            Create beautiful online memorials to celebrate and remember your loved ones. Share memories, photos, and stories with family and friends.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                                Create Memorial
                            </Button>
                            <a href="#featured-memorials">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                                    View Examples
                                </Button>
                            </a>
                            {/*<Link to="/tribute">*/}
                            {/*    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">*/}
                            {/*        View Examples*/}
                            {/*    </Button>*/}
                            {/*</Link>*/}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section id="features" className="bg-gray-50 py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Everything You Need to Honor Their Memory
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-lg lg:text-xl">
                        Our platform provides all the tools you need to create a lasting tribute.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-500">{description}</p>
            </CardContent>
        </Card>
    );
}

function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-white py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        How It Works
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-lg lg:text-xl">
                        Creating a memorial is simple and meaningful. Follow these steps to get started.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StepCard({ icon: Icon, title, description }) {
    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-500">{description}</p>
            </CardContent>
        </Card>
    );
}

function FeaturedMemorialsSection({ memorials }) {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Featured Memorials
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-lg lg:text-xl">
                        Explore some of our beautiful memorial pages.
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {memorials.map((memorial) => (
                        <MemorialCard key={memorial.id} memorial={memorial} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function MemorialCard({ memorial }) {
    return (
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
                src={`${assetServer}/images/people/${memorial.image}` || "/placeholder.svg"}
                alt={`${memorial.first_name} ${memorial.last_name}`}
                width={400}
                height={300}
                className="h-48 w-full object-cover"
            />
            <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                    {memorial.first_name} {memorial.last_name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    {new Date(memorial.date_of_birth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(memorial.date_of_death).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-3">{memorial.quote}</p>
                <Link
                    to={
                        memorial.theme === "Warm"
                            ? `/theme-warm/${memorial.id}/${memorial.title}`
                            : "#"
                    }
                >
                    <Button className="w-full" variant="outline">
                        View Memorial
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

function TestimonialsSection() {
    return (
        <section id="testimonials" className="bg-white py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        What Families Say
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-lg lg:text-xl">
                        Hear from families who have created memorials with us.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ name, year, content }) {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <img
                        src="/placeholder.svg"
                        alt={name}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-gray-500">Created memorial in {year}</p>
                    </div>
                </div>
                <p className="text-gray-600 italic">"{content}"</p>
            </CardContent>
        </Card>
    );
}

function DonationSection() {
    return (
        <section id="donation" className="bg-gray-50 py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Support a Cause
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-lg lg:text-xl">
                        Accept donations for a cause, for the family, or towards the memorial.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                        Donate Now
                    </Button>
                </div>
            </div>
        </section>
    );
}

function CallToActionSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-primary text-white">
            <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                        Ready to Create a Lasting Tribute?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl">
                        Join thousands of families who have created beautiful online memorials.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                            Create Memorial
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}