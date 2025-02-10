import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { server } from "@/server.js";
import { assetServer } from "@/assetServer.js";
import Header from "@/components/landing/Header.jsx";

import { FamilyTreeMinimal } from "@/components/tribute/FamilyTreeMinimal.jsx";
import { Events } from "@/components/tribute/Events.jsx";
import { toast } from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

export function ElegantTabTheme() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("about");
    const [memorial, setMemorial] = useState(null);
    const [milestonesData, setMilestonesData] = useState([]);
    const [memory, setMemory] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [link, setLink] = useState('');
    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMemorialLoading, setIsMemorialLoading] = useState(true);
    const [isMilestonesLoading, setIsMilestonesLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
        tribute_id: id,
    });

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
            })
            .finally(() => {
                setIsMemorialLoading(false);
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
        } finally {
            setIsMilestonesLoading(false);
        }
    };

    const handleAddMemory = async () => {
        try {
            const response = await axios.post(`${server}/memories/add/text`, { memory, tribute_id: id });
            if (response.status === 200) {
                toast.success("Memory Added");
                setMemory('');
            }
        } catch (error) {
            toast.error("Error adding memory");
        }
    };

    const handleAddImage = async () => {
        if (!image) {
            toast.error("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('tribute_id', id);
        formData.append('files[]', image);

        try {
            const response = await axios.post(`${server}/memories/add/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success("Image uploaded successfully");
                setImage(null);
            }
        } catch (error) {
            toast.error("Error uploading image");
            console.error("Error uploading image:", error);
        }
    };

    const handleAddVideo = async () => {
        if (!video) {
            toast.error("Please select a video to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('tribute_id', id);
        formData.append('files[]', video);

        try {
            const response = await axios.post(`${server}/memories/add/video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success("Video uploaded successfully");
                setVideo(null);
            }
        } catch (error) {
            toast.error("Error uploading video");
            console.error("Error uploading video:", error);
        }
    };

    const handleAddLink = async () => {
        if (!link) {
            toast.error("Please enter a link.");
            return;
        }

        const formData = new FormData();
        formData.append('tribute_id', id);
        formData.append('links', link);

        try {
            const response = await axios.post(`${server}/memories/add/link`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success("Link added successfully");
                setLink('');
            }
        } catch (error) {
            toast.error("Error adding link");
            console.error("Error adding link:", error);
        }
    };

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const response = await axios.get(`${server}/tributes/memories/${id}`);
                setMemories(response.data);
            } catch (error) {
                console.error("Error fetching memories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemories();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/initialize-guest-payment`, formData);
            window.location.href = response.data; // Redirect to payment URL
        } catch (error) {
            toast.error("Error initializing payment");
            console.error("Error initializing payment:", error);
        }
    };

    return (
        <>
            <Header />

            <div className="bg-gray-50 min-h-screen">
                <header className="relative bg-cover bg-center text-white py-16" style={{ backgroundImage: `url('/src/assets/landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png')` }}>
                    <div className="relative container mx-auto text-center mt-12 px-4 sm:px-6 lg:px-8">
                        {isMemorialLoading ? (
                            <div className="flex justify-center items-center">
                                <p>Loading memorial details...</p>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-5xl font-serif mb-2">{memorial?.first_name} {memorial?.middle_name} {memorial?.last_name} ({memorial?.nickname})</h1>
                                <p className="text-xl font-light">
                                    {new Date(memorial?.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {new Date(memorial?.date_of_death).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </>
                        )}
                    </div>
                </header>

                <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full flex flex-wrap justify-center mb-24 sm:mb-8">
                            <TabsTrigger value="about" className="px-4 py-2 sm:px-6 sm:py-3">
                                About
                            </TabsTrigger>
                            <TabsTrigger value="life" className="px-4 py-2 sm:px-6 sm:py-3">
                                Life
                            </TabsTrigger>
                            <TabsTrigger value="milestones" className="px-4 py-2 sm:px-6 sm:py-3">
                                Milestones
                            </TabsTrigger>
                            <TabsTrigger value="family" className="px-4 py-2 sm:px-6 sm:py-3">
                                Family Tree
                            </TabsTrigger>
                            <TabsTrigger value="media" className="px-4 py-2 sm:px-6 sm:py-3">
                                Media & Memories
                            </TabsTrigger>
                            <TabsTrigger value="contribute" className="px-4 py-2 sm:px-6 sm:py-3">
                                Contribute
                            </TabsTrigger>
                            <TabsTrigger value="events" className="px-4 py-2 sm:px-6 sm:py-3">
                                Events
                            </TabsTrigger>
                        </TabsList>
                        <div className="mt-8 max-w-6xl mx-auto">
                            <TabsContent value="about">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-4 sm:p-8">
                                        {isMemorialLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading about section...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col md:flex-row items-center">
                                                <img
                                                    src={`${assetServer}/images/people/${memorial?.image}` || "/placeholder.svg"}
                                                    alt={memorial?.first_name}
                                                    className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-full mb-6 sm:mb-8 md:mb-0 md:mr-8 sm:mr-12 shadow-lg"
                                                />
                                                <div>
                                                    <h2 className="text-2xl sm:text-3xl font-serif mb-2 sm:mb-4">
                                                        {memorial?.first_name}
                                                    </h2>
                                                    <p className="text-xl sm:text-2xl italic mb-4 sm:mb-6 text-gray-600">
                                                        "{memorial?.quote}"
                                                    </p>
                                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                                        Welcome to {memorial?.first_name}'s memorial<br />
                                                        We created this memorial to celebrate the life of {memorial?.first_name} {memorial?.last_name} with family and friends.<br />
                                                        To add your memories of {memorial?.first_name}, click Media and Memories tab.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="life">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-4 sm:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading life section...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">Life</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                                    <div>
                                                        <h3 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-4">Biography</h3>
                                                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                                            {milestonesData?.bio}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-4">Details</h3>
                                                        <ul className="space-y-2 sm:space-y-4 text-gray-700 text-sm sm:text-base">
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
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="milestones">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-4 sm:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading milestones section...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">Milestones</h2>
                                                <div className="space-y-4 sm:space-y-8">
                                                    <ul className="text-gray-600 text-sm sm:text-base">
                                                        {milestonesData?.milestone?.map((item, index) => (
                                                            item && <li key={index}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="family">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-4 sm:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading family section...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">Family Tree</h2>
                                                <div className="">
                                                    <FamilyTreeMinimal data={milestonesData?.family} />
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="media">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-4 sm:p-8">
                                        <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">
                                            Images, Videos, and Memories
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-8">
                                            {isLoading ? (
                                                <div className="flex justify-center items-center">
                                                    <p>Loading memories...</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {memories?.images && JSON.parse(memories.images).map((image, index) => (
                                                        <img key={index} src={`${assetServer}/images/gallery/${image}`} alt={`Memory ${index}`} className="w-full h-auto rounded-lg shadow-md" />
                                                    ))}
                                                    {memories?.videos && JSON.parse(memories.videos).map((video, index) => (
                                                        <video key={index} controls className="w-full h-auto rounded-lg shadow-md">
                                                            <source src={`${assetServer}/${video}`} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ))}
                                                    {memories?.links && JSON.parse(memories.links).map((link, index) => (
                                                        <Card key={index} className="w-full h-auto rounded-lg shadow-md">
                                                            <CardContent>
                                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                    {link}
                                                                </a>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                    {memories?.memories && JSON.parse(memories.memories).map((text, index) => (
                                                        <Card key={index} className="w-full h-auto rounded-lg shadow-md">
                                                            <CardContent>
                                                                <p className="text-gray-700">{text}</p>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="contribute">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-4 sm:p-8">
                                        <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">
                                            Share Your Memories
                                        </h2>
                                        <div className="space-y-4">
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="Write your memory here..."
                                                    className="w-full mb-8 p-4 border border-gray-200 rounded-lg"
                                                    value={memory}
                                                    onChange={(e) => setMemory(e.target.value)}
                                                />
                                                <Button className="w-full bg-green-100  hover:bg-red-200" onClick={handleAddMemory}>
                                                    Add Memories
                                                </Button>
                                            </>
                                            <input
                                                type="file"
                                                className="w-full mb-8 p-4 border border-gray-200 rounded-lg"
                                                onChange={(e) => setImage(e.target.files[0])}
                                            />
                                            <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleAddImage}>
                                                Add Photos
                                            </Button>
                                            <input
                                                type="file"
                                                className="w-full mb-8 p-4 border border-gray-200 rounded-lg"
                                                onChange={(e) => setVideo(e.target.files[0])}
                                            />
                                            <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleAddVideo}>
                                                Add Videos
                                            </Button>
                                            <input
                                                type="text"
                                                placeholder="Add a link..."
                                                className="w-full mb-8 p-4 border border-gray-200 rounded-lg"
                                                value={link}
                                                onChange={(e) => setLink(e.target.value)}
                                            />
                                            <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleAddLink}>
                                                Add Link
                                            </Button>
                                        </div>

                                        <section id="donations" className="mt-10">
                                            <h2 className="text-3xl font-light text-gray-800 mb-4">Donations</h2>
                                            <Card className="p-6 shadow-md bg-white">
                                                <p className="text-gray-600 mb-4">
                                                    To honor {memorial?.first_name} {memorial?.last_name} memory, please consider a donation:
                                                </p>
                                                <>
                                                    <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setIsModalOpen(true)}>
                                                        Make a Donation
                                                    </Button>

                                                    {isModalOpen && (
                                                        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                                                            <DialogContent className="sm:max-w-[425px] bg-white">
                                                                <DialogHeader>
                                                                    <DialogTitle>Make a Donation</DialogTitle>
                                                                    <DialogDescription>
                                                                        Please fill out the form below to make a donation.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                            <Label htmlFor="name" className="text-right">
                                                                                Name
                                                                            </Label>
                                                                            <Input
                                                                                id="name"
                                                                                name="name"
                                                                                placeholder="Name"
                                                                                value={formData.name}
                                                                                onChange={handleInputChange}
                                                                                className="col-span-3"
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                            <Label htmlFor="email" className="text-right">
                                                                                Email
                                                                            </Label>
                                                                            <Input
                                                                                id="email"
                                                                                name="email"
                                                                                type="email"
                                                                                placeholder="Email"
                                                                                value={formData.email}
                                                                                onChange={handleInputChange}
                                                                                className="col-span-3"
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                            <Label htmlFor="amount" className="text-right">
                                                                                Amount
                                                                            </Label>
                                                                            <Input
                                                                                id="amount"
                                                                                name="amount"
                                                                                type="number"
                                                                                placeholder="Amount"
                                                                                value={formData.amount}
                                                                                onChange={handleInputChange}
                                                                                className="col-span-3"
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button type="submit" className="w-full bg-primary text-white hover:bg-green-600">
                                                                            Submit
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </form>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </>
                                            </Card>
                                        </section>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="events">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-4 sm:p-8">
                                        <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">Events</h2>
                                        <div className="space-y-4 sm:space-y-8">
                                            <Events id={memorial?.id} user_id={memorial?.user_id} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </main>

                <footer className="bg-primary text-white py-4 sm:py-8 mt-8 sm:mt-12">
                    <div className="container mx-auto text-center">
                        <p>&copy; 2025 Memorial Website. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}