import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import {Link} from "react-router-dom";

export default function MusicTheme() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-medium text-gray-600">TRIBUTE TITLE</h1>
                <h2 className="text-2xl text-gray-500">THEME AND MUSIC</h2>
            </div>

            {/* Music Options */}
            <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center space-x-2">
                    <Checkbox id="noMusic"/>
                    <Label htmlFor="noMusic" className="text-blue-500">
                        No Music
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="defaultMusic"/>
                    <Label htmlFor="defaultMusic" className="text-blue-500">
                        Default Music
                    </Label>
                </div>
            </div>

            {/* Upload Music Button */}
            <div className="mb-12">
                <Button
                    variant="outline"
                    className="h-16 w-full md:w-auto border-2 border-dashed border-blue-300 text-blue-500 hover:bg-blue-50"
                >
                    <Upload className="w-4 h-4 mr-2"/>
                    UPLOAD MUSIC
                </Button>
            </div>

            {/* Theme Selection */}
            <div className="space-y-6 mb-12">
                <h3 className="text-xl text-gray-500">SELECT THEME</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Theme Card 1 */}
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-blue-100 p-4">
                            <div className="space-y-1">
                                <h4 className="text-blue-500">LOREM IPSUM DOLOR</h4>
                                <p className="text-sm text-blue-400">FREE</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-square bg-blue-50"/>
                        </CardContent>
                    </Card>

                    {/* Theme Card 2 */}
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-blue-100 p-4">
                            <div className="space-y-1">
                                <h4 className="text-blue-500">LOREM IPSUM DOLOR</h4>
                                <p className="text-sm text-blue-400">PREMIUM</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-square bg-blue-50"/>
                        </CardContent>
                    </Card>

                    {/* Theme Card 3 */}
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-blue-100 p-4">
                            <div className="space-y-1">
                                <h4 className="text-blue-500">LOREM IPSUM DOLOR</h4>
                                <p className="text-sm text-blue-400">PREMIUM</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-square bg-blue-50"/>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-16">
                <Link to={`/dashboard/donations-form`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                        DONATIONS
                    </Button>
                </Link>
                <Link to={`/dashboard/preview`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                        PREVIEW
                    </Button>
                </Link>
            </div>
        </div>
    )
}
