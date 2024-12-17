import { Card } from "@/components/ui/card"

export function TributeCard({ variant = "solid", onClick }) {
    if (variant === "dashed") {
        return (
            <Card
                className="w-64 h-64 border-2 border-dashed border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={onClick}
            >
                <span className="text-blue-500 font-medium">CREATE TRIBUTE</span>
            </Card>
        )
    }

    return (
        <Card className="w-64 h-64 flex items-center justify-center bg-blue-50">
            <span className="text-blue-900 font-medium">TRIBUTE</span>
        </Card>
    )
}
