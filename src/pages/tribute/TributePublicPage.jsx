import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '@/server.js';
import { assetServer } from '@/assetServer.js';
import { toast } from 'react-hot-toast';
import Header from "@/components/landing/Header.jsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    FileText,
    Image as ImageIcon,
    Video,
    Link2,
    Send,
    Upload,
    Mail,
    Link as LinkIcon,
    Share,
    MessageSquare,
    CalendarIcon,
    MapPin as MapPinIcon,
    Clock as ClockIcon,
    Camera as CameraIcon,
    Video as VideoIcon,
    Link as Link2Icon,
    MessageCircle as MessageCircleIcon,
    Gift as GiftIcon,
    Mail as MailIcon,
    Share2 as Share2Icon,
    Volume2 as Volume2Icon,
    VolumeX as VolumeXIcon,
} from 'lucide-react';
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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

const TributePublicPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    // State for main tribute details
    const [tribute, setTribute] = useState(null);
    const [isTributeLoading, setIsTributeLoading] = useState(true);
    const [tributeError, setTributeError] = useState(null);

    // State for theme data
    const [theme, setTheme] = useState(null);
    const [isThemeLoading, setIsThemeLoading] = useState(true);

    // State for memories, images, videos, links
    const [memoriesData, setMemoriesData] = useState(null);
    const [isMemoriesLoading, setIsMemoriesLoading] = useState(true);
    const [memoriesError, setMemoriesError] = useState(null);

    // State for Milestones and Family data
    const [milestonesData, setMilestonesData] = useState(null);
    const [isMilestonesLoading, setIsMilestonesLoading] = useState(true);
    const [milestonesError, setMilestonesError] = useState(null);

    // State for theme layout tabs
    const [activeTab, setActiveTab] = useState("about"); // Default to 'about' or first section

    // State for music
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef(null);
    const BACKGROUND_MUSIC_URL = tribute?.music ? `${assetServer}/api/music/${tribute.music.split('/').pop()}` : null;

    // State for adding memories/media/links
    const [memory, setMemory] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [link, setLink] = useState("");

    // State for donation modal
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
        tribute_id: null, // Will be set after fetching tribute ID
        anonymous: false,
    });

    // State for message modal
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageData, setMessageData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        tribute_id: null, // Will be set after fetching tribute ID
        user_id: null // Will be set after fetching tribute details
    });

    // State for RSVP modal
    const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rsvpData, setRsvpData] = useState({
        name: "",
        email: "",
        phone: "",
        attendees: "1",
        event_id: "",
        tribute_id: null, // Will be set after fetching tribute ID
        anonymous: false
    });

    // --- Fetch Main Tribute Details ---
    const fetchTribute = useCallback(async () => {
        setIsTributeLoading(true);
        setTributeError(null);
        try {
            let tributeId = slug;
            // If slug is not numeric, try to get tribute ID from name
            if (isNaN(slug)) {
                const nameResponse = await axios.get(`${server}/tributes/by-name/${slug}`);
                if (nameResponse.data?.status === "success" && nameResponse.data?.data?.tribute) {
                    tributeId = nameResponse.data.data.tribute.id;
                } else {
                    throw new Error('Tribute not found with this name');
                }
            }
            // Fetch tribute details
            const response = await axios.get(`${server}/tribute/details/${tributeId}`);
            const fetchedData = response.data;
            // Set default values if not present
            fetchedData.biography = fetchedData.biography || "A detailed life story about the beloved individual will be added here soon.";
            fetchedData.epitaph = fetchedData.epitaph || "Forever in our hearts.";
            fetchedData.donation_charity = fetchedData.donation_charity || "a cause dear to their heart";
            fetchedData.achievements = Array.isArray(fetchedData.achievements) ? fetchedData.achievements : [];
            fetchedData.favorite_quotes = Array.isArray(fetchedData.favorite_quotes) ? fetchedData.favorite_quotes : [];
            setTribute(fetchedData);
            // Update form IDs after fetching tribute
            setFormData(prev => ({ ...prev, tribute_id: parseInt(tributeId) }));
            setMessageData(prev => ({ ...prev, tribute_id: parseInt(tributeId), user_id: fetchedData.user_id }));
            setRsvpData(prev => ({ ...prev, tribute_id: parseInt(tributeId) }));
            return parseInt(tributeId); // Ensure numeric ID
        } catch (err) {
            setTributeError("Failed to load tribute details. Please try again later.");
            console.error("Error fetching tribute details:", err);
            setTribute(null);
            return null;
        } finally {
            setIsTributeLoading(false);
        }
    }, [slug]);

    // --- Fetch Theme Data ---
    const fetchThemeData = useCallback(async (tributeId) => {
        if (!tributeId) return;
        setIsThemeLoading(true);
        try {
            const response = await axios.get(`${server}/tributes/${tributeId}/theme`);
            if (response.data?.success) {
                setTheme(response.data.theme);
            } else {
                // Fallback to default theme
                setTheme({
                    name: 'Classic',
                    layout_type: 'single',
                    colors: {
                        primary: '#1f2937',
                        background: '#f9fafb',
                        card: '#ffffff',
                        text: '#374151',
                        accent: '#4f46e5'
                    },
                    banner_style: 'classic',
                    layout: [
                        { id: 'about', title: 'About', width: 'full' },
                        { id: 'life', title: 'Life Story', width: 'full' },
                        { id: 'milestones', title: 'Milestones', width: 'full' },
                        { id: 'family', title: 'Family', width: 'full' },
                        { id: 'media', title: 'Media & Memories', width: 'full' },
                        { id: 'contribute', title: 'Contribute', width: 'full' },
                        { id: 'events', title: 'Events', width: 'full' },
                    ]
                });
            }
        } catch (err) {
            console.error("Error fetching theme data:", err);
            // Set default theme on error
            setTheme({
                name: 'Classic',
                layout_type: 'single',
                colors: {
                    primary: '#1f2937',
                    background: '#f9fafb',
                    card: '#ffffff',
                    text: '#374151',
                    accent: '#4f46e5'
                },
                banner_style: 'classic',
                layout: [
                    { id: 'about', title: 'About', width: 'full' },
                    { id: 'life', title: 'Life Story', width: 'full' },
                    { id: 'milestones', title: 'Milestones', width: 'full' },
                    { id: 'family', title: 'Family', width: 'full' },
                    { id: 'media', title: 'Media & Memories', width: 'full' },
                    { id: 'contribute', title: 'Contribute', width: 'full' },
                    { id: 'events', title: 'Events', width: 'full' },
                ]
            });
        } finally {
            setIsThemeLoading(false);
        }
    }, []);

    // --- Fetch Memories Data ---
    const fetchMemoriesData = useCallback(async (tributeId) => {
        if (!tributeId) return;
        setIsMemoriesLoading(true);
        setMemoriesError(null);
        try {
            const response = await axios.get(`${server}/tributes/memories/${tributeId}`);
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
    }, []);

    // --- Fetch Milestones and Family Data ---
    const fetchMilestonesAndFamilyData = useCallback(async (tributeId) => {
        if (!tributeId) return;
        setIsMilestonesLoading(true);
        setMilestonesError(null);
        try {
            const response = await axios.get(`${server}/tributes/${tributeId}/bio-family`);
            if (response.data.status === "success" && response.data.data) {
                const data = response.data.data;
                setMilestonesData(data);
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
        }
    }, []);

    // Main data fetching effect
    useEffect(() => {
        const fetchAllData = async () => {
            const tributeId = await fetchTribute();
            if (tributeId) {
                await Promise.all([
                    fetchThemeData(tributeId),
                    fetchMemoriesData(tributeId),
                    fetchMilestonesAndFamilyData(tributeId)
                ]);
            }
        };
        if (slug) {
            fetchAllData();
        }
    }, [slug, fetchTribute, fetchThemeData, fetchMemoriesData, fetchMilestonesAndFamilyData]);

    // Audio handling
    useEffect(() => {
        if (!BACKGROUND_MUSIC_URL) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
            return;
        }
        const audioInstance = new Audio();
        audioRef.current = audioInstance;
        audioInstance.loop = true;
        audioInstance.muted = isMuted;
        audioInstance.volume = 0.3;
        const errorHandler = (e) => {
            console.error("Audio Error:", e);
            setIsMuted(true);
            if (audioRef.current) audioRef.current.muted = true;
        };
        audioInstance.addEventListener('error', errorHandler);
        audioInstance.src = BACKGROUND_MUSIC_URL;
        if (!isMuted) {
            audioInstance.addEventListener('canplaythrough', () => {
                if (audioRef.current && !audioRef.current.muted) {
                    audioRef.current.play().catch(playError => {
                        console.warn("Music play() failed after canplaythrough:", playError);
                        setIsMuted(true);
                        if (audioRef.current) audioRef.current.muted = true;
                    });
                }
            });
            audioInstance.load();
            audioInstance.play().catch(initialPlayError => {
                if (initialPlayError.name === 'NotSupportedError') {
                    setIsMuted(true);
                    if (audioRef.current) audioRef.current.muted = true;
                }
            });
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('error', errorHandler);
                audioRef.current.removeEventListener('canplaythrough', () => {});
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
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
                        audioRef.current.play().catch(e => {
                            if(audioRef.current) audioRef.current.muted = true;
                            return true;
                        });
                    } else if (audioRef.current.src) {
                        audioRef.current.load();
                        audioRef.current.play().catch(e => {
                            if(audioRef.current) audioRef.current.muted = true;
                            return true;
                        });
                    }
                } else if (newMutedState) {
                    audioRef.current.pause();
                }
            }
            return newMutedState;
        });
    }, []);

    // --- Handlers for adding memories, images, videos, links ---
    const handleAddMemory = async () => {
        if (!memory.trim()) {
            toast.error("Please write a memory.");
            return;
        }
        if (!formData.tribute_id) {
            toast.error("Tribute ID not loaded. Please refresh the page.");
            return;
        }
        try {
            const response = await axios.post(`${server}/memories/add/text`, { memory, tribute_id: formData.tribute_id });
            if (response.status === 200) {
                toast.success("Memory Added Successfully");
                setMemory("");
                fetchMemoriesData(formData.tribute_id); // Refresh memories
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
        if (!formData.tribute_id) {
            toast.error("Tribute ID not loaded. Please refresh the page.");
            return;
        }
        const formDataObj = new FormData();
        formDataObj.append("tribute_id", formData.tribute_id);
        formDataObj.append("files[]", image);
        try {
            const response = await axios.post(`${server}/memories/add/image`, formDataObj, { headers: { "Content-Type": "multipart/form-data" } });
            if (response.status === 200) {
                toast.success("Image uploaded successfully");
                setImage(null); // Clear the selected file
                fetchMemoriesData(formData.tribute_id); // Refresh memories
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
        if (!formData.tribute_id) {
            toast.error("Tribute ID not loaded. Please refresh the page.");
            return;
        }
        const formDataObj = new FormData();
        formDataObj.append("tribute_id", formData.tribute_id);
        formDataObj.append("files[]", video);
        try {
            const response = await axios.post(`${server}/memories/add/video`, formDataObj, { headers: { "Content-Type": "multipart/form-data" } });
            if (response.status === 200) {
                toast.success("Video uploaded successfully");
                setVideo(null); // Clear the selected file
                fetchMemoriesData(formData.tribute_id); // Refresh memories
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
        if (!formData.tribute_id) {
            toast.error("Tribute ID not loaded. Please refresh the page.");
            return;
        }
        // Basic URL validation
        try {
            new URL(link);
        } catch (_) {
            toast.error("Please enter a valid URL (e.g., https://example.com).");
            return;
        }
        const payload = { tribute_id: formData.tribute_id, links: link };
        try {
            const response = await axios.post(`${server}/memories/add/link`, payload);
            if (response.status === 200) {
                toast.success("Link added successfully");
                setLink("");
                fetchMemoriesData(formData.tribute_id); // Refresh memories
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
        if (!formData.tribute_id) {
            toast.error("Tribute ID not loaded. Please refresh the page.");
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
        if (!messageData.tribute_id || !messageData.user_id) {
            toast.error("Tribute or User ID not loaded. Please refresh the page.");
            return;
        }

        try {
            const messagePayload = { ...messageData, user_id: messageData.user_id };
            const response = await axios.post(`${server}/messages/send`, messagePayload);
            if (response.status === 200 && response.data.status === 'success') {
                toast.success("Message sent successfully");
                setMessageData({ name: "", email: "", subject: "", message: "", tribute_id: messageData.tribute_id, user_id: messageData.user_id });
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
        if (!rsvpData.tribute_id || !rsvpData.event_id) {
            toast.error("Tribute or Event ID not loaded. Please refresh the page.");
            return;
        }

        try {
            const payload = { ...rsvpData, attendees: parseInt(rsvpData.attendees, 10) || 1 };
            const response = await axios.post(`${server}/events/rsvp`, payload);
            if ((response.status === 200 || response.status === 201) && response.data.status === 'success') {
                toast.success("RSVP submitted successfully");
                setRsvpData({ name: "", email: "", phone: "", attendees: "1", event_id: "", tribute_id: rsvpData.tribute_id, anonymous: false });
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
        if (!formData.tribute_id) {
            toast.error("Tribute ID not loaded. Please refresh the page.");
            return;
        }
        setSelectedEvent(event);
        setRsvpData(prev => ({
            ...prev,
            event_id: event.id,
            name: "", email: "", phone: "", attendees: "1", anonymous: false, tribute_id: formData.tribute_id
        }));
        setIsRsvpModalOpen(true);
    };

    // Calculate derived data
    const fullName = tribute ? `${tribute.first_name || ""} ${tribute.middle_name || ""} ${tribute.last_name || ""}`.replace(/\s+/g, " ").trim() : '';
    const lifeDates = tribute ? `${formatDate(tribute.date_of_birth)} - ${formatDate(tribute.date_of_death)}` : '';
    const yearsLived = tribute && tribute.date_of_birth && tribute.date_of_death
        ? `${new Date(tribute.date_of_birth).getFullYear()} - ${new Date(tribute.date_of_death).getFullYear()}`
        : "Dates N/A";
    const age = tribute && tribute.date_of_birth && tribute.date_of_death
        ? Math.floor((new Date(tribute.date_of_death) - new Date(tribute.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
        : null;
    const textMemories = memoriesData?.memories || [];
    const galleryImages = memoriesData?.images || [];
    const galleryVideos = memoriesData?.videos || [];
    const actualMilestones = milestonesData?.milestone || [];
    const familyData = milestonesData?.family || {};

    // --- Render Functions for Sections ---
    const renderSectionContent = (section) => {
        switch (section.id) {
            case 'about':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            About {tribute?.first_name || "the Person"}
                        </h3>
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3 flex flex-col items-center">
                                <img
                                    src={tribute?.image ? `${assetServer}/images/people/${tribute.image}` : "/placeholder.svg"}
                                    alt={fullName}
                                    className="w-48 h-48 object-cover rounded-full shadow-xl border-4 border-white"
                                />
                                <div className="mt-4 text-center">
                                    <h4 className="text-xl font-semibold">{fullName}</h4>
                                    <p className="text-gray-600">{yearsLived}</p>
                                </div>
                            </div>
                            <div className="lg:w-2/3">
                                {tribute?.quote && (
                                    <blockquote className="italic text-lg mb-4 text-gray-700 border-l-4 border-primary pl-4 py-2 bg-primary/10 rounded-r-md">
                                        "{tribute.quote}"
                                    </blockquote>
                                )}
                                <p className="text-gray-700 leading-relaxed">
                                    Welcome to {tribute?.first_name || "their"} memorial page. We created this memorial to celebrate the life of {fullName} with family and friends.
                                    This page serves as a gathering place for memories, photos, and stories that help us remember and celebrate {tribute?.first_name || "their"} life.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'life':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            Life Story
                        </h3>
                        {isMilestonesLoading ? (
                            <div className="flex justify-center items-center p-8 text-slate-500 min-h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                Loading life story...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <h4 className="text-lg font-semibold mb-3">Biography</h4>
                                    <div className="prose prose-slate max-w-none">
                                        <p>{milestonesData?.bio || "Biography information is not available at this moment."}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h4 className="text-lg font-semibold mb-4">Key Details</h4>
                                    <ul className="space-y-3">
                                        {[
                                            { icon: Calendar, label: "Born", value: tribute?.date_of_birth ? formatDate(tribute.date_of_birth) : "N/A" },
                                            { icon: Calendar, label: "Passed", value: tribute?.date_of_death ? formatDate(tribute.date_of_death) : "N/A" },
                                            { icon: MapPin, label: "Location", value: tribute?.country_died || "Unknown" }
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <div className="bg-slate-200 p-2 rounded-full mr-3 mt-0.5 flex-shrink-0">
                                                    <item.icon className="h-4 w-4 text-slate-600" />
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-slate-500">{item.label}</span>
                                                    <span className="font-medium text-slate-700">{item.value}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    {tribute?.achievements && tribute.achievements.length > 0 && (
                                        <>
                                            <h4 className="text-lg font-semibold mt-6 mb-3">Achievements</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {tribute.achievements.map((achievement, index) => (
                                                    <li key={index}>{achievement}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'milestones':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            Life Milestones
                        </h3>
                        {isMilestonesLoading ? (
                            <div className="flex justify-center items-center p-8 text-slate-500 min-h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                Loading milestones...
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-slate-200 ml-3 pl-8 py-2">
                                {actualMilestones.length > 0 ? actualMilestones.map(
                                    (item, index) =>
                                        item && (
                                            <div key={index} className="mb-8 relative">
                                                <div className="absolute -left-[calc(2rem+1px)] sm:-left-[calc(2.5rem+1px)] top-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary ring-4 ring-white flex items-center justify-center shadow">
                                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-100">
                                                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{item}</p>
                                                </div>
                                            </div>
                                        )
                                ) : (
                                    <p className="text-slate-500 italic">No milestones have been added yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 'family':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            Family Tree
                        </h3>
                        {isMilestonesLoading ? (
                            <div className="flex justify-center items-center p-8 text-slate-500 min-h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                Loading family tree...
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto bg-slate-50 p-3 rounded-lg border border-slate-200 min-h-[200px]">
                                    {/* Placeholder for FamilyTreeMinimal */}
                                    <div className="p-4 text-center text-gray-500">
                                        Family tree visualization would go here.
                                        {Object.keys(familyData).length === 0 && <p>No family data available.</p>}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 'media':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            Media & Memories
                        </h3>
                        {isMemoriesLoading ? (
                            <div className="flex justify-center items-center p-8 text-slate-500 min-h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
                                Loading media...
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Images Section */}
                                {galleryImages.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 flex items-center text-slate-700">
                                            <span className="bg-slate-100 p-1.5 rounded-full mr-2.5 border border-slate-200"><CameraIcon className="h-4 w-4 text-slate-500" /></span>Photos
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                            {galleryImages.map((imageSrc, index) => (
                                                imageSrc && (
                                                    <div key={`image-${index}`} className="relative group overflow-hidden rounded-lg shadow-md aspect-square border border-slate-200">
                                                        <img
                                                            src={`${assetServer}/images/gallery/${imageSrc}`}
                                                            alt={`Gallery photo ${index + 1}`}
                                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Videos Section */}
                                {galleryVideos.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 flex items-center text-slate-700">
                                            <span className="bg-slate-100 p-1.5 rounded-full mr-2.5 border border-slate-200"><VideoIcon className="h-4 w-4 text-slate-500" /></span>Videos
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                            {galleryVideos.map((videoPath, index) => (
                                                <div key={index} className="rounded-lg overflow-hidden shadow-md border border-slate-200">
                                                    <video controls className="w-full h-auto aspect-video bg-black rounded-t-lg">
                                                        <source src={`${assetServer}/${videoPath}`} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Memories Section */}
                                {textMemories.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 flex items-center text-slate-700">
                                            <span className="bg-slate-100 p-1.5 rounded-full mr-2.5 border border-slate-200"><MessageCircleIcon className="h-4 w-4 text-slate-500" /></span>Shared Memories
                                        </h4>
                                        <div className="space-y-4 sm:space-y-5">
                                            {textMemories.map((memory, index) => (
                                                <Card key={index} className="bg-slate-50 border border-slate-200 shadow-sm">
                                                    <CardContent className="p-4 sm:p-5">
                                                        <div className="flex items-center mb-3">
                                                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 mr-2.5 border-2 border-white shadow">
                                                                <AvatarFallback className="bg-primary/20 text-primary text-xs sm:text-sm">
                                                                    {typeof memory === 'object' ? memory.author?.substring(0, 1).toUpperCase() : memory?.substring(0, 1).toUpperCase() || "M"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-xs sm:text-sm font-medium text-slate-700">
                                                                    {typeof memory === 'object' ? memory.author : 'Memory Contributor'}
                                                                </p>
                                                                <p className="text-xs text-slate-500">Shared a memory</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                                            {typeof memory === 'object' ? memory.text : memory}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Links Section */}
                                {memoriesData?.links && parseMemoryJson(memoriesData.links).length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 flex items-center text-slate-700">
                                            <span className="bg-slate-100 p-1.5 rounded-full mr-2.5 border border-slate-200"><Link2Icon className="h-4 w-4 text-slate-500" /></span>Shared Links
                                        </h4>
                                        <div className="space-y-2.5 sm:space-y-3">
                                            {parseMemoryJson(memoriesData.links).map((linkItem, index) => (
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
                                {galleryImages.length === 0 && galleryVideos.length === 0 && textMemories.length === 0 && (!memoriesData?.links || parseMemoryJson(memoriesData.links).length === 0) && (
                                    <p className="text-gray-600 text-center py-4">No media or memories shared yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 'contribute':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            Share Your Memories & Tributes
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Add a Written Memory</h4>
                                    <Textarea
                                        placeholder="Share your memory or message of condolence..."
                                        className="min-h-[140px] w-full border-slate-300 focus:border-primary focus:ring-primary rounded-md"
                                        value={memory}
                                        onChange={e => setMemory(e.target.value)}
                                    />
                                    <Button
                                        className="w-full mt-3 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-md"
                                        onClick={handleAddMemory}
                                        disabled={!memory.trim()}
                                    >
                                        <Send className="mr-2 h-4 w-4" /> Share Memory
                                    </Button>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Add a Link</h4>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com"
                                        value={link}
                                        onChange={e => setLink(e.target.value)}
                                        className="border-slate-300 focus:border-primary focus:ring-primary rounded-md"
                                    />
                                    <Button
                                        className="w-full mt-3 py-2.5 rounded-md"
                                        variant="outline"
                                        onClick={handleAddLink}
                                        disabled={!link.trim()}
                                    >
                                        <Link2Icon className="mr-2 h-4 w-4" /> Add Link
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold mb-3">Upload Media</h4>
                                {[
                                    { type: 'Photo', id: 'photo-upload', accept: 'image/*', state: image, setState: setImage, handler: handleAddImage, maxSize: '10MB', icon: CameraIcon },
                                    { type: 'Video', id: 'video-upload', accept: 'video/*', state: video, setState: setVideo, handler: handleAddVideo, maxSize: '50MB', icon: VideoIcon }
                                ].map(item => (
                                    <div key={item.id}>
                                        <Label htmlFor={item.id} className="block mb-1.5 font-medium text-slate-600">Upload {item.type}</Label>
                                        <label htmlFor={item.id} className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer block">
                                            <input id={item.id} type="file" className="hidden" accept={item.accept} onChange={e => item.setState(e.target.files[0])} />
                                            <item.icon className="mx-auto h-8 w-8 text-slate-400" />
                                            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">{item.state ? item.state.name : "Click to upload or drag and drop"}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.accept.split('/')[0].toUpperCase()} up to {item.maxSize}</p>
                                        </label>
                                        {item.state && <Button className="w-full mt-2.5 py-2.5 rounded-md" onClick={item.handler}>Upload {item.type}</Button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator className="my-8 bg-slate-200" />
                        <section id="donations" className="mt-6">
                            <h4 className="text-xl font-bold mb-4">Make a Donation</h4>
                            <Card className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
                                <p className="text-slate-700 mb-4 leading-relaxed">
                                    To Honour {fullName}'s memory, please consider making a donation. Your contribution is greatly appreciated.
                                </p>
                                <Button className="bg-primary hover:bg-primary/90 text-white py-2.5 px-5 sm:px-6 rounded-md" onClick={() => setIsDonationModalOpen(true)}>
                                    <GiftIcon className="mr-2 h-4 w-4" /> Make a Donation
                                </Button>
                            </Card>
                        </section>
                    </div>
                );
            case 'events':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            Memorial Events
                        </h3>
                        <div className="p-4 text-center text-gray-500">
                            {/* Placeholder for Events Component */}
                            <p>Memorial events would be listed here.</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.colors?.primary }}>
                            {section.title || section.name}
                        </h3>
                        <p className="text-gray-600">
                            Content for {section.title} section.
                        </p>
                    </div>
                );
        }
    };

    const renderBanner = () => {
        if (!theme || !tribute) return null;
        const bannerStyle = theme.banner_style || 'classic';
        const getBannerStyle = () => {
            const styles = {
                classic: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.3)'
                },
                minimal: {
                    background: '#f8fafc',
                    textColor: '#1e293b',
                    overlay: 'rgba(255,255,255,0.1)'
                },
                elegant: {
                    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.4)'
                },
                natural: {
                    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.2)'
                },
                warm: {
                    background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.2)'
                },
                modern: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.3)'
                }
            };
            return styles[bannerStyle] || styles.classic;
        };

        const bannerStyleConfig = getBannerStyle();
        return (
            <div
                className="h-80 rounded-lg mb-8 flex items-center justify-center p-6 relative overflow-hidden"
                style={{ background: bannerStyleConfig.background }}
            >
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: bannerStyleConfig.overlay }}
                />
                <div className="text-center relative z-10 max-w-4xl mx-auto" style={{ color: bannerStyleConfig.textColor }}>
                    <h1 className="text-4xl font-bold mb-4">In Loving Memory</h1>
                    <h2 className="text-3xl font-semibold mb-3">{fullName}</h2>
                    <p className="text-xl opacity-90 mb-4">{yearsLived}</p>
                    {tribute?.quote && (
                        <p className="text-lg italic opacity-80 max-w-2xl mx-auto">
                            "{tribute.quote}"
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const renderSingleLayout = () => (
        <div className="space-y-8">
            {theme?.layout?.map((section) => (
                <section key={section.id}>
                    <Card style={{
                        backgroundColor: theme.colors.card,
                        borderColor: `${theme.colors.primary}20`
                    }}>
                        <CardContent className="p-6">
                            {renderSectionContent(section)}
                        </CardContent>
                    </Card>
                </section>
            ))}
        </div>
    );

    const renderTabbedLayout = () => (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white rounded-lg shadow-lg mb-8 sticky top-0 z-30 backdrop-blur-lg bg-white/95 border-b border-slate-200">
                <ScrollArea orientation="horizontal" className="sm:overflow-auto">
                    <TabsList className="w-max sm:w-full flex sm:grid sm:grid-cols-4 md:flex md:justify-center p-1 sm:p-1.5 bg-slate-100 rounded-t-lg">
                        {theme?.layout?.map((section) => (
                            <TabsTrigger
                                key={section.id}
                                value={section.id}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md capitalize transition-all whitespace-nowrap"
                            >
                                {section.title.replace('-', ' & ')}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </ScrollArea>
            </div>
            {theme?.layout?.map((section) => (
                <TabsContent key={section.id} value={section.id} className="space-y-4">
                    <Card style={{ backgroundColor: theme.colors.card }}>
                        <CardContent className="p-6">
                            {renderSectionContent(section)}
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );

    const renderThemePreview = () => {
        if (!theme || !tribute) return null;
        return (
            <div
                className="min-h-screen rounded-lg p-6"
                style={{
                    background: theme.colors.background,
                    color: theme.colors.text
                }}
            >
                {/* Layout Type Indicator */}
                {/*<div className="text-center mb-6">*/}
                {/*    <Badge*/}
                {/*        variant="outline"*/}
                {/*        className="mb-2"*/}
                {/*        style={{*/}
                {/*            borderColor: theme.colors.accent,*/}
                {/*            color: theme.colors.accent*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {theme.layout_type === 'single' ? 'Single Page Layout' : 'Tabbed Layout'}*/}
                {/*    </Badge>*/}
                {/*    <h2 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>*/}
                {/*        {tribute.title || 'In Loving Memory'}*/}
                {/*    </h2>*/}
                {/*</div>*/}
                {/* Hero Banner */}
                {renderBanner()}
                {/* Main Content */}
                <div className="max-w-6xl mx-auto">
                    {theme.layout_type === 'tabs' ? renderTabbedLayout() : renderSingleLayout()}
                </div>
                {/* Footer */}
                <div
                    className="mt-12 pt-6 border-t text-center text-sm"
                    style={{ borderColor: `${theme.colors.primary}20` }}
                >
                    <p style={{ color: theme.colors.text }}>
                        Created with {theme.name} Theme • {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        );
    };

    // Loading state
    if (isTributeLoading || isThemeLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 p-4">
                <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-rose-600" />
                <p className="mt-4 md:mt-6 text-md md:text-lg font-medium">Loading Tribute...</p>
            </div>
        );
    }

    // Error state
    if (tributeError && !tribute) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-6 text-center">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">An Error Occurred</h2>
                <p className="mb-6 text-sm md:text-base">{tributeError}</p>
                <Button onClick={() => window.location.reload()} className="bg-rose-600 hover:bg-rose-700 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    // Not found state
    if (!tribute) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-700 p-6 text-center">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Tribute Not Found</h2>
                <p className="mb-6 text-sm md:text-base">The tribute you're looking for doesn't exist or has been removed.</p>
                <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white">
                    <a href="/">Return Home</a>
                </Button>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen" style={{ backgroundColor: theme?.colors?.background || '#f9fafb' }}>
                {/* Header Actions */}
                <div className="fixed top-4 right-4 z-50 flex gap-2">
                    {BACKGROUND_MUSIC_URL && audioRef.current && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/90 backdrop-blur-sm"
                            onClick={toggleMute}
                        >
                            {isMuted ? <VolumeXIcon className="w-4 h-4" /> : <Volume2Icon className="w-4 h-4" />}
                        </Button>
                    )}
                    <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
                        <Share2Icon className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </div>

                {/* Main Content */}
                <ScrollArea className="h-screen">
                    {renderThemePreview()}
                </ScrollArea>

                {/* --- Modals --- */}
                {/* Donation Modal */}
                <Dialog open={isDonationModalOpen} onOpenChange={setIsDonationModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white rounded-lg">
                        <DialogHeader className="p-5 sm:p-6 border-b border-slate-200">
                            <DialogTitle className="text-lg sm:text-xl font-serif text-slate-800">Make a Donation</DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Your contribution Honours {fullName}.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDonationSubmit} className="space-y-4 p-5 sm:p-6">
                            {tribute?.allow_anonymous === 1 && (
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
                                Send a message regarding {tribute?.first_name || "the person"}'s memorial.
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
            </div>
        </>
    );
};

export default TributePublicPage;