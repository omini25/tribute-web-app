"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
    Users,
    Share,
    Link
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {Events} from "@/components/tribute/Events.jsx";

export function ElegantTabTheme() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState("about")
    const [memorial, setMemorial] = useState(null)
    const [milestonesData, setMilestonesData] = useState([])
    const [memory, setMemory] = useState("")
    const [image, setImage] = useState(null)
    const [video, setVideo] = useState(null)
    const [link, setLink] = useState("")
    const [memories, setMemories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isMemorialLoading, setIsMemorialLoading] = useState(true)
    const [isMilestonesLoading, setIsMilestonesLoading] = useState(true)
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
    const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
        tribute_id: id
    })
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
        tribute_id: id
    })

    useEffect(() => {
        fetchMilestonesData()
    }, [])

    useEffect(() => {
        axios
            .get(`${server}/tribute/details/${id}`)
            .then(response => {
                setMemorial(response.data)
            })
            .catch(error => {
                console.error("Error fetching memorial details:", error)
            })
            .finally(() => {
                setIsMemorialLoading(false)
            })
    }, [id])

    const fetchMilestonesData = async () => {
        try {
            const response = await axios.get(`${server}/tributes/${id}/bio-family`)
            if (response.data.status === "success") {
                setMilestonesData(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching tribute details:", error)
        } finally {
            setIsMilestonesLoading(false)
        }
    }

    const handleAddMemory = async () => {
        try {
            const response = await axios.post(`${server}/memories/add/text`, {
                memory,
                tribute_id: id
            })
            if (response.status === 200) {
                toast.success("Memory Added")
                setMemory("")
                // Refresh memories
                fetchMemories()
            }
        } catch (error) {
            toast.error("Error adding memory")
        }
    }

    const handleAddImage = async () => {
        if (!image) {
            toast.error("Please select an image to upload.")
            return
        }

        const formData = new FormData()
        formData.append("tribute_id", id)
        formData.append("files[]", image)

        try {
            const response = await axios.post(
                `${server}/memories/add/image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (response.status === 200) {
                toast.success("Image uploaded successfully")
                setImage(null)
                // Refresh memories
                fetchMemories()
            }
        } catch (error) {
            toast.error("Error uploading image")
            console.error("Error uploading image:", error)
        }
    }

    const handleAddVideo = async () => {
        if (!video) {
            toast.error("Please select a video to upload.")
            return
        }

        const formData = new FormData()
        formData.append("tribute_id", id)
        formData.append("files[]", video)

        try {
            const response = await axios.post(
                `${server}/memories/add/video`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (response.status === 200) {
                toast.success("Video uploaded successfully")
                setVideo(null)
                // Refresh memories
                fetchMemories()
            }
        } catch (error) {
            toast.error("Error uploading video")
            console.error("Error uploading video:", error)
        }
    }

    const handleAddLink = async () => {
        if (!link) {
            toast.error("Please enter a link.")
            return
        }

        const formData = new FormData()
        formData.append("tribute_id", id)
        formData.append("links", link)

        try {
            const response = await axios.post(
                `${server}/memories/add/link`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (response.status === 200) {
                toast.success("Link added successfully")
                setLink("")
                // Refresh memories
                fetchMemories()
            }
        } catch (error) {
            toast.error("Error adding link")
            console.error("Error adding link:", error)
        }
    }

    const fetchMemories = async () => {
        try {
            const response = await axios.get(`${server}/tributes/memories/${id}`)
            setMemories(response.data)
        } catch (error) {
            console.error("Error fetching memories:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMemories()
    }, [id])

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleMessageInputChange = e => {
        const { name, value } = e.target
        setMessageData({ ...messageData, [name]: value })
    }

    const handleRsvpInputChange = e => {
        const { name, value } = e.target
        setRsvpData({ ...rsvpData, [name]: value })
    }

    const handleDonationSubmit = async e => {
        e.preventDefault()
        try {
            const response = await axios.post(
                `${server}/initialize-guest-payment`,
                formData
            )
            window.location.href = response.data // Redirect to payment URL
        } catch (error) {
            toast.error("Error initializing payment")
            console.error("Error initializing payment:", error)
        }
    }

    const handleMessageSubmit = async e => {
        e.preventDefault()
        try {
            const messagePayload = {
                ...messageData,
                user_id: memorial?.user_id,
            }
            const response = await axios.post(
                `${server}/messages/send`,
                messagePayload
            )
            if (response.status === 200) {
                toast.success("Message sent successfully")
                setMessageData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                    user_id: memorial?.user_id
                })
                setIsMessageModalOpen(false)
            }
        } catch (error) {
            toast.error("Error sending message")
            console.error("Error sending message:", error)
        }
    }

    const handleRsvpSubmit = async e => {
        e.preventDefault()
        try {
            const response = await axios.post(`${server}/events/rsvp`, rsvpData)
            if (response.status === 200) {
                toast.success("RSVP submitted successfully")
                setRsvpData({
                    name: "",
                    email: "",
                    phone: "",
                    attendees: "1",
                    event_id: "",
                    tribute_id: id
                })
                setIsRsvpModalOpen(false)
            }
        } catch (error) {
            toast.error("Error submitting RSVP")
            console.error("Error submitting RSVP:", error)
        }
    }

    const openRsvpModal = event => {
        setSelectedEvent(event)
        setRsvpData(prev => ({
            ...prev,
            event_id: event.id
        }))
        setIsRsvpModalOpen(true)
    }

    return (
        <>
            <Header />

            <div className="bg-gray-50 min-h-screen">
                {/* Hero Banner */}
                <header
                    className="relative bg-cover bg-center text-white py-24"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/src/assets/landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png')`,
                        backgroundPosition: "center 30%"
                    }}
                >
                    <div className="relative container mx-auto text-center px-4 sm:px-6 lg:px-8">
                        {isMemorialLoading ? (
                            <div className="flex justify-center items-center">
                                <p>Loading memorial details...</p>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 font-light tracking-wide">
                                    {memorial?.first_name} {memorial?.middle_name}{" "}
                                    {memorial?.last_name}
                                </h1>
                                {memorial?.nickname && (
                                    <p className="text-xl md:text-2xl font-light italic mb-4">
                                        "{memorial?.nickname}"
                                    </p>
                                )}
                                <p className="text-lg md:text-xl font-light mb-6">
                                    {new Date(memorial?.date_of_birth).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        }
                                    )}{" "}
                                    -{" "}
                                    {new Date(memorial?.date_of_death).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        }
                                    )}
                                </p>
                                <div className="flex justify-center gap-4 mt-8">
                                    <Button
                                        onClick={() => setIsDonationModalOpen(true)}
                                        className="bg-white text-gray-800 hover:bg-gray-100"
                                    >
                                        Make a Donation
                                    </Button>
                                    <Button
                                        onClick={() => setIsMessageModalOpen(true)}
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-gray-800"
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Contact
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <div className="bg-white rounded-lg shadow-md mb-24 md:mb-12">
                            <TabsList className="w-full flex flex-wrap justify-center p-1 bg-gray-50 rounded-t-lg border-b">
                                <TabsTrigger
                                    value="about"
                                    className="px-4 py-3 text-sm md:text-base rounded-md"
                                >
                                    About
                                </TabsTrigger>
                                <TabsTrigger
                                    value="life"
                                    className="px-4 py-3 text-sm md:text-base rounded-md"
                                >
                                    Life
                                </TabsTrigger>
                                <TabsTrigger
                                    value="milestones"
                                    className="px-4 py-3 text-sm md:text-base rounded-md"
                                >
                                    Milestones
                                </TabsTrigger>
                                <TabsTrigger
                                    value="family"
                                    className="px-4 py-3 text-sm md:text-base rounded-md"
                                >
                                    Family Tree
                                </TabsTrigger>
                                <TabsTrigger
                                    value="media"
                                    className="px-4 py-3 text-sm md:text-base rounded-md"
                                >
                                    Media & Memories
                                </TabsTrigger>
                                <TabsTrigger
                                    value="contribute"
                                    className="px-4 py-3 text-sm md:text-base rounded-md"
                                >
                                    Contribute
                                </TabsTrigger>
                                <TabsTrigger
                                    value="events"
                                    className="px-4 py-3 text-sm md:text-base rounded-md"
                                >
                                    Events
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="mt-8 max-w-6xl mx-auto">
                            {/* About Tab */}
                            <TabsContent value="about">
                                <Card className="bg-white shadow-lg overflow-hidden">
                                    <CardContent className="p-0">
                                        {isMemorialLoading ? (
                                            <div className="flex justify-center items-center p-8">
                                                <p>Loading about section...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/3 bg-gray-50">
                                                    <div className="p-6 md:p-8 flex flex-col items-center">
                                                        <div className="relative mb-6">
                                                            <img
                                                                src={
                                                                    `${assetServer}/images/people/${memorial?.image}` ||
                                                                    "/placeholder.svg"
                                                                }
                                                                alt={memorial?.first_name}
                                                                className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-full shadow-lg border-4 border-white"
                                                            />
                                                        </div>
                                                        <h2 className="text-2xl font-serif mb-2 text-center">
                                                            {memorial?.first_name} {memorial?.last_name}
                                                        </h2>
                                                        <p className="text-gray-500 text-center mb-4">
                                                            {new Date(memorial?.date_of_birth).getFullYear()}{" "}
                                                            -{" "}
                                                            {new Date(memorial?.date_of_death).getFullYear()}
                                                        </p>
                                                        <div className="w-full mt-4">
                                                            <Separator className="my-4" />
                                                            <div className="space-y-3">
                                                                <div className="flex items-center">
                                                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                                    <span className="text-sm text-gray-600">
                                                                    {memorial?.country_died ||
                                                                        "Unknown location"}
                                                                  </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                                    <span className="text-sm text-gray-600">
                                                                        Born:{" "}
                                                                        {new Date(
                                                                            memorial?.date_of_birth
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:w-2/3 p-6 md:p-8">
                                                    <h3 className="text-2xl font-serif mb-4">
                                                        About {memorial?.first_name}
                                                    </h3>
                                                    {memorial?.quote && (
                                                        <blockquote className="italic text-xl mb-6 text-gray-600 border-l-4 border-gray-200 pl-4 py-2">
                                                            "{memorial?.quote}"
                                                        </blockquote>
                                                    )}
                                                    <p className="text-gray-700 leading-relaxed mb-6">
                                                        Welcome to {memorial?.first_name}'s memorial page.
                                                        We created this memorial to celebrate the life of{" "}
                                                        {memorial?.first_name} {memorial?.last_name} with
                                                        family and friends.
                                                    </p>
                                                    <p className="text-gray-700 leading-relaxed mb-6">
                                                        This page serves as a gathering place for memories,
                                                        photos, and stories that help us remember and
                                                        celebrate {memorial?.first_name}'s life.
                                                    </p>
                                                    <div className="mt-8">
                                                        <h4 className="text-lg font-medium mb-3">
                                                            Share this memorial:
                                                        </h4>
                                                        <div className="flex space-x-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-full"
                                                                onClick={() => {
                                                                    const subject = `Memorial Page for ${memorial?.first_name} ${memorial?.last_name}`;
                                                                    const body = `I would like to share this memorial page with you:\n${window.location.href}`;
                                                                    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                                                }}
                                                            >
                                                                <Mail className="h-4 w-4 mr-2" />
                                                                Email
                                                            </Button>
                                                           <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-full"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(window.location.href)
                                                                        .then(() => toast.success('Link copied to clipboard'))
                                                                        .catch(() => toast.error('Failed to copy link'));
                                                                }}
                                                            >
                                                                <Link className="h-4 w-4 mr-2" />
                                                                Copy link
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Life Tab */}
                            <TabsContent value="life">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-6 md:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading life section...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-3xl font-serif mb-6">Life Story</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="md:col-span-2">
                                                        <h3 className="text-xl font-serif mb-4">
                                                            Biography
                                                        </h3>
                                                        <div className="prose max-w-none">
                                                            <p className="text-gray-700 leading-relaxed">
                                                                {milestonesData?.bio ||
                                                                    "Biography information is not available."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 p-6 rounded-lg">
                                                        <h3 className="text-xl font-serif mb-4">Details</h3>
                                                        <ul className="space-y-4">
                                                            <li className="flex items-start">
                                                                <div className="bg-gray-200 p-2 rounded-full mr-3">
                                                                    <Calendar className="h-4 w-4 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                  <span className="block text-sm text-gray-500">
                                                                    Born
                                                                  </span>
                                                                                                    <span className="font-medium">
                                                                    {new Date(
                                                                        memorial?.date_of_birth
                                                                    ).toLocaleDateString("en-US", {
                                                                        month: "long",
                                                                        day: "numeric",
                                                                        year: "numeric"
                                                                    })}
                                                                  </span>
                                                                </div>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <div className="bg-gray-200 p-2 rounded-full mr-3">
                                                                    <Calendar className="h-4 w-4 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                  <span className="block text-sm text-gray-500">
                                                                    Passed
                                                                  </span>
                                                                                                    <span className="font-medium">
                                                                    {new Date(
                                                                        memorial?.date_of_death
                                                                    ).toLocaleDateString("en-US", {
                                                                        month: "long",
                                                                        day: "numeric",
                                                                        year: "numeric"
                                                                    })}
                                                                  </span>
                                                                </div>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <div className="bg-gray-200 p-2 rounded-full mr-3">
                                                                    <MapPin className="h-4 w-4 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                  <span className="block text-sm text-gray-500">
                                                                    Location
                                                                  </span>
                                                                                                    <span className="font-medium">
                                                                    {memorial?.country_died || "Unknown"}
                                                                  </span>
                                                                </div>
                                                            </li>
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
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-6 md:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading milestones section...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-3xl font-serif mb-6">
                                                    Life Milestones
                                                </h2>
                                                <div className="relative border-l-2 border-gray-200 ml-3 pl-8 py-4">
                                                    {milestonesData?.milestone?.map(
                                                        (item, index) =>
                                                            item && (
                                                                <div key={index} className="mb-8 relative">
                                                                    <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                                    </div>
                                                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                                                        <p className="text-gray-700">{item}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                    )}
                                                    {(!milestonesData?.milestone ||
                                                        milestonesData.milestone.length === 0) && (
                                                        <p className="text-gray-500 italic">
                                                            No milestones have been added yet.
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Family Tree Tab */}
                            <TabsContent value="family">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-6 md:p-8">
                                        {isMilestonesLoading ? (
                                            <div className="flex justify-center items-center">
                                                <p>Loading family section...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-3xl font-serif mb-6">
                                                    Family Tree
                                                </h2>
                                                <div className="overflow-x-auto">
                                                    <FamilyTreeMinimal data={milestonesData?.family} />
                                                </div>
                                                {(!milestonesData?.family ||
                                                    Object.keys(milestonesData?.family).length === 0) && (
                                                    <p className="text-gray-500 italic text-center mt-8">
                                                        Family tree information is not available.
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Media & Memories Tab */}
                            <TabsContent value="media">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-6 md:p-8">
                                        <h2 className="text-3xl font-serif mb-6">
                                            Media & Memories
                                        </h2>
                                        {isLoading ? (
                                            <div className="flex justify-center items-center p-12">
                                                <p>Loading memories...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                {/* Images Section */}
                                                <div>
                                                    <h3 className="text-xl font-medium mb-4 flex items-center">
                                                        <span className="bg-gray-100 p-1.5 rounded-full mr-2">
                                                          <Upload className="h-4 w-4" />
                                                        </span>
                                                        Photos
                                                    </h3>
                                                    {memories?.images &&
                                                    JSON.parse(memories.images).length > 0 ? (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                            {JSON.parse(memories.images).map(
                                                                (image, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="relative group overflow-hidden rounded-lg shadow-md aspect-square"
                                                                    >
                                                                        <img
                                                                            src={`${assetServer}/images/gallery/${image}`}
                                                                            alt={`Memory ${index}`}
                                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">
                                                            No photos have been shared yet.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Videos Section */}
                                                {memories?.videos &&
                                                    JSON.parse(memories.videos).length > 0 && (
                                                        <div>
                                                            <h3 className="text-xl font-medium mb-4 flex items-center">
                                                                <span className="bg-gray-100 p-1.5 rounded-full mr-2">
                                                                  <Upload className="h-4 w-4" />
                                                                </span>
                                                                Videos
                                                            </h3>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {JSON.parse(memories.videos).map(
                                                                    (video, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="rounded-lg overflow-hidden shadow-md"
                                                                        >
                                                                            <video controls className="w-full h-auto">
                                                                                <source
                                                                                    src={`${assetServer}/${video}`}
                                                                                    type="video/mp4"
                                                                                />
                                                                                Your browser does not support the video
                                                                                tag.
                                                                            </video>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Memories Section */}
                                                <div>
                                                    <h3 className="text-xl font-medium mb-4 flex items-center">
                                                        <span className="bg-gray-100 p-1.5 rounded-full mr-2">
                                                          <MessageSquare className="h-4 w-4" />
                                                        </span>
                                                        Shared Memories
                                                    </h3>
                                                    {memories?.memories &&
                                                    JSON.parse(memories.memories).length > 0 ? (
                                                        <div className="space-y-4">
                                                            {JSON.parse(memories.memories).map(
                                                                (text, index) => (
                                                                    <Card key={index} className="bg-gray-50">
                                                                        <CardContent className="p-4">
                                                                            <div className="flex items-center mb-3">
                                                                                <Avatar className="h-8 w-8 mr-2">
                                                                                    <AvatarFallback>
                                                                                        {text.substring(0, 2) || "M"}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <div>
                                                                                    <p className="text-sm font-medium">
                                                                                        Memory Contributor
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        Shared a memory
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-gray-700">{text}</p>
                                                                        </CardContent>
                                                                    </Card>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">
                                                            No memories have been shared yet.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Links Section */}
                                                {memories?.links &&
                                                    JSON.parse(memories.links).length > 0 && (
                                                        <div>
                                                            <h3 className="text-xl font-medium mb-4 flex items-center">
                                                            <span className="bg-gray-100 p-1.5 rounded-full mr-2">
                                                              <Link className="h-4 w-4" />
                                                            </span>
                                                                Shared Links
                                                            </h3>
                                                            <div className="space-y-2">
                                                                {JSON.parse(memories.links).map(
                                                                    (link, index) => (
                                                                        <Card key={index} className="bg-gray-50">
                                                                            <CardContent className="p-4">
                                                                                <a
                                                                                    href={link}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-600 hover:underline break-all"
                                                                                >
                                                                                    {link}
                                                                                </a>
                                                                            </CardContent>
                                                                        </Card>
                                                                    )
                                                                )}
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
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-6 md:p-8">
                                        <h2 className="text-3xl font-serif mb-6">
                                            Share Your Memories
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-xl font-medium mb-4">
                                                    Add a Written Memory
                                                </h3>
                                                <div className="space-y-4">
                                                    <Textarea
                                                        placeholder="Share your memory or message of condolence..."
                                                        className="min-h-[150px] w-full"
                                                        value={memory}
                                                        onChange={e => setMemory(e.target.value)}
                                                    />
                                                    <Button
                                                        className="w-full bg-primary hover:bg-primary/90"
                                                        onClick={handleAddMemory}
                                                        disabled={!memory.trim()}
                                                    >
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Share Memory
                                                    </Button>
                                                </div>

                                                <div className="mt-8">
                                                    <h3 className="text-xl font-medium mb-4">
                                                        Add a Link
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <Input
                                                            type="url"
                                                            placeholder="https://example.com"
                                                            value={link}
                                                            onChange={e => setLink(e.target.value)}
                                                        />
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                            onClick={handleAddLink}
                                                            disabled={!link.trim()}
                                                        >
                                                            Add Link
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-medium mb-4">
                                                    Upload Media
                                                </h3>
                                                <div className="space-y-6">
                                                    <div>
                                                        <Label
                                                            htmlFor="photo-upload"
                                                            className="block mb-2"
                                                        >
                                                            Upload Photos
                                                        </Label>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                                            <input
                                                                id="photo-upload"
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={e => setImage(e.target.files[0])}
                                                            />
                                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                            <p className="mt-2 text-sm text-gray-600">
                                                                {image
                                                                    ? image.name
                                                                    : "Click to upload or drag and drop"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                PNG, JPG, GIF up to 10MB
                                                            </p>
                                                        </div>
                                                        {image && (
                                                            <Button
                                                                className="w-full mt-2"
                                                                onClick={handleAddImage}
                                                            >
                                                                Upload Photo
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label
                                                            htmlFor="video-upload"
                                                            className="block mb-2"
                                                        >
                                                            Upload Videos
                                                        </Label>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                                            <input
                                                                id="video-upload"
                                                                type="file"
                                                                className="hidden"
                                                                accept="video/*"
                                                                onChange={e => setVideo(e.target.files[0])}
                                                            />
                                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                            <p className="mt-2 text-sm text-gray-600">
                                                                {video
                                                                    ? video.name
                                                                    : "Click to upload or drag and drop"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                MP4, MOV up to 50MB
                                                            </p>
                                                        </div>
                                                        {video && (
                                                            <Button
                                                                className="w-full mt-2"
                                                                onClick={handleAddVideo}
                                                            >
                                                                Upload Video
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-8" />

                                        <section id="donations" className="mt-8">
                                            <h3 className="text-2xl font-serif mb-4">
                                                Make a Donation
                                            </h3>
                                            <Card className="p-6 bg-gray-50">
                                                <p className="text-gray-700 mb-4">
                                                    To honor {memorial?.first_name} {memorial?.last_name}
                                                    's memory, please consider making a donation:
                                                </p>
                                                <Button
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={() => setIsDonationModalOpen(true)}
                                                >
                                                    Make a Donation
                                                </Button>
                                            </Card>
                                        </section>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Events Tab */}
                            <TabsContent value="events">
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-6 md:p-8">
                                        <h2 className="text-3xl font-serif mb-6">
                                            Memorial Events
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* This is a placeholder for the Events component */}
                                            {/* We'll enhance it with RSVP functionality */}
                                            <Events id={memorial?.id} user_id={memorial?.user_id} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </main>

                <footer className="bg-gray-800 text-white py-8 mt-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    About This Memorial
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    This memorial page was created to remember and honor the life
                                    of {memorial?.first_name} {memorial?.last_name}.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-4">Contact</h3>
                                <Button
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    onClick={() => setIsMessageModalOpen(true)}
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Message Memorial Creator
                                </Button>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-4">Share</h3>
                                <div className="flex space-x-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        <Share className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-6 bg-gray-700" />
                        <div className="text-center text-gray-400 text-sm">
                            <p>
                                &copy; {new Date().getFullYear()} Memorial Website. All rights
                                reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Donation Modal */}
            <Dialog open={isDonationModalOpen} onOpenChange={setIsDonationModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Make a Donation</DialogTitle>
                        <DialogDescription>
                            Your donation helps honor the memory of {memorial?.first_name}{" "}
                            {memorial?.last_name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDonationSubmit} className="space-y-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Your name"
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
                                    placeholder="Your email"
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
                                    placeholder="Donation amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-white hover:bg-primary/90"
                            >
                                Proceed to Payment
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Message Modal */}
            <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Message Memorial Creator</DialogTitle>
                        <DialogDescription>
                            Send a message to the person who created this memorial page.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMessageSubmit} className="space-y-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="message-name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="message-name"
                                    name="name"
                                    placeholder="Your name"
                                    value={messageData.name}
                                    onChange={handleMessageInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="message-email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="message-email"
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    value={messageData.email}
                                    onChange={handleMessageInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="message-subject" className="text-right">
                                    Subject
                                </Label>
                                <Input
                                    id="message-subject"
                                    name="subject"
                                    placeholder="Message subject"
                                    value={messageData.subject}
                                    onChange={handleMessageInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="message-content" className="text-right pt-2">
                                    Message
                                </Label>
                                <Textarea
                                    id="message-content"
                                    name="message"
                                    placeholder="Your message"
                                    value={messageData.message}
                                    onChange={handleMessageInputChange}
                                    className="col-span-3 min-h-[120px]"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-white hover:bg-primary/90"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* RSVP Modal */}
            <Dialog open={isRsvpModalOpen} onOpenChange={setIsRsvpModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white">
                    <DialogHeader>
                        <DialogTitle>RSVP for Event</DialogTitle>
                        <DialogDescription>
                            {selectedEvent
                                ? `Confirm your attendance for ${selectedEvent.title}`
                                : "Confirm your attendance for this event"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRsvpSubmit} className="space-y-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rsvp-name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="rsvp-name"
                                    name="name"
                                    placeholder="Your name"
                                    value={rsvpData.name}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rsvp-email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="rsvp-email"
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    value={rsvpData.email}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rsvp-phone" className="text-right">
                                    Phone
                                </Label>
                                <Input
                                    id="rsvp-phone"
                                    name="phone"
                                    placeholder="Your phone number"
                                    value={rsvpData.phone}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rsvp-attendees" className="text-right">
                                    Attendees
                                </Label>
                                <Input
                                    id="rsvp-attendees"
                                    name="attendees"
                                    type="number"
                                    min="1"
                                    placeholder="Number of attendees"
                                    value={rsvpData.attendees}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-white hover:bg-primary/90"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Confirm Attendance
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

// Enhanced Events component with RSVP functionality
const EventsWithRSVP = ({ id, user_id, onRsvp }) => {
    // This component wraps the original Events component and adds RSVP functionality
    // For demonstration purposes, we'll create a simplified version

    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Assuming the Events component uses this endpoint
                const response = await axios.get(`${server}/events/tribute/${id}`)
                setEvents(response.data || [])
            } catch (error) {
                console.error("Error fetching events:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvents()
    }, [id])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                Loading events...
            </div>
        )
    }

    if (events.length === 0) {
        return (
            <Card className="bg-gray-50 p-6 text-center">
                <p className="text-gray-500">No events have been scheduled yet.</p>
            </Card>
        )
    }

    return (
        <>
            {events.map((event, index) => (
                <Card key={index} className="overflow-hidden">
                    <div className="bg-gray-100 p-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                            <h3 className="font-medium">{event.title}</h3>
                        </div>
                        <Badge
                            variant={event.status === "upcoming" ? "default" : "secondary"}
                        >
                            {event.status === "upcoming" ? "Upcoming" : "Past"}
                        </Badge>
                    </div>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Date & Time</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(event.date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                        {event.time && `, ${event.time}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Location</p>
                                    <p className="text-sm text-gray-600">
                                        {event.location || "To be announced"}
                                    </p>
                                </div>
                            </div>

                            {event.description && (
                                <div className="pt-2">
                                    <p className="text-sm text-gray-700">{event.description}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm text-gray-600">
                {event.attendees || 0} attending
              </span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    window.open(
                                        `https://maps.google.com/?q=${encodeURIComponent(
                                            event.location
                                        )}`,
                                        "_blank"
                                    )
                                }
                            >
                                Directions
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => onRsvp(event)}
                                disabled={event.status !== "upcoming"}
                            >
                                RSVP
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}
