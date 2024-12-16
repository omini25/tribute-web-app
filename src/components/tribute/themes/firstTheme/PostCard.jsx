import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx"
import { Card, CardContent } from "@/components/ui/card.jsx"

export function PostCard({ name, time, content }) {
    return (
        <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8 bg-blue-500">
                        <AvatarFallback className="text-white">
                            {name
                                .split(" ")
                                .map(n => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{name}</span>
                        <span className="text-sm text-gray-500">{time}</span>
                    </div>
                </div>
                <p className="text-blue-500">{content}</p>
            </CardContent>
        </Card>
    )
}
