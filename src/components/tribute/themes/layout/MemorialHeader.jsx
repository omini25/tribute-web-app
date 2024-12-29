import { Button } from "@/components/ui/button"
import { Share, Printer, Heart } from "lucide-react"
import Image from "next/image"

export function MemorialHeader({
                                   name,
                                   dates,
                                   profileImage,
                                   theme = "classic"
                               }) {
    const themeStyles = {
        classic: "bg-stone-100",
        modern: "bg-gray-100",
        nature: "bg-green-50",
        vintage: "bg-sepia-100",
        minimalist: "bg-white"
    }

    return (
        <div className={`w-full ${themeStyles[theme]}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-end gap-2 mb-6">
                    <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share Memorial
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 h-48 relative rounded-full overflow-hidden">
                        <Image
                            src={profileImage}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
                        <p className="text-lg text-gray-600">{dates}</p>

                        <div className="flex items-center gap-4 mt-4">
                            <Button variant="default">
                                <Heart className="h-4 w-4 mr-2" />
                                Follow this Memorial
                            </Button>
                            <Button variant="outline">Leave a tribute</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
