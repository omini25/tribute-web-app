import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"
import { Link } from "react-router-dom"

export default function FamilyTreeForm() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="space-y-2 mb-16">
                <h1 className="text-4xl font-medium text-gray-600">TRIBUTE TITLE</h1>
                <h2 className="text-2xl text-gray-500">FAMILY TREE OF JOHN DOE</h2>
            </div>

            <div className="grid grid-cols-3 gap-8 place-items-center mb-16">
                {/* Parent Position */}
                <div className="col-start-2">
                    <button className="w-48 h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                        ADD FAMILY
                    </button>
                </div>

                {/* Left Sibling/Spouse Position */}
                <div className="col-start-1 row-start-2">
                    <button className="w-48 h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                        ADD FAMILY
                    </button>
                </div>

                {/* Center Profile */}
                <Card className="w-48 h-32 bg-blue-100 col-start-2 row-start-2">
                    <div className="h-full flex flex-col items-center justify-center space-y-2">
                        <User className="w-8 h-8 text-blue-500" />
                        <span className="font-medium text-blue-700">JOHN DOE</span>
                    </div>
                </Card>

                {/* Right Sibling/Spouse Position */}
                <div className="col-start-3 row-start-2">
                    <button className="w-48 h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                        ADD FAMILY
                    </button>
                </div>

                {/* Child Position */}
                <div className="col-start-2 row-start-3">
                    <button className="w-48 h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                        ADD FAMILY
                    </button>
                </div>
            </div>

            <div className="flex justify-between mt-16">
               <Link to={`/dashboard/tribute-life`}>
                   <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                       LIFE
                   </Button>
               </Link>
               <Link to={`/dashboard/events`}>
                   <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                       EVENTS
                   </Button>
               </Link>
            </div>
        </div>
    )
}
