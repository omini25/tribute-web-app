import {Play} from "lucide-react";

export const Tribute = () => {
    return (
        <>

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-serif text-gray-600 mb-4">
                            Tribute To John Doe
                        </h1>
                        <p className="text-xl text-gray-500">
                            Excepteur sint occaecat cupidatat
                        </p>
                    </div>
                    <button
                        className="p-4 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                        aria-label="Play tribute"
                    >
                        <Play className="w-6 h-6 text-[#0ea5e9]"/>
                    </button>
                </div>
            </div>
        </>
    )
}