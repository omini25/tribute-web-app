import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoSlider } from "@/components/landing/VideoSlider.jsx";
import { Heart, Users, ImageIcon, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/landing/Header.jsx";
import { Footer } from "@/components/landing/Footer.jsx";
import { server } from "@/server.js";
import { assetServer} from "@/assetServer.js";

export default function HomePage() {
    const [memorials, setMemorials] = useState([]);

    useEffect(() => {
        axios.get(`${server}/tributesing`)
            .then(response => {
                setMemorials(response.data);
            })
            .catch(error => {
                console.error("Error fetching memorials:", error);
            });
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-x-hidden">
                <section className="relative h-screen">
                    <VideoSlider />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="container px-4 md:px-6">
                            <div className="max-w-2xl space-y-4 text-center text-white">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                    Preserve Their Legacy Forever
                                </h1>
                                <p className="mx-auto max-w-[700px] text-lg text-gray-200 md:text-xl">
                                    Create beautiful online memorials to celebrate and remember
                                    your loved ones. Share memories, photos, and stories with
                                    family and friends.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                                        Create Memorial
                                    </Button>
                                    <Link to="/tribute">
                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                                            View Examples
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="bg-gray-50 py-24 ">
                    <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Everything You Need to Honor Their Memory
                            </h2>
                            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-lg">
                                Our platform provides all the tools you need to create a lasting tribute
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                { icon: Heart, title: "Personalized Tributes", description: "Create beautiful, customized memorial pages that truly reflect their life and legacy." },
                                { icon: Users, title: "Collaborative Memories", description: "Invite family and friends to share their own stories, photos, and memories." },
                                { icon: ImageIcon, title: "Unlimited Media", description: "Upload unlimited photos and videos to create a rich visual history." },
                                { icon: Shield, title: "Private & Secure", description: "Control who can view and contribute to the memorial with advanced privacy settings." },
                                { icon: Star, title: "Premium Features", description: "Access advanced features like virtual ceremonies and memory books." }
                            ].map(feature => (
                                <Card key={feature.title} className="border-none">
                                    <CardContent className="pt-6">
                                        <feature.icon className="h-12 w-12 text-primary" />
                                        <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                                        <p className="mt-2 text-gray-500">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Featured Memorials
                            </h2>
                            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-lg">
                                Explore some of our beautiful memorial pages
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {memorials.map(memorial => (
                                <Card key={memorial.id} className="overflow-hidden">
                                    <img
                                        src={`${assetServer}/images/people/${memorial.image}` || "/placeholder.svg"}
                                        alt={`Featured Memorial ${memorial.id}`}
                                        width={400}
                                        height={300}
                                        className="h-48 w-full object-cover"
                                    />
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold">{memorial.first_name} {memorial.last_name}</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            {new Date(memorial.date_of_death).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} -
                                            {new Date(memorial.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="mt-4 text-gray-600">{memorial.quote}</p>
                                        <Link to={memorial.theme === 'Warm' ? `/theme-warm/${memorial.id}/${memorial.title}` : '#'}>
                                            <Button className="mt-4" variant="outline">
                                                View Memorial
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="bg-gray-50 py-24">
                    <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                What Families Say
                            </h2>
                            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-lg">
                                Hear from families who have created memorials with us
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(i => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src="/placeholder.svg"
                                                alt={`Testimonial ${i}`}
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <p className="font-semibold">Sarah Johnson</p>
                                                <p className="text-sm text-gray-500">
                                                    Created memorial in 2023
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-gray-600">
                                            &quot;Creating a memorial helped our family come together and share our memories. It&apos;s become a precious space for us to remember and celebrate...&quot;
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden py-24">
                    <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Ready to Create a Lasting Tribute?
                            </h2>
                            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-lg">
                                Join thousands of families who have created beautiful online memorials
                            </p>
                            <div className="mt-8 flex justify-center space-x-4">
                                <Button size="lg">Create Memorial</Button>
                                <Button size="lg" variant="outline">Learn More</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}