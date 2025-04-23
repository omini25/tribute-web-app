"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

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
    Bookmark,
    ChevronRight
} from "lucide-react"

// Config
import { server } from "@/server.js"

import Header from "@/components/landing/Header.jsx";
import {assetServer} from "@/assetServer.js";

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
        return "Invalid Date"
    }
}

export function ModernTheme({ fallbackId }) {
    const params = useParams();
    const navigate = useNavigate();
    const id = params?.id || fallbackId;
    const [memorial, setMemorial] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState("story")
    const [messageOpen, setMessageOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        const fetchMemorial = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await axios.get(`${server}/tribute/details/${id}`)
                // Enhance data for premium look
                const fetchedData = response.data
                fetchedData.biography =
                    fetchedData.biography ||
                    "A detailed life story about the beloved individual will be added here soon. Their journey, passions, and the impact they had on the lives they touched deserve a thoughtful recount."
                fetchedData.photos = fetchedData.photos || []
                fetchedData.service_details = fetchedData.service_details || null
                fetchedData.donation_charity =
                    fetchedData.donation_charity || "a cause dear to their heart"
                fetchedData.donation_link = fetchedData.donation_link || null
                fetchedData.epitaph = fetchedData.epitaph || "Forever in our hearts"
                fetchedData.memories = fetchedData.memories || []
                fetchedData.achievements = fetchedData.achievements || []
                fetchedData.favorite_quotes = fetchedData.favorite_quotes || []

                setMemorial(fetchedData)
            } catch (err) {
                setError("Failed to load tribute details. Please try again later.")
                console.error("Error fetching memorial details:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMemorial()
    }, [id])

    console.log(memorial)

    // Message Tribute Creator Function
    const handleSendMessage = async () => {
        if (!message.trim()) return

        setIsSending(true)
        try {
            await axios.post(`${server}/tribute/message/${id}`, {
                message: message.trim(),
                tribute_id: id
            })
            setMessage("")
            setMessageOpen(false)
            // Optional: Show success toast/notification
        } catch (error) {
            console.error("Error sending message:", error)
            // Optional: Show error toast/notification
        } finally {
            setIsSending(false)
        }
    }

    // Loading State
    if (isLoading)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 text-slate-600">
                <div className="w-16 h-16 relative animate-spin">
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-t-rose-500 border-slate-200 rounded-full"></div>
                </div>
                <p className="mt-6 text-lg font-medium">Loading Tribute...</p>
            </div>
        )

    // Error State
    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-6">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-semibold mb-2">An Error Occurred</h2>
                    <p className="mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-rose-600 hover:bg-rose-700"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        )

    // No Memorial Found State
    if (!memorial)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-semibold mb-2">Tribute Not Found</h2>
                    <p className="mb-6">
                        The tribute you're looking for doesn't exist or has been removed.
                    </p>
                    <Button asChild className="bg-rose-600 hover:bg-rose-700">
                        <a href="/">Return Home</a>
                    </Button>
                </div>
            </div>
        )

    // Prepare Data for Components
    const fullName = `${memorial.first_name || ""} ${memorial.middle_name ||
    ""} ${memorial.last_name || ""}`
        .replace(/\s+/g, " ")
        .trim()
    const lifeDates = `${formatDate(memorial.date_of_birth)} - ${formatDate(
        memorial.date_of_death
    )}`
    const yearsLived = `${new Date(
        memorial.date_of_birth
    ).getFullYear()} - ${new Date(memorial.date_of_death).getFullYear()}`
    const age =
        memorial.date_of_birth && memorial.date_of_death
            ? Math.floor(
                (new Date(memorial.date_of_death) -
                    new Date(memorial.date_of_birth)) /
                (365.25 * 24 * 60 * 60 * 1000)
            )
            : null

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 font-sans">
                {/* Hero Banner */}
                <div className="relative bg-gradient-to-r from-rose-500 to-purple-600 text-white">
                    <div className="absolute inset-0 bg-black/30 z-10"></div>

                    {memorial.image ? (
                        <div className="absolute inset-0">
                            <img
                                src={memorial.image || "/placeholder.svg"}
                                alt={fullName}
                                fill
                                className="object-cover opacity-40"
                                priority
                            />
                        </div>
                    ) : null}

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-20">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/80 shadow-xl flex-shrink-0 bg-gradient-to-br from-rose-200 to-rose-300">
                                {memorial.image ? (
                                    <img
                                        src={
                                            `${assetServer}/images/people/${memorial?.image}` ||
                                            "/placeholder.svg"
                                        }
                                        alt={fullName}
                                        width={224}
                                        height={224}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                                        {fullName.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="text-center md:text-left">
                                {/*<Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">*/}
                                {/*    Premium Tribute*/}
                                {/*</Badge>*/}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                                    {fullName}
                                </h1>
                                <p className="text-xl md:text-2xl opacity-90 mb-4">
                                    {yearsLived}
                                </p>
                                <p className="text-lg md:text-xl italic opacity-80 max-w-2xl">
                                    {memorial.epitaph}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-between py-3 text-sm">
                            <div className="flex items-center gap-6 flex-wrap">
                                {memorial.date_of_birth && (
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-rose-500" />
                                        <span>Born: {formatDate(memorial.date_of_birth)}</span>
                                    </div>
                                )}

                                {memorial.country_of_birth && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                        <span>{memorial.country_of_birth}</span>
                                    </div>
                                )}

                                {age !== null && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-rose-500" />
                                        <span>{age} years</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                {/*Message Tribute Creator*/}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5"
                                    onClick={() => setMessageOpen(true)}
                                >
                                    <MessageCircle className="w-4 h-4" /> Message
                                </Button>

                                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                                    <Share2 className="w-4 h-4" /> Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                        {/* Main Content Area */}
                        <div className="space-y-8">
                            {/* Navigation Tabs */}
                            <Tabs
                                defaultValue="story"
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-white rounded-lg border border-slate-200 p-1">
                                    <TabsTrigger
                                        value="story"
                                        className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
                                    >
                                        Life Story
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="gallery"
                                        className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
                                    >
                                        Gallery
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="timeline"
                                        className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
                                    >
                                        Timeline
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="tributes"
                                        className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
                                    >
                                        Tributes
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="service"
                                        className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
                                    >
                                        Service
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="donate"
                                        className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
                                    >
                                        Donate
                                    </TabsTrigger>
                                </TabsList>

                                {/* Life Story Tab */}
                                <TabsContent value="story" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                            <CardTitle className="text-2xl font-semibold text-slate-900">
                                                Life Story
                                            </CardTitle>
                                            <CardDescription>
                                                The journey, passions, and legacy of {fullName}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-6 space-y-6">
                                            {memorial.quote && (
                                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 relative">
                                                    <Quote className="absolute text-rose-200 w-12 h-12 -top-2 -left-2" />
                                                    <blockquote className="pl-6 italic text-lg text-slate-700">
                                                        "{memorial.quote}"
                                                    </blockquote>
                                                </div>
                                            )}

                                            <div className="prose prose-slate max-w-none lg:prose-lg">
                                                <h3 className="text-xl font-medium text-slate-900 mb-3">
                                                    Biography
                                                </h3>
                                                <p>{memorial.biography}</p>

                                                {memorial.achievements &&
                                                    memorial.achievements.length > 0 && (
                                                        <>
                                                            <h3 className="text-xl font-medium text-slate-900 mt-8 mb-3">
                                                                Achievements & Milestones
                                                            </h3>
                                                            <ul>
                                                                {memorial.achievements.map(
                                                                    (achievement, index) => (
                                                                        <li key={index}>{achievement}</li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </>
                                                    )}

                                                {memorial.favorite_quotes &&
                                                    memorial.favorite_quotes.length > 0 && (
                                                        <>
                                                            <h3 className="text-xl font-medium text-slate-900 mt-8 mb-3">
                                                                Favorite Quotes
                                                            </h3>
                                                            <ul>
                                                                {memorial.favorite_quotes.map((quote, index) => (
                                                                    <li key={index}>"{quote}"</li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Gallery Tab */}
                                <TabsContent value="gallery" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                            <CardTitle className="text-2xl font-semibold text-slate-900">
                                                Photo Gallery
                                            </CardTitle>
                                            <CardDescription>
                                                Cherished moments and memories
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-6">
                                            {memorial.photos && memorial.photos.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                    {memorial.photos.map((photo, index) => (
                                                        <div
                                                            key={index}
                                                            className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative group"
                                                        >
                                                            <img
                                                                src={
                                                                    photo.url ||
                                                                    "/placeholder.svg?height=300&width=300"
                                                                }
                                                                alt={photo.caption || `Photo ${index + 1}`}
                                                                width={300}
                                                                height={300}
                                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                                            />
                                                            {photo.caption && (
                                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    {photo.caption}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 px-4">
                                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                        <img
                                                            src="/placeholder.svg?height=64&width=64"
                                                            alt="Gallery placeholder"
                                                            width={64}
                                                            height={64}
                                                            className="w-8 h-8 text-slate-400"
                                                        />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                                                        No Photos Yet
                                                    </h3>
                                                    <p className="text-slate-500 max-w-md mx-auto">
                                                        Photos will be added to this gallery soon to celebrate
                                                        the life and memories of {fullName}.
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Timeline Tab */}
                                <TabsContent value="timeline" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                            <CardTitle className="text-2xl font-semibold text-slate-900">
                                                Life Timeline
                                            </CardTitle>
                                            <CardDescription>
                                                Key moments and milestones
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-6">
                                            <div className="relative border-l-2 border-rose-200 pl-6 py-2 space-y-8">
                                                {/* Birth */}
                                                <div className="relative">
                                                    <div className="absolute -left-[29px] w-12 h-12 rounded-full bg-rose-100 border-4 border-white flex items-center justify-center shadow-sm">
                                                        <Calendar className="w-5 h-5 text-rose-600" />
                                                    </div>
                                                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                                                        <div className="text-sm text-rose-600 font-medium mb-1">
                                                            {formatDate(memorial.date_of_birth)}
                                                        </div>
                                                        <h3 className="text-lg font-medium text-slate-900 mb-1">
                                                            Born in {memorial.country_of_birth || "N/A"}
                                                        </h3>
                                                        <p className="text-slate-600">
                                                            {fullName} was born on{" "}
                                                            {formatDate(memorial.date_of_birth)}.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Life Events - Would be populated from memorial.life_events */}
                                                {memorial.life_events &&
                                                    memorial.life_events.map((event, index) => (
                                                        <div key={index} className="relative">
                                                            <div className="absolute -left-[29px] w-12 h-12 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shadow-sm">
                                                                <event.icon className="w-5 h-5 text-slate-600" />
                                                            </div>
                                                            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                                                                <div className="text-sm text-slate-500 font-medium mb-1">
                                                                    {formatDate(event.date)}
                                                                </div>
                                                                <h3 className="text-lg font-medium text-slate-900 mb-1">
                                                                    {event.title}
                                                                </h3>
                                                                <p className="text-slate-600">
                                                                    {event.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}

                                                {/* Death */}
                                                <div className="relative">
                                                    <div className="absolute -left-[29px] w-12 h-12 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shadow-sm">
                                                        <Heart className="w-5 h-5 text-slate-600" />
                                                    </div>
                                                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                                                        <div className="text-sm text-slate-500 font-medium mb-1">
                                                            {formatDate(memorial.date_of_death)}
                                                        </div>
                                                        <h3 className="text-lg font-medium text-slate-900 mb-1">
                                                            Passed away in {memorial.country_died || "N/A"}
                                                        </h3>
                                                        <p className="text-slate-600">
                                                            {fullName} passed away on{" "}
                                                            {formatDate(memorial.date_of_death)}.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Tributes Tab */}
                                <TabsContent value="tributes" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                            <CardTitle className="text-2xl font-semibold text-slate-900">
                                                Tributes & Memories
                                            </CardTitle>
                                            <CardDescription>
                                                Share your memories and messages of support
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-6">
                                            <div className="mb-8">
                                                <Button className="bg-rose-600 hover:bg-rose-700 gap-2">
                                                    <MessageCircle className="w-4 h-4" /> Share a Memory
                                                </Button>
                                            </div>

                                            {memorial.memories && memorial.memories.length > 0 ? (
                                                <div className="space-y-6">
                                                    {memorial.memories.map((memory, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <Avatar>
                                                                    <AvatarImage
                                                                        src={memory.authorImage || "/placeholder.svg"}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {memory.author.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {memory.author}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500">
                                                                        {formatDate(memory.date)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-slate-700">{memory.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 px-4 border border-dashed border-slate-300 rounded-lg">
                                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                        <MessageCircle className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                                                        No Memories Shared Yet
                                                    </h3>
                                                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                                                        Be the first to share a memory or message about{" "}
                                                        {fullName}.
                                                    </p>
                                                    <Button className="bg-rose-600 hover:bg-rose-700">
                                                        Share a Memory
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Service Tab */}
                                <TabsContent value="service" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                            <CardTitle className="text-2xl font-semibold text-slate-900">
                                                Service Information
                                            </CardTitle>
                                            <CardDescription>
                                                Details about memorial and funeral services
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-6">
                                            {memorial.service_details ? (
                                                <div className="space-y-6">
                                                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                                                        <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                                                            <Calendar className="w-5 h-5 mr-2 text-rose-500" />
                                                            {memorial.service_details.type ||
                                                                "Memorial Service"}
                                                        </h3>

                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500 mb-1">
                                                                    Date & Time
                                                                </div>
                                                                <div className="text-slate-900">
                                                                    {formatDate(memorial.service_details.date)}
                                                                    {memorial.service_details.time
                                                                        ? `, ${memorial.service_details.time}`
                                                                        : ""}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500 mb-1">
                                                                    Location
                                                                </div>
                                                                <div className="text-slate-900">
                                                                    {memorial.service_details.location ||
                                                                        "To be announced"}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {memorial.service_details.notes && (
                                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                                <div className="text-sm font-medium text-slate-500 mb-1">
                                                                    Additional Information
                                                                </div>
                                                                <div className="text-slate-700">
                                                                    {memorial.service_details.notes}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="mt-6 flex flex-wrap gap-3">
                                                            <Button variant="outline" className="gap-2">
                                                                <MapPin className="w-4 h-4" /> View Map
                                                            </Button>

                                                            <Button variant="outline" className="gap-2">
                                                                <Calendar className="w-4 h-4" /> Add to Calendar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 px-4 border border-dashed border-slate-300 rounded-lg">
                                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                        <Calendar className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                                                        Service Details Coming Soon
                                                    </h3>
                                                    <p className="text-slate-500 max-w-md mx-auto">
                                                        Information about memorial and funeral services will
                                                        be posted here when available.
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Donate Tab */}
                                <TabsContent value="donate" className="mt-6">
                                    <Card className="overflow-hidden border-slate-200">
                                        <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                            <CardTitle className="text-2xl font-semibold text-slate-900">
                                                Make a Donation
                                            </CardTitle>
                                            <CardDescription>
                                                Honor the memory of {fullName} with a charitable
                                                contribution
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-6">
                                            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                                                <h3 className="text-lg font-medium text-slate-900 mb-2 flex items-center">
                                                    <Gift className="w-5 h-5 mr-2 text-rose-500" />
                                                    In Lieu of Flowers
                                                </h3>

                                                <p className="text-slate-700 mb-6">
                                                    The family kindly requests that in lieu of flowers,
                                                    donations be made to{" "}
                                                    {memorial.donation_charity ||
                                                        "a cause dear to their heart"}{" "}
                                                    in memory of {fullName}.
                                                </p>

                                                {memorial.donation_link ? (
                                                    <Button
                                                        asChild
                                                        className="bg-rose-600 hover:bg-rose-700 gap-2"
                                                    >
                                                        <a
                                                            href={memorial.donation_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Donate Now <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        disabled
                                                        className="bg-rose-600 hover:bg-rose-700"
                                                    >
                                                        Donation Information Pending
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <Card className="overflow-hidden border-slate-200">
                                <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        About {fullName}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {memorial.nickname && (
                                            <div className="px-6 py-4 flex justify-between items-center">
                                                <div className="text-sm font-medium text-slate-500">
                                                    Known As
                                                </div>
                                                <div className="text-sm text-slate-900">
                                                    {memorial.nickname}
                                                </div>
                                            </div>
                                        )}

                                        <div className="px-6 py-4 flex justify-between items-center">
                                            <div className="text-sm font-medium text-slate-500">
                                                Born
                                            </div>
                                            <div className="text-sm text-slate-900">
                                                {formatDate(memorial.date_of_birth)}
                                            </div>
                                        </div>

                                        {memorial.country_of_birth && (
                                            <div className="px-6 py-4 flex justify-between items-center">
                                                <div className="text-sm font-medium text-slate-500">
                                                    Birthplace
                                                </div>
                                                <div className="text-sm text-slate-900">
                                                    {memorial.country_of_birth}
                                                </div>
                                            </div>
                                        )}

                                        <div className="px-6 py-4 flex justify-between items-center">
                                            <div className="text-sm font-medium text-slate-500">
                                                Passed Away
                                            </div>
                                            <div className="text-sm text-slate-900">
                                                {formatDate(memorial.date_of_death)}
                                            </div>
                                        </div>

                                        {memorial.country_died && (
                                            <div className="px-6 py-4 flex justify-between items-center">
                                                <div className="text-sm font-medium text-slate-500">
                                                    Place of Death
                                                </div>
                                                <div className="text-sm text-slate-900">
                                                    {memorial.country_died}
                                                </div>
                                            </div>
                                        )}

                                        {age !== null && (
                                            <div className="px-6 py-4 flex justify-between items-center">
                                                <div className="text-sm font-medium text-slate-500">
                                                    Age
                                                </div>
                                                <div className="text-sm text-slate-900">{age} years</div>
                                            </div>
                                        )}

                                        {/*{memorial.relationship && (*/}
                                        {/*    <div className="px-6 py-4 flex justify-between items-center">*/}
                                        {/*        <div className="text-sm font-medium text-slate-500">*/}
                                        {/*            Relationship*/}
                                        {/*        </div>*/}
                                        {/*        <div className="text-sm text-slate-900">*/}
                                        {/*            {memorial.relationship}*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-slate-50 px-6 py-4">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Share2 className="w-4 h-4" /> Share Profile
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Memorial Info */}
                            <Card className="overflow-hidden border-slate-200">
                                <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        Memorial Information
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        <div className="px-6 py-4 flex justify-between items-center">
                                            <div className="text-sm font-medium text-slate-500">
                                                Created On
                                            </div>
                                            <div className="text-sm text-slate-900">
                                                {formatDate(memorial.created_at || new Date())}
                                            </div>
                                        </div>

                                        {/*<div className="px-6 py-4 flex justify-between items-center">*/}
                                        {/*    <div className="text-sm font-medium text-slate-500">*/}
                                        {/*        Memorial Type*/}
                                        {/*    </div>*/}
                                        {/*    <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">*/}
                                        {/*        Premium*/}
                                        {/*    </Badge>*/}
                                        {/*</div>*/}

                                        {memorial.plan && (
                                            <div className="px-6 py-4 flex justify-between items-center">
                                                <div className="text-sm font-medium text-slate-500">
                                                    Plan
                                                </div>
                                                <div className="text-sm text-slate-900">
                                                    {memorial.plan}
                                                </div>
                                            </div>
                                        )}

                                        {memorial.end_date && (
                                            <div className="px-6 py-4 flex justify-between items-center">
                                                <div className="text-sm font-medium text-slate-500">
                                                    Active Until
                                                </div>
                                                <div className="text-sm text-slate-900">
                                                    {formatDate(memorial.end_date)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Links */}
                            <Card className="overflow-hidden border-slate-200">
                                <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        Quick Links
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        <button
                                            onClick={() => setActiveTab("story")}
                                            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="text-sm font-medium text-slate-900">
                                                Life Story
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("gallery")}
                                            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="text-sm font-medium text-slate-900">
                                                Photo Gallery
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("tributes")}
                                            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="text-sm font-medium text-slate-900">
                                                Share a Memory
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </button>

                                        {memorial.service_details && (
                                            <button
                                                onClick={() => setActiveTab("service")}
                                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="text-sm font-medium text-slate-900">
                                                    Service Details
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </button>
                                        )}

                                        {!memorial.no_donations && (
                                            <button
                                                onClick={() => setActiveTab("donate")}
                                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="text-sm font-medium text-slate-900">
                                                    Make a Donation
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* QR Code */}
                            <Card className="overflow-hidden border-slate-200">
                                <CardHeader className="bg-gradient-to-r from-rose-50 to-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-xl font-semibold text-slate-900">
                                        Share This Tribute
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-6 text-center">
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 inline-block mb-4">
                                        <div className="w-32 h-32 bg-slate-100 flex items-center justify-center">
                                            {/* QR code would go here */}
                                            <img
                                                src="/placeholder.svg?height=128&width=128"
                                                alt="QR Code"
                                                width={128}
                                                height={128}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 mb-4">
                                        Scan this code to visit this tribute page on your mobile
                                        device
                                    </p>

                                    <div className="flex justify-center gap-2">
                                        <Button variant="outline" size="sm" className="gap-1.5">
                                            <Share2 className="w-4 h-4" /> Share
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-1.5">
                                            <Bookmark className="w-4 h-4" /> Save
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-800 text-slate-300 py-12 mt-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    About This Tribute
                                </h3>
                                <p className="text-slate-400 mb-4">
                                    This memorial tribute was created to honor and celebrate the
                                    life of {fullName}.
                                </p>
                                <p className="text-slate-400">{lifeDates}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Quick Links
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => {
                                                setActiveTab("story")
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            }}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            Life Story
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                setActiveTab("gallery")
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            }}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            Photo Gallery
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                setActiveTab("tributes")
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            }}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            Share a Memory
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                setActiveTab("service")
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            }}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            Service Information
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
                                <p className="text-slate-400 mb-4">
                                    For questions or assistance with this memorial tribute, please
                                    contact us.
                                </p>
                                <Button
                                    variant="outline"
                                    className="bg-transparent text-white border-slate-600 hover:bg-slate-700 hover:text-white"
                                >
                                    Contact Support
                                </Button>
                            </div>
                        </div>

                        <Separator className="my-8 bg-slate-700" />

                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-slate-400 mb-4 md:mb-0">
                                &copy; {new Date().getFullYear()}{" "}
                                {memorial.tribute_name || "Memorial Tribute"}. All rights
                                reserved.
                            </p>

                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </a>
                                <a
                                    href="#"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Help
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/*Message Tag*/}
            <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Send a Message</DialogTitle>
                        <DialogDescription>
                            Share your thoughts and condolences with the family.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setMessageOpen(false)}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending}
                            className="bg-rose-600 hover:bg-rose-700"
                        >
                            {isSending ? "Sending..." : "Send Message"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
