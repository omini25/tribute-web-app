// C:/Users/david/Documents/Github/tribute-web-app/src/pages/landing/TributesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added more Card components
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer.jsx";
import Header from "@/components/landing/Header.jsx";
import { Loader2, AlertTriangle, SearchX } from 'lucide-react'; // Icons for loading/error states
import {server} from "@/server.js";
import { assetServer } from "@/assetServer.js";


// New Component to display individual memorials
function MemorialCard({ name, years, image, url }) {
    return (
        <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <Link to={url} className="block group">
                <div className="aspect-[3/4] overflow-hidden">
                    <img
                        src={image}
                        alt={`Memorial for ${name}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <CardHeader className="p-4">
                    <CardTitle className="text-lg font-serif text-[#2a3342] group-hover:text-[#e09a39] transition-colors">
                        {name}
                    </CardTitle>
                    <CardDescription className="text-sm text-[#4a5568]">{years}</CardDescription>
                </CardHeader>
            </Link>
            <CardFooter className="p-4 mt-auto">
                <Button asChild variant="outline" className="w-full border-[#e09a39] text-[#e09a39] hover:bg-[#e09a39]/10">
                    <Link to={url}>View Memorial</Link>
                </Button>
            </CardFooter>
        </Card>
    );
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
                <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-tight">Public Memorials</h1>
                <p className="text-2xl md:text-3xl text-gray-200 font-light mb-8">
                    Browse through the beautiful tributes created by our community to Honour and remember loved ones.
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

export default function TributesPage() {
    const [memorials, setMemorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        axios
            .get(`${server}/tributesing`) // Assuming 'tributesing' is the correct endpoint
            .then(response => {
                const formattedMemorials = response.data
                    .filter(tribute => tribute.is_public !== 0) // Show only public tributes
                    .map(tribute => {
                        const memorialName = tribute.title || `${tribute.first_name || ''} ${tribute.last_name || ''}`.trim() || "In Loving Memory";

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

                        const imageUrl = tribute.image
                            ? `${assetServer}/images/people/${tribute.image}`
                            : "/placeholder.svg?height=400&width=300&text=In+Memory"; // Placeholder image

                        const firstName = (tribute.first_name || '').toLowerCase();
                        const lastName = (tribute.last_name || '').toLowerCase();
                        const slug = [firstName, lastName].filter(Boolean).join('-');
                        const memorialUrl = slug ? `/tribute/${slug}` : `/tribute/${tribute.id}`;

                        return {
                            id: tribute.id,
                            name: memorialName,
                            years: yearsString,
                            image: imageUrl,
                            url: memorialUrl,
                        };
                    });
                setMemorials(formattedMemorials);
            })
            .catch(err => {
                console.error("Error fetching memorials:", err);
                setError("Failed to load memorials. Please try again later.");
                setMemorials([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f4f0]">
            <Header />

            <HeroSection />

            {/* Memorials Grid Section */}
            <section className="py-16 sm:py-20 bg-[#f8f4f0]">
                <div className="container mx-auto px-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <Loader2 className="h-12 w-12 animate-spin text-[#e09a39] mb-4" />
                            <p className="text-lg text-[#4a5568]">Loading Memorials...</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex flex-col items-center justify-center text-center py-10 bg-red-50 p-6 rounded-lg border border-red-200">
                            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                            <p className="text-lg text-red-700 font-semibold">An Error Occurred</p>
                            <p className="text-md text-red-600">{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && memorials.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <SearchX className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-xl text-[#4a5568] font-semibold">No Public Memorials Found</p>
                            <p className="text-md text-gray-500 mt-2">
                                There are currently no public memorials to display.
                                <br />
                                Why not be the first to <Link to="/signup" className="text-[#e09a39] hover:underline">create one</Link>?
                            </p>
                        </div>
                    )}
                    {!isLoading && !error && memorials.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {memorials.map((memorial) => (
                                <MemorialCard key={memorial.id} {...memorial} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action Section (can be kept or modified) */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a3342] to-[#2a3342]/80 z-0"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-serif text-4xl font-medium text-white md:text-5xl">
                            Ready to Create a Lasting Tribute?
                        </h2>
                        <p className="mx-auto mt-6 max-w-2xl text-white/80 md:text-xl">
                            Join our community and start preserving the precious memories of your loved one today.
                        </p>
                        <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4">
                            <Button asChild className="bg-[#fcd34d] hover:bg-[#e09a39] text-white px-8 py-6 text-lg w-full md:w-auto">
                                <Link to="/signup">Create a Memorial</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg w-full md:w-auto"
                            >
                                <Link to="/pricing">View Pricing</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}