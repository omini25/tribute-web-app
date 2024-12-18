import { useState, useRef, useEffect } from "react";
import video1 from "../../assets/Landing/Videos/5383080_Coll_wavebreak_Family_1280x720.mp4";
import video2 from "../../assets/Landing/Videos/5341119_Coll_wavebreak_Home_1280x720.mp4";
import video3 from "../../assets/Landing/Videos/4924507_Memory_Photo_1280x720.mp4";

export default function Hero() {
    const videoRefs = useRef([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videos = [video1, video2, video3];

    useEffect(() => {
        const currentVideo = videoRefs.current[currentVideoIndex];

        const handleVideoEnd = () => {
            currentVideo.classList.add("fade-out");
            setTimeout(() => {
                currentVideo.classList.remove("fade-out");
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
            }, 500); // Adjust for your transition duration
        };

        if (currentVideo) {
            currentVideo.play();
            currentVideo.addEventListener("ended", handleVideoEnd);
        }

        return () => {
            if (currentVideo) {
                currentVideo.removeEventListener("ended", handleVideoEnd);
            }
        };
    }, [currentVideoIndex, videos]);

    return (
        <div className="bg-white">
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    {videos.map((videoSrc, index) => (
                        <video
                            key={index}
                            ref={(el) => (videoRefs.current[index] = el)}
                            muted
                            playsInline
                            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${
                                index === currentVideoIndex ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ))}
                    <div className="absolute inset-0 bg-black opacity-30" />
                    {/* Overlay */}
                </div>

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
                            Celebrate an amazing life
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-gray-100 sm:text-xl/8">
                            Preserve and share memories of your loved one
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </a>
                            <a href="#" className="text-sm/6 font-semibold text-gray-100">
                                Learn more <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
