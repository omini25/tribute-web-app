import { Card, CardContent } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"

export function PostInput() {
    return (
        <Card className="bg-white shadow-sm mb-6">
            <CardContent className="p-4">
                <Input
                    placeholder="Write a Post..."
                    className="border-none bg-transparent text-gray-500 placeholder:text-blue-400 focus-visible:ring-0"
                />
            </CardContent>
        </Card>
    )
}
