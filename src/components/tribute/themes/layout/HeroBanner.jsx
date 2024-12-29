import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Heart, Printer } from "lucide-react"

export function HeroBanner({
                               name,
                               dates,
                               profileImage,
                               bannerImage,
                               theme = "classic"
                           }) {
    const [isFollowing, setIsFollowing] = useState(false)

    return (
        <div className="relative h-[50vh] min-h-[400px] w-full">
            {/* Banner Image */}
            <div className="absolute inset-0">
                <img
                    src={bannerImage}
                    alt="Memorial Banner"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="container relative h-full mx-auto px-4">
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button variant="ghost" size="sm" className="text-white">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>

                <div className="absolute bottom-[-64px] left-4 flex items-end">
                    <div className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden">
                        <img
                            src={profileImage}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="ml-4 mb-4">
                        <h1 className="text-3xl font-bold text-white">{name}</h1>
                        <p className="text-white/90">{dates}</p>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4">
                    <Button
                        variant={isFollowing ? "secondary" : "default"}
                        onClick={() => setIsFollowing(!isFollowing)}
                        className="mr-2"
                    >
                        <Heart
                            className={`h-4 w-4 mr-2 ${isFollowing ? "fill-current" : ""}`}
                        />
                        {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="secondary">Leave a tribute</Button>
                </div>
            </div>
        </div>
    )
}
