import { Heart } from 'lucide-react'

export const Conclusions = () => {
    return (
        <>
            <div className="max-w-2xl mx-auto text-center">
                <div className="relative w-12 h-12 mx-auto mb-8">
                    <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-blue-500"/>
                    </div>
                </div>

                <h1 className="text-4xl font-light text-blue-500 mb-6">
                    Excepteur sint occaecat cupidatat non proident, culpa
                </h1>

                <p className="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                    incididunt ut ero labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco.
                </p>
            </div>
        </>
    )
}