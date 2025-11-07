"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Upload, ChevronLeft, Loader2, Play, Pause, Eye, Music, Palette, Crown, CheckCircle2, ChevronDown, ChevronUp, X, Check, Layout } from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import ThemePreviewModal from "@/components/ThemePreviewModal";

// Default theme images (fallback)
const defaultThemeImages = {
    serenity: "/images/themes/serenity-thumb.jpg",
    classic: "/images/themes/classic-thumb.jpg",
    vibrant: "/images/themes/vibrant-thumb.jpg",
    modern: "/images/themes/modern-thumb.jpg",
    celestial: "/images/themes/celestial-thumb.jpg",
}

const musicOptions = [
    {
        id: "peaceful_memories",
        name: "Peaceful Memories",
        file: "/music/farewell-to-w-111721.mp3",
    },
    {
        id: "gentle_reflection",
        name: "Gentle Reflection",
        file: "/music/funeral-165257.mp3",
    },
    {
        id: "celebration_of_life",
        name: "Celebration of Life",
        file: "/music/our-young-king-has-died-glbml-20940.mp3",
    },
    {
        id: "forever_remembered",
        name: "Forever Remembered",
        file: "/music/theme-1.mp3",
    },
]

// Simplified plans structure to avoid complex objects
const PLANS = {
    free: {
        id: "free",
        name: "Free Plan",
        description: "Start simple, honour sincerely. Limited features and duration.",
        price: "₦0 (Free)",
        features: ["2 Tributes", "Photo Gallery (20 photos)", "Basic Themes", "Visitor Guestbook"],
        isPopular: false
    },
    premium: {
        id: "premium",
        name: "Premium Plan",
        description: "Full flexibility and ongoing support with unlimited features.",
        price: "₦1,000/month",
        features: ["3 Tributes", "Unlimited Photos & Videos", "Premium Themes", "Music Options", "Priority Support"],
        isPopular: true
    },
    one_time: {
        id: "one_time",
        name: "One-Time Plan",
        description: "Temporary tribute with all premium features, valid for 30 days.",
        price: "₦1,500 (one-time)",
        features: ["1 Tribute (30 days)", "Unlimited Media", "All Premium Themes", "Music Options"],
        isPopular: false
    },
    "life-time": {
        id: "life-time",
        name: "Lifetime Plan",
        description: "A tribute that lasts forever with a one-time payment.",
        price: "₦15,000 (one-time)",
        features: ["Unlimited Tributes", "All Features", "Lifetime Access", "Priority Support"],
        isPopular: false
    }
}

// Helper component for the feature lock overlay
const FeatureLockOverlay = ({ onUpgrade }) => (
    <div className="relative bg-[#f8f4f0] p-6 rounded-lg min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="relative z-20 space-y-4">
            <Crown className="h-12 w-12 text-[#fcd34d] mx-auto" />
            <p className="text-xl font-semibold text-[#2a3342]">Feature Not Available</p>
            <p className="text-[#4a5568] max-w-sm">
                Music options are a premium feature. Please upgrade your plan to access background music for your tribute.
            </p>
            <Button
                onClick={onUpgrade}
                className="bg-[#fcd34d] hover:bg-[#645a52] text-white px-6 py-2"
            >
                Upgrade Plan
            </Button>
        </div>
    </div>
);

// Simple Plan Change Dialog Component
const PlanChangeDialog = ({ isOpen, onClose, currentPlanId, onChangePlan, isLoading }) => {
    const [selectedPlan, setSelectedPlan] = useState(currentPlanId);

    const handleConfirm = () => {
        if (selectedPlan && selectedPlan !== currentPlanId) {
            onChangePlan(selectedPlan);
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[800px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-[#2a3342]">Change Your Plan</DialogTitle>
                    <DialogDescription className="text-[#4a5568]">
                        Choose the plan that best fits your needs. You can change your plan at any time.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.values(PLANS).map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative p-4 border rounded-lg cursor-pointer transition-all flex flex-col ${
                                    selectedPlan === plan.id
                                        ? "border-[#fcd34d] ring-2 ring-[#fcd34d] bg-[#f8f4f0]"
                                        : "border-[#e5e0d9] hover:border-[#fcd34d]"
                                } ${plan.id === currentPlanId ? "bg-[#f0f7ff]" : ""}`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1 ">
                                        <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="mt-1 text-[#fcd34d]" />
                                        <div className="flex-1">
                                            <Label htmlFor={`plan-${plan.id}`} className="cursor-pointer flex flex-col h-full">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-semibold text-[#2a3342]">{plan.name}</span>
                                                    {plan.isPopular && (
                                                        <Badge className="bg-[#fcd34d] text-white text-xs">Popular</Badge>
                                                    )}
                                                    {plan.id === currentPlanId && (
                                                        <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                                                            Current
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-[#4a5568] mb-2">{plan.description}</p>
                                                <p className="text-lg font-bold text-[#2a3342] mb-2">{plan.price}</p>
                                                <ul className="space-y-1 text-sm text-[#4a5568] mt-auto">
                                                    {plan.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center space-x-2">
                                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedPlan || selectedPlan === currentPlanId}
                        className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {selectedPlan === currentPlanId ? "Current Plan" : "Change Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function MemoriesMusicTheme() {
    const { id } = useParams()
    const [tribute, setTribute] = useState({
        music_option: "",
        selected_music_id: "",
        theme: "",
        music: "",
        plan: "free",
        title: "",
        id: "",
    })
    const [themes, setThemes] = useState([])
    const [loadingThemes, setLoadingThemes] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [title, setTitle] = useState("TRIBUTE")
    const [previewTheme, setPreviewTheme] = useState(null)
    const [audioPlaying, setAudioPlaying] = useState(false)
    const [audioElement, setAudioElement] = useState(null)
    const [showPlanDialog, setShowPlanDialog] = useState(false)
    const [activeTab, setActiveTab] = useState("theme")

    useEffect(() => {
        setIsLoading(true)
        fetchTributeTitle()
        fetchTributeDetails()
        fetchThemes()

        return () => {
            if (audioElement) {
                audioElement.pause()
                audioElement.src = ""
            }
        }
    }, [])

    const fetchThemes = async () => {
        try {
            setLoadingThemes(true)
            const response = await fetch(`${server}/themes`)
            if (!response.ok) {
                throw new Error('Failed to fetch themes')
            }
            const themesData = await response.json()
            const themesFromBackend = themesData.data || []

            // Map backend themes to include images and normalize data
            const themesWithImages = themesFromBackend.map(theme => ({
                id: theme.id,
                name: theme.name,
                description: theme.description || "A beautiful memorial theme",
                allowed_plans: theme.allowed_plans || ['free'],
                colors: theme.colors || {
                    primary: '#1f2937',
                    background: '#f9fafb',
                    card: '#ffffff',
                    text: '#374151',
                    accent: '#4f46e5'
                },
                layout_type: theme.layout_type || 'single',
                image: theme.image_url || defaultThemeImages[theme.id] || defaultThemeImages.serenity,
                is_active: theme.is_active !== false
            }))

            setThemes(themesWithImages.filter(theme => theme.is_active))
        } catch (error) {
            console.error("Failed to fetch themes:", error)
            toast.error("Could not load themes. Please try again later.")
            // Fallback to default themes if API fails
            setThemes(getDefaultThemes())
        } finally {
            setLoadingThemes(false)
        }
    }

    const getDefaultThemes = () => [
        {
            id: "serenity",
            name: "Serenity",
            description: "A peaceful and calming design with soft colors",
            allowed_plans: ['free', 'premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#1f2937',
                background: '#f9fafb',
                card: '#ffffff',
                text: '#374151',
                accent: '#4f46e5'
            },
            layout_type: 'single',
            image: defaultThemeImages.serenity
        },
        {
            id: "classic",
            name: "Classic Elegance",
            description: "Traditional design with warm, comforting colors",
            allowed_plans: ['free', 'premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#7c2d12',
                background: '#fef7ed',
                card: '#ffffff',
                text: '#431407',
                accent: '#ea580c'
            },
            layout_type: 'single',
            image: defaultThemeImages.classic
        },
        {
            id: "vibrant",
            name: "Vibrant Life",
            description: "Colorful and energetic design celebrating life",
            allowed_plans: ['premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#7c3aed',
                background: '#faf5ff',
                card: '#ffffff',
                text: '#5b21b6',
                accent: '#8b5cf6'
            },
            layout_type: 'single',
            image: defaultThemeImages.vibrant
        },
        {
            id: "modern",
            name: "Modern Minimal",
            description: "Contemporary design with bold colors and layout",
            allowed_plans: ['premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#1e40af',
                background: '#eff6ff',
                card: '#ffffff',
                text: '#1e3a8a',
                accent: '#3b82f6'
            },
            layout_type: 'tabs',
            image: defaultThemeImages.modern
        },
        {
            id: "celestial",
            name: "Celestial",
            description: "Elegant design with celestial motifs and dark theme",
            allowed_plans: ['lifetime'],
            colors: {
                primary: '#1e1b4b',
                background: '#0f172a',
                card: '#1e293b',
                text: '#e2e8f0',
                accent: '#6366f1'
            },
            layout_type: 'single',
            image: defaultThemeImages.celestial
        }
    ]

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(`${server}/tribute/title/image/${user.id}`)
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            const data = response.data

            let musicOption = "no_music"
            if (data.music_type === "default") {
                musicOption = "select_music"
            } else if (data.music_type === "custom") {
                musicOption = "upload_music"
            }

            setTribute({
                music_option: musicOption,
                selected_music_id: data.selected_music_id || "",
                theme: data.theme || "",
                music: data.custom_music || null,
                plan: data.plan?.toLowerCase() || "free",
                title: data.title || "",
                id: data.id,
            })
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            toast.error("Failed to load tribute details")
        } finally {
            setIsLoading(false)
        }
    }

    const handleMusicOptionChange = (value) => {
        setTribute((prev) => ({
            ...prev,
            music_option: value,
        }))
    }

    const handleSelectedMusicChange = (value) => {
        setTribute((prev) => ({
            ...prev,
            selected_music_id: value,
        }))
    }

    const handleThemeChange = (themeId) => {
        const themeObj = themes.find((t) => t.id === themeId);
        if (!themeObj) return;

        // Check if theme is allowed for current plan
        if (!themeObj.allowed_plans.includes(tribute.plan)) {
            setShowPlanDialog(true);
            return;
        }

        setTribute((prev) => ({ ...prev, theme: themeId }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setTribute((prev) => ({ ...prev, music: file }))
        }
    }

    const handlePlanChange = async (newPlanId) => {
        try {
            setIsLoading(true);
            console.log("Updating plan to:", newPlanId)
            const response = await axios.post(`${server}/tributes/${tribute.id}/plan`, {
                plan: newPlanId,
                current_plan: tribute.plan
            });

            // Handle payment redirection from Paystack
            if (response.data.data && response.data.data.authorization_url) {
                window.location.href = response.data.data.authorization_url;
            } else if (response.data.redirect_url) {
                window.location.href = response.data.redirect_url;
            } else { // Handle successful downgrade to free or other non-payment updates
                setTribute((prev) => ({ ...prev, plan: newPlanId }));
                setShowPlanDialog(false);
                toast.success(response.data.message || "Plan updated successfully");
                fetchTributeDetails();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update plan";
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                Object.values(validationErrors).forEach(err => {
                    toast.error(err[0]);
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        const formData = new FormData();

        formData.append("theme", tribute.theme || "");

        try {
            if (!["free"].includes(tribute.plan)) {
                if (tribute.music_option === "select_music" && tribute.selected_music_id) {
                    const selectedMusic = musicOptions.find((m) => m.id === tribute.selected_music_id);
                    if (selectedMusic) {
                        const response = await fetch(selectedMusic.file);
                        const blob = await response.blob();
                        formData.append("default_music", blob, selectedMusic.name + '.mp3');
                    }
                } else if (tribute.music_option === "upload_music" && tribute.music) {
                    if (tribute.music instanceof File) {
                        const fileType = tribute.music.type.toLowerCase();
                        const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav'];
                        const validExtensions = ['.mp3', '.wav'];

                        if (validTypes.includes(fileType) ||
                            validExtensions.some(ext => tribute.music.name.toLowerCase().endsWith(ext))) {
                            formData.append("music_file", tribute.music);
                        } else {
                            throw new Error("Only MP3 and WAV files are allowed");
                        }
                    }
                }
                formData.append("music_option", tribute.music_option);
            } else {
                formData.append("music_option", "no_music");
            }

            const response = await axios.post(`${server}/tributes/${id}/music`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message) {
                toast.success(response.data.message);
                if (audioElement) {
                    audioElement.pause();
                    setAudioElement(null);
                    setAudioPlaying(false);
                }
                fetchTributeDetails();
            }
        } catch (error) {
            console.error("Error updating tribute:", error);
            const message = error.response?.data?.message || error.message || "Failed to update tribute";
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    const openThemePreview = (theme) => {
        setPreviewTheme(theme)
    }

    const playMusic = (musicFile) => {
        if (audioElement) {
            audioElement.pause()
        }

        const audio = new Audio(musicFile)
        audio.addEventListener("ended", () => setAudioPlaying(false))
        audio.play().catch(err => {
            console.error("Error playing audio:", err);
            toast.error("Could not play audio.");
            setAudioPlaying(false);
        });
        setAudioElement(audio)
        setAudioPlaying(true)
    }

    const pauseMusic = () => {
        if (audioElement) {
            audioElement.pause()
            setAudioPlaying(false)
        }
    }

    // Get current plan details - using simple string access
    const currentPlan = PLANS[tribute.plan] || PLANS.free; // This was already correct, but I'm confirming it.

    // Determine if music tab should be locked
    const isMusicLocked = tribute.plan === "free";

    // Filter available themes based on current plan
    const availableThemes = tribute.plan
        ? themes.filter(theme => theme.allowed_plans.includes(tribute.plan))
        : [];

    return (
        <div className="bg-[#f8f4f0] min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-between text-xs sm:text-sm text-[#4a5568] mb-2 gap-2">
                        <span className="font-medium text-[#2a3342]">Basic Info</span>
                        <span>Life</span>
                        <span>Events & Donations</span>
                        <span>Memories</span>
                    </div>
                    <Progress value={100} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                </div>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <CardTitle className="text-3xl font-serif text-[#2a3342]">{title}</CardTitle>
                                <CardDescription className="text-[#4a5568]">
                                    Customize your tribute's appearance and sound
                                </CardDescription>
                            </div>

                            {/* Current Plan Display - Simplified */}
                            <div className="flex items-center bg-[#f8f4f0] rounded-lg p-3 space-x-3">
                                <div className="flex-shrink-0">
                                    <Crown className={`h-5 w-5 ${tribute.plan === "free" ? "text-[#4a5568]" : "text-[#fcd34d]"}`} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-[#2a3342]">Current Plan: {currentPlan.name}</p>
                                    <p className="text-xs text-[#4a5568]">{currentPlan.price}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                                    onClick={() => setShowPlanDialog(true)}
                                >
                                    Change
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-[#fcd34d]" />
                            </div>
                        ) : (
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid grid-cols-2 mb-6 bg-[#f0ece6]">
                                    <TabsTrigger
                                        value="theme"
                                        className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                    >
                                        <Palette className="h-4 w-4 mr-2" />
                                        Theme
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="music"
                                        className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                    >
                                        <Music className="h-4 w-4 mr-2" />
                                        Music
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="theme" className="mt-0 space-y-6">
                                    <ThemeSelection
                                        tribute={tribute}
                                        themes={themes}
                                        availableThemes={availableThemes}
                                        loadingThemes={loadingThemes}
                                        onChange={handleThemeChange}
                                        onPreview={openThemePreview}
                                    />
                                </TabsContent>

                                <TabsContent value="music" className="mt-0 space-y-6">
                                    {isMusicLocked ? (
                                        <FeatureLockOverlay onUpgrade={() => setShowPlanDialog(true)} />
                                    ) : (
                                        <MusicOptions
                                            tribute={tribute}
                                            musicOptions={musicOptions}
                                            onOptionChange={handleMusicOptionChange}
                                            onSelectedMusicChange={handleSelectedMusicChange}
                                            onFileChange={handleFileChange}
                                            playMusic={playMusic}
                                            pauseMusic={pauseMusic}
                                            isPlaying={audioPlaying}
                                        />
                                    )}
                                </TabsContent>
                            </Tabs>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t p-6 gap-4">
                        <NavigationButtons id={id} tribute={tribute} />

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || isSaving}
                                className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>

                            <Link to="/dashboard/main" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Theme Preview Modal */}
            {previewTheme && (
                <ThemePreviewModal theme={previewTheme} onClose={() => setPreviewTheme(null)}/>
            )}

            {/* Simplified Plan Change Dialog */}
            <PlanChangeDialog
                isOpen={showPlanDialog}
                onClose={() => setShowPlanDialog(false)}
                currentPlanId={tribute.plan}
                onChangePlan={handlePlanChange}
                isLoading={isLoading}
            />
        </div>
    )
}

const MusicOptions = ({
                          tribute,
                          musicOptions,
                          onOptionChange,
                          onSelectedMusicChange,
                          onFileChange,
                          playMusic,
                          pauseMusic,
                          isPlaying,
                      }) => {

    const handlePlayPause = (music) => {
        if (music && music.file) {
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic(music.file);
            }
        } else if (music instanceof File) {
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic(URL.createObjectURL(music));
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#f8f4f0] p-6 rounded-lg">
                <h3 className="text-xl font-medium text-[#2a3342] mb-4">Background Music</h3>
                <p className="text-[#4a5568] mb-4">
                    Choose background music that will play when visitors view your tribute page.
                </p>

                <RadioGroup
                    value={tribute.music_option || 'no_music'}
                    onValueChange={onOptionChange}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-md hover:bg-[#f5f0ea] transition-colors">
                        <RadioGroupItem value="no_music" id="no_music" className="text-[#fcd34d]" />
                        <Label htmlFor="no_music" className="font-medium text-[#2a3342] cursor-pointer">
                            No Music
                        </Label>
                        <span className="text-sm text-[#4a5568] ml-auto">Silent tribute page</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-md hover:bg-[#f5f0ea] transition-colors">
                        <RadioGroupItem value="select_music" id="select_music" className="text-[#fcd34d]" />
                        <Label htmlFor="select_music" className="font-medium text-[#2a3342] cursor-pointer">
                            Select Music
                        </Label>
                        <span className="text-sm text-[#4a5568] ml-auto">Choose from our collection</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-md hover:bg-[#f5f0ea] transition-colors">
                        <RadioGroupItem value="upload_music" id="upload_music" className="text-[#fcd34d]" />
                        <Label htmlFor="upload_music" className="font-medium text-[#2a3342] cursor-pointer">
                            Upload Music
                        </Label>
                        <span className="text-sm text-[#4a5568] ml-auto">Use your own audio file</span>
                    </div>
                </RadioGroup>
            </div>

            {tribute.music_option === "select_music" && (
                <div className="bg-white border border-[#e5e0d9] p-6 rounded-lg space-y-4">
                    <h4 className="font-medium text-[#2a3342]">Choose a Track</h4>
                    <Select value={tribute.selected_music_id} onValueChange={onSelectedMusicChange}>
                        <SelectTrigger className="w-full border-[#e5e0d9]">
                            <SelectValue placeholder="Select a music track" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {musicOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {tribute.selected_music_id && (
                        <div className="flex items-center p-3 bg-[#f8f4f0] rounded-md">
                            <Button
                                variant="outline"
                                size="sm"
                                className="mr-3 border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                                onClick={() => {
                                    const music = musicOptions.find((m) => m.id === tribute.selected_music_id)
                                    if (music) {
                                        handlePlayPause(music)
                                    }
                                }}
                            >
                                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                {isPlaying ? "Pause" : "Preview"}
                            </Button>
                            <span className="text-[#4a5568]">
                {musicOptions.find((m) => m.id === tribute.selected_music_id)?.name}
              </span>
                        </div>
                    )}
                </div>
            )}

            {tribute.music_option === "upload_music" && (
                <div className="bg-white border border-[#e5e0d9] p-6 rounded-lg space-y-4">
                    <h4 className="font-medium text-[#2a3342]">Upload Your Music</h4>
                    <p className="text-sm text-[#4a5568]">Supported formats: MP3, WAV (max 10MB)</p>

                    <Label htmlFor="music-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full h-32 px-4 transition bg-[#f8f4f0] border-2 border-dashed border-[#e5e0d9] rounded-md appearance-none cursor-pointer hover:border-[#fcd34d] focus:outline-none">
              <span className="flex items-center space-x-2">
                <Upload className="w-6 h-6 text-[#fcd34d]" />
                <span className="font-medium text-[#4a5568]">
                  {tribute.music instanceof File ? tribute.music.name : (typeof tribute.music === 'string' && tribute.music ? "Current: " + tribute.music.split('/').pop() : "Click to upload music")}
                </span>
              </span>
                            <input id="music-upload" type="file" className="hidden" onChange={onFileChange} accept=".mp3,.wav,audio/mpeg,audio/wav" />
                        </div>
                    </Label>

                    {tribute.music && (
                        <div className="flex items-center p-3 bg-[#f8f4f0] rounded-md">
                            <Button
                                variant="outline"
                                size="sm"
                                className="mr-3 border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                                onClick={() => {
                                    if (tribute.music instanceof File) {
                                        handlePlayPause(tribute.music);
                                    } else if (typeof tribute.music === 'string') {
                                        playMusic(tribute.music);
                                    }
                                }}
                            >
                                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                {isPlaying ? "Pause" : "Preview"}
                            </Button>
                            <span className="text-[#4a5568]">{tribute.music instanceof File ? tribute.music.name : (typeof tribute.music === 'string' ? tribute.music.split('/').pop() : "")}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const ThemeSelection = ({ tribute, themes, availableThemes, loadingThemes, onChange, onPreview }) => {
    if (loadingThemes) {
        return (
            <div className="space-y-6">
                <div className="bg-[#f8f4f0] p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-medium text-[#2a3342] mb-4">Visual Theme</h3>
                    <p className="text-[#4a5568]">Loading available themes...</p>
                </div>
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#fcd34d]" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-[#f8f4f0] p-6 rounded-lg mb-6">
                <h3 className="text-xl font-medium text-[#2a3342] mb-4">Visual Theme</h3>
                <p className="text-[#4a5568]">
                    Choose a theme that best represents your loved one's personality and style.
                    {tribute.plan && (
                        <span className="block mt-2 text-sm">
              {availableThemes.length} theme{availableThemes.length !== 1 ? 's' : ''} available for your {tribute.plan} plan
            </span>
                    )}
                </p>
            </div>

            {availableThemes.length === 0 ? (
                <div className="text-center py-12 bg-[#f8f4f0] rounded-lg">
                    <Palette className="h-12 w-12 text-[#fcd34d] mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-[#2a3342] mb-2">No Themes Available</h4>
                    <p className="text-[#4a5568]">
                        {themes.length === 0
                            ? "No themes are currently available. Please try again later."
                            : `No themes are available for the ${tribute.plan} plan. Please upgrade to access more themes.`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableThemes.map((theme) => {
                        const isSelected = tribute.theme === theme.id;
                        const isFreeTheme = theme.allowed_plans.includes('free');

                        return (
                            <Card
                                key={theme.id}
                                className={`transition-all cursor-pointer ${
                                    isSelected
                                        ? "ring-2 ring-[#fcd34d] shadow-md"
                                        : "hover:border-[#fcd34d]/50 hover:shadow-sm"
                                }`}
                                onClick={() => onChange(theme.id)}
                            >
                                <div className="aspect-video relative group overflow-hidden rounded-t-lg">
                                    <img
                                        src={theme.image}
                                        alt={theme.name}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.src = "/images/themes/default-thumb.jpg"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onPreview({
                                                    id: tribute?.id,
                                                    name: theme.name,
                                                    title: tribute?.title,
                                                    colors: theme.colors,
                                                    layout_type: theme.layout_type,
                                                    description: theme.description,
                                                });
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Preview
                                        </Button>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-3 left-3 bg-[#fcd34d] text-white rounded-full p-1">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                    {!isFreeTheme && (
                                        <div className="absolute top-3 right-3">
                                            <Badge variant="outline" className="text-xs bg-white/90">
                                                Premium
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-[#2a3342]">{theme.name}</h4>
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {theme.layout_type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>

                                    {/* Color Palette Preview */}
                                    <div className="flex space-x-1 mb-2">
                                        {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-6 h-6 rounded border flex-1"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-[#4a5568]">
                                        <div className="flex items-center">
                                            <Layout className="h-3 w-3 mr-1" />
                                            {theme.layout_type === 'tabs' ? 'Tabbed Layout' : 'Single Page'}
                                        </div>
                                        <div className="flex items-center">
                                            <Eye className="h-3 w-3 mr-1" />
                                            Click to select
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const NavigationButtons = ({ id, tribute }) => (
    <div className="flex gap-3 w-full sm:w-auto">
        <Link to={`/dashboard/memories/memories/${id}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                <ChevronLeft className="h-4 w-4 mr-2" /> Memories
            </Button>
        </Link>
        <Button
            variant="outline"
            className="w-full border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
            onClick={() => {
                const themeName = tribute?.theme || 'default';
                const tributeId = id || tribute?.id;
                const tributeTitle = tribute?.title || 'tribute';
                if (tributeId) {
                    window.open(`/${themeName}/${tributeId}/${encodeURIComponent(tributeTitle)}`, '_blank')
                } else {
                    toast.error("Tribute details not available for preview.");
                }
            }}
        >
            Preview <Eye className="h-4 w-4 ml-2" />
        </Button>
    </div>
)