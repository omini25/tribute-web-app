import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Roses from "../../assets/images/roses.png"


export function Tribute() {
    return (
        <div className="min-h-screen bg-[#f5f0eb] relative overflow-hidden">
            {/* Background roses */}
            {/*<div className="absolute left-0 top-1/4 opacity-30">*/}
            {/*    <img*/}
            {/*        src={Roses}*/}
            {/*        alt="Decorative roses"*/}
            {/*        width={300}*/}
            {/*        height={300}*/}
            {/*        className="object-cover"*/}
            {/*    />*/}
            {/*</div>*/}

            {/* Main content */}
            <div className="max-w-4xl mx-auto px-4 py-12 relative">
                <div className="text-center space-y-8">
                    {/* Candle Image */}
                    <div className="w-48 h-48 mx-auto relative mb-8">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-08%20at%2021.32.21_92de69ce.jpg-LJe35DkAlEAYGquOskNh5YvyenkYq3.jpeg"
                            alt="Memorial Candle"
                            width={200}
                            height={200}
                            className="object-contain"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
                        In Loving Memory
                    </h1>

                    {/* Memorial Text */}
                    <div className="max-w-2xl mx-auto space-y-6 text-center">
                        <p className="text-lg text-gray-600 font-serif leading-relaxed">
                            Your simple black roses noticeable just colors yours real world
                            your year and never let me and you. Let me see favorite world and
                            home done your there done so other noticeable best man best there
                            done get extreme.
                        </p>
                        <p className="text-lg text-gray-600 font-serif leading-relaxed">
                            Your there world color for feel betula. Call you actions checkout
                            and donate. Noticeable more time that real me leaving you for
                            more.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-12">
                        <Button
                            variant="outline"
                            className="bg-transparent border-gray-400 text-gray-600 hover:bg-gray-100 px-8 py-2 rounded-full font-serif"
                        >
                            IT'S YOURS
                        </Button>
                        <Button className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-2 rounded-full font-serif">
                            DEMO
                        </Button>
                    </div>
                </div>
            </div>

            {/* Play button - floating */}
            {/*<button*/}
            {/*    className="fixed bottom-8 right-8 p-4 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 z-10"*/}
            {/*    aria-label="Play tribute"*/}
            {/*>*/}
            {/*    <Play className="w-6 h-6 text-gray-800" />*/}
            {/*</button>*/}
        </div>
    )
}
