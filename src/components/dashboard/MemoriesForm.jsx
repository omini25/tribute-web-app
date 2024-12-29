import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload } from "lucide-react"
import {Link} from "react-router-dom";


export default function MemoriesForm() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-medium text-gray-600">TRIBUTE TITLE</h1>
                <h2 className="text-2xl text-gray-500">MEMORIES</h2>
            </div>

            <div className="space-y-8">
                {/* Privacy Option */}
                <div className="flex items-center space-x-2">
                    <Checkbox id="private"/>
                    <Label htmlFor="private" className="text-blue-500">
                       Allow Anyone Add Memories To Tribute
                    </Label>
                </div>

                {/* Memories Section */}
                <div className="space-y-2">
                    <h3 className="text-xl text-gray-500">MEMORIES</h3>
                    <Card className="p-0">
                        <Textarea
                            placeholder="Milestones of the bereaved"
                            className="min-h-[200px] border-blue-100 resize-none"
                        />
                    </Card>
                </div>

                {/* Add Button */}
                <div className="flex justify-center">
                    <Button
                        size="icon"
                        className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600"
                    >
                        <Plus className="h-6 w-6"/>
                    </Button>
                </div>

                {/* Upload/Link Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="h-16 border-2 border-dashed border-blue-300 text-blue-500 hover:bg-blue-50"
                    >
                        <Upload className="w-4 h-4 mr-2"/>
                        UPLOAD VIDEO OR AUDIO
                    </Button>
                    <Button
                        variant="outline"
                        className="h-16 border-2 border-dashed border-blue-300 text-blue-500 hover:bg-blue-50"
                    >
                        <Link className="w-4 h-4 mr-2"/>
                        LINK AUDIO OR VIDEO
                    </Button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-16">
                    <Link to={`/dashboard/events`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                            EVENTS
                        </Button>
                    </Link>
                    <Link to={`/dashboard/donations-form`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                            DONATIONS
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
