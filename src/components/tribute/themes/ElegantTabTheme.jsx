"use client"

import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card" // Removed CardFooter as it's not directly used for Card itself
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import { server } from "@/server.js"
import { assetServer } from "@/assetServer.js"
import Header from "@/components/landing/Header.jsx"
import { FamilyTreeMinimal } from "@/components/tribute/FamilyTreeMinimal.jsx"
import { toast } from "react-hot-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Textarea } from "@/components/ui/textarea"
import {
    Calendar,
    Mail,
    MessageSquare,
    Send,
    Upload,
    CalendarIcon,
    Clock,
    MapPin,
    Share,
    Link as LinkIcon,
    Volume2,
    VolumeX
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Events } from "@/components/tribute/Events.jsx";
import { ScrollArea } from "@/components/ui/scroll-area"

// Helper function for safe JSON parsing
const safeJsonParse = (jsonString, defaultValue = []) => {
    if (!jsonString) return defaultValue;
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (error) {
        console.error("Failed to parse JSON string:", error, jsonString);
        return defaultValue;
    }
};


export function ElegantTabTheme() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState("about")
    const [memorial, setMemorial] = useState(null)
    const [milestonesData, setMilestonesData] = useState([])
    const [memory, setMemory] = useState("")
    const [image, setImage] = useState(null)
    const [video, setVideo] = useState(null)
    const [link, setLink] = useState("")
    const [memories, setMemories] = useState({ images: "[]", videos: "[]", memories: "[]", links: "[]" })
    const [isLoading, setIsLoading] = useState(true) // General loading for memories tab
    const [isMemorialLoading, setIsMemorialLoading] = useState(true) // For hero and about tab
    const [isMilestonesLoading, setIsMilestonesLoading] = useState(true) // For life, milestones, family tabs
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
    const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    // Music State
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef(null);
    // IMPORTANT: Ensure this path points to an actual audio file in your public directory
    const themeMusicUrl = "/audio/elegant-theme-music.mp3";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
        tribute_id: id,
        anonymous: false,
    });
    const [messageData, setMessageData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        tribute_id: id
    })
    const [rsvpData, setRsvpData] = useState({
        name: "",
        email: "",
        phone: "",
        attendees: "1",
        event_id: "",
        tribute_id: id,
        anonymous: false
    })

    // Fetch memorial details
    useEffect(() => {
        setIsMemorialLoading(true);
        axios
            .get(`${server}/tribute/details/${id}`)
            .then(response => {
                setMemorial(response.data)
            })
            .catch(error => {
                console.error("Error fetching memorial details:", error)
                // toast.error("Could not load memorial details.");
            })
            .finally(() => {
                setIsMemorialLoading(false)
            })
    }, [id])

    // Fetch milestones and family data
    const fetchMilestonesData = async () => {
        setIsMilestonesLoading(true);
        try {
            const response = await axios.get(`${server}/tributes/${id}/bio-family`)
            if (response.data.status === "success") {
                setMilestonesData(response.data.data)
            } else {
                // toast.error(response.data.message || "Could not load life and family data.");
            }
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            // toast.error("Error fetching life and family data.");
        } finally {
            setIsMilestonesLoading(false)
        }
    }

    // Fetch memories
    const fetchMemories = async () => {
        setIsLoading(true); // This is for the 'media' tab's general loading state
        try {
            const response = await axios.get(`${server}/tributes/memories/${id}`)
            setMemories(response.data || { images: "[]", videos: "[]", memories: "[]", links: "[]" });
        } catch (error) {
            console.error("Error fetching memories:", error)
            // toast.error("Could not load memories.");
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) { // Ensure id is present before fetching
            fetchMilestonesData()
            fetchMemories()
        }
    }, [id])


    // Music Controls
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            if (!isMuted) {
                audioRef.current.play().catch(error => {
                    console.log("Audio autoplay prevented. User interaction might be needed.", error);
                    setIsMuted(true);
                    if (audioRef.current) audioRef.current.muted = true;
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(prevMuted => !prevMuted);
    };

    // --- Handlers for adding memories, images, videos, links ---
    // (Keeping existing logic, ensuring toast messages are consistent)
    const handleAddMemory = async () => {
        if (!memory.trim()) {
            toast.error("Please write a memory.");
            return;
        }
        try {
            const response = await axios.post(`${server}/memories/add/text`, { memory, tribute_id: id });
            if (response.status === 200) {
                toast.success("Memory Added Successfully");
                setMemory("");
                fetchMemories();
            } else {
                toast.error(response.data.message || "Failed to add memory.");
            }
        } catch (error) {
            toast.error("Error adding memory. Please try again.");
            console.error("Error adding memory:", error);
        }
    };

    const handleAddImage = async () => {
        if (!image) {
            toast.error("Please select an image to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("tribute_id", id);
        formData.append("files[]", image);
        try {
            const response = await axios.post(`${server}/memories/add/image`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            if (response.status === 200) {
                toast.success("Image uploaded successfully");
                setImage(null); // Clear the selected file
                fetchMemories();
            } else {
                toast.error(response.data.message || "Failed to upload image.");
            }
        } catch (error) {
            toast.error("Error uploading image. Please try again.");
            console.error("Error uploading image:", error);
        }
    };

    const handleAddVideo = async () => {
        if (!video) {
            toast.error("Please select a video to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("tribute_id", id);
        formData.append("files[]", video);
        try {
            const response = await axios.post(`${server}/memories/add/video`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            if (response.status === 200) {
                toast.success("Video uploaded successfully");
                setVideo(null); // Clear the selected file
                fetchMemories();
            } else {
                toast.error(response.data.message || "Failed to upload video.");
            }
        } catch (error) {
            toast.error("Error uploading video. Please try again.");
            console.error("Error uploading video:", error);
        }
    };

    const handleAddLink = async () => {
        if (!link.trim()) {
            toast.error("Please enter a link.");
            return;
        }
        // Basic URL validation (optional, but good practice)
        try {
            new URL(link);
        } catch (_) {
            toast.error("Please enter a valid URL (e.g., https://example.com).");
            return;
        }

        const payload = { tribute_id: id, links: link }; // Sending as JSON
        try {
            const response = await axios.post(`${server}/memories/add/link`, payload); // Assuming backend expects JSON
            if (response.status === 200) {
                toast.success("Link added successfully");
                setLink("");
                fetchMemories();
            } else {
                toast.error(response.data.message || "Failed to add link.");
            }
        } catch (error) {
            toast.error("Error adding link. Please try again.");
            console.error("Error adding link:", error);
        }
    };

    // --- Input change handlers ---
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMessageInputChange = e => {
        const { name, value } = e.target;
        setMessageData(prev => ({ ...prev, [name]: value }));
    };

    const handleRsvpInputChange = e => {
        const { name, value, type, checked } = e.target;
        setRsvpData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- Form submission handlers ---
    const handleDonationSubmit = async e => {
        e.preventDefault();
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error("Please enter a valid donation amount.");
            return;
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { // Basic email validation
            toast.error("Please enter a valid email address.");
            return;
        }
        if (!formData.anonymous && !formData.name.trim()) {
            toast.error("Please enter your name, or choose to donate anonymously.");
            return;
        }

        try {
            const payload = {
                tribute_id: formData.tribute_id,
                amount: formData.amount,
                email: formData.email,
                anonymous: formData.anonymous,
                name: formData.anonymous ? 'Anonymous Donor' : formData.name,
            };
            const response = await axios.post(`${server}/initialize-guest-payment`, payload);
            if (response.data && response.data.authorization_url) {
                window.location.href = response.data.authorization_url;
            } else if (response.request && response.request.responseURL && response.request.responseURL !== window.location.href) {
                window.location.href = response.request.responseURL;
            } else {
                toast.error("Could not retrieve payment URL. Please try again.");
                console.error("Payment initialization response:", response);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Error initializing payment. Please check your details.");
            console.error("Error initializing payment:", error.response || error);
        }
    };

    const handleMessageSubmit = async e => {
        e.preventDefault();
        if (!messageData.name.trim() || !messageData.email.trim() || !messageData.subject.trim() || !messageData.message.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(messageData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            const messagePayload = { ...messageData, user_id: memorial?.user_id };
            const response = await axios.post(`${server}/messages/send`, messagePayload);
            if (response.status === 200 && response.data.status === 'success') {
                toast.success("Message sent successfully");
                setMessageData({ name: "", email: "", subject: "", message: "", tribute_id: id, user_id: memorial?.user_id });
                setIsMessageModalOpen(false);
            } else {
                toast.error(response.data.message || "Failed to send message.");
            }
        } catch (error) {
            toast.error("Error sending message. Please try again.");
            console.error("Error sending message:", error);
        }
    };

    const handleRsvpSubmit = async e => {
        e.preventDefault();
        if (!rsvpData.name.trim() && !rsvpData.anonymous) {
            toast.error("Please enter your name or choose to RSVP anonymously (if available).");
            return;
        }
        if (!rsvpData.email.trim() && !rsvpData.anonymous) {
            toast.error("Please enter your email or choose to RSVP anonymously (if available).");
            return;
        }
        if (rsvpData.email.trim() && !/\S+@\S+\.\S+/.test(rsvpData.email) && !rsvpData.anonymous) {
            toast.error("Please enter a valid email address.");
            return;
        }
        if (parseInt(rsvpData.attendees, 10) < 1) {
            toast.error("Number of attendees must be at least 1.");
            return;
        }
        try {
            const payload = { ...rsvpData, attendees: parseInt(rsvpData.attendees, 10) || 1 };
            const response = await axios.post(`${server}/events/rsvp`, payload);
            if ((response.status === 200 || response.status === 201) && response.data.status === 'success') {
                toast.success("RSVP submitted successfully");
                setRsvpData({ name: "", email: "", phone: "", attendees: "1", event_id: "", tribute_id: id, anonymous: false });
                setIsRsvpModalOpen(false);
            } else {
                toast.error(response.data.message || "Failed to submit RSVP.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting RSVP. Please try again.");
            console.error("Error submitting RSVP:", error);
        }
    };

    const openRsvpModal = event => {
        setSelectedEvent(event);
        setRsvpData(prev => ({
            ...prev,
            event_id: event.id,
            name: "", email: "", phone: "", attendees: "1", anonymous: false
        }));
        setIsRsvpModalOpen(true);
    };

    // Parsed media for rendering
    const parsedImages = safeJsonParse(memories?.images);
    const parsedVideos = safeJsonParse(memories?.videos);
    const parsedTextMemories = safeJsonParse(memories?.memories);
    const parsedLinks = safeJsonParse(memories?.links);

    return (
        <>
            <Header />
            <audio ref={audioRef} src={themeMusicUrl} loop preload="auto" />

            <div className="bg-slate-100 min-h-screen font-sans text-slate-800"> {/* Slightly lighter bg */}
                {/* Mute/Unmute Button */}
                <Button
                    onClick={toggleMute}
                    variant="outline"
                    size="icon"
                    className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={isMuted ? "Unmute music" : "Mute music"}
                >
                    {isMuted ? <VolumeX className="h-5 w-5 text-slate-600" /> : <Volume2 className="h-5 w-5 text-primary" />}
                </Button>

                {/* Hero Banner */}
                <header
                    className="relative bg-cover bg-center text-white py-24 md:py-32 lg:py-40" // Adjusted padding
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/src/assets/landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png')`,
                        backgroundPosition: "center 30%"
                    }}
                >
                    <div className="relative container mx-auto text-center px-4">
                        {isMemorialLoading ? (
                            <div className="flex flex-col justify-center items-center min-h-[200px]">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-3"></div>
                                <p className="text-md">Loading memorial details...</p>
                            </div>
                        ) : memorial ? (
                            <>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-2 md:mb-3 font-medium tracking-tight">
                                    {memorial.first_name} {memorial.middle_name && `${memorial.middle_name} `}{memorial.last_name}
                                </h1>
                                {memorial.nickname && (
                                    <p className="text-lg sm:text-xl md:text-2xl font-light italic mb-3 md:mb-4 text-slate-200">
                                        "{memorial.nickname}"
                                    </p>
                                )}
                                <p className="text-md sm:text-lg md:text-xl font-light mb-6 md:mb-8 text-slate-100">
                                    {new Date(memorial.date_of_birth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    {" - "}
                                    {new Date(memorial.date_of_death).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8">
                                    <Button
                                        onClick={() => setIsDonationModalOpen(true)}
                                        className="bg-white text-slate-900 hover:bg-slate-200 px-6 py-3 sm:px-8 text-sm sm:text-base rounded-md shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                                    >
                                        Make a Donation
                                    </Button>
                                    <Button
                                        onClick={() => setIsMessageModalOpen(true)}
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 sm:px-8 text-sm sm:text-base rounded-md shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                                    >
                                        <MessageSquare className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                                        Contact Creator
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-lg sm:text-xl text-amber-400 min-h-[200px] flex items-center justify-center">Memorial details could not be loaded.</p>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto py-8 md:py-12 px-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="bg-white rounded-lg shadow-lg mb-8 md:mb-12 sticky top-0 z-30 backdrop-blur-lg bg-white/95 border-b border-slate-200">
                            {/* For mobile, TabsList can be made scrollable if too many tabs */}
                            <ScrollArea orientation="horizontal" className="sm:overflow-auto">
                                <TabsList className="w-max sm:w-full flex sm:grid sm:grid-cols-4 md:flex md:justify-center p-1 sm:p-1.5 bg-slate-100 rounded-t-lg">
                                    {["about", "life", "milestones", "family", "media", "contribute", "events"].map(tabValue => (
                                        <TabsTrigger
                                            key={tabValue}
                                            value={tabValue}
                                            className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md capitalize transition-all whitespace-nowrap"
                                        >
                                            {tabValue.replace('-', ' & ')}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </ScrollArea>
                        </div>

                        <div className="mt-6 max-w-5xl mx-auto"> {/* Slightly reduced max-width for content */}
                            {/* About Tab */}
                            <TabsContent value="about">
                                <Card className="bg-white shadow-lg overflow-hidden rounded-lg">
                                    <CardContent className="p-0">
                                        {isMemorialLoading ? (
                                            <div className="flex justify-center items-center p-8 md:p-12 text-slate-500 min-h-[300px]">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                                Loading details...
                                            </div>
                                        ) : memorial ? (
                                            <div className="flex flex-col lg:flex-row">
                                                <div className="lg:w-2/5 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
                                                    <div className="p-6 md:p-8 flex flex-col items-center text-center">
                                                        <div className="relative mb-5">
                                                            <img
                                                                src={memorial.image ? `${assetServer}/images/people/${memorial.image}` : "/placeholder.svg"}
                                                                alt={`${memorial.first_name} ${memorial.last_name}`}
                                                                className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full shadow-xl border-4 border-white"
                                                            />
                                                        </div>
                                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif mb-1 text-slate-800">
                                                            {memorial.first_name} {memorial.last_name}
                                                        </h2>
                                                        <p className="text-slate-500 text-sm sm:text-base mb-4">
                                                            {new Date(memorial.date_of_birth).getFullYear()} - {new Date(memorial.date_of_death).getFullYear()}
                                                        </p>
                                                        <div className="w-full mt-3 text-left space-y-3 text-sm">
                                                            <Separator className="my-4 bg-slate-200" />
                                                            <div className="flex items-center text-slate-600">
                                                                <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                                                                <span>{memorial.country_died || "Location unknown"}</span>
                                                            </div>
                                                            <div className="flex items-center text-slate-600">
                                                                <Calendar className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                                                                <span>Born: {new Date(memorial.date_of_birth).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="lg:w-3/5 p-6 md:p-8">
                                                    <h3 className="text-xl sm:text-2xl font-serif mb-4 text-slate-700">
                                                        About {memorial.first_name}
                                                    </h3>
                                                    {memorial.quote && (
                                                        <blockquote className="italic text-md sm:text-lg mb-6 text-slate-600 border-l-4 border-primary pl-4 py-1.5 bg-primary/10 rounded-r-md">
                                                            "{memorial.quote}"
                                                        </blockquote>
                                                    )}
                                                    <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed">
                                                        <p>Welcome to {memorial.first_name}'s memorial page. We created this memorial to celebrate the life of {memorial.first_name} {memorial.last_name} with family and friends.</p>
                                                        <p>This page serves as a gathering place for memories, photos, and stories that help us remember and celebrate {memorial.first_name}'s life.</p>
                                                    </div>
                                                    <div className="mt-8">
                                                        <h4 className="text-md sm:text-lg font-semibold mb-2.5 text-slate-700">Share this memorial:</h4>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            <Button variant="outline" size="sm" className="rounded-md border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm" onClick={() => { /* ... email logic ... */ }}>
                                                                <Mail className="h-3.5 w-3.5 mr-1.5" /> Email
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="rounded-md border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm" onClick={() => { /* ... copy link logic ... */ }}>
                                                                <LinkIcon className="h-3.5 w-3.5 mr-1.5" /> Copy Link
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="p-8 text-center text-slate-500 min-h-[300px] flex items-center justify-center">Details not available.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Life Tab */}
                            <TabsContent value="life">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardContent className="p-6 md:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center p-8 md:p-12 text-slate-500 min-h-[300px]">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                                Loading life story...
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl sm:text-3xl font-serif mb-6 md:mb-8 text-slate-800">Life Story</h2>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                                                    <div className="lg:col-span-2">
                                                        <h3 className="text-lg sm:text-xl font-serif mb-3 text-slate-700">Biography</h3>
                                                        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed">
                                                            <p>{milestonesData?.bio || "Biography information is not available at this moment."}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-200">
                                                        <h3 className="text-lg sm:text-xl font-serif mb-4 text-slate-700">Key Details</h3>
                                                        <ul className="space-y-4">
                                                            {[
                                                                { icon: Calendar, label: "Born", value: memorial?.date_of_birth ? new Date(memorial.date_of_birth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A" },
                                                                { icon: Calendar, label: "Passed", value: memorial?.date_of_death ? new Date(memorial.date_of_death).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A" },
                                                                { icon: MapPin, label: "Location", value: memorial?.country_died || "Unknown" }
                                                            ].map(item => (
                                                                <li key={item.label} className="flex items-start">
                                                                    <div className="bg-slate-200 p-2 rounded-full mr-3 mt-0.5 flex-shrink-0">
                                                                        <item.icon className="h-4 w-4 text-slate-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-xs sm:text-sm text-slate-500">{item.label}</span>
                                                                        <span className="font-medium text-slate-700 text-sm sm:text-base">{item.value}</span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Milestones Tab */}
                            <TabsContent value="milestones">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardContent className="p-6 md:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center p-8 md:p-12 text-slate-500 min-h-[300px]">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                                Loading milestones...
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl sm:text-3xl font-serif mb-6 md:mb-8 text-slate-800">Life Milestones</h2>
                                                <div className="relative border-l-2 border-slate-200 ml-3 pl-8 py-2 sm:ml-4 sm:pl-10">
                                                    {(milestonesData?.milestone && milestonesData.milestone.length > 0) ? milestonesData.milestone.map(
                                                        (item, index) =>
                                                            item && (
                                                                <div key={index} className="mb-8 relative">
                                                                    <div className="absolute -left-[calc(2rem+1px)] sm:-left-[calc(2.5rem+1px)] top-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary ring-4 ring-white flex items-center justify-center shadow">
                                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                                                                    </div>
                                                                    <div className="bg-slate-50 p-4 sm:p-5 rounded-lg shadow-sm border border-slate-100">
                                                                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{item}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                    ) : (
                                                        <p className="text-slate-500 italic text-sm sm:text-base">No milestones have been added yet.</p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Family Tree Tab */}
                            <TabsContent value="family">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardContent className="p-6 md:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center p-8 md:p-12 text-slate-500 min-h-[300px]">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                                Loading family tree...
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl sm:text-3xl font-serif mb-6 md:mb-8 text-slate-800">Family Tree</h2>
                                                <div className="overflow-x-auto bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200 min-h-[200px]">
                                                    <FamilyTreeMinimal data={milestonesData?.family} />
                                                </div>
                                                {(!milestonesData?.family || Object.keys(milestonesData.family).length === 0) && (
                                                    <p className="text-slate-500 italic text-center mt-6 text-sm sm:text-base">Family tree information is not available.</p>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Media & Memories Tab */}
                            <TabsContent value="media">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardContent className="p-6 md:p-8">
                                        <h2 className="text-2xl sm:text-3xl font-serif mb-6 md:mb-8 text-slate-800">Media & Memories</h2>
                                        {isLoading ? (
                                            <div className="flex justify-center items-center p-8 md:p-12 text-slate-500 min-h-[300px]">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                                Loading media...
                                            </div>
                                        ) : (
                                            <div className="space-y-8 md:space-y-10">
                                                {/* Images Section */}
                                                <div>
                                                    <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-slate-700">
                                                        <span className="bg-slate-100 p-1.5 sm:p-2 rounded-full mr-2.5 border border-slate-200"><Upload className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" /></span>Photos
                                                    </h3>
                                                    {parsedImages.length > 0 ? (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                                            {parsedImages.map((image, index) => (
                                                                <div key={index} className="relative group overflow-hidden rounded-lg shadow-md aspect-square border border-slate-200">
                                                                    <img src={`${assetServer}/images/gallery/${image}`} alt={`Memory ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : <p className="text-slate-500 italic text-sm sm:text-base">No photos shared yet.</p>}
                                                </div>

                                                {/* Videos Section */}
                                                {parsedVideos.length > 0 && (
                                                    <div>
                                                        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-slate-700">
                                                            <span className="bg-slate-100 p-1.5 sm:p-2 rounded-full mr-2.5 border border-slate-200"><Upload className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" /></span>Videos
                                                        </h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                                            {parsedVideos.map((video, index) => (
                                                                <div key={index} className="rounded-lg overflow-hidden shadow-md border border-slate-200">
                                                                    <video controls className="w-full h-auto aspect-video bg-black rounded-t-lg">
                                                                        <source src={`${assetServer}/${video}`} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Memories Section */}
                                                <div>
                                                    <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-slate-700">
                                                        <span className="bg-slate-100 p-1.5 sm:p-2 rounded-full mr-2.5 border border-slate-200"><MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" /></span>Shared Memories
                                                    </h3>
                                                    {parsedTextMemories.length > 0 ? (
                                                        <div className="space-y-4 sm:space-y-5">
                                                            {parsedTextMemories.map((text, index) => (
                                                                <Card key={index} className="bg-slate-50 border border-slate-200 shadow-sm">
                                                                    <CardContent className="p-4 sm:p-5">
                                                                        <div className="flex items-center mb-3">
                                                                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 mr-2.5 border-2 border-white shadow">
                                                                                <AvatarFallback className="bg-primary/20 text-primary text-xs sm:text-sm">{text.substring(0, 1).toUpperCase() || "M"}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <p className="text-xs sm:text-sm font-medium text-slate-700">Memory Contributor</p>
                                                                                <p className="text-xs text-slate-500">Shared a memory</p>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">{text}</p>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    ) : <p className="text-slate-500 italic text-sm sm:text-base">No memories shared yet.</p>}
                                                </div>

                                                {/* Links Section */}
                                                {parsedLinks.length > 0 && (
                                                    <div>
                                                        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-slate-700">
                                                            <span className="bg-slate-100 p-1.5 sm:p-2 rounded-full mr-2.5 border border-slate-200"><LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" /></span>Shared Links
                                                        </h3>
                                                        <div className="space-y-2.5 sm:space-y-3">
                                                            {parsedLinks.map((linkItem, index) => (
                                                                <Card key={index} className="bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                                                    <CardContent className="p-3 sm:p-4">
                                                                        <a href={linkItem} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-xs sm:text-sm">
                                                                            {linkItem}
                                                                        </a>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Contribute Tab */}
                            <TabsContent value="contribute">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardContent className="p-6 md:p-8">
                                        <h2 className="text-2xl sm:text-3xl font-serif mb-6 md:mb-8 text-slate-800">Share Your Memories & Tributes</h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-slate-700">Add a Written Memory</h3>
                                                    <Textarea placeholder="Share your memory or message of condolence..." className="min-h-[140px] w-full border-slate-300 focus:border-primary focus:ring-primary rounded-md text-sm sm:text-base" value={memory} onChange={e => setMemory(e.target.value)} />
                                                    <Button className="w-full mt-3 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-md text-sm sm:text-base" onClick={handleAddMemory} disabled={!memory.trim()}>
                                                        <Send className="mr-2 h-4 w-4" /> Share Memory
                                                    </Button>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-slate-700">Add a Link</h3>
                                                    <Input type="url" placeholder="https://example.com" value={link} onChange={e => setLink(e.target.value)} className="border-slate-300 focus:border-primary focus:ring-primary rounded-md text-sm sm:text-base" />
                                                    <Button className="w-full mt-3 py-2.5 rounded-md text-sm sm:text-base" variant="outline" onClick={handleAddLink} disabled={!link.trim()}>
                                                        <LinkIcon className="mr-2 h-4 w-4" /> Add Link
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-slate-700">Upload Media</h3>
                                                {[
                                                    { type: 'Photo', id: 'photo-upload', accept: 'image/*', state: image, setState: setImage, handler: handleAddImage, maxSize: '10MB' },
                                                    { type: 'Video', id: 'video-upload', accept: 'video/*', state: video, setState: setVideo, handler: handleAddVideo, maxSize: '50MB' }
                                                ].map(item => (
                                                    <div key={item.id}>
                                                        <Label htmlFor={item.id} className="block mb-1.5 font-medium text-slate-600 text-sm sm:text-base">Upload {item.type}</Label>
                                                        <label htmlFor={item.id} className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer block">
                                                            <input id={item.id} type="file" className="hidden" accept={item.accept} onChange={e => item.setState(e.target.files[0])} />
                                                            <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
                                                            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">{item.state ? item.state.name : "Click to upload or drag and drop"}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">{item.accept.split('/')[0].toUpperCase()} up to {item.maxSize}</p>
                                                        </label>
                                                        {item.state && <Button className="w-full mt-2.5 py-2.5 rounded-md text-sm sm:text-base" onClick={item.handler}>Upload {item.type}</Button>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Separator className="my-8 md:my-10 bg-slate-200" />
                                        <section id="donations" className="mt-6">
                                            <h3 className="text-xl sm:text-2xl font-serif mb-4 text-slate-800">Make a Donation</h3>
                                            <Card className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
                                                <p className="text-slate-700 mb-4 text-sm sm:text-base leading-relaxed">
                                                    To Honour {memorial?.first_name} {memorial?.last_name}'s memory, please consider making a donation. Your contribution is greatly appreciated.
                                                </p>
                                                <Button className="bg-primary hover:bg-primary/90 text-white py-2.5 px-5 sm:px-6 rounded-md text-sm sm:text-base" onClick={() => setIsDonationModalOpen(true)}>
                                                    Make a Donation
                                                </Button>
                                            </Card>
                                        </section>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Events Tab */}
                            <TabsContent value="events">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardContent className="p-6 md:p-8">
                                        <h2 className="text-2xl sm:text-3xl font-serif mb-6 md:mb-8 text-slate-800">Memorial Events</h2>
                                        <Events id={memorial?.id} user_id={memorial?.user_id} onRsvpClick={openRsvpModal} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </main>

                <footer className="bg-slate-800 text-slate-300 py-10 md:py-16 mt-12 md:mt-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                            <div>
                                <h3 className="text-md sm:text-lg font-semibold text-white mb-3">About This Memorial</h3>
                                <p className="text-xs sm:text-sm leading-relaxed">
                                    This memorial page was created to remember and Honour the life of {memorial?.first_name} {memorial?.last_name}.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-md sm:text-lg font-semibold text-white mb-3">Contact Creator</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-xs sm:text-sm"
                                    onClick={() => setIsMessageModalOpen(true)}
                                >
                                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Send a Message
                                </Button>
                            </div>
                            <div>
                                <h3 className="text-md sm:text-lg font-semibold text-white mb-3">Share This Page</h3>
                                <div className="flex space-x-2.5">
                                    <Button variant="outline" size="icon" className="rounded-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-8 w-8 sm:h-9 sm:w-9" onClick={() => { /* ... email logic ... */ }}>
                                        <Mail className="h-4 w-4 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-8 w-8 sm:h-9 sm:w-9" onClick={() => { /* ... generic share or copy link ... */ }}>
                                        <Share className="h-4 w-4 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-6 md:my-8 bg-slate-700" />
                        <div className="text-center text-slate-400 text-xs sm:text-sm">
                            <p>&copy; {new Date().getFullYear()} Remembered Always. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* --- Modals --- */}
            {/* Donation Modal */}
            <Dialog open={isDonationModalOpen} onOpenChange={setIsDonationModalOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-lg">
                    <DialogHeader className="p-5 sm:p-6 border-b border-slate-200">
                        <DialogTitle className="text-lg sm:text-xl font-serif text-slate-800">Make a Donation</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Your contribution Honours {memorial?.first_name} {memorial?.last_name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDonationSubmit} className="space-y-4 p-5 sm:p-6">
                        {memorial?.allow_anonymous === 1 && (
                            <div className="flex items-center space-x-2">
                                <Checkbox id="anonymous-donation" name="anonymous" checked={formData.anonymous} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked }))} />
                                <Label htmlFor="anonymous-donation" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">Donate Anonymously</Label>
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label htmlFor="donation-name" className="text-xs sm:text-sm font-medium text-slate-700">Name</Label>
                            <Input id="donation-name" name="name" placeholder={formData.anonymous ? "Optional" : "Your full name"} value={formData.name} onChange={handleInputChange} required={!formData.anonymous} disabled={formData.anonymous} className="border-slate-300 rounded-md text-sm sm:text-base"/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="donation-email" className="text-xs sm:text-sm font-medium text-slate-700">Email</Label>
                            <Input id="donation-email" name="email" type="email" placeholder="Your email (for receipt)" value={formData.email} onChange={handleInputChange} required className="border-slate-300 rounded-md text-sm sm:text-base"/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="donation-amount" className="text-xs sm:text-sm font-medium text-slate-700">Amount (USD)</Label>
                            <Input id="donation-amount" name="amount" type="number" min="1" placeholder="Enter amount" value={formData.amount} onChange={handleInputChange} required className="border-slate-300 rounded-md text-sm sm:text-base"/>
                        </div>
                        <DialogFooter className="pt-3">
                            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 py-2.5 rounded-md text-sm sm:text-base">
                                Proceed to Payment
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Message Modal */}
            <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                <DialogContent className="sm:max-w-lg bg-white rounded-lg">
                    <DialogHeader className="p-5 sm:p-6 border-b border-slate-200">
                        <DialogTitle className="text-lg sm:text-xl font-serif text-slate-800">Message Memorial Creator</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Send a message regarding {memorial?.first_name}'s memorial.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMessageSubmit} className="space-y-4 p-5 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="message-modal-name" className="text-xs sm:text-sm font-medium text-slate-700">Your Name</Label>
                                <Input id="message-modal-name" name="name" placeholder="John Doe" value={messageData.name} onChange={handleMessageInputChange} required className="border-slate-300 rounded-md text-sm sm:text-base"/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="message-modal-email" className="text-xs sm:text-sm font-medium text-slate-700">Your Email</Label>
                                <Input id="message-modal-email" name="email" type="email" placeholder="you@example.com" value={messageData.email} onChange={handleMessageInputChange} required className="border-slate-300 rounded-md text-sm sm:text-base"/>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="message-modal-subject" className="text-xs sm:text-sm font-medium text-slate-700">Subject</Label>
                            <Input id="message-modal-subject" name="subject" placeholder="Regarding the memorial..." value={messageData.subject} onChange={handleMessageInputChange} required className="border-slate-300 rounded-md text-sm sm:text-base"/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="message-modal-content" className="text-xs sm:text-sm font-medium text-slate-700">Message</Label>
                            <Textarea id="message-modal-content" name="message" placeholder="Your message..." value={messageData.message} onChange={handleMessageInputChange} required className="min-h-[100px] sm:min-h-[120px] border-slate-300 rounded-md text-sm sm:text-base"/>
                        </div>
                        <DialogFooter className="pt-3">
                            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 py-2.5 rounded-md text-sm sm:text-base">
                                <Send className="mr-2 h-4 w-4" /> Send Message
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* RSVP Modal */}
            <Dialog open={isRsvpModalOpen} onOpenChange={setIsRsvpModalOpen}>
                <DialogContent className="sm:max-w-lg bg-white rounded-lg">
                    <DialogHeader className="p-5 sm:p-6 border-b border-slate-200">
                        <DialogTitle className="text-lg sm:text-xl font-serif text-slate-800">RSVP for Event</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            {selectedEvent ? `Confirm attendance for: ${selectedEvent.title}` : "Confirm your attendance."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRsvpSubmit} className="space-y-4 p-5 sm:p-6">
                        {/* Example: Anonymous RSVP option - uncomment and adapt if needed
                        {memorial?.allow_anonymous_rsvp === 1 && (
                            <div className="flex items-center space-x-2">
                                <Checkbox id="anonymous-rsvp" name="anonymous" checked={rsvpData.anonymous} onCheckedChange={(checked) => setRsvpData(prev => ({...prev, anonymous: checked}))} />
                                <Label htmlFor="anonymous-rsvp" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">RSVP Anonymously</Label>
                            </div>
                        )}
                        */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="rsvp-modal-name" className="text-xs sm:text-sm font-medium text-slate-700">Your Name</Label>
                                <Input id="rsvp-modal-name" name="name" placeholder="John Doe" value={rsvpData.name} onChange={handleRsvpInputChange} required={!rsvpData.anonymous} disabled={rsvpData.anonymous} className="border-slate-300 rounded-md text-sm sm:text-base"/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="rsvp-modal-email" className="text-xs sm:text-sm font-medium text-slate-700">Your Email</Label>
                                <Input id="rsvp-modal-email" name="email" type="email" placeholder="you@example.com" value={rsvpData.email} onChange={handleRsvpInputChange} required={!rsvpData.anonymous} disabled={rsvpData.anonymous} className="border-slate-300 rounded-md text-sm sm:text-base"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="rsvp-modal-phone" className="text-xs sm:text-sm font-medium text-slate-700">Phone <span className="text-xs text-slate-400">(Optional)</span></Label>
                                <Input id="rsvp-modal-phone" name="phone" placeholder="Your phone number" value={rsvpData.phone} onChange={handleRsvpInputChange} className="border-slate-300 rounded-md text-sm sm:text-base"/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="rsvp-modal-attendees" className="text-xs sm:text-sm font-medium text-slate-700">Number of Attendees</Label>
                                <Input id="rsvp-modal-attendees" name="attendees" type="number" min="1" value={rsvpData.attendees} onChange={handleRsvpInputChange} required className="border-slate-300 rounded-md text-sm sm:text-base"/>
                            </div>
                        </div>
                        <DialogFooter className="pt-3">
                            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 py-2.5 rounded-md text-sm sm:text-base">
                                <CalendarIcon className="mr-2 h-4 w-4" /> Confirm Attendance
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}