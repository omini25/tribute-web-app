import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Star, Gift, BookOpen, Flame, ImageIcon, Shield, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer.jsx";
import { server } from "@/server";
import { assetServer } from "@/assetServer";
import Header from "@/components/landing/Header.jsx";
import memorialImage from "@/assets/Landing/images/a-realsitic-image-of-a-memorial-of-a-deceded-old-b(1).png";
import hero1 from "@/assets/landing/images/a-beautiful-nighttime-memorial-gathering-with-doze.png"

// Hero background image - this would be a high-quality image of a memorial scene
const heroBackground = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.4)), url(${hero1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
};

const features = [
    {
        icon: Heart,
        title: "Lasting Tribute",
        description: "Create a permanent online memorial to Honour your loved one."
    },
    {
        icon: Users,
        title: "Share with Family",
        description: "Invite family and friends to contribute memories and photos."
    },
    {
        icon: ImageIcon,
        title: "Photo Gallery",
        description: "Upload and share cherished photos in a beautiful gallery."
    },
    {
        icon: Shield,
        title: "Privacy Options",
        description: "Control who can view and contribute to the memorial."
    },
    {
        icon: Star,
        title: "Personalized Themes",
        description: "Choose from a variety of elegant themes to customize the memorial."
    },
    {
        icon: Clock,
        title: "Easy to Create",
        description: "Our intuitive tools make it simple to create a memorial in minutes."
    }
];

const steps = [
    {
        icon: Gift,
        title: "Create an Account",
        description: "Sign up for a free account to get started."
    },
    {
        icon: BookOpen,
        title: "Add Details",
        description: "Enter information about your loved one, including their name, dates, and a biography."
    },
    {
        icon: ImageIcon,
        title: "Upload Photos",
        description: "Add photos to create a visual tribute to their life and legacy."
    },
    {
        icon: Heart,
        title: "Share the Memorial",
        description: "Invite family and friends to view and contribute to the memorial."
    }
];

export default function HomePage() {
    // State to hold the featured memorials, initialized as an empty array
    const [featuredMemorials, setFeaturedMemorials] = useState([]);

    useEffect(() => {
        axios
            .get(`${server}/tributesing`)
            .then(response => {
                console.log("API Response Data:", response.data); // Good for debugging
                const formattedMemorials = response.data
                    .filter(tribute => tribute.is_public !== 0)
                    .map(tribute => {
                        // Construct the full name if needed, or use title
                        const memorialName = tribute.title || `${tribute.first_name || ''} ${tribute.last_name || ''}`.trim() || "In Loving Memory";

                        // Format years
                        const birthYear = tribute.date_of_birth ? new Date(tribute.date_of_birth).getFullYear() : null;
                        const deathYear = tribute.date_of_death ? new Date(tribute.date_of_death).getFullYear() : null;
                        let yearsString = "Life's Journey";
                        if (birthYear && deathYear) {
                            yearsString = `${birthYear} - ${deathYear}`;
                        } else if (birthYear) {
                            yearsString = `Born ${birthYear}`;
                        } else if (deathYear) {
                            yearsString = `Passed ${deathYear}`;
                        }

                        // Construct image URL
                        const imageUrl = tribute.image
                            ? `${assetServer}/images/people/${tribute.image}`
                            : "/placeholder.svg?height=400&width=300";

                        // Construct memorial URL
                        const memorialUrl = `/${tribute.theme}/${tribute.id}/${encodeURIComponent(tribute.title || 'tribute')}`;

                        return {
                            id: tribute.id,
                            name: memorialName,
                            years: yearsString,
                            image: imageUrl,
                            url: memorialUrl,
                        };
                    });
                setFeaturedMemorials(formattedMemorials.slice(0, 3));
            })
            .catch(error => {
                console.error("Error fetching featured memorials:", error);
                setFeaturedMemorials([]);
            });
    }, []);

    const testimonials = [
        {
            id: 1,
            name: "Sarah J.",
            avatar: "/placeholder.svg?height=50&width=50",
            rating: 5,
            text: "Creating a memorial for my father brought our family together. The process was simple and the result was beautiful. Thank you for this wonderful service.",
        },
        {
            id: 2,
            name: "Michael R.",
            avatar: "/placeholder.svg?height=50&width=50",
            rating: 5,
            text: "I was worried about creating an online memorial, but it was so easy to use. The support team was incredibly helpful and responsive to all my questions.",
        },
        {
            id: 3,
            name: "Jennifer L.",
            avatar: "/placeholder.svg?height=50&width=50",
            rating: 5,
            text: "What a lovely tribute to my mother. Friends and family from around the world have been able to share memories and photos. It's been a healing experience for all of us.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8f4f0]">
            <Header />

            {/* Hero Section with Background Image */}
            <section
                className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-24 text-center"
                style={heroBackground}
            >
                <div className="max-w-4xl mx-auto z-10">
                    <div className="inline-block p-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                        <Flame className="h-12 w-12 text-[#fcd34d]" />
                    </div>
                    <h1 className="font-serif text-5xl font-medium tracking-tight text-white md:text-6xl lg:text-7xl">
                        Honour Their Memory Forever
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-white/90 text-lg md:text-xl">
                        Create beautiful online memorials to celebrate the lives of your loved ones and preserve their legacy
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
                        <Button
                            asChild
                            className="bg-[#fcd34d] hover:bg-[#e09a39] text-white px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                        >
                            <Link to="/signup">Create a Memorial</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="border-white text-white hover:bg-white/20 px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                        >
                            <Link to="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f8f4f0">
                        <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Highlight */}
            <section className="relative py-20 bg-[#f8f4f0]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="bg-[#fcd34d]/20 text-[#e09a39] px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                            OUR FEATURES
                        </span>
                        <h2 className="font-serif text-3xl font-medium text-[#2a3342] md:text-4xl lg:text-5xl">
                            Everything You Need to Honour Their Memory
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] text-lg leading-relaxed">
                            Our platform provides all the tools you need to create a lasting tribute that celebrates their life.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.slice(0, 3).map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>

                    {features.length > 3 && (
                        <div className="mt-16 text-center">
                            <Button
                                asChild
                                variant="outline"
                                className="border-[#fcd34d] text-[#fcd34d] hover:bg-[#fcd34d] hover:text-white px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                            >
                                <Link to="/features">View All Features</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Preserve Memories Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <span className="bg-[#fcd34d]/20 text-[#e09a39] px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                                WHY CHOOSE US
                            </span>
                            <h2 className="font-serif text-3xl font-medium text-[#2a3342] md:text-4xl lg:text-5xl">
                                Preserve Memories for Generations
                            </h2>
                            <p className="mt-6 text-[#4a5568] text-lg leading-relaxed">
                                Every Memorial is unique & beautiful, digitally preserved to safeguard the life of your loved one. Create
                                a lasting tribute that Honours their memory and helps family members to grieve.
                            </p>
                            <div className="mt-8">
                                <ul className="space-y-6">
                                    {[
                                        {
                                            icon: Heart,
                                            title: "Share photos, videos & stories",
                                            description: "Upload unlimited photos and videos to preserve precious memories."
                                        },
                                        {
                                            icon: Users,
                                            title: "Invite family & friends",
                                            description: "Allow loved ones to contribute their own memories and messages."
                                        },
                                        {
                                            icon: Gift,
                                            title: "Support causes they loved",
                                            description: "Collect donations for charities and causes they cared about."
                                        }
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="bg-[#fcd34d]/20 p-2 rounded-full mr-4 mt-1 flex-shrink-0">
                                                <item.icon className="h-5 w-5 text-[#fcd34d]" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#2a3342] text-lg">{item.title}</h4>
                                                <p className="text-[#4a5568] mt-1">{item.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    asChild
                                    className="mt-8 bg-[#fcd34d] hover:bg-[#e09a39] text-white px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                                >
                                    <Link to="/features">Explore All Features</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 order-1 lg:order-2">
                            <div className="relative max-w-md mx-auto">
                                {/* Card stack effect */}
                                <div className="absolute -right-4 -bottom-4 w-full h-full rounded-2xl bg-[#fcd34d]/20"></div>
                                <div className="absolute -right-2 -bottom-2 w-full h-full rounded-2xl bg-[#fcd34d]/30"></div>
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src={memorialImage}
                                        alt="Memorial example with candles"
                                        className="object-cover w-full h-auto aspect-square"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                        <p className="font-serif text-2xl">In Loving Memory</p>
                                        <p className="text-lg mt-1">Henry Williams • 1935-2023</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="hidden lg:block absolute -left-24 -bottom-24 w-64 h-64 rounded-full bg-[#fcd34d]/10 z-0"></div>
                <div className="hidden lg:block absolute right-12 top-12 w-32 h-32 rounded-full bg-[#fcd34d]/10 z-0"></div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-[#f8f4f0]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="bg-[#fcd34d]/20 text-[#e09a39] px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                            HOW IT WORKS
                        </span>
                        <h2 className="font-serif text-3xl font-medium text-[#2a3342] md:text-4xl lg:text-5xl">
                            Create a Memorial in 4 Easy Steps
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] text-lg leading-relaxed">
                            Our simple process guides you through creating a beautiful and meaningful memorial
                        </p>
                    </div>

                    <div className="relative max-w-6xl mx-auto">
                        {/* Progress line (visible on desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-[#fcd34d]/30 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <StepCard key={index} step={index + 1} {...step} />
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Button
                            asChild
                            className="bg-[#fcd34d] hover:bg-[#e09a39] text-white px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                        >
                            <Link to="/signup">Get Started Now</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Memorials Section */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="bg-[#fcd34d]/20 text-[#e09a39] px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                            FEATURED MEMORIALS
                        </span>
                        <h2 className="font-serif text-3xl font-medium text-[#2a3342] md:text-4xl lg:text-5xl">
                            Celebrating Lives Well Lived
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] text-lg leading-relaxed">
                            Every life has a story worth sharing and remembering
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {featuredMemorials.length > 0 ? (
                            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {featuredMemorials.map((memorial) => (
                                    <Link
                                        key={memorial.id}
                                        to={memorial.url}
                                        className="group block overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative h-72 w-full overflow-hidden">
                                            <img
                                                src={memorial.image}
                                                alt={memorial.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <h3 className="text-2xl font-serif font-medium">{memorial.name}</h3>
                                                <p className="text-white/80 mt-1">{memorial.years}</p>
                                                <span className="inline-flex items-center mt-4 text-[#fcd34d] font-medium">
                                                    Visit Memorial <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center py-16">
                                <div className="text-center">
                                    <Clock className="h-16 w-16 text-[#fcd34d]/50 mx-auto mb-4" />
                                    <p className="text-xl text-[#4a5568]">
                                        Loading featured memorials...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 text-center">
                        <Button
                            asChild
                            variant="outline"
                            className="border-[#fcd34d] text-[#fcd34d] hover:bg-[#fcd34d] hover:text-white px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                        >
                            <Link to="/memorials">Browse All Memorials</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-[#f0ece6] py-24 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="hidden lg:block absolute -right-24 -top-24 w-64 h-64 rounded-full bg-[#fcd34d]/10 z-0"></div>
                <div className="hidden lg:block absolute left-12 bottom-12 w-32 h-32 rounded-full bg-[#fcd34d]/10 z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="bg-[#fcd34d]/20 text-[#e09a39] px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                            TESTIMONIALS
                        </span>
                        <h2 className="font-serif text-3xl font-medium text-[#2a3342] md:text-4xl lg:text-5xl">
                            What Families Say
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-[#4a5568] text-lg leading-relaxed">
                            Hear from those who have created memorials for their loved ones
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} {...testimonial} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Support a Cause Section */}
            <section className="bg-white py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#fcd34d]/20 to-[#fcd34d]/5 rounded-3xl p-12 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#fcd34d]/20 z-0"></div>
                        <div className="absolute left-12 top-12 w-32 h-32 rounded-full bg-[#fcd34d]/20 z-0"></div>

                        <div className="relative z-10">
                            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-[#fcd34d]/20 mb-6">
                                <Heart className="h-10 w-10 text-[#fcd34d]" />
                            </div>
                            <h2 className="font-serif text-3xl font-medium text-[#2a3342] md:text-4xl">
                                Support a Cause They Loved
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-[#4a5568] text-lg leading-relaxed">
                                Honour your loved one by supporting a charity or cause that was important to them
                            </p>
                            <Button
                                asChild
                                className="mt-8 bg-[#fcd34d] hover:bg-[#e09a39] text-white px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                            >
                                <Link to="/memorials">View a Cause </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a3342] to-[#2a3342]/80 z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-serif text-3xl font-medium text-white md:text-4xl lg:text-5xl">
                            Create a Lasting Tribute Today
                        </h2>
                        <p className="mx-auto mt-6 max-w-2xl text-white/80 text-lg md:text-xl leading-relaxed">
                            Begin your journey to create a beautiful memorial that preserves
                            the memory of your loved one for generations to come
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
                            <Button
                                asChild
                                className="bg-[#fcd34d] hover:bg-[#e09a39] text-white px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                            >
                                <Link to="/signup">Create a Memorial</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="border-white text-white hover:bg-white/20 px-8 py-3 text-lg font-medium min-w-[200px] h-12"
                            >
                                <Link to="/pricing">See Pricing Plans</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white group hover:translate-y-[-5px] h-full">
            <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="bg-[#fcd34d]/20 p-4 rounded-full mb-6 group-hover:bg-[#fcd34d]/30 transition-colors">
                    <Icon className="h-8 w-8 text-[#fcd34d]" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#2a3342] font-serif">{title}</h3>
                <p className="text-[#4a5568] flex-grow">{description}</p>
            </CardContent>
        </Card>
    );
}

function StepCard({ icon: Icon, title, description, step }) {
    return (
        <div className="relative">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-8 flex flex-col items-center text-center relative z-10 h-full">
                <div className="bg-[#fcd34d] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg absolute -top-5 left-1/2 transform -translate-x-1/2">
                    {step}
                </div>
                <div className="bg-[#fcd34d]/20 p-4 rounded-full mb-6 mt-4">
                    <Icon className="h-8 w-8 text-[#fcd34d]" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#2a3342]">
                    {title}
                </h3>
                <p className="text-[#4a5568] flex-grow">{description}</p>
            </div>
        </div>
    );
}

function TestimonialCard({ name, avatar, rating, text }) {
    return (
        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden h-full">
            <CardContent className="p-0 h-full flex flex-col">
                <div className="bg-[#fcd34d]/10 px-6 py-4 flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full border-2 border-white flex-shrink-0">
                        <img
                            src={avatar}
                            alt={name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-medium text-[#2a3342]">{name}</p>
                        <div className="flex">
                            {[...Array(rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-[#fcd34d] text-[#fcd34d]" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 flex-grow">
                    <p className="italic text-[#4a5568] leading-relaxed">"{text}"</p>
                </div>
            </CardContent>
        </Card>
    );
}