"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import axios from "axios"
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area";

// UI Components
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ExternalLink,
    Heart,
    Calendar,
    MapPin,
    Quote,
    Clock,
    Gift,
    MessageCircle,
    Share2,
    Camera,
    Loader2,
    Volume2,
    VolumeX,
    Users,
    Award,
    UploadCloud,
    Link2,
    Trash2
} from "lucide-react"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";

// Config
import { server } from "@/server.js"
import Header from "@/components/landing/Header.jsx";
import { assetServer } from "@/assetServer.js";
import { FamilyTreeMinimal } from "@/components/tribute/FamilyTreeMinimal.jsx";
import { toast } from "react-hot-toast";
import { Events } from "@/components/tribute/Events.jsx";

// Helper Function for Date Formatting
const formatDate = dateString => {
    if (!dateString) return "N/A"
    try {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    } catch (e) {
        console.warn("Invalid date string for formatDate:", dateString);
        return "Invalid Date"
    }
}

// Helper function to safely parse JSON strings
const parseMemoryJson = (jsonString) => {
    if (!jsonString || typeof jsonString !== 'string') {
        return [];
    }
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to parse memory JSON:", error, "String was:", jsonString);
        return [];
    }
};

export function ModernTheme({ fallbackId }) {
    const params = useParams();
    const id = params?.id || fallbackId;

    // State for main memorial details
    const [memorial, setMemorial] = useState(null);
    const [isMemorialLoading, setIsMemorialLoading] = useState(true);
    const [memorialError, setMemorialError] = useState(null);

    // State for memories, images, videos, links
    const [memoriesData, setMemoriesData] = useState(null);
    const [isMemoriesLoading, setIsMemoriesLoading] = useState(true);
    const [memoriesError, setMemoriesError] = useState(null);

    // State for family data
    const [familyData, setFamilyData] = useState(null);
    const [isFamilyLoading, setIsFamilyLoading] = useState(true);

    // State for Milestones data
    const [milestonesData, setMilestonesData] = useState(null);
    const [isMilestonesLoading, setIsMilestonesLoading] = useState(true);
    const [milestonesError, setMilestonesError] = useState(null);

    const [activeTab, setActiveTab] = useState("story");
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageData, setMessageData] = useState({
        name: "", email: "", subject: "", message: "",
    });
    const [isSending, setIsSending] = useState(false)

    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [donationFormData, setDonationFormData] = useState({
        name: "", email: "", amount: "", tribute_id: id, anonymous: false,
    });
    const [isProcessingDonation, setIsProcessingDonation] = useState(false);

    // --- State for Guest Contributions ---
    const [memory, setMemory] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [link, setLink] = useState("");
    const [linkTitle, setLinkTitle] = useState("");
    const [isSubmittingMemory, setIsSubmittingMemory] = useState(false);
    const [isSubmittingImage, setIsSubmittingImage] = useState(false);
    const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);
    const [isSubmittingLink, setIsSubmittingLink] = useState(false);

    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const BACKGROUND_MUSIC_URL = memorial?.music ? `${assetServer}/api/music/${memorial.music.split('/').pop()}` : null;

    // --- Fetch Main Memorial Details ---
    const fetchMemorial = useCallback(async () => {
        setIsMemorialLoading(true);
        if (!familyData) setIsFamilyLoading(true);
        setMemorialError(null);
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`);
            const fetchedData = response.data;
            fetchedData.biography = fetchedData.biography || "A detailed life story about the beloved individual will be added here soon.";
            fetchedData.epitaph = fetchedData.epitaph || "Forever in our hearts.";
            fetchedData.donation_charity = fetchedData.donation_charity || "a cause dear to their heart";
            fetchedData.achievements = Array.isArray(fetchedData.achievements) ? fetchedData.achievements : [];
            fetchedData.favorite_quotes = Array.isArray(fetchedData.favorite_quotes) ? fetchedData.favorite_quotes : [];
            setMemorial(fetchedData);
            if (fetchedData.family) {
                setFamilyData(fetchedData.family);
                setIsFamilyLoading(false);
            } else if (!familyData) {
                setIsFamilyLoading(false);
            }
        } catch (err) {
            setMemorialError("Failed to load tribute details. Please try again later.");
            console.error("Error fetching memorial details:", err);
            setMemorial(null);
            if (!familyData) setFamilyData(null);
            if (!familyData) setIsFamilyLoading(false);
        } finally {
            setIsMemorialLoading(false);
        }
    }, [id, familyData]);

    useEffect(() => {
        if (id) fetchMemorial();
    }, [id, fetchMemorial]);

    const fetchMemoriesData = useCallback(async () => {
        setIsMemoriesLoading(true);
        setMemoriesError(null);
        try {
            const response = await axios.get(`${server}/tributes/memories/${id}`);
            const rawData = response.data;
            const parsedData = {
                memories: parseMemoryJson(rawData?.memories),
                images: parseMemoryJson(rawData?.images),
                videos: parseMemoryJson(rawData?.videos),
                links: parseMemoryJson(rawData?.links),
            };
            setMemoriesData(parsedData);
        } catch (err) {
            setMemoriesError("Failed to load memories and gallery. Please try again later.");
            console.error("Error fetching memories data:", err);
            setMemoriesData({ memories: [], images: [], videos: [], links: [] });
        } finally {
            setIsMemoriesLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchMemoriesData();
    }, [id, fetchMemoriesData]);

    const fetchMilestonesAndFamilyData = useCallback(async () => {
        setIsMilestonesLoading(true);
        if (!familyData) setIsFamilyLoading(true);
        setMilestonesError(null);
        try {
            const response = await axios.get(`${server}/tributes/${id}/bio-family`);
            if (response.data.status === "success" && response.data.data) {
                const data = response.data.data;
                setMilestonesData(data);
                if (data.family && !familyData) {
                    setFamilyData(data.family);
                }
            } else {
                setMilestonesError(response.data.message || "Failed to load milestones.");
                setMilestonesData(null);
            }
        } catch (error) {
            setMilestonesError("Error fetching milestones. Please try again later.");
            console.error("Error fetching milestones:", error);
            setMilestonesData(null);
        } finally {
            setIsMilestonesLoading(false);
            if (!familyData) setIsFamilyLoading(false);
        }
    }, [id, familyData]);

    useEffect(() => {
        if (id) fetchMilestonesAndFamilyData();
    }, [id, fetchMilestonesAndFamilyData]);

    // Audio handling
    useEffect(() => {
        if (!BACKGROUND_MUSIC_URL) {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
            return;
        }
        const audioInstance = new Audio();
        audioRef.current = audioInstance;
        audioInstance.loop = true; audioInstance.muted = isMuted; audioInstance.volume = 0.3;
        const errorHandler = (e) => {
            console.error("Audio Error:", e); setIsMuted(true); if (audioRef.current) audioRef.current.muted = true;
        };
        audioInstance.addEventListener('error', errorHandler);
        audioInstance.src = BACKGROUND_MUSIC_URL;
        if (!isMuted) {
            audioInstance.addEventListener('canplaythrough', () => {
                if (audioRef.current && !audioRef.current.muted) {
                    audioRef.current.play().catch(playError => {
                        console.warn("Music play() failed after canplaythrough:", playError); setIsMuted(true); if (audioRef.current) audioRef.current.muted = true;
                    });
                }
            });
            audioInstance.load();
            audioInstance.play().catch(initialPlayError => {
                if (initialPlayError.name === 'NotSupportedError') { setIsMuted(true); if (audioRef.current) audioRef.current.muted = true; }
            });
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('error', errorHandler);
                audioRef.current.removeEventListener('canplaythrough', () => {});
                audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null;
            }
        };
    }, [BACKGROUND_MUSIC_URL, isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prevMuted => {
            const newMutedState = !prevMuted;
            if (audioRef.current) {
                audioRef.current.muted = newMutedState;
                if (!newMutedState && audioRef.current.paused) {
                    if (audioRef.current.src && audioRef.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
                        audioRef.current.play().catch(e => { if(audioRef.current) audioRef.current.muted = true; return true; });
                    } else if (audioRef.current.src) {
                        audioRef.current.load();
                        audioRef.current.play().catch(e => { if(audioRef.current) audioRef.current.muted = true; return true; });
                    }
                } else if (newMutedState) {
                    audioRef.current.pause();
                }
            }
            return newMutedState;
        });
    }, []);

    const handleMessageDataChange = (e) => {
        const {name, value} = e.target;
        setMessageData(prev => ({...prev, [name]: value}));
    };

    const handleMessageSubmit = async e => {
        e.preventDefault();
        if (!messageData.name.trim() || !messageData.email.trim() || !messageData.subject.trim() || !messageData.message.trim()) {
            toast.error("Please fill in all required fields."); return;
        }
        if (!/\S+@\S+\.\S+/.test(messageData.email)) {
            toast.error("Please enter a valid email address."); return;
        }
        setIsSending(true);
        try {
            const messagePayload = { ...messageData, tribute_id: id, user_id: memorial?.user_id };
            const response = await axios.post(`${server}/messages/send`, messagePayload);
            if (response.status === 200 && response.data.status === 'success') {
                toast.success("Message sent successfully");
                setMessageData({ name: "", email: "", subject: "", message: "" });
                setIsMessageModalOpen(false);
            } else {
                toast.error(response.data.message || "Failed to send message.");
            }
        } catch (error) {
            toast.error("Error sending message. Please try again.");
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleDonationInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDonationFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDonationSubmit = async e => {
        e.preventDefault();
        if (!donationFormData.amount || parseFloat(donationFormData.amount) <= 0) {
            toast.error("Please enter a valid donation amount."); return;
        }
        if (!donationFormData.email.trim() || !/\S+@\S+\.\S+/.test(donationFormData.email)) {
            toast.error("Please enter a valid email address."); return;
        }
        if (!donationFormData.anonymous && !donationFormData.name.trim()) {
            toast.error("Please enter your name, or choose to donate anonymously."); return;
        }
        setIsProcessingDonation(true);
        try {
            const payload = { ...donationFormData, tribute_id: id, name: donationFormData.anonymous ? 'Anonymous Donor' : donationFormData.name };
            const response = await axios.post(`${server}/initialize-guest-payment`, payload);
            if (response.data && response.data.authorization_url) {
                window.location.href = response.data.authorization_url;
            } else if (response.request && response.request.responseURL && response.request.responseURL !== window.location.href) {
                window.location.href = response.request.responseURL;
            } else {
                toast.error("Could not retrieve payment URL. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Error initializing payment. Please check your details.");
        } finally {
            setIsProcessingDonation(false);
        }
    };

    // --- Separate Contribution Handlers ---
    const handleAddMemory = async () => {
        if (!memory.trim()) {
            toast.error("Please write a memory.");
            return;
        }
        setIsSubmittingMemory(true);
        try {
            const response = await axios.post(`${server}/memories/add/text`, {
                memory,
                tribute_id: id
            });
            if (response.data.status === "success") {
                toast.success("Memory added successfully!");
                setMemory("");
                fetchMemoriesData();
            } else {
                toast.error(response.data.message || "Failed to add memory.");
            }
        } catch (error) {
            toast.error("Error adding memory. Please try again.");
            console.error("Error adding memory:", error);
        } finally {
            setIsSubmittingMemory(false);
        }
    };

    const handleAddImage = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Image size should be less than 5MB");
            return;
        }

        setIsSubmittingImage(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("tribute_id", id);

        try {
            const response = await axios.post(`${server}/memories/add/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.status === "success") {
                toast.success("Image uploaded successfully!");
                e.target.value = ""; // Clear the file input
                fetchMemoriesData();
            } else {
                toast.error(response.data.message || "Failed to upload image.");
            }
        } catch (error) {
            toast.error("Error uploading image. Please try again.");
            console.error("Image upload error:", error);
        } finally {
            setIsSubmittingImage(false);
        }
    };

    const handleAddVideo = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            toast.error("Video size should be less than 50MB");
            return;
        }

        setIsSubmittingVideo(true);
        const formData = new FormData();
        formData.append("video", file);
        formData.append("tribute_id", id);

        try {
            const response = await axios.post(`${server}/memories/add/video`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.status === "success") {
                toast.success("Video uploaded successfully!");
                e.target.value = ""; // Clear the file input
                fetchMemoriesData();
            } else {
                toast.error(response.data.message || "Failed to upload video.");
            }
        } catch (error) {
            toast.error("Error uploading video. Please try again.");
            console.error("Video upload error:", error);
        } finally {
            setIsSubmittingVideo(false);
        }
    };

    const handleAddLink = async () => {
        if (!link.trim()) {
            toast.error("Please enter a link.");
            return;
        }

        try {
            new URL(link);
        } catch (_) {
            toast.error("Please enter a valid URL (e.g., https://example.com)");
            return;
        }

        setIsSubmittingLink(true);
        try {
            const response = await axios.post(`${server}/memories/add/link`, {
                links: link,
                title: linkTitle || "Shared Link",
                tribute_id: id
            });

            if (response.data.status === "success") {
                toast.success("Link added successfully!");
                setLink("");
                setLinkTitle("");
                fetchMemoriesData();
            } else {
                toast.error(response.data.message || "Failed to add link.");
            }
        } catch (error) {
            toast.error("Error adding link. Please try again.");
            console.error("Link submission error:", error);
        } finally {
            setIsSubmittingLink(false);
        }
    };

    const overallLoading = isMemorialLoading || isMemoriesLoading || isFamilyLoading || isMilestonesLoading;

    if (overallLoading && !memorial) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 p-4">
                <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-rose-600" />
                <p className="mt-4 md:mt-6 text-md md:text-lg font-medium">Loading Tribute...</p>
            </div>
        );
    }

    if (memorialError && !memorial) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-6 text-center">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">An Error Occurred</h2>
                <p className="mb-6 text-sm md:text-base">{memorialError}</p>
                <Button onClick={() => fetchMemorial()} className="bg-rose-600 hover:bg-rose-700 text-white">Try Again</Button>
            </div>
        );
    }

    if (!memorial) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-700 p-6 text-center">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Tribute Not Found</h2>
                <p className="mb-6 text-sm md:text-base">The tribute you're looking for doesn't exist or has been removed.</p>
                <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white"><a href="/">Return Home</a></Button>
            </div>
        );
    }

    const fullName = `${memorial.first_name || ""} ${memorial.middle_name || ""} ${memorial.last_name || ""}`.replace(/\s+/g, " ").trim();
    const lifeDates = `${formatDate(memorial.date_of_birth)} - ${formatDate(memorial.date_of_death)}`;
    const yearsLived = memorial.date_of_birth && memorial.date_of_death ? `${new Date(memorial.date_of_birth).getFullYear()} - ${new Date(memorial.date_of_death).getFullYear()}` : "Dates N/A";
    const age = memorial.date_of_birth && memorial.date_of_death ? Math.floor((new Date(memorial.date_of_death) - new Date(memorial.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) : null;

    const textMemories = memoriesData?.memories || [];
    const galleryImages = memoriesData?.images || [];
    const galleryVideos = memoriesData?.videos || [];
    const actualMilestones = milestonesData?.milestone || [];

    const TABS_CONFIG = [
        { value: "story", label: "Life Story" },
        { value: "gallery", label: "Gallery" },
        { value: "timeline", label: "Timeline" },
        { value: "family", label: "Family" },
        { value: "milestones", label: "Milestones" },
        { value: "tributes", label: "Tributes" },
        { value: "contribute", label: "Contribute" },
        { value: "service", label: "Service" },
        { value: "donate", label: "Donate" },
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-rose-50 text-slate-800 font-sans">
                {/* Hero Banner */}
                <div className="relative bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    {memorial.image && (
                        <div className="absolute inset-0">
                            <img src={`${assetServer}/images/people/${memorial.image}`} alt={fullName} className="object-cover w-full h-full opacity-30" />
                        </div>
                    )}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-20">
                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/70 shadow-xl flex-shrink-0 bg-rose-500 flex items-center justify-center">
                                {memorial.image ? (
                                    <img src={`${assetServer}/images/people/${memorial.image}`} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl md:text-6xl font-bold text-white opacity-80">{fullName.charAt(0) || "?"}</span>
                                )}
                            </div>
                            <div className="text-center md:text-left mt-4 md:mt-0">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold mb-1 md:mb-2 leading-tight">{fullName}</h1>
                                <p className="text-lg sm:text-xl md:text-2xl opacity-80 mb-3 md:mb-4">{yearsLived}</p>
                                <p className="text-md sm:text-lg italic opacity-70 max-w-xl md:max-w-2xl">{memorial.epitaph}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 sm:py-3 text-xs sm:text-sm text-slate-700">
                            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-start mb-2 sm:mb-0">
                                {memorial.date_of_birth && (<div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-rose-500" /><span>Born: {formatDate(memorial.date_of_birth)}</span></div>)}
                                {memorial.country_of_birth && (<div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /><span>{memorial.country_of_birth}</span></div>)}
                                {age !== null && (<div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-rose-500" /><span>{age} years</span></div>)}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                {BACKGROUND_MUSIC_URL && audioRef.current && (
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 hover:text-rose-600" onClick={toggleMute} title={isMuted ? "Unmute Music" : "Mute Music"} aria-label={isMuted ? "Unmute Music" : "Mute Music"}>
                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-slate-600 hover:bg-slate-100 hover:text-rose-600" onClick={() => setIsMessageModalOpen(true)}>
                                    <MessageCircle className="w-4 h-4" /><span className="hidden sm:inline">Message</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-slate-600 hover:bg-slate-100 hover:text-rose-600">
                                    <Share2 className="w-4 h-4" /><span className="hidden sm:inline">Share</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,350px)]">
                        <div className="space-y-8 min-w-0">
                            <Tabs defaultValue="story" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <ScrollArea orientation="horizontal" className="pb-2 -mb-2 sm:overflow-auto">
                                    <TabsList className="w-max sm:w-full flex sm:grid sm:grid-cols-4 md:flex md:justify-start lg:justify-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                                        {TABS_CONFIG.map(tab => (
                                            <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 data-[state=active]:shadow-inner text-slate-600 hover:bg-slate-50 px-3 py-1.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap rounded-md">
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </ScrollArea>

                                {/* Life Story Tab */}
                                <TabsContent value="story" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6">
                                            <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Life Story</CardTitle>
                                            <CardDescription className="text-sm sm:text-base text-slate-600 mt-1">The journey, passions, and legacy of {fullName}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-5 sm:p-6 space-y-5 sm:space-y-6">
                                            {memorial.quote && (<div className="bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-200 relative shadow-sm"><Quote className="absolute text-rose-100 w-10 h-10 sm:w-12 sm:h-12 -top-2 -left-2 opacity-70" /><blockquote className="pl-4 sm:pl-6 italic text-md sm:text-lg text-slate-700">"{memorial.quote}"</blockquote></div>)}
                                            <div className="prose prose-slate max-w-none sm:prose-lg leading-relaxed text-sm sm:text-base">
                                                <h3 className="text-lg sm:text-xl font-medium text-slate-800 mb-2 sm:mb-3">Biography</h3>
                                                <p className="whitespace-pre-line">{memorial.biography}</p>
                                                {memorial.achievements && memorial.achievements.length > 0 && (<><h3 className="text-lg sm:text-xl font-medium text-slate-800 mt-6 mb-2 sm:mt-8 sm:mb-3">Achievements</h3><ul className="list-disc list-inside space-y-1">{memorial.achievements.map((achievement, index) => (<li key={index}>{achievement}</li>))}</ul></>)}
                                                {memorial.favorite_quotes && memorial.favorite_quotes.length > 0 && (<><h3 className="text-lg sm:text-xl font-medium text-slate-800 mt-6 mb-2 sm:mt-8 sm:mb-3">Favorite Quotes</h3><ul className="space-y-2">{memorial.favorite_quotes.map((quote, index) => (<li key={index} className="italic pl-4 border-l-2 border-rose-200">"{quote}"</li>))}</ul></>)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Gallery Tab */}
                                <TabsContent value="gallery" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6"><CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Gallery</CardTitle><CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Cherished photos and videos</CardDescription></CardHeader>
                                        <CardContent className="p-5 sm:p-6">
                                            {isMemoriesLoading ? (<div className="flex justify-center items-center py-10 sm:py-12"><Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-rose-500" /><p className="ml-3 text-slate-600 text-sm sm:text-base">Loading gallery...</p></div>)
                                                : (galleryImages.length > 0 || galleryVideos.length > 0) ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                                        {galleryImages.map((imageSrc, index) => (imageSrc && (<div key={`image-${index}`} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"><img src={`${assetServer}/images/gallery/${imageSrc}`} alt={`Gallery photo ${index + 1}`} className="object-cover w-full h-full transition-transform group-hover:scale-105" /></div>)))}
                                                        {galleryVideos.map((videoSrc, index) => (videoSrc && (<div key={`video-${index}`} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-slate-200 bg-black relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"><video src={`${assetServer}/${videoSrc}`} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" controls preload="metadata" /></div>)))}
                                                    </div>
                                                ) : (<div className="text-center py-10 sm:py-12 px-4"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 sm:mb-4"><Camera className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" /></div><h3 className="text-md sm:text-lg font-medium text-slate-800 mb-1">No Media Yet</h3><p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">Photos and videos will be added here soon.</p></div>)}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Timeline Tab */}
                                <TabsContent value="timeline" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl"><CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6"><CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Life Timeline</CardTitle><CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Key moments and milestones</CardDescription></CardHeader>
                                        <CardContent className="p-5 sm:p-6">
                                            <div className="relative border-l-2 border-rose-200 ml-4 pl-6 py-2 space-y-6 sm:space-y-8">
                                                <div className="relative"><div className="absolute -left-[calc(1.5rem+2px+0.5rem)] top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-100 border-4 border-rose-50 flex items-center justify-center shadow-sm"><Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" /></div><div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm ml-2"><div className="text-xs sm:text-sm text-rose-600 font-medium mb-0.5 sm:mb-1">{formatDate(memorial.date_of_birth)}</div><h3 className="text-md sm:text-lg font-medium text-slate-800 mb-1">Born in {memorial.country_of_birth || "N/A"}</h3><p className="text-slate-600 text-xs sm:text-sm">{fullName} was born on {formatDate(memorial.date_of_birth)}.</p></div></div>
                                                <div className="relative"><div className="absolute -left-[calc(1.5rem+2px+0.5rem)] top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 border-4 border-slate-50 flex items-center justify-center shadow-sm"><Heart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" /></div><div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm ml-2"><div className="text-xs sm:text-sm text-slate-500 font-medium mb-0.5 sm:mb-1">{formatDate(memorial.date_of_death)}</div><h3 className="text-md sm:text-lg font-medium text-slate-800 mb-1">Passed away in {memorial.country_died || "N/A"}</h3><p className="text-slate-600 text-xs sm:text-sm">{fullName} passed away on {formatDate(memorial.date_of_death)}.</p></div></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Family Tab */}
                                <TabsContent value="family" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl"><CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6"><CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Family</CardTitle><CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Family members and relationships</CardDescription></CardHeader>
                                        <CardContent className="p-5 sm:p-6">
                                            {isFamilyLoading && !familyData ? (<div className="flex justify-center items-center py-10 sm:py-12"><Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-rose-500" /><p className="ml-3 text-slate-600 text-sm sm:text-base">Loading family tree...</p></div>)
                                                : familyData && Object.keys(familyData).length > 0 ? (<div className="p-2 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 overflow-x-auto min-h-[250px]"><FamilyTreeMinimal data={familyData} /></div>)
                                                    : (<div className="text-center py-10 sm:py-12 px-4"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 sm:mb-4"><Users className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" /></div><h3 className="text-md sm:text-lg font-medium text-slate-800 mb-1">Family Information Not Available</h3><p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">Details about {fullName}'s family will be added here.</p></div>)}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Milestones Tab */}
                                <TabsContent value="milestones" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl"><CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6"><CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Life Milestones</CardTitle><CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Significant achievements and moments.</CardDescription></CardHeader>
                                        <CardContent className="p-5 sm:p-6">
                                            {isMilestonesLoading && !actualMilestones.length ? (<div className="flex justify-center items-center py-10 sm:py-12"><Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-rose-500" /><p className="ml-3 text-slate-600 text-sm sm:text-base">Loading milestones...</p></div>)
                                                : actualMilestones.length > 0 ? (<ul className="space-y-3 sm:space-y-4 list-none pl-0 text-slate-700">{actualMilestones.map((milestone, index) => (milestone && (<li key={index} className="flex items-start p-3 sm:p-4 bg-slate-50 rounded-md border border-slate-200 shadow-sm"><Award className="w-5 h-5 text-rose-500 mr-3 mt-1 flex-shrink-0" /><span className="text-sm sm:text-base">{milestone}</span></li>)))}</ul>)
                                                    : (<div className="text-center py-10 sm:py-12 px-4"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 sm:mb-4"><Award className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" /></div><h3 className="text-md sm:text-lg font-medium text-slate-800 mb-1">No Milestones Yet</h3><p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">Significant life milestones will be shared here.</p></div>)}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Tributes Tab */}
                                <TabsContent value="tributes" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl"><CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6"><CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Tributes & Memories</CardTitle><CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Share your memories and messages</CardDescription></CardHeader>
                                        <CardContent className="p-5 sm:p-6">
                                            <div className="mb-6 sm:mb-8"><Button className="bg-rose-600 hover:bg-rose-700 text-white gap-2 w-full sm:w-auto py-2.5 px-5 text-sm sm:text-base" onClick={() => setActiveTab('contribute')}><MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Share a Memory</Button></div>
                                            {isMemoriesLoading && !textMemories.length ? (<div className="flex justify-center items-center py-10 sm:py-12"><Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-rose-500" /><p className="ml-3 text-slate-600 text-sm sm:text-base">Loading memories...</p></div>)
                                                : textMemories.length > 0 ? (<div className="space-y-5 sm:space-y-6">{textMemories.map((memory, index) => (memory && (<div key={`memory-${index}`} className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-sm"><div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3"><Avatar className="w-9 h-9 sm:w-10 sm:h-10"><AvatarImage src={typeof memory === 'object' ? memory.authorImage : "/placeholder.svg"} alt={typeof memory === 'object' ? memory.author : 'Contributor'} /><AvatarFallback className="bg-rose-100 text-rose-600 text-sm">{typeof memory === 'object' && memory.author ? memory.author.charAt(0) : (typeof memory === 'string' ? 'A' : '?')}</AvatarFallback></Avatar><div><div className="font-medium text-sm sm:text-base text-slate-800">{typeof memory === 'object' ? memory.author : 'Anonymous'}</div><div className="text-xs text-slate-500">{typeof memory === 'object' && memory.date ? formatDate(memory.date) : 'Recently'}</div></div></div><p className="text-slate-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{typeof memory === 'object' ? memory.text : memory}</p></div>)))}</div>)
                                                    : (<div className="text-center py-10 sm:py-12 px-4"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 sm:mb-4"><MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" /></div><h3 className="text-md sm:text-lg font-medium text-slate-800 mb-1">No Memories Shared Yet</h3><p className="text-slate-500 max-w-md mx-auto mb-5 sm:mb-6 text-sm sm:text-base">Be the first to share a memory.</p><Button className="bg-rose-600 hover:bg-rose-700 text-white text-sm sm:text-base" onClick={() => setActiveTab('contribute')}>Share a Memory</Button></div>)}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Contribute Tab */}
                                <TabsContent value="contribute" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6">
                                            <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Contribute to {fullName}'s Memorial</CardTitle>
                                            <CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Share your memories, photos, videos, or helpful links.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-5 sm:p-6 space-y-6">
                                            {/* Memory Contribution */}
                                            <div className="space-y-3">
                                                <Label htmlFor="memory" className="text-sm font-medium text-slate-700 flex items-center">
                                                    <MessageCircle className="w-4 h-4 mr-2 text-rose-500" /> Share a Memory
                                                </Label>
                                                <Textarea
                                                    id="memory"
                                                    value={memory}
                                                    onChange={(e) => setMemory(e.target.value)}
                                                    placeholder="Write your memory or message here..."
                                                    rows={4}
                                                    className="text-sm border-slate-300 rounded-md focus:border-rose-500 focus:ring-rose-500"
                                                />
                                                <Button
                                                    onClick={handleAddMemory}
                                                    disabled={isSubmittingMemory || !memory.trim()}
                                                    className="bg-rose-600 hover:bg-rose-700 text-white text-sm py-2 px-4"
                                                >
                                                    {isSubmittingMemory ? (
                                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                                                    ) : (
                                                        "Submit Memory"
                                                    )}
                                                </Button>
                                            </div>

                                            <Separator className="my-6" />

                                            {/* Image Contribution */}
                                            <div className="space-y-3">
                                                <Label htmlFor="image" className="text-sm font-medium text-slate-700 flex items-center">
                                                    <Camera className="w-4 h-4 mr-2 text-rose-500" /> Upload a Photo
                                                </Label>
                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAddImage}
                                                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                                                />
                                                <p className="text-xs text-slate-500">Max file size: 5MB (JPEG, PNG)</p>
                                                {isSubmittingImage && (
                                                    <div className="flex items-center text-sm text-slate-600">
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Uploading image...
                                                    </div>
                                                )}
                                            </div>

                                            <Separator className="my-6" />

                                            {/* Video Contribution */}
                                            <div className="space-y-3">
                                                <Label htmlFor="video" className="text-sm font-medium text-slate-700 flex items-center">
                                                    <Volume2 className="w-4 h-4 mr-2 text-rose-500" /> Upload a Video
                                                </Label>
                                                <Input
                                                    id="video"
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleAddVideo}
                                                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                                                />
                                                <p className="text-xs text-slate-500">Max file size: 50MB (MP4, MOV)</p>
                                                {isSubmittingVideo && (
                                                    <div className="flex items-center text-sm text-slate-600">
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Uploading video...
                                                    </div>
                                                )}
                                            </div>

                                            <Separator className="my-6" />

                                            {/* Link Contribution */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium text-slate-700 flex items-center">
                                                    <Link2 className="w-4 h-4 mr-2 text-rose-500" /> Share a Link
                                                </Label>
                                                <div className="space-y-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Link Title (optional)"
                                                        value={linkTitle}
                                                        onChange={(e) => setLinkTitle(e.target.value)}
                                                        className="text-sm border-slate-300 rounded-md focus:border-rose-500 focus:ring-rose-500"
                                                    />
                                                    <Input
                                                        type="url"
                                                        placeholder="https://example.com"
                                                        value={link}
                                                        onChange={(e) => setLink(e.target.value)}
                                                        className="text-sm border-slate-300 rounded-md focus:border-rose-500 focus:ring-rose-500"
                                                    />
                                                </div>
                                                <Button
                                                    onClick={handleAddLink}
                                                    disabled={isSubmittingLink || !link.trim()}
                                                    className="bg-rose-600 hover:bg-rose-700 text-white text-sm py-2 px-4"
                                                >
                                                    {isSubmittingLink ? (
                                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                                                    ) : (
                                                        "Submit Link"
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Service Tab */}
                                <TabsContent value="service" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl"><CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6"><CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Service Information</CardTitle><CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Details about memorial and funeral services</CardDescription></CardHeader>
                                        <CardContent className="p-5 sm:p-6"><Events id={memorial?.id} user_id={memorial?.user_id} /></CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Donate Tab */}
                                <TabsContent value="donate" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl"><CardHeader className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-b border-slate-100 p-5 sm:p-6"><CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">Make a Donation</CardTitle><CardDescription className="text-sm sm:text-base text-slate-600 mt-1">Honour their memory with a contribution</CardDescription></CardHeader>
                                        <CardContent className="p-5 sm:p-6">
                                            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-sm"><h3 className="text-md sm:text-lg font-medium text-slate-800 mb-2 flex items-center"><Gift className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0" />In Lieu of Flowers</h3><p className="text-slate-700 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">The family kindly requests that in lieu of flowers, donations be made to {memorial.donation_charity || "a cause dear to their heart"} in memory of {fullName}.</p>
                                                <Button onClick={() => setIsDonationModalOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 w-full sm:w-auto py-2.5 text-sm sm:text-base">Donate Now <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                                                {memorial.donation_link && (<p className="text-xs text-slate-500 mt-3">Alternatively, you can donate directly via: <a href={memorial.donation_link} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">{memorial.donation_link}</a></p>)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6 lg:sticky lg:top-20 self-start">
                            <Card className="overflow-hidden border-slate-200 shadow-lg rounded-xl">
                                <CardHeader className="bg-gradient-to-r from-rose-100 via-purple-100 to-indigo-100 border-b border-slate-200 p-5"><CardTitle className="text-lg sm:text-xl font-semibold text-slate-800">About {memorial.first_name || "The Departed"}</CardTitle></CardHeader>
                                <CardContent className="p-0"><div className="divide-y divide-slate-100 text-xs sm:text-sm">
                                    {memorial.nickname && (<div className="px-5 py-3 sm:px-6 sm:py-3.5 flex justify-between items-center"><div className="font-medium text-slate-500">Known As</div><div className="text-slate-700 text-right">{memorial.nickname}</div></div>)}
                                    <div className="px-5 py-3 sm:px-6 sm:py-3.5 flex justify-between items-center"><div className="font-medium text-slate-500">Born</div><div className="text-slate-700 text-right">{formatDate(memorial.date_of_birth)}</div></div>
                                    {memorial.country_of_birth && (<div className="px-5 py-3 sm:px-6 sm:py-3.5 flex justify-between items-center"><div className="font-medium text-slate-500">Birthplace</div><div className="text-slate-700 text-right">{memorial.country_of_birth}</div></div>)}
                                    <div className="px-5 py-3 sm:px-6 sm:py-3.5 flex justify-between items-center"><div className="font-medium text-slate-500">Passed Away</div><div className="text-slate-700 text-right">{formatDate(memorial.date_of_death)}</div></div>
                                    {memorial.country_died && (<div className="px-5 py-3 sm:px-6 sm:py-3.5 flex justify-between items-center"><div className="font-medium text-slate-500">Place of Death</div><div className="text-slate-700 text-right">{memorial.country_died}</div></div>)}
                                    {age !== null && (<div className="px-5 py-3 sm:px-6 sm:py-3.5 flex justify-between items-center"><div className="font-medium text-slate-500">Age</div><div className="text-slate-700 text-right">{age} years</div></div>)}
                                </div></CardContent>
                                <CardFooter className="bg-slate-50 px-5 py-4 sm:px-6 sm:py-4 border-t border-slate-100"><Button variant="outline" className="w-full gap-1.5 text-sm border-slate-300 hover:bg-slate-100 hover:border-slate-400"><Share2 className="w-4 h-4" /> Share Profile</Button></CardFooter>
                            </Card>
                        </aside>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-800 text-slate-400 py-10 md:py-16 mt-12 md:mt-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="text-sm"><h3 className="text-md sm:text-lg font-semibold text-white mb-3">About This Tribute</h3><p className="mb-3">This memorial tribute was created to Honour and celebrate the life of {fullName}.</p><p>{lifeDates}</p></div>
                            <div className="text-sm"><h3 className="text-md sm:text-lg font-semibold text-white mb-3">Quick Links</h3><ul className="space-y-1.5">{TABS_CONFIG.slice(0, 5).map(tab => (<li key={`footer-link-${tab.value}`}><button onClick={() => { setActiveTab(tab.value); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white transition-colors">{tab.label}</button></li>))}</ul></div>
                            <div className="text-sm"><h3 className="text-md sm:text-lg font-semibold text-white mb-3">Contact</h3><p className="mb-3">For questions or assistance with this memorial tribute, please contact support.</p><Button variant="outline" size="sm" className="bg-transparent text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">Contact Support</Button></div>
                        </div>
                        <Separator className="my-6 md:my-8 bg-slate-700" />
                        <div className="flex flex-col md:flex-row justify-between items-center text-xs"><p className="mb-3 md:mb-0">&copy; {new Date().getFullYear()} {memorial.tribute_name || "Memorial Tribute"}. All rights reserved.</p><div className="flex gap-3 sm:gap-4"><a href="#" className="hover:text-white transition-colors">Privacy Policy</a><a href="#" className="hover:text-white transition-colors">Terms of Service</a></div></div>
                    </div>
                </footer>
            </div>

            {/* Message Creator Modal */}
            <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                <DialogContent className="sm:max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
                    <DialogHeader className="p-5 sm:p-6 border-b border-slate-200"><DialogTitle className="text-lg sm:text-xl font-semibold text-slate-800">Send a Message to Creator</DialogTitle><DialogDescription className="text-sm text-slate-500 mt-1">Share your thoughts and condolences directly.</DialogDescription></DialogHeader>
                    <form onSubmit={handleMessageSubmit}><div className="p-5 sm:p-6 space-y-4">
                        <div><Label htmlFor="message-name" className="text-xs sm:text-sm font-medium text-slate-700">Your Name</Label><Input id="message-name" name="name" value={messageData.name} onChange={handleMessageDataChange} placeholder="John Doe" required className="mt-1 text-sm sm:text-base border-slate-300 rounded-md focus:border-rose-500 focus:ring-rose-500" /></div>
                        <div><Label htmlFor="message-email" className="text-xs sm:text-sm font-medium text-slate-700">Your Email</Label><Input id="message-email" name="email" type="email" value={messageData.email} onChange={handleMessageDataChange} placeholder="you@example.com" required className="mt-1 text-sm sm:text-base border-slate-300 rounded-md focus:border-rose-500 focus:ring-rose-500" /></div>
                        <div><Label htmlFor="message-subject" className="text-xs sm:text-sm font-medium text-slate-700">Subject</Label><Input id="message-subject" name="subject" value={messageData.subject} onChange={handleMessageDataChange} placeholder="Regarding the tribute..." required className="mt-1 text-sm sm:text-base border-slate-300 rounded-md focus:border-rose-500 focus:ring-rose-500" /></div>
                        <div><Label htmlFor="message-content" className="text-xs sm:text-sm font-medium text-slate-700">Message</Label><Textarea id="message-content" name="message" placeholder="Type your message here..." value={messageData.message} onChange={handleMessageDataChange} rows={5} required className="mt-1 text-sm sm:text-base border-slate-300 rounded-md focus:border-rose-500 focus:ring-rose-500" /></div>
                    </div><DialogFooter className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex-col sm:flex-row gap-2"><Button type="button" onClick={() => setIsMessageModalOpen(false)} variant="outline" className="w-full sm:w-auto border-slate-300 rounded-md text-sm">Cancel</Button><Button type="submit" disabled={isSending || !messageData.name.trim() || !messageData.email.trim() || !messageData.subject.trim() || !messageData.message.trim()} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white rounded-md text-sm">{isSending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : "Send Message"}</Button></DialogFooter></form>
                </DialogContent>
            </Dialog>

            {/* Donation Modal */}
            <Dialog open={isDonationModalOpen} onOpenChange={setIsDonationModalOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl">
                    <DialogHeader className="p-5 sm:p-6 border-b border-slate-200"><DialogTitle className="text-lg sm:text-xl font-serif text-slate-800">Make a Donation</DialogTitle><DialogDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">Your contribution Honours {fullName}.</DialogDescription></DialogHeader>
                    <form onSubmit={handleDonationSubmit}><div className="p-5 sm:p-6 space-y-4">
                        {memorial?.allow_anonymous === true && (<div className="flex items-center space-x-2"><Checkbox id="donation-anonymous" name="anonymous" checked={donationFormData.anonymous} onCheckedChange={(checked) => handleDonationInputChange({ target: { name: 'anonymous', value: checked, type: 'checkbox' }})}/><Label htmlFor="donation-anonymous" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">Donate Anonymously</Label></div>)}
                        <div><Label htmlFor="donation-name" className="text-xs sm:text-sm font-medium text-slate-700">Name</Label><Input id="donation-name" name="name" placeholder={donationFormData.anonymous ? "Optional" : "Your full name"} value={donationFormData.name} onChange={handleDonationInputChange} required={!donationFormData.anonymous} disabled={donationFormData.anonymous} className="mt-1 border-slate-300 rounded-md text-sm sm:text-base" /></div>
                        <div><Label htmlFor="donation-email" className="text-xs sm:text-sm font-medium text-slate-700">Email</Label><Input id="donation-email" name="email" type="email" placeholder="Your email (for receipt)" value={donationFormData.email} onChange={handleDonationInputChange} required className="mt-1 border-slate-300 rounded-md text-sm sm:text-base" /></div>
                        <div><Label htmlFor="donation-amount" className="text-xs sm:text-sm font-medium text-slate-700">Amount</Label><Input id="donation-amount" name="amount" type="number" min="1" step="0.01" placeholder="Enter amount (e.g., 25.00)" value={donationFormData.amount} onChange={handleDonationInputChange} required className="mt-1 border-slate-300 rounded-md text-sm sm:text-base" /></div>
                    </div><DialogFooter className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex-col sm:flex-row gap-2"><Button type="button" variant="outline" onClick={() => setIsDonationModalOpen(false)} className="w-full sm:w-auto border-slate-300 rounded-md text-sm" disabled={isProcessingDonation}>Cancel</Button><Button type="submit" className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white rounded-md text-sm" disabled={isProcessingDonation}>{isProcessingDonation ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : "Proceed to Payment"}</Button></DialogFooter></form>
                </DialogContent>
            </Dialog>
        </>
    )
}