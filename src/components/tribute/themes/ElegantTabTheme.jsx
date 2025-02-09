import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {useParams} from "react-router-dom";
import {server} from "@/server.js";
import {assetServer} from "@/assetServer.js";
import Header from "@/components/landing/Header.jsx";
import Cool from "@/assets/landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png"
import {FamilyTreeMinimal} from "@/components/tribute/FamilyTreeMinimal.jsx";
import {Events} from "@/components/tribute/Events.jsx";

export function ElegantTabTheme( ) {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("about");
    const [memorial, setMemorial] = useState(null);
    const [milestonesData, setMilestonesData] = useState([]);

    useEffect(() => {
        fetchMilestonesData();
    }, []);

    useEffect(() => {
        axios.get(`${server}/tribute/details/${id}`)
            .then(response => {
                setMemorial(response.data);
            })
            .catch(error => {
                console.error("Error fetching memorial details:", error);
            });
    }, [id]);

    const fetchMilestonesData = async () => {
        try {
            const response = await axios.get(`${server}/tributes/${id}/bio-family`);
            if (response.data.status === "success") {
                setMilestonesData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching tribute details:", error);
        }
    };



    return (
        <>
            <Header />

            <div className="bg-gray-50 min-h-screen">
                <header className="relative bg-cover bg-center text-white py-16" style={{ backgroundImage: `url(${Cool})` }}>
                    {/*<div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-800 opacity-75"></div>*/}
                    <div className="relative container mx-auto text-center mt-12">
                        <h1 className="text-5xl font-serif mb-2">{memorial?.first_name} {memorial?.middle_name} {memorial?.last_name} ({memorial?.nickname})</h1>
                        <p className="text-xl font-light">
                            {new Date(memorial?.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {new Date(memorial?.date_of_death).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </header>

                <main className="container mx-auto py-12 px-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full flex justify-center mb-8">
                            <TabsTrigger value="about" className="px-6 py-3">
                                About
                            </TabsTrigger>
                            <TabsTrigger value="life" className="px-6 py-3">
                                Life
                            </TabsTrigger>
                            <TabsTrigger value="milestones" className="px-6 py-3">
                                Milestones
                            </TabsTrigger>
                            <TabsTrigger value="family" className="px-6 py-3">
                                Family Tree
                            </TabsTrigger>
                            <TabsTrigger value="media" className="px-6 py-3">
                                Media & Memories
                            </TabsTrigger>
                            <TabsTrigger value="contribute" className="px-6 py-3">
                                Contribute
                            </TabsTrigger>
                            <TabsTrigger value="events" className="px-6 py-3">
                                Events
                            </TabsTrigger>
                        </TabsList>
                        <div className="mt-8 max-w-6xl mx-auto">
                            <TabsContent value="about">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row items-center">
                                            <img
                                                src={`${assetServer}/images/people/${memorial?.image}` || "/placeholder.svg"}
                                                alt={memorial?.first_name}
                                                className="w-64 h-64 object-cover rounded-full mb-8 md:mb-0 md:mr-12 shadow-lg"
                                            />
                                            <div>
                                                <h2 className="text-3xl font-serif mb-4">
                                                    {memorial?.first_name}
                                                </h2>
                                                <p className="text-2xl italic mb-6 text-gray-600">
                                                    "{memorial?.quote}"
                                                </p>
                                                <p className="text-gray-700 leading-relaxed">
                                                    Welcome to  {memorial?.first_name}'s memorial<br />
                                                    We created this memorial to celebrate the life of  {memorial?.first_name}  {memorial?.last_name} with family and friends.<br />
                                                    To add your memories of  {memorial?.first_name}, click Media and Memories tab.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="life">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <h2 className="text-3xl font-serif mb-6">Life</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-2xl font-serif mb-4">Biography</h3>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {milestonesData?.bio}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif mb-4">Details</h3>
                                                <ul className="space-y-4 text-gray-700">
                                                    <li>
                                                        <strong className="font-serif">Date of Birth:</strong>{" "}
                                                        {new Date(memorial?.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </li>
                                                    <li>
                                                        <strong className="font-serif">Date of Death:</strong>{" "}
                                                        {new Date(memorial?.date_of_death).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </li>
                                                    <li>
                                                        <strong className="font-serif">Obituary Locations:</strong>{" "}
                                                        {memorial?.country_died}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="milestones">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <h2 className="text-3xl font-serif mb-6">Milestones</h2>
                                        <div className="space-y-8">
                                            <ul className="text-gray-600">
                                                {milestonesData?.milestone?.map((item, index) => (
                                                    item && <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="family">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <h2 className="text-3xl font-serif mb-6">Family Tree</h2>
                                        {/* Implement family tree visualization here */}
                                        <div className=" ">
                                            <FamilyTreeMinimal data={milestonesData?.family} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="media">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <h2 className="text-3xl font-serif mb-6">
                                            Images, Videos, and Memories
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {memorial?.mediaMemories?.map((item, index) => (
                                                <div key={index} className="space-y-4">
                                                    {item.type === "image" && (
                                                        <img
                                                            src={item.src || "/placeholder.svg"}
                                                            alt={item.caption}
                                                            className="w-full h-64 object-cover rounded-lg shadow-md"
                                                        />
                                                    )}
                                                    {item.type === "video" && (
                                                        <video
                                                            src={item.src}
                                                            controls
                                                            className="w-full h-64 object-cover rounded-lg shadow-md"
                                                        />
                                                    )}
                                                    <p className="text-gray-700 italic">{item.caption}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="contribute">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <h2 className="text-3xl font-serif mb-6">
                                            Share Your Memories
                                        </h2>
                                        <form className="space-y-6">
                                            <div>
                                                <label
                                                    htmlFor="memory"
                                                    className="block text-lg font-serif mb-2"
                                                >
                                                    Your Memory
                                                </label>
                                                <textarea
                                                    id="memory"
                                                    rows={6}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="image"
                                                    className="block text-lg font-serif mb-2"
                                                >
                                                    Upload Image
                                                </label>
                                                <input type="file" id="image" className="w-full" />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="bg-purple-600 hover:bg-purple-700 text-white font-serif py-3 px-6 rounded-md"
                                            >
                                                Share Memory
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="events">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <h2 className="text-3xl font-serif mb-6">Events</h2>
                                        <div className="space-y-8">
                                            <Events id={memorial?.id} user_id={memorial?.user_id} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </main>

                <footer className="bg-gray-800 text-white py-8 mt-12">
                    <div className="container mx-auto text-center">
                        <p>&copy; 2025 Memorial Website. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}