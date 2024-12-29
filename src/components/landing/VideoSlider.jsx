import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import video1 from "../../assets/Landing/Videos/5383080_Coll_wavebreak_Family_1280x720.mp4";
import video2 from "../../assets/Landing/Videos/5341119_Coll_wavebreak_Home_1280x720.mp4";
import video3 from "../../assets/Landing/Videos/4924507_Memory_Photo_1280x720.mp4";

const videos = [video1, video2, video3]

export function VideoSlider() {
    const [currentVideo, setCurrentVideo] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentVideo(prev => (prev + 1) % videos.length)
        }, 8000)
        return () => clearInterval(timer)
    }, [])

    let timer = null // Declare timer variable here

    const handlePrevious = () => {
        setCurrentVideo(prev => (prev - 1 + videos.length) % videos.length)
        // Reset the timer when manually changing slides
        clearInterval(timer)
        timer = setInterval(() => {
            setCurrentVideo(prev => (prev + 1) % videos.length)
        }, 8000)
    }

    const handleNext = () => {
        setCurrentVideo(prev => (prev + 1) % videos.length)
        // Reset the timer when manually changing slides
        clearInterval(timer)
        timer = setInterval(() => {
            setCurrentVideo(prev => (prev + 1) % videos.length)
        }, 8000)
    }

    return (
        <div className="relative h-full w-full overflow-hidden">
            {videos.map((video, index) => (
                <div
                    key={video}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentVideo ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                    >
                        <source src={video} type="video/mp4" />
                    </video>
                </div>
            ))}
            <div className="absolute inset-0 bg-black/50" />
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handlePrevious}
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handleNext}
            >
                <ChevronRight className="h-8 w-8" />
            </Button>
        </div>
    )
}
