import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card"

export function TributeCard({ variant = "solid", onClick }) {
    if (variant === "dashed") {
        return (
            <Link to="/dashboard/create-tribute"> {/* Wrap in Link */}
                <Card
                    className="w-64 h-64 border-2 border-dashed border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                >
                    <span className="text-blue-500 font-medium">CREATE TRIBUTE</span>
                </Card>
            </Link>
        )
    }

    return (
        <Card className="w-64 h-64 flex items-center justify-center bg-blue-50">
            <span className="text-blue-900 font-medium">TRIBUTE</span>
        </Card>
    )
}
