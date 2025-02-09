"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MinimalistTabTheme({ memorial }) {
    const [activeTab, setActiveTab] = useState("about")

    return (
        <div className="bg-white min-h-screen">
            <header className="bg-gray-50 py-12">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-light mb-2">{memorial?.fullName}</h1>
                    <p className="text-gray-600">
                        {memorial?.birthDate} - {memorial?.deathDate}
                    </p>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="life">Life</TabsTrigger>
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                        <TabsTrigger value="family">Family Tree</TabsTrigger>
                        <TabsTrigger value="media">Media & Memories</TabsTrigger>
                        <TabsTrigger value="contribute">Contribute</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>
                    <div className="mt-8">
                        <TabsContent value="about">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-center">
                                        <img
                                            src={memorial?.image || "/placeholder.svg"}
                                            alt={memorial?.fullName}
                                            className="w-48 h-48 object-cover rounded-full mb-4 md:mb-0 md:mr-8"
                                        />
                                        <div>
                                            <h2 className="text-2xl font-light mb-4">
                                                {memorial?.fullName}
                                            </h2>
                                            <p className="text-xl italic mb-4">"{memorial?.quote}"</p>
                                            <p className="text-gray-600">{memorial?.shortBio}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="life">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-light mb-4">Life</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-light mb-2">Biography</h3>
                                            <p className="text-gray-600">{memorial?.biography}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-light mb-2">Details</h3>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>
                                                    <strong>Date of Birth:</strong> {memorial?.birthDate}
                                                </li>
                                                <li>
                                                    <strong>Date of Death:</strong> {memorial?.deathDate}
                                                </li>
                                                <li>
                                                    <strong>Obituary Locations:</strong>{" "}
                                                    {memorial?.obituaryLocations.join(", ")}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="milestones">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-light mb-4">Milestones</h2>
                                    <ul className="space-y-4">
                                        {memorial?.milestones.map((milestone, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                                                    <span className="text-gray-600">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-light">
                                                        {milestone.title}
                                                    </h3>
                                                    <p className="text-gray-600">{milestone.date}</p>
                                                    <p className="text-gray-600">
                                                        {milestone.description}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="family">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-light mb-4">Family Tree</h2>
                                    {/* Implement family tree visualization here */}
                                    <p className="text-center text-gray-600">
                                        Family tree visualization goes here
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="media">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-light mb-4">
                                        Images, Videos, and Memories
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {memorial?.mediaMemories.map((item, index) => (
                                            <div key={index} className="space-y-2">
                                                {item.type === "image" && (
                                                    <img
                                                        src={item.src || "/placeholder.svg"}
                                                        alt={item.caption}
                                                        className="w-full h-48 object-cover rounded"
                                                    />
                                                )}
                                                {item.type === "video" && (
                                                    <video
                                                        src={item.src}
                                                        controls
                                                        className="w-full h-48 object-cover rounded"
                                                    />
                                                )}
                                                <p className="text-sm text-gray-600">{item.caption}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="contribute">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-light mb-4">
                                        Share Your Memories
                                    </h2>
                                    <form className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="memory"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Your Memory
                                            </label>
                                            <textarea
                                                id="memory"
                                                rows={4}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="image"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Upload Image
                                            </label>
                                            <input
                                                type="file"
                                                id="image"
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                        <Button type="submit">Share Memory</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="events">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-light mb-4">Events</h2>
                                    <ul className="space-y-4">
                                        {memorial?.events?.map((event, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center mr-4">
                                                      <span className="text-lg font-light">
                                                        {event.date.split(" ")[0]}
                                                      </span>
                                                                                <span className="text-sm text-gray-600">
                                                        {event.date.split(" ")[1]}
                                                      </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-light">{event.title}</h3>
                                                    <p className="text-gray-600">{event.location}</p>
                                                    <p className="text-gray-600">{event.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </main>

            <footer className="bg-gray-50 py-4 mt-8">
                <div className="container mx-auto text-center">
                    <p className="text-gray-600">
                        &copy; 2025 Memorial Website. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
