import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PieChart, Hexagon, LayoutGrid } from "lucide-react"

export default function Pricing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="py-6 border-b">
                <div className="container mx-auto">
                    <div className="flex justify-center gap-16">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-600">MEMORIAL OWNER</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-600">ABOUT YOU</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-600">PLANS AND FEATURES</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Pricing Cards */}
            <div className="container mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <Card className="p-6 bg-blue-50">
                        <div className="flex flex-col items-center gap-4">
                            <PieChart className="w-16 h-16 text-blue-500" strokeWidth={1} />
                            <h3 className="text-xl font-medium">Free</h3>
                            <div className="space-y-2 text-center text-gray-600">
                                <p>Lorem ipsum</p>
                                <p>Dolor sit amet</p>
                                <p>Consectetur adipisicin</p>
                            </div>
                            <div className="mt-auto pt-6 w-full">
                                <Button className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    Free!
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="p-6 bg-blue-50 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white px-3 py-1 text-xs rounded">
                            RECOMMENDED
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <Hexagon className="w-16 h-16 text-blue-500" strokeWidth={1} />
                            <h3 className="text-xl font-medium">Premium</h3>
                            <div className="space-y-2 text-center text-gray-600">
                                <p>Lorem ipsum</p>
                                <p>Dolor sit amet</p>
                                <p>Consectetur adipisicin</p>
                                <p>Sed do eiusmo</p>
                            </div>
                            <div className="mt-auto pt-6 w-full">
                                <Button className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    $ 9.99 / month
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Corporate Plan */}
                    <Card className="p-6 bg-blue-50">
                        <div className="flex flex-col items-center gap-4">
                            <LayoutGrid className="w-16 h-16 text-blue-500" strokeWidth={1} />
                            <h3 className="text-xl font-medium">Corporate</h3>
                            <div className="space-y-2 text-center text-gray-600">
                                <p>Lorem ipsum</p>
                                <p>Dolor sit amet</p>
                                <p>Consectetur adipisicin</p>
                                <p>Sed do eiusmo</p>
                                <p>Tempor incididunt</p>
                            </div>
                            <div className="mt-auto pt-6 w-full">
                                <Button className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    $ 19.99 / month
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Theme Selection */}
            <div className="container mx-auto py-12">
                <h2 className="text-xl font-medium mb-8">SELECT THEME</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[1, 2, 3].map(theme => (
                        <div key={theme} className="space-y-4">
                            <Card className="p-4 bg-blue-50">
                                <div className="text-blue-500 mb-2">
                                    <h3 className="font-medium">LOREM IPSUM DOLOR</h3>
                                    <p className="text-sm">{theme === 1 ? "FREE" : "PREMIUM"}</p>
                                </div>
                                <div className="aspect-video bg-blue-100 rounded-lg" />
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="container mx-auto py-12">
                <div className="flex justify-center gap-4">
                    <Button variant="outline">BACK</Button>
                    <Button>NEXT</Button>
                </div>
            </div>
        </div>
    )
}
