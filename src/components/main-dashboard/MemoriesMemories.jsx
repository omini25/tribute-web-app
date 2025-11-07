"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
    Plus,
    Upload,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Edit,
    Trash2,
    Save,
    X,
    ImageIcon,
    Video,
    LinkIcon,
    MessageSquare,
    Heart,
    AlertCircle,
    FileText,
    Music,
    ExternalLink,
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "react-hot-toast"
import axios from "axios"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {assetServer} from "@/assetServer.js";
import { Lock } from "lucide-react"

export default function MemoriesMemories() {
    const { id } = useParams()
    const [tribute, setTribute] = useState({
        event_private: false,
        memories: "",
        images: [],
        videos: [],
        audio: [],
        links: [],
        plan: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title, setTitle] = useState("TRIBUTE")
    const [fileUpload, setFileUpload] = useState(null)
    const [fileType, setFileType] = useState("image") // "image", "video", "audio"
    const [linkInput, setLinkInput] = useState("")
    const [linkDescription, setLinkDescription] = useState("")
    const [newMemory, setNewMemory] = useState("")
    const [memories, setMemories] = useState([])
    const [editingMemoryId, setEditingMemoryId] = useState(null)
    const [editingMemoryText, setEditingMemoryText] = useState("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [memoryToDelete, setMemoryToDelete] = useState(null)
    const [isAddMemoryDialogOpen, setIsAddMemoryDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("written")
    const [previewUrl, setPreviewUrl] = useState(null)
    const [info, setInfo] = useState({})

    console.log(tribute)

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(`${server}/tribute/title/image/${user.id}`)
            setTitle(response.data.title || "TRIBUTE")
            setInfo(response.data)
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${server}/tributes/memories/${id}`)
            setTribute(response.data)



            // Parse memories from the response
            try {
                if (response.data.memories) {
                    const parsedMemories = JSON.parse(response.data.memories)
                    // If memories is an array, use it directly
                    if (Array.isArray(parsedMemories)) {
                        setMemories(
                            parsedMemories.map((memory, index) => ({
                                id: index.toString(),
                                text: memory,
                            })),
                        )
                    }
                    // If memories is a string, split by newlines
                    else if (typeof response.data.memories === "string") {
                        const memoriesArray = response.data.memories.split("\n").filter((memory) => memory.trim() !== "")

                        setMemories(
                            memoriesArray.map((memory, index) => ({
                                id: index.toString(),
                                text: memory,
                            })),
                        )
                    }
                }
            } catch (error) {
                console.error("Error parsing memories:", error)
                setMemories([])
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn("Resource not found, proceeding with default data.")
                setTribute({
                    event_private: false,
                    memories: "",
                    images: [],
                    videos: [],
                    audio: [],
                    links: [],
                    plan: "",
                })
                setMemories([])
            } else {
                console.error("Error fetching tribute details:", error)
                toast.error("Failed to fetch tribute details. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleCheckboxChange = () => {
        setTribute((prev) => ({ ...prev, event_private: !prev.event_private }))
    }

    const addMemory = async () => {
        if (!newMemory.trim()) {
            toast.error("Please enter a memory")
            return
        }

        try {
            setIsSubmitting(true)
            const response = await axios.post(
                `${server}/memories/add/text`,
                {
                    tribute_id: id,
                    memory: newMemory,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )

            if (response.status === 200) {
                // Add the new memory to the memories array
                const newMemoryObj = {
                    id: (memories.length + 1).toString(),
                    text: newMemory,
                }
                setMemories([...memories, newMemoryObj])

                // Update the tribute object
                setTribute((prev) => ({
                    ...prev,
                    memories: JSON.stringify([...memories.map((m) => m.text), newMemory]),
                }))

                setNewMemory("")
                setIsAddMemoryDialogOpen(false)
                toast.success("Memory added successfully.")
            } else {
                toast.error("An error occurred. Please try again.")
                console.error(response)
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data)
                toast.error(`Error: ${error.response.data.message || "An error occurred. Please try again."}`)
            } else if (error.request) {
                console.error("Error request:", error.request)
                toast.error("No response received from the server. Please try again.")
            } else {
                console.error("Error message:", error.message)
                toast.error(`Error: ${error.message}`)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const startEditingMemory = (memory) => {
        setEditingMemoryId(memory.id)
        setEditingMemoryText(memory.text)
    }

    const cancelEditingMemory = () => {
        setEditingMemoryId(null)
        setEditingMemoryText("")
    }

    const saveEditedMemory = async (memoryId) => {
        if (!editingMemoryText.trim()) {
            toast.error("Memory text cannot be empty")
            return
        }

        try {
            setIsSubmitting(true)

            // Find the memory to update
            const memory = memories.find((m) => m.id === memoryId)
            if (!memory) {
                toast.error("Memory not found")
                return
            }

            // Update the API
            const response = await axios.put(`${server}/tribute/memories/update/${id}`, {
                old_memory: memory.text,
                new_memory: editingMemoryText,
            })

            if (response.status === 200) {
                // Create updated memories array
                const updatedMemories = memories.map((m) => (m.id === memoryId ? { ...m, text: editingMemoryText } : m))

                // Update local state
                setMemories(updatedMemories)
                setTribute((prev) => ({
                    ...prev,
                    memories: JSON.stringify(updatedMemories.map((m) => m.text)),
                }))

                toast.success("Memory updated successfully")
                setEditingMemoryId(null)
                setEditingMemoryText("")
            } else {
                toast.error("Failed to update memory")
            }
        } catch (error) {
            console.error("Error updating memory:", error)
            toast.error(error.response?.data?.message || "Failed to update memory")
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmDeleteMemory = (memory) => {
        setMemoryToDelete(memory)
        setIsDeleteDialogOpen(true)
    }

    const deleteMemory = async () => {
        if (!memoryToDelete) return

        try {
            setIsSubmitting(true)

            const response = await axios.delete(`${server}/tributes/memories/delete/${id}`, {
                data: { memory: memoryToDelete.text },
            })

            if (response.status === 200) {
                const updatedMemories = memories.filter((m) => m.id !== memoryToDelete.id)
                setMemories(updatedMemories)
                setTribute((prev) => ({
                    ...prev,
                    memories: JSON.stringify(updatedMemories.map((m) => m.text)),
                }))
                toast.success("Memory deleted successfully")
            } else {
                toast.error("Failed to delete memory")
            }
        } catch (error) {
            console.error("Error deleting memory:", error)
            toast.error("Failed to delete memory. Please try again.")
        } finally {
            setIsSubmitting(false)
            setIsDeleteDialogOpen(false)
            setMemoryToDelete(null)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileUpload(file)

            // Create a preview URL for images
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
            } else {
                setPreviewUrl(null)
            }
        }
    }

    const handleFileUpload = async () => {
        if (!fileUpload) {
            toast.error("Please select a file to upload")
            return
        }

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("tribute_id", id)
        formData.append("files[]", fileUpload)
        formData.append("uploader_name", JSON.parse(localStorage.getItem("user"))?.name || "Guest")

        let endpoint = ""
        if (fileType === "image") {
            endpoint = `${server}/memories/add/image`
        } else if (fileType === "video") {
            endpoint = `${server}/memories/add/video`
        } else if (fileType === "audio") {
            endpoint = `${server}/memories/add/audio`
        }

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.status === 200) {
                toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully.`)
                fetchTributeDetails() // Refresh the tribute details
                setFileUpload(null)
                setPreviewUrl(null)
            } else {
                toast.error("An error occurred. Please try again.")
                console.error(response)
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data)
                toast.error(`Error: ${error.response.data.message || "An error occurred. Please try again."}`)
            } else if (error.request) {
                console.error("Error request:", error.request)
                toast.error("No response received from the server. Please try again.")
            } else {
                console.error("Error message:", error.message)
                toast.error(`Error: ${error.message}`)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLinkSubmit = async () => {
        if (!linkInput.trim()) {
            toast.error("Please enter a valid URL")
            return
        }

        // Basic URL validation
        try {
            new URL(linkInput)
        } catch (e) {
            toast.error("Please enter a valid URL (include http:// or https://)")
            return
        }

        setIsSubmitting(true)
        try {
            // In a real implementation, you would send this to the server
            // For now, we'll just update the local state
            setTribute((prev) => ({
                ...prev,
                links: [
                    ...prev.links,
                    {
                        url: linkInput,
                        description: linkDescription || "External link",
                    },
                ],
            }))

            toast.success("Your link has been added successfully.")
            setLinkInput("")
            setLinkDescription("")
            // In a real implementation, you would refresh the data
            // fetchTributeDetails()
        } catch (error) {
            console.error("Error adding link:", error)
            toast.error("Failed to add link. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getCompletionPercentage = () => {
        // Consider the section complete if at least one memory (of any type) has been added
        const hasWrittenMemories = memories.length > 0
        const hasMedia =
            tribute.images.length > 0 || tribute.videos.length > 0 || tribute.audio.length > 0 || tribute.links.length > 0

        return hasWrittenMemories || hasMedia ? 100 : 0
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f4f0]">
                <Loader2 className="h-8 w-8 animate-spin text-[#fcd34d]" />
            </div>
        )
    }

    return (
        <div className="bg-[#f8f4f0] min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-between text-xs sm:text-sm text-[#4a5568] mb-2 gap-2">
                        <span className="font-medium text-[#2a3342]">Basic Info</span>
                        <span>Life</span>
                        <span>Events & Donations</span>
                        <span>Memories</span>
                    </div>
                    <Progress value={90} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                </div>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <CardTitle className="text-3xl font-serif text-[#2a3342]">{title}</CardTitle>
                                <CardDescription className="text-[#4a5568]">
                                    Share memories, photos, videos, and more to Honour your loved one
                                </CardDescription>
                            </div>

                            {/* Completion Badge */}
                            <Badge
                                variant={getCompletionPercentage() === 100 ? "default" : "outline"}
                                className={`${
                                    getCompletionPercentage() === 100
                                        ? "bg-[#fcd34d] hover:bg-[#645a52]"
                                        : "text-[#fcd34d] border-[#fcd34d]"
                                }`}
                            >
                                {getCompletionPercentage() === 100 ? (
                                    <span className="flex items-center">
                                        <Heart className="h-3 w-3 mr-1" /> Complete
                                      </span>
                                ) : (
                                    <span>Add at least one memory</span>
                                )}
                            </Badge>
                        </div>
                    </CardHeader>

                    {isLoading ? (
                        <CardContent className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#fcd34d]" />
                        </CardContent>
                    ) : (
                        <>
                            <CardContent className="p-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 bg-[#f0ece6]">
                                        <TabsTrigger
                                            value="written"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                        >
                                            <MessageSquare className="h-4 w-4 sm:mr-2 hidden sm:inline" />
                                            Written
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="media"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                        >
                                            <ImageIcon className="h-4 w-4 sm:mr-2 hidden sm:inline" />
                                            Media
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="links"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                        >
                                            <LinkIcon className="h-4 w-4 sm:mr-2 hidden sm:inline" />
                                            Links
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="written" className="mt-0 space-y-6">
                                        <WrittenMemoriesSection
                                            memories={memories}
                                            editingMemoryId={editingMemoryId}
                                            editingMemoryText={editingMemoryText}
                                            isSubmitting={isSubmitting}
                                            setEditingMemoryText={setEditingMemoryText}
                                            cancelEditingMemory={cancelEditingMemory}
                                            saveEditedMemory={saveEditedMemory}
                                            startEditingMemory={startEditingMemory}
                                            confirmDeleteMemory={confirmDeleteMemory}
                                            setIsAddMemoryDialogOpen={setIsAddMemoryDialogOpen}
                                        />
                                    </TabsContent>

                                    <TabsContent value="media" className="mt-0 space-y-6">
                                        <MediaUploadSection
                                            fileType={fileType}
                                            setFileType={setFileType}
                                            handleFileChange={handleFileChange}
                                            handleFileUpload={handleFileUpload}
                                            fileUpload={fileUpload}
                                            isSubmitting={isSubmitting}
                                            previewUrl={previewUrl}
                                            tribute={tribute}
                                            info={info}
                                        />
                                    </TabsContent>

                                    <TabsContent value="links" className="mt-0 space-y-6">
                                        <ExternalLinksSection
                                            linkInput={linkInput}
                                            setLinkInput={setLinkInput}
                                            linkDescription={linkDescription}
                                            setLinkDescription={setLinkDescription}
                                            handleLinkSubmit={handleLinkSubmit}
                                            isSubmitting={isSubmitting}
                                            tribute={tribute}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>

                            <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t p-6 gap-4">
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Link to={`/dashboard/memories/donations/${id}`} className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                                            <ChevronLeft className="h-4 w-4 mr-2" /> Donations
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Link to={`/dashboard/memories/music-theme/${id}`} className="w-full sm:w-auto">
                                        <Button className="w-full bg-[#fcd34d] hover:bg-[#645a52] text-white">
                                            Continue <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>

            {/* Add Memory Dialog */}
            <Dialog open={isAddMemoryDialogOpen} onOpenChange={setIsAddMemoryDialogOpen}>
                <DialogContent className="bg-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif text-[#2a3342]">Add New Memory</DialogTitle>
                        <DialogDescription className="text-[#4a5568]">
                            Share a special memory or thought about your loved one
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Textarea
                            value={newMemory}
                            onChange={(e) => setNewMemory(e.target.value)}
                            placeholder="Enter your memory here..."
                            className="min-h-[150px] border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 resize-none"
                        />
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="mt-3 sm:mt-0 border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={addMemory}
                            disabled={isSubmitting || !newMemory.trim()}
                            className="bg-[#fcd34d] hover:bg-[#645a52] text-white"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {isSubmitting ? "Saving..." : "Save Memory"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-medium text-[#2a3342]">Delete Memory</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#4a5568]">
                            Are you sure you want to delete this memory? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {memoryToDelete && (
                        <div className="py-4">
                            <div className="bg-[#f8f4f0] p-4 rounded-md mb-4">
                                <p className="text-[#4a5568] italic">"{memoryToDelete.text}"</p>
                            </div>
                            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>This will permanently remove this memory from the tribute.</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        <AlertDialogCancel className="mt-3 sm:mt-0 border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={deleteMemory} className="bg-red-600 hover:bg-red-700 text-white">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            {isSubmitting ? "Deleting..." : "Delete Memory"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

const WrittenMemoriesSection = ({
                                    memories,
                                    editingMemoryId,
                                    editingMemoryText,
                                    isSubmitting,
                                    setEditingMemoryText,
                                    cancelEditingMemory,
                                    saveEditedMemory,
                                    startEditingMemory,
                                    confirmDeleteMemory,
                                    setIsAddMemoryDialogOpen,
                                }) => (
    <div className="space-y-6">
        <div className="bg-[#f8f4f0] p-6 rounded-lg">
            <div className="flex items-center mb-4">
                <MessageSquare className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-xl font-medium text-[#2a3342]">Written Memories</h3>
            </div>
            <p className="text-[#4a5568] mb-6">
                Share special memories, stories, and thoughts about your loved one. These will be displayed on their tribute
                page.
            </p>

            <div className="bg-white border border-[#e5e0d9] rounded-lg overflow-hidden">
                <ScrollArea className="h-[350px]">
                    {memories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <FileText className="h-12 w-12 text-[#e5e0d9] mb-4" />
                            <p className="text-[#4a5568] mb-2">No written memories have been added yet</p>
                            <p className="text-sm text-[#4a5568] max-w-md mb-6">
                                Share special stories, moments, or thoughts about your loved one to help preserve their memory.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-[#e5e0d9]">
                            {memories.map((memory) => (
                                <li key={memory.id} className="p-4 relative group">
                                    {editingMemoryId === memory.id ? (
                                        <div className="space-y-3">
                                            <Textarea
                                                value={editingMemoryText}
                                                onChange={(e) => setEditingMemoryText(e.target.value)}
                                                className="min-h-[100px] border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 resize-none"
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={cancelEditingMemory}
                                                    className="border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => saveEditedMemory(memory.id)}
                                                    className="bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                    ) : (
                                                        <Save className="h-4 w-4 mr-1" />
                                                    )}
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-[#4a5568] pr-16 whitespace-pre-line">{memory.text}</p>
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => startEditingMemory(memory)}
                                                                className="h-8 w-8 text-[#fcd34d] hover:text-[#645a52] hover:bg-[#f5f0ea]"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit memory</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => confirmDeleteMemory(memory)}
                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete memory</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </ScrollArea>
            </div>

            <div className="flex justify-center mt-6">
                <Button onClick={() => setIsAddMemoryDialogOpen(true)} className="bg-[#fcd34d] hover:bg-[#645a52] text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add New Memory
                </Button>
            </div>
        </div>
    </div>
)

const MediaUploadSection = ({
                                fileType,
                                setFileType,
                                handleFileChange,
                                handleFileUpload,
                                fileUpload,
                                isSubmitting,
                                previewUrl,
                                tribute,
                                handleDeleteMedia,
                                info,
                            }) => {
    // Parse media arrays or JSON strings
    let images = [];
    let videos = [];
    let audio = [];

    try {
        images = Array.isArray(tribute.images)
            ? tribute.images
            : tribute.images
                ? JSON.parse(tribute.images)
                : [];
    } catch {
        images = [];
    }
    try {
        videos = Array.isArray(tribute.videos)
            ? tribute.videos
            : tribute.videos
                ? JSON.parse(tribute.videos)
                : [];
    } catch {
        videos = [];
    }
    try {
        audio = Array.isArray(tribute.audio)
            ? tribute.audio
            : tribute.audio
                ? JSON.parse(tribute.audio)
                : [];
    } catch {
        audio = [];
    }

    const hasMedia = images.length > 0 || videos.length > 0 || audio.length > 0;


    return(
        <div className="space-y-6">
            <div className="bg-[#f8f4f0] p-6 rounded-lg">
                <div className="flex items-center mb-4">
                    <ImageIcon className="h-5 w-5 text-[#fcd34d] mr-2" />
                    <h3 className="text-xl font-medium text-[#2a3342]">Photos & Media</h3>
                </div>
                <p className="text-[#4a5568] mb-6">
                    Upload photos, videos, or audio files to share special moments and memories of your loved one.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card
                        className={`border cursor-pointer transition-all ${fileType === "image" ? "border-[#fcd34d] bg-[#f5f0ea] shadow-md" : "border-[#e5e0d9] hover:border-[#fcd34d] hover:shadow-sm"}`}
                        onClick={() => setFileType("image")}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                            <ImageIcon className={`h-8 w-8 mb-2 ${fileType === "image" ? "text-[#fcd34d]" : "text-[#4a5568]"}`} />
                            <h4 className={`font-medium ${fileType === "image" ? "text-[#2a3342]" : "text-[#4a5568]"}`}>Photos</h4>
                            <p className="text-xs text-[#4a5568] mt-1">Upload images (JPG, PNG, GIF)</p>
                        </CardContent>
                    </Card>

                    <Card
                        className={`border cursor-pointer transition-all relative ${
                            fileType === "video" ? "border-[#fcd34d] bg-[#f5f0ea] shadow-md" : "border-[#e5e0d9] hover:border-[#fcd34d] hover:shadow-sm"
                        } ${(info?.plan === "free" || info?.plan === "Basic") ? "opacity-75" : ""}`}
                        onClick={() => {
                            if (info?.plan !== "free" && info?.plan !== "Basic") {
                                setFileType("video");
                            }
                        }}
                    >
                        {(info?.plan === "free" || info?.plan === "Basic") && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-white z-10 rounded-lg">
                                <Lock className="h-5 w-5 mb-2" />
                                <p className="text-sm text-center">
                                    Video uploads are available with Premium plans
                                </p>
                            </div>
                        )}
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                            <Video className={`h-8 w-8 mb-2 ${fileType === "video" ? "text-[#fcd34d]" : "text-[#4a5568]"}`} />
                            <h4 className={`font-medium ${fileType === "video" ? "text-[#2a3342]" : "text-[#4a5568]"}`}>Videos</h4>
                            <p className="text-xs text-[#4a5568] mt-1">Upload videos (MP4, MOV)</p>
                        </CardContent>
                    </Card>

                    <Card
                        className={`border cursor-pointer transition-all ${fileType === "audio" ? "border-[#fcd34d] bg-[#f5f0ea] shadow-md" : "border-[#e5e0d9] hover:border-[#fcd34d] hover:shadow-sm"}`}
                        onClick={() => setFileType("audio")}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                            <Music className={`h-8 w-8 mb-2 ${fileType === "audio" ? "text-[#fcd34d]" : "text-[#4a5568]"}`} />
                            <h4 className={`font-medium ${fileType === "audio" ? "text-[#2a3342]" : "text-[#4a5568]"}`}>Audio</h4>
                            <p className="text-xs text-[#4a5568] mt-1">Upload audio files (MP3, WAV)</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="bg-white border border-[#e5e0d9] rounded-lg p-6">
                        <div className="space-y-4">
                            <Label htmlFor="file-upload" className="text-[#2a3342]">
                                {fileType === "image" ? "Upload Photo" : fileType === "video" ? "Upload Video" : "Upload Audio"}
                            </Label>

                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept={fileType === "image" ? "image/*" : fileType === "video" ? "video/*" : "audio/*"}
                                        onChange={handleFileChange}
                                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                    />
                                </div>

                                {previewUrl && fileType === "image" && (
                                    <div className="mt-4 border border-[#e5e0d9] rounded-lg overflow-hidden">
                                        <img
                                            src={previewUrl || "/placeholder.svg"}
                                            alt="Preview"
                                            className="max-h-[200px] mx-auto object-contain"
                                        />
                                    </div>
                                )}

                                <Button
                                    onClick={handleFileUpload}
                                    disabled={!fileUpload || isSubmitting}
                                    className="bg-[#fcd34d] hover:bg-[#645a52] text-white w-full sm:w-auto self-center mt-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                    {isSubmitting ? `Uploading ${fileType}...` : `Upload ${fileType}`}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Media Gallery Preview */}
                    <div className="bg-white border border-[#e5e0d9] rounded-lg p-6">
                        <h4 className="font-medium text-[#2a3342] mb-4">Uploaded Media</h4>
                        {!hasMedia ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#e5e0d9] rounded-lg">
                                <ImageIcon className="h-12 w-12 text-[#e5e0d9] mb-4" />
                                <p className="text-[#4a5568] mb-2">No media has been uploaded yet</p>
                                <p className="text-sm text-[#4a5568] max-w-md">
                                    Upload photos, videos, or audio files to share special moments and memories.
                                </p>
                            </div>
                        ) : (
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div key={`image-${index}`} className="relative group">
                                        <img
                                            src={`${assetServer}/images/gallery/${image}`}
                                            alt={image}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    const response = await axios.delete(`${server}/memories/delete/image`, {
                                                        data: { filename: image }
                                                    });

                                                    if (response.status === 200) {
                                                        toast.success('Image deleted successfully');
                                                        // Refresh the tribute details
                                                        fetchTributeDetails();
                                                    }
                                                } catch (error) {
                                                    console.error('Error deleting image:', error);
                                                    fetchTributeDetails();
                                                    // toast.error(error.response?.data?.message || 'Failed to delete image');
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {videos.map((video, index) => (
                                    <div key={`video-${index}`} className="relative group">
                                        <video
                                            controls
                                            className="w-full h-48 object-cover rounded-md"
                                        >
                                            <source src={`${assetServer}/images/gallery/${video}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    const response = await axios.delete(`${server}/memories/delete/video`, {
                                                        data: { filename: video }
                                                    });

                                                    if (response.status === 200) {
                                                        toast.success('Video deleted successfully');
                                                        // Refresh the tribute details
                                                        fetchTributeDetails();
                                                    }
                                                } catch (error) {
                                                    console.error('Error deleting video:', error);
                                                    toast.error(error.response?.data?.message || 'Failed to delete video');
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {audio.map((audioFile, index) => (
                                    <div key={`audio-${index}`} className="relative group bg-white p-4 rounded-md border border-[#e5e0d9]">
                                        <audio
                                            controls
                                            className="w-full"
                                        >
                                            <source src={`${assetServer}/images/gallery/${audioFile}`} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    const response = await axios.delete(`${server}/memories/delete/audio`, {
                                                        data: { filename: audioFile }
                                                    });

                                                    if (response.status === 200) {
                                                        toast.success('Audio deleted successfully');
                                                        // Refresh the tribute details
                                                        fetchTributeDetails();
                                                    }
                                                } catch (error) {
                                                    console.error('Error deleting audio:', error);
                                                    toast.error(error.response?.data?.message || 'Failed to delete audio');
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



const ExternalLinksSection = ({
                                  linkInput,
                                  setLinkInput,
                                  linkDescription,
                                  setLinkDescription,
                                  handleLinkSubmit,
                                  isSubmitting,
                                  tribute,
                              }) => {
    // Ensure links is always an array
    const links = Array.isArray(tribute.links) ? tribute.links : []

    return (
        <div className="space-y-6">
            <div className="bg-[#f8f4f0] p-6 rounded-lg">
                <div className="flex items-center mb-4">
                    <LinkIcon className="h-5 w-5 text-[#fcd34d] mr-2"/>
                    <h3 className="text-xl font-medium text-[#2a3342]">External Links</h3>
                </div>
                <p className="text-[#4a5568] mb-6">
                    Add links to external content such as videos, articles, or other online resources related to your
                    loved one.
                </p>

                <div className="space-y-6">
                    <div className="bg-white border border-[#e5e0d9] rounded-lg p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="link-input" className="text-[#2a3342]">
                                    Link URL
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="link-input"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={linkInput}
                                        onChange={(e) => setLinkInput(e.target.value)}
                                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link-description" className="text-[#2a3342]">
                                    Description (optional)
                                </Label>
                                <Input
                                    id="link-description"
                                    type="text"
                                    placeholder="Describe what this link is about"
                                    value={linkDescription}
                                    onChange={(e) => setLinkDescription(e.target.value)}
                                    className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                />
                            </div>

                            <Button
                                onClick={handleLinkSubmit}
                                disabled={!linkInput.trim() || isSubmitting}
                                className="bg-[#fcd34d] hover:bg-[#645a52] text-white"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> :
                                    <Plus className="h-4 w-4 mr-2"/>}
                                {isSubmitting ? "Adding..." : "Add Link"}
                            </Button>
                        </div>
                    </div>

                    {/* Links List */}
                    <div className="bg-white border border-[#e5e0d9] rounded-lg p-6">
                        <h4 className="font-medium text-[#2a3342] mb-4">Added Links</h4>

                        {links.length === 0 ? (
                            <div
                                className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#e5e0d9] rounded-lg">
                                <LinkIcon className="h-12 w-12 text-[#e5e0d9] mb-4"/>
                                <p className="text-[#4a5568] mb-2">No links have been added yet</p>
                                <p className="text-sm text-[#4a5568] max-w-md">
                                    Add links to videos, articles, or other online resources related to your loved one.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-[#e5e0d9]">
                                {links.map((link, index) => (
                                    <li key={index} className="py-3 flex items-center justify-between">
                                        <div className="flex items-start space-x-3">
                                            <ExternalLink className="h-5 w-5 text-[#fcd34d] mt-0.5"/>
                                            <div>
                                                <a
                                                    href={typeof link === "string" ? link : link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#fcd34d] hover:underline font-medium break-all"
                                                >
                                                    {typeof link === "string" ? link : link.url}
                                                </a>
                                                {typeof link !== "string" && link.description && (
                                                    <p className="text-sm text-[#4a5568] mt-1">{link.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
