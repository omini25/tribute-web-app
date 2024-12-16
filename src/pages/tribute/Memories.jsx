import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Globe } from "lucide-react"


export const Memories = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-blue-500 mb-4">
                    Excepteur sint occaeuiecat cupidatat.
                </h1>
                <p className="text-gray-600 max-w-3xl">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                    eiusmod tempor incididunt ut ero labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco porti laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in ulenlpty voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat norin proident, sunt
                    in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>

            {/* Content Section */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Section */}
                <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                            LOREM IPSUM DOLOR AMET CONSECTETUER
                        </h2>
                    </div>
                    <div className="bg-slate-50 rounded-lg h-[300px] w-full"></div>
                </div>

                {/* Right Section - Profile Card */}
                <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2 mb-6">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-500">webpage</span>
                    </div>
                    <Card className="bg-blue-400 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12 bg-white">
                                    <AvatarFallback className="text-blue-400">NS</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">Name Surname</h3>
                                    <p className="text-blue-50">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                                        sed do eiusmod tempor incididunt ut ero labore et dolore
                                        magna aliqua. Ut enim ad minim veniam.
                                    </p>
                                </div>
                                <button className="ml-auto">
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
