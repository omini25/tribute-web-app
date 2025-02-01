import { useEffect, useState } from "react";
import { Share, Printer, Heart, Camera, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "@/server.js";
import Header from "@/components/landing/Header.jsx";
import { FamilyTreeMinimal } from "@/components/tribute/FamilyTreeMinimal.jsx";

export function MinimalistTheme() {
    const { id } = useParams();
    const [memorial, setMemorial] = useState(null);
    const [milestonesData, setMilestonesData] = useState([]);

    useEffect(() => {
        fetchMilestonesData()
    }, [])

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
            const response = await axios.get(`${server}/tributes/${id}/bio-family`)
            if (response.data.status === "success") {
                setMilestonesData(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching tribute details:", error)
        }
    }


    // if (!memorial) {
    //     return <div>Loading...</div>;
    // }


    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100">
                {/* Banner */}
                <div
                    className="relative h-[400px] bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-01%20at%2016-09-54%20RememberedAlways-ajhlFObtNMnE3hik3Xd1egdZuet9bz.png)",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button variant="ghost" className="text-white hover:bg-white/20">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/20">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h1 className="text-4xl font-bold">In Loving Memory</h1>
                        <p className="text-xl">{memorial?.first_name} {memorial?.middle_name} {memorial?.last_name} ({memorial?.nickname})</p>
                    </div>
                </div>



                {/* Main Content */}
                <main className="container mx-auto px-4 py-8 max-w-7xl ">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <section id="about">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Biography</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    <p className="text-gray-600">{milestonesData?.bio}</p>
                                </Card>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section id="birth">
                                    <h2 className="text-3xl font-light text-gray-800 mb-4">Birth</h2>
                                    <Card className="p-6 shadow-md bg-white">
                                        <div className="space-y-2 text-gray-600">
                                            <p>Date: {new Date(memorial?.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} </p>
                                            <p>Location: {memorial?.country_of_birth}</p>
                                        </div>
                                    </Card>
                                </section>

                                <section id="death">
                                    <h2 className="text-3xl font-light text-gray-800 mb-4">Death</h2>
                                    <Card className="p-6 shadow-md bg-white">
                                        <div className="space-y-2 text-gray-600">
                                            <p>Date: {new Date(memorial?.date_of_death).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            <p>Location: {memorial?.country_died}</p>
                                        </div>
                                    </Card>
                                </section>
                            </div>

                            <section id="family">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Milestones</h2>
                                <Card className="p-6 shadow-md bg-white">
                                   <ul className="text-gray-600">
                                        {milestonesData?.milestone?.map((item, index) => (
                                            item && <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </Card>
                            </section>

                            <section id="extended-family">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Family</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    <div className="p-8">
                                        <FamilyTreeMinimal data={milestonesData?.family} />
                                    </div>
                                </Card>
                            </section>

                            <section id="donations">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Donations</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    <p className="text-gray-600 mb-4">
                                        To honor their memory, please consider a donation to:
                                    </p>
                                    <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                                        Make a Donation
                                    </Button>
                                </Card>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Contribute</h2>
                                <div className="space-y-4">
                                    <Button className="w-full bg-red-100 text-red-700 hover:bg-red-200">
                                        Share a Memory
                                    </Button>
                                    <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                                        Add Photos
                                    </Button>
                                </div>
                            </Card>

                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Memorial Statistics</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-gray-600">
                                        <div className="flex items-center">
                                            <Camera className="h-4 w-4 mr-2" />
                                            Photos
                                        </div>
                                        <span>0</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between text-gray-600">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2" />
                                            Contributors
                                        </div>
                                        <span>0</span>
                                    </div>
                                    <Separator />

                                </div>
                            </Card>

                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Images and Videos</h2>
                                <p className="text-gray-600">No recent updates</p>
                            </Card>

                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Recent Updates</h2>
                                <p className="text-gray-600">No recent updates</p>
                            </Card>
                        </div>
                    </div>
                </main>

                <footer className="border-t bg-white py-4 mt-8">
                    <div className="container mx-auto px-4 text-center text-gray-500">
                        © 2025 Memorial Site. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}