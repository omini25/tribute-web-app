"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import video1 from "@/assets/Landing/Videos/4924507_Memory_Photo_1280x720.mp4"
import video2 from "@/assets/Landing/Videos/5383080_Coll_wavebreak_Family_1280x720.mp4"
import video3 from "@/assets/Landing/Videos/5341119_Coll_wavebreak_Home_1280x720.mp4"


export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Sample memorial images - replace with your actual images
    const memorialImages = [
        {
            src: video1,
            alt: "Memorial garden with flowers",
            caption: "A peaceful place to remember"
        },
        {
            src: video2,
            alt: "Sunset over memorial stones",
            caption: "As the sun sets, memories remain"
        },
        {
            src: video3,
            alt: "Candles lit in remembrance",
            caption: "Light that guides through darkness"
        },
    ]

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === memorialImages.length - 1 ? 0 : prev + 1))
    }, [memorialImages.length])

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === 0 ? memorialImages.length - 1 : prev - 1))
    }, [memorialImages.length])

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide()
        }, 6000)
        return () => clearInterval(interval)
    }, [nextSlide])

    return (
        <section className="relative min-h-screen bg-[#f5f0ea] overflow-hidden">
            {/* Animated cloud background - use multiple layers for parallax effect */}
            <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none mt-28">
                {/* Background cloud layer - slowest moving */}
                <div
                    className="absolute inset-0 bg-repeat-x animate-cloud-slow"
                    style={{
                        backgroundImage: "url('/images/cloud-bg-layer1.png')",
                        backgroundPosition: "0 80%",
                        backgroundSize: "1200px auto"
                    }}
                />

                {/* Middle cloud layer - medium speed */}
                <div
                    className="absolute inset-0 bg-repeat-x animate-cloud-medium"
                    style={{
                        backgroundImage: "url('/images/cloud-bg-layer2.png')",
                        backgroundPosition: "0 60%",
                        backgroundSize: "1000px auto",
                        opacity: 0.7
                    }}
                />

                {/* Foreground cloud layer - fastest moving */}
                <div
                    className="absolute inset-0 bg-repeat-x animate-cloud-fast"
                    style={{
                        backgroundImage: "url('/images/cloud-bg-layer3.png')",
                        backgroundPosition: "0 90%",
                        backgroundSize: "800px auto",
                        opacity: 0.5
                    }}
                />
            </div>

            {/* Image Slider */}
            <div className="absolute inset-0 z-0">
                {memorialImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <video
                            src={image.src || "/placeholder.mp4"}
                            alt={image.alt}
                            className="object-cover w-full h-full"
                            autoPlay
                            muted
                            loop
                            playsInline
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-[#f5f0ea]/60"></div>
                    </div>
                ))}
            </div>

            {/* Slider Controls */}
            <div className="absolute inset-x-0 top-1/2 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8 transform -translate-y-1/2">
                <Button
                    onClick={prevSlide}
                    size="icon"
                    variant="ghost"
                    className="bg-white/30 backdrop-blur-sm hover:bg-white/50 text-[#2a3342] rounded-full h-10 w-10 sm:h-12 sm:w-12"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Previous slide</span>
                </Button>
                <Button
                    onClick={nextSlide}
                    size="icon"
                    variant="ghost"
                    className="bg-white/30 backdrop-blur-sm hover:bg-white/50 text-[#2a3342] rounded-full h-10 w-10 sm:h-12 sm:w-12"
                >
                    <ChevronRight className="h-6 w-6" />
                    <span className="sr-only">Next slide</span>
                </Button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center gap-2">
                {memorialImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                            index === currentSlide
                                ? "bg-[#786f66] w-8"
                                : "bg-[#786f66]/40 hover:bg-[#786f66]/60"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-4xl mx-auto space-y-8 relative">
                    {/* Candle flame */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-40 h-40 flex items-center justify-center">
                            <div className="relative">
                                <div className="w-8 h-16 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full animate-pulse"></div>
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-10 bg-gradient-to-t from-amber-400 to-white rounded-full opacity-70 animate-flame"></div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-serif text-[#2a3342] tracking-wide drop-shadow-sm">
                        In Loving Memory
                    </h1>

                    <p className="text-lg md:text-xl text-[#2a3342] font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm bg-[#f5f0ea]/30 backdrop-blur-sm p-4 rounded-lg">
                        A beautiful online space where you can honor and celebrate the life
                        of your loved one. Share cherished memories, photos, and stories
                        that will preserve their legacy forever.
                    </p>

                    {/* Caption from current slide */}
                    {memorialImages[currentSlide]?.caption && (
                        <p className="text-lg md:text-xl text-[#2a3342] font-light italic drop-shadow-sm">
                            "{memorialImages[currentSlide].caption}"
                        </p>
                    )}

                    <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-[#786f66] hover:bg-[#645a52] text-white border-none font-medium px-8"
                        >
                            Create Memorial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="hidden sm:inline-flex border-[#786f66] text-[#786f66] hover:bg-[#f5f0ea]/70 hover:text-[#645a52] font-medium px-8 backdrop-blur-sm"
                        >
                            View Examples
                        </Button>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes cloud-move-slow {
                    0% {
                        background-position: 0% 80%;
                    }
                    100% {
                        background-position: 1200px 80%;
                    }
                }
                @keyframes cloud-move-medium {
                    0% {
                        background-position: 0% 60%;
                    }
                    100% {
                        background-position: 1000px 60%;
                    }
                }
                @keyframes cloud-move-fast {
                    0% {
                        background-position: 0% 90%;
                    }
                    100% {
                        background-position: 800px 90%;
                    }
                }
                @keyframes flame {
                    0%,
                    100% {
                        transform: translateX(-50%) scale(1);
                    }
                    50% {
                        transform: translateX(-50%) scale(1.1);
                    }
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
                .animate-flame {
                    animation: flame 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    )
}
