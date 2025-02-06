import { useEffect, useState } from "react";
import { Share, Printer, Heart, Camera, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "@/server.js";
import Header from "@/components/landing/Header.jsx";
import { FamilyTreeMinimal } from "@/components/tribute/FamilyTreeMinimal.jsx";
import { toast } from "react-hot-toast";
import { Events } from "@/components/tribute/Events.jsx";
import Warm from "../../../assets/Landing/images/2948b129-4e43-47d4-b0f5-2b4db8eec2e3.png"
import { assetServer } from "@/assetServer.js";

export function MinimalistTheme() {
    const { id } = useParams();
    const [memorial, setMemorial] = useState(null);
    const [milestonesData, setMilestonesData] = useState({});
    const [memory, setMemory] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [link, setLink] = useState('');
    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
        // Implement video upload logic here
    };

    const handleAddLink = async () => {
        // Implement link addition logic here
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
            <div className="min-h-screen bg-gray-100">
                <div
                    className="relative h-[400px] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${Warm})`
                    }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute top-4 right-4 flex gap-2 mt-12">
                        {/*<Button variant="ghost" className="text-white hover:bg-white/20">*/}
                        {/*    <Printer className="h-4 w-4 mr-2" />*/}
                        {/*    Print*/}
                        {/*</Button>*/}
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: document.title,
                                        url: window.location.href,
                                    }).catch(error => console.error('Error sharing:', error));
                                } else {
                                    console.error('Share API not supported');
                                }
                            }}
                        >
                            <Share className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h1 className="text-4xl font-bold">In Loving Memory</h1>
                        <p className="text-xl">{memorial?.first_name} {memorial?.middle_name} {memorial?.last_name} ({memorial?.nickname})</p>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                                            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
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

                            <section id="memories">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Memories</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center">
                                            <Spinner /> {/* Display a spinner or loading indicator */}
                                        </div>
                                    ) : (
                                       <div className="grid gap-4">
                                           {memories?.memories && memories.memories.length > 0 && JSON.parse(memories.memories).map((item, index) => (
                                                item && (
                                                    <Card key={index} className="p-4 shadow-md bg-white">
                                                        <p className="text-gray-600">{item}</p>
                                                    </Card>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Contribute</h2>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-medium text-gray-800 mb-4">Share a Memory</h2>
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Write your memory here..."
                                            className="w-full mb-8 p-4 border border-gray-200 rounded-lg"
                                            value={memory}
                                            onChange={(e) => setMemory(e.target.value)}
                                        />
                                        <Button className="w-full bg-red-100 text-red-700 hover:bg-red-200" onClick={handleAddMemory}>
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
                            </Card>

                            {/*<Card className="p-6 shadow-md bg-white">*/}
                            {/*    <h2 className="text-2xl font-medium text-gray-800 mb-4">Memorial Statistics</h2>*/}
                            {/*    <div className="space-y-4">*/}
                            {/*        <div className="flex items-center justify-between text-gray-600">*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <Camera className="h-4 w-4 mr-2" />*/}
                            {/*                Photos and Videos*/}
                            {/*            </div>*/}
                            {/*            <span>*/}
                            {/*                {memorial?.images && memorial?.videos*/}
                            {/*                    ? JSON.parse(memorial.images).length + JSON.parse(memorial.videos).length*/}
                            {/*                    : 0}*/}
                            {/*            </span>*/}
                            {/*        </div>*/}
                            {/*        <Separator />*/}
                            {/*        <div className="flex items-center justify-between text-gray-600">*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <Users className="h-4 w-4 mr-2" />*/}
                            {/*                Contributors*/}
                            {/*            </div>*/}
                            {/*            <span>0</span>*/}
                            {/*        </div>*/}
                            {/*        <Separator />*/}
                            {/*    </div>*/}
                            {/*</Card>*/}

                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Images and Videos</h2>
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <Spinner /> {/* Display a spinner or loading indicator */}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {memories?.images && JSON.parse(memories.images).map((image, index) => (
                                            <img key={index} src={`${assetServer}/images/gallery/${image}`} alt={`Memory ${index}`} className="w-full h-auto rounded-lg shadow-md" />
                                        ))}
                                        {memories?.videos && JSON.parse(memories.videos).map((video, index) => (
                                            <video key={index} controls className="w-full h-auto rounded-lg shadow-md">
                                                <source src={`${assetServer}/${video}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ))}
                                    </div>
                                )}
                            </Card>

                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Events</h2>

                                    <Events id={memorial?.id} user_id={memorial?.user_id} />

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