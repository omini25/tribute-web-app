import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import { Share, Printer, Heart, Camera, Users, Eye, X, ChevronLeft, ChevronRight } from "lucide-react"; // Added X, ChevronLeft, ChevronRight
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
    const [isMemorialLoading, setIsMemorialLoading] = useState(true);
    const [isMilestonesLoading, setIsMilestonesLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
        tribute_id: id,
    });

    // Lightbox State
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

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
                // Optionally re-fetch memories to update the list
                fetchMemories();
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
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast.success("Image uploaded successfully");
                setImage(null);
                document.getElementById('image-upload-input').value = ''; // Reset file input
                fetchMemories(); // Re-fetch memories
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
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast.success("Video uploaded successfully");
                setVideo(null);
                document.getElementById('video-upload-input').value = ''; // Reset file input
                fetchMemories(); // Re-fetch memories
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
        formData.append('links', link); // Ensure backend expects 'links'
        try {
            // Assuming the backend expects 'links' as a single string or an array of strings
            // If it expects a JSON array, you might need to adjust:
            // formData.append('links', JSON.stringify([link]));
            const response = await axios.post(`${server}/memories/add/link`, formData, {
                headers: {
                    // If sending JSON, use: 'Content-Type': 'application/json',
                    // If using FormData for a single link, 'multipart/form-data' might be okay
                    // but check backend. If it's just a simple string, a regular POST might be better.
                },
            });
            if (response.status === 200) {
                toast.success("Link added successfully");
                setLink('');
                fetchMemories(); // Re-fetch memories
            }
        } catch (error) {
            toast.error("Error adding link");
            console.error("Error adding link:", error);
        }
    };

    const fetchMemories = async () => { // Made fetchMemories reusable
        setIsLoading(true); // Set loading true when fetching
        try {
            const response = await axios.get(`${server}/tributes/memories/${id}`);
            setMemories(response.data);
        } catch (error) {
            console.error("Error fetching memories:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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
            window.location.href = response.data;
        } catch (error) {
            toast.error("Error initializing payment");
            console.error("Error initializing payment:", error);
        }
    };

    // Combine images and videos for the lightbox
    const allMedia = useMemo(() => {
        const parsedImages = memories?.images ? JSON.parse(memories.images) : [];
        const parsedVideos = memories?.videos ? JSON.parse(memories.videos) : [];

        return [
            ...parsedImages.map(src => ({ type: 'image', src: `${assetServer}/images/gallery/${src}` })),
            ...parsedVideos.map(src => ({ type: 'video', src: `${assetServer}/${src}` }))
        ];
    }, [memories]);

    const openLightbox = (index) => {
        setSelectedMediaIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const showNextMedia = () => {
        setSelectedMediaIndex((prevIndex) => (prevIndex + 1) % allMedia.length);
    };

    const showPrevMedia = () => {
        setSelectedMediaIndex((prevIndex) => (prevIndex - 1 + allMedia.length) % allMedia.length);
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
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                    .then(() => {
                                        toast.success("Link copied to clipboard");
                                    })
                                    .catch(error => {
                                        console.error('Failed to copy link:', error);
                                        toast.error("Failed to copy link");
                                    });
                            }}
                        >
                            <Share className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                        {isMemorialLoading ? (
                            <div className="flex justify-center items-center">
                                <p>Loading memorial details...</p>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold">In Loving Memory</h1>
                                <p className="text-xl">{memorial?.first_name} {memorial?.middle_name} {memorial?.last_name} ({memorial?.nickname})</p>
                            </>
                        )}
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <section id="about">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Biography</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    {isMilestonesLoading ? (
                                        <div className="flex justify-center items-center">
                                            <p>Loading biography...</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">{milestonesData?.bio}</p>
                                    )}
                                </Card>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section id="birth">
                                    <h2 className="text-3xl font-light text-gray-800 mb-4">Birth</h2>
                                    <Card className="p-6 shadow-md bg-white">
                                        {isMemorialLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading birth details...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-gray-600">
                                                <p>Date: {new Date(memorial?.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} </p>
                                                <p>Location: {memorial?.country_of_birth}</p>
                                            </div>
                                        )}
                                    </Card>
                                </section>

                                <section id="death">
                                    <h2 className="text-3xl font-light text-gray-800 mb-4">Death</h2>
                                    <Card className="p-6 shadow-md bg-white">
                                        {isMemorialLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading death details...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-gray-600">
                                                <p>Date: {new Date(memorial?.date_of_death).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                <p>Location: {memorial?.country_died}</p>
                                            </div>
                                        )}
                                    </Card>
                                </section>
                            </div>

                            <section id="family">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Milestones</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    {isMilestonesLoading ? (
                                        <div className="flex justify-center items-center">
                                            <p>Loading milestones...</p>
                                        </div>
                                    ) : (
                                        <ul className="text-gray-600 list-disc list-inside">
                                            {milestonesData?.milestone?.map((item, index) => (
                                                item && <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </Card>
                            </section>

                            <section id="extended-family">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Family</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    {isMilestonesLoading ? (
                                        <div className="flex justify-center items-center">
                                            <p>Loading family tree...</p>
                                        </div>
                                    ) : (
                                        <div className="p-4 sm:p-8"> {/* Adjusted padding */}
                                            <FamilyTreeMinimal data={milestonesData?.family} />
                                        </div>
                                    )}
                                </Card>
                            </section>


                            <section id="memories">
                                <h2 className="text-3xl font-light text-gray-800 mb-4">Memories and Links</h2>
                                <Card className="p-6 shadow-md bg-white">
                                    {isLoading && !memories?.memories && !memories?.links ? ( // Show loading only if no data yet
                                        <div className="flex justify-center items-center">
                                            <p>Loading memories...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {memories?.memories && JSON.parse(memories.memories).length > 0 ? (
                                                JSON.parse(memories.memories).map((item, index) => (
                                                    item && (
                                                        <Card key={`memory-${index}`} className="p-4 shadow-sm bg-gray-50">
                                                            <p className="text-gray-700 whitespace-pre-wrap">{item}</p>
                                                        </Card>
                                                    )
                                                ))
                                            ) : <p className="text-gray-500">No text memories shared yet.</p>}

                                            {memories?.links && JSON.parse(memories.links).length > 0 ? (
                                                JSON.parse(memories.links).map((link, index) => (
                                                    link && (
                                                        <Card key={`link-${index}`} className="p-4 shadow-sm bg-gray-50">
                                                            <a href={link.startsWith('http') ? link : `//${link}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700 break-all">
                                                                {link}
                                                            </a>
                                                        </Card>
                                                    )
                                                ))
                                            ) : <p className="text-gray-500">No links shared yet.</p>}
                                        </div>
                                    )}
                                </Card>
                            </section>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-8">
                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Contribute</h2>
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="memory-text" className="text-sm font-medium text-gray-700 mb-1 block">Share a Memory (Text)</Label>
                                        <textarea
                                            id="memory-text"
                                            placeholder="Write your memory here..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                            value={memory}
                                            onChange={(e) => setMemory(e.target.value)}
                                        />
                                        <Button className="w-full mt-2 bg-primary  hover:bg-red-200" onClick={handleAddMemory} disabled={!memory.trim()}>
                                            Add Memory
                                        </Button>
                                    </div>
                                    {memories?.images && JSON.parse(memories.images).length < 10 ? (
                                        <div>
                                            <Label htmlFor="image-upload-input" className="text-sm font-medium text-gray-700 mb-1 block">Add a Photo</Label>
                                            <Input
                                                id="image-upload-input"
                                                type="file"
                                                accept="image/*"
                                                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                                onChange={(e) => setImage(e.target.files[0])}
                                            />
                                            <Button className="w-full mt-2 bg-primary  hover:bg-gray-200" onClick={handleAddImage} disabled={!image}>
                                                Upload Photo
                                            </Button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Uploadeding images not available right now</p>
                                    )}
                                    {/*{memories?.videos && JSON.parse(memories.videos).length < 2 ? (*/}
                                    {/*    <div>*/}
                                    {/*        <Label htmlFor="video-upload-input" className="text-sm font-medium text-gray-700 mb-1 block">Add a Video</Label>*/}
                                    {/*        <Input*/}
                                    {/*            id="video-upload-input"*/}
                                    {/*            type="file"*/}
                                    {/*            accept="video/*"*/}
                                    {/*            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"*/}
                                    {/*            onChange={(e) => setVideo(e.target.files[0])}*/}
                                    {/*        />*/}
                                    {/*        <Button className="w-full mt-2 bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleAddVideo} disabled={!video}>*/}
                                    {/*            Upload Video*/}
                                    {/*        </Button>*/}
                                    {/*    </div>*/}
                                    {/*) : (*/}
                                    {/*    <p className="text-sm text-gray-500">Maximum number of videos (2) reached.</p>*/}
                                    {/*)}*/}
                                    <div>
                                        <Label htmlFor="link-input" className="text-sm font-medium text-gray-700 mb-1 block">Add a Link</Label>
                                        <Input
                                            id="link-input"
                                            type="url"
                                            placeholder="https://example.com"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                        />
                                        <Button className="w-full mt-2 bg-primary hover:bg-gray-200" onClick={handleAddLink} disabled={!link.trim()}>
                                            Add Link
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* MODIFIED Images and Videos Section */}
                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Gallery</h2>
                                {isLoading && allMedia.length === 0 ? (
                                    <div className="flex justify-center items-center">
                                        <p>Loading gallery...</p>
                                    </div>
                                ) : (
                                    allMedia.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {allMedia.map((media, index) => (
                                                <div
                                                    key={index}
                                                    className="cursor-pointer aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                                    onClick={() => openLightbox(index)}
                                                >
                                                    {media.type === 'image' ? (
                                                        <img src={media.src} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="relative w-full h-full bg-black">
                                                            <video
                                                                src={media.src}
                                                                className="w-full h-full object-cover"
                                                                // controls // Optional: show controls on thumbnail
                                                                muted
                                                                playsInline
                                                                preload="metadata" // For faster thumbnail loading
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                <Camera className="h-8 w-8 text-white opacity-75" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No images or videos have been shared yet.</p>
                                    )
                                )}
                            </Card>
                            {/* END OF MODIFIED Section */}


                            <Card className="p-6 shadow-md bg-white">
                                <h2 className="text-2xl font-medium text-gray-800 mb-4">Events</h2>
                                <Events id={memorial?.id} user_id={memorial?.user_id} />
                            </Card>
                        </div>
                    </div>
                </main>

                <footer className="border-t bg-white py-4 mt-8">
                    <div className="container mx-auto px-4 text-center text-gray-500">
                        © {new Date().getFullYear()} Memorial Site. All rights reserved.
                    </div>
                </footer>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && allMedia.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={closeLightbox}>
                    <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 text-white bg-black/30 hover:bg-black/50 h-8 w-8"
                            onClick={closeLightbox}
                        >
                            <X className="h-5 w-5" />
                        </Button>

                        {allMedia[selectedMediaIndex].type === 'image' ? (
                            <img
                                src={allMedia[selectedMediaIndex].src}
                                alt={`View ${selectedMediaIndex + 1}`}
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />
                        ) : (
                            <video
                                src={allMedia[selectedMediaIndex].src}
                                controls
                                autoPlay
                                className="w-full max-h-[80vh] object-contain"
                            />
                        )}

                        {allMedia.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 h-10 w-10"
                                    onClick={showPrevMedia}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 h-10 w-10"
                                    onClick={showNextMedia}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </>
                        )}
                        <div className="text-center py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                            {selectedMediaIndex + 1} / {allMedia.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}