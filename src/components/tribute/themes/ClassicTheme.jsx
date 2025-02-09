import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ClassicTheme({ memorialData }) {
    console.log(memorialData)
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-gray-800 text-white py-6">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">{memorialData?.fullName}</h1>
                    <p className="text-xl mt-2">
                        {memorialData?.birthDate} - {memorialData?.deathDate}
                    </p>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                <section id="about" className="mb-12">
                    <Card>
                        <CardContent className="flex flex-col md:flex-row items-center p-6">
                            <img
                                src={memorialData?.image || "/placeholder.svg"}
                                alt={memorialData?.fullName}
                                className="w-64 h-64 object-cover rounded-full mb-4 md:mb-0 md:mr-6"
                            />
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-semibold mb-4">{memorialData?.fullName}</h2>
                                <p className="text-xl italic mb-4">"{memorialData?.quote}"</p>
                                <p className="text-gray-600">{memorialData?.shortBio}</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section id="life" className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Life</h2>
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Biography</h3>
                                    <p>{memorialData?.biography}</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Details</h3>
                                    <p>
                                        <strong>Date of Birth:</strong> {memorialData?.birthDate}
                                    </p>
                                    <p>
                                        <strong>Date of Death:</strong> {memorialData?.deathDate}
                                    </p>
                                    <p>
                                        <strong>Obituary Locations:</strong> {memorialData?.obituaryLocations.join(", ")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section id="milestones" className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Milestones</h2>
                    <Card>
                        <CardContent className="p-6">
                            <ul className="space-y-4">
                                {memorialData?.milestones.map((milestone, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center mr-4">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{milestone.title}</h3>
                                            <p className="text-gray-600">{milestone.date}</p>
                                            <p>{milestone.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <section id="family-tree" className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Family Tree</h2>
                    <Card>
                        <CardContent className="p-6">
                            {/* Implement family tree visualization here */}
                            <p className="text-center text-gray-600">Family tree visualization goes here</p>
                        </CardContent>
                    </Card>
                </section>

                <section id="media-memories" className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Images, Videos, and Memories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memorialData?.mediaMemories.map((item, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    {item.type === "image" && (
                                        <img
                                            src={item.src || "/placeholder.svg"}
                                            alt={item.caption}
                                            className="w-full h-48 object-cover mb-2 rounded"
                                        />
                                    )}
                                    {item.type === "video" && (
                                        <video src={item.src} controls className="w-full h-48 object-cover mb-2 rounded" />
                                    )}
                                    <p className="text-sm text-gray-600">{item.caption}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section id="guest-contributions" className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Share Your Memories</h2>
                    <Card>
                        <CardContent className="p-6">
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="memory" className="block text-sm font-medium text-gray-700">
                                        Your Memory
                                    </label>
                                    <textarea
                                        id="memory"
                                        rows={4}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                        Upload Image
                                    </label>
                                    <input type="file" id="image" className="mt-1 block w-full" />
                                </div>
                                <Button type="submit">Share Memory</Button>
                            </form>
                        </CardContent>
                    </Card>
                </section>

                <section id="events" className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Events</h2>
                    <Card>
                        <CardContent className="p-6">
                            <ul className="space-y-4">
                                {memorialData?.events.map((event, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex flex-col items-center justify-center mr-4">
                                            <span className="text-2xl font-bold">{event.date.split(" ")[0]}</span>
                                            <span className="text-sm">{event.date.split(" ")[1]}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{event.title}</h3>
                                            <p className="text-gray-600">{event.location}</p>
                                            <p>{event.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 memorialData Website. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

