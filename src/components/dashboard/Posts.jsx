import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Share2 } from "lucide-react"

export function Post({ name, time, content, likes }) {
    return (
        <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
                <Avatar>
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                    <span className="font-medium">{name}</span>
                    <span className="text-sm text-gray-500">{time}</span>
                </div>
            </div>

            <p className="text-gray-600 mb-4">{content}</p>

            {likes !== undefined && (
                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                        <Heart size={20} />
                        <span>{likes}</span>
                    </button>
                    <button className="text-gray-600 hover:text-blue-500">
                        <Share2 size={20} />
                        <span className="sr-only">Share</span>
                    </button>
                </div>
            )}
        </div>
    )
}
