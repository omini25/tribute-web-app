import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Heart, Users } from "lucide-react"

export default function Preview() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-medium text-gray-600">TRIBUTE TITLE</h1>
                    <p className="text-sm text-gray-400">PREVIEW</p>
                    <div className="mt-4">
                        <h2 className="text-blue-500 font-medium">JOHN DOE</h2>
                        <p className="text-sm text-gray-500">BALTIMORE, USA</p>
                        <p className="text-sm text-blue-400">www.tributeurl.com</p>
                    </div>
                </div>
                <div className="w-24 h-24 bg-blue-100 rounded-lg" />
            </div>

            {/* Quote Section */}
            <div className="mb-12 space-y-4">
                <blockquote className="text-xl text-gray-600 italic">
                    "User Enter Short quote about the bereaved or about death"
                </blockquote>
                <p className="text-sm text-gray-500">June 2, 2017</p>
            </div>

            {/* Description */}
            <div className="mb-12">
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut ea labore et dolore magna aliqua. Ut enim
                    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>

            {/* Milestones */}
            <section className="mb-16">
                <h3 className="text-2xl text-blue-500 mb-6">
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                    officia
                </h3>
                <p className="text-gray-600 mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    <Card className="text-center p-6">
                        <CardContent className="space-y-2">
                            <p className="text-4xl font-bold text-blue-500">4</p>
                            <p className="text-sm text-gray-500">Happy Extended Families</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center bg-blue-500 text-white p-6">
                        <CardContent className="space-y-2">
                            <p className="text-4xl font-bold">8</p>
                            <p className="text-sm">Years Devoted</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-6">
                        <CardContent className="space-y-2">
                            <p className="text-4xl font-bold text-blue-500">6</p>
                            <p className="text-sm text-gray-500">Life Projects</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="bg-blue-50 p-4">
                            <CardContent className="flex items-center justify-center min-h-[100px]">
                                <span className="text-blue-500">JOHN DOE</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Latest News */}
            <section className="mb-16">
                <h4 className="text-sm text-blue-500 uppercase mb-4">Latest News</h4>
                <Card className="mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6">
                            <h5 className="text-blue-500 mb-4">
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim.
                            </h5>
                            <p className="text-gray-600 text-sm mb-4">
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </p>
                            <div className="flex items-center gap-4">
                                <Heart className="w-4 h-4 text-blue-500" />
                                <Users className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-blue-100 min-h-[200px]" />
                    </div>
                </Card>
            </section>

            {/* Testimonial */}
            <section className="mb-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 min-h-[200px]" />
                    <Card className="bg-blue-100 p-6">
                        <CardContent className="flex flex-col items-center text-center">
                            <Avatar className="w-12 h-12 mb-4">
                                <AvatarFallback>
                                    <User className="w-6 h-6" />
                                </AvatarFallback>
                            </Avatar>
                            <h5 className="font-medium mb-2">Name Surname</h5>
                            <p className="text-sm text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Pricing */}
            <section className="mb-12">
                <div className="border-t border-b py-4">
                    <div className="flex justify-between items-center mb-2">
                        <span>JOHN DOE TRIBUTE</span>
                        <span>$ 1,500</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                        <span>Total</span>
                        <span>$ 2,150</span>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button className="bg-blue-500 hover:bg-blue-600">
                    SAVE AND CREATE
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                    SAVE AND SHARE
                </Button>
            </div>
        </div>
    )
}
