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
    X
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
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
    AlertDialogTitle
} from "@/components/ui/alert-dialog"

export default function MemoriesMemories() {
    const { id } = useParams()
    const [tribute, setTribute] = useState({
        event_private: false,
        memories: "",
        images: [],
        videos: [],
        audio: [],
        links: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title, setTitle] = useState("TRIBUTE")
    const [fileUpload, setFileUpload] = useState(null)
    const [linkInput, setLinkInput] = useState("")
    const [newMemory, setNewMemory] = useState("")
    const [newMemoryImage, setNewMemoryImage] = useState(null)
    const [memories, setMemories] = useState([])
    const [editingMemoryId, setEditingMemoryId] = useState(null)
    const [editingMemoryText, setEditingMemoryText] = useState("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [memoryToDelete, setMemoryToDelete] = useState(null)

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
            setTitle(response.data.title || "TRIBUTE")
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
                                text: memory
                            }))
                        )
                    }
                    // If memories is a string, split by newlines
                    else if (typeof response.data.memories === "string") {
                        const memoriesArray = response.data.memories
                            .split("\n")
                            .filter(memory => memory.trim() !== "")

                        setMemories(
                            memoriesArray.map((memory, index) => ({
                                id: index.toString(),
                                text: memory
                            }))
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
                    links: []
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
        setTribute(prev => ({ ...prev, event_private: !prev.event_private }))
    }

    const addMemory = async () => {
        if (!newMemory) return

        try {
            setIsSubmitting(true)
            const response = await axios.post(
                `${server}/memories/add/text`,
                {
                    tribute_id: id,
                    memory: newMemory
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            if (response.status === 200) {
                // Add the new memory to the memories array
                const newMemoryObj = {
                    id: (memories.length + 1).toString(),
                    text: newMemory
                }
                setMemories([...memories, newMemoryObj])

                // Update the tribute object
                setTribute(prev => ({
                    ...prev,
                    memories: JSON.stringify([...memories.map(m => m.text), newMemory])
                }))

                setNewMemory("")
                toast.success("Memory added successfully.")
            } else {
                toast.error("An error occurred. Please try again.")
                console.error(response)
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data)
                toast.error(
                    `Error: ${error.response.data.message ||
                    "An error occurred. Please try again."}`
                )
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

    const startEditingMemory = memory => {
        setEditingMemoryId(memory.id)
        setEditingMemoryText(memory.text)
    }

    const cancelEditingMemory = () => {
        setEditingMemoryId(null)
        setEditingMemoryText("")
    }

    const saveEditedMemory = async memoryId => {
        if (!editingMemoryText.trim()) {
            toast.error("Memory text cannot be empty")
            return
        }

        try {
            setIsSubmitting(true)

            // Find the memory to update
            const memory = memories.find(m => m.id === memoryId)
            if (!memory) {
                toast.error("Memory not found")
                return
            }

            // Update the API
            const response = await axios.put(
                `${server}/tribute/memories/update/${id}`,
                {
                    old_memory: memory.text,
                    new_memory: editingMemoryText
                }
            )

            if (response.status === 200) {
                // Create updated memories array
                const updatedMemories = memories.map(m =>
                    m.id === memoryId ? { ...m, text: editingMemoryText } : m
                )

                // Update local state
                setMemories(updatedMemories)
                setTribute(prev => ({
                    ...prev,
                    memories: JSON.stringify(updatedMemories.map(m => m.text))
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

    const confirmDeleteMemory = memory => {
        setMemoryToDelete(memory)
        setIsDeleteDialogOpen(true)
    }

    const deleteMemory = async () => {
        if (!memoryToDelete) return

        try {
            setIsSubmitting(true)

            const response = await axios.delete(
                `${server}/tributes/memories/delete/${id}`,
                {
                    data: { memory: memoryToDelete.text }
                }
            )

            if (response.status === 200) {
                const updatedMemories = memories.filter(m => m.id !== memoryToDelete.id)
                setMemories(updatedMemories)
                setTribute(prev => ({
                    ...prev,
                    memories: JSON.stringify(updatedMemories.map(m => m.text))
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

    const handleFileChange = e => {
        if (e.target.files) {
            setFileUpload(e.target.files[0])
        }
    }

    const handleSubmit = async () => {
        if (!fileUpload) return

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("tribute_id", id)
        formData.append("files[]", fileUpload)
        formData.append(
            "uploader_name",
            JSON.parse(localStorage.getItem("user"))?.name || "Guest"
        )

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
                toast.success("Video uploaded successfully.")
                fetchTributeDetails() // Refresh the tribute details to show the new video
            } else {
                toast.error("An error occurred. Please try again.")
                console.error(response)
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data)
                toast.error(
                    `Error: ${error.response.data.message ||
                    "An error occurred. Please try again."}`
                )
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

    const handleImageSubmit = async () => {
        if (!fileUpload) return

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("tribute_id", id)
        formData.append("files[]", fileUpload)
        formData.append(
            "uploader_name",
            JSON.parse(localStorage.getItem("user"))?.name || "Guest"
        )

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
                toast.success("Image uploaded successfully.")
                fetchTributeDetails() // Refresh the tribute details to show the new image
            } else {
                toast.error("An error occurred. Please try again.")
                console.error(response)
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data)
                toast.error(
                    `Error: ${error.response.data.message ||
                    "An error occurred. Please try again."}`
                )
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
        if (!linkInput) return
        setIsSubmitting(true)
        try {
            setTribute(prev => ({ ...prev, links: [...prev.links, linkInput] }))
            toast.success("Your link has been added successfully.")
            setLinkInput("")
            fetchTributeDetails()
        } catch (error) {
            console.error("Error adding link:", error)
            toast.error("Failed to add link. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-warm-500" />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-warm-800">
                            {title}
                        </CardTitle>
                        <p className="text-xl text-warm-600">MEMORIES</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/*<div className="flex items-center space-x-2">*/}
                        {/*    <Checkbox*/}
                        {/*        id="private"*/}
                        {/*        checked={tribute.event_private}*/}
                        {/*        onCheckedChange={handleCheckboxChange}*/}
                        {/*    />*/}
                        {/*    <Label htmlFor="private" className="text-warm-600">*/}
                        {/*        Allow Anyone Add Memories To Tribute*/}
                        {/*    </Label>*/}
                        {/*</div>*/}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-warm-700">
                                    MEMORIES
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px] pr-4">
                                    {memories.length === 0 ? (
                                        <p className="text-center text-warm-500 italic py-8">
                                            No memories have been added yet. Add your first memory
                                            below.
                                        </p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {memories.map(memory => (
                                                <li
                                                    key={memory.id}
                                                    className="border border-warm-200 rounded-lg p-4 relative group"
                                                >
                                                    {editingMemoryId === memory.id ? (
                                                        <div className="space-y-2">
                                                            <Textarea
                                                                value={editingMemoryText}
                                                                onChange={e =>
                                                                    setEditingMemoryText(e.target.value)
                                                                }
                                                                className="min-h-[100px] border-warm-200 resize-none"
                                                            />
                                                            <div className="flex justify-end space-x-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={cancelEditingMemory}
                                                                    className="text-warm-600"
                                                                >
                                                                    <X className="h-4 w-4 mr-1" /> Cancel
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => saveEditedMemory(memory.id)}
                                                                    className="bg-warm-500 hover:bg-warm-600"
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
                                                            <p className="text-warm-600 pr-16">
                                                                {memory.text}
                                                            </p>
                                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => startEditingMemory(memory)}
                                                                    className="h-8 w-8 text-warm-500 hover:text-warm-700 hover:bg-warm-100"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => confirmDeleteMemory(memory)}
                                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <div className="flex justify-center bg-white">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="rounded-full w-12 h-12 bg-warm-500 hover:bg-warm-600 ">
                                        <Plus className="h-6 w-6" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className={"bg-white"}>
                                    <DialogHeader className={"bg-white"}>
                                        <DialogTitle>Add New Memory</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 bg-white">
                                        <Textarea
                                            value={newMemory}
                                            onChange={e => setNewMemory(e.target.value)}
                                            placeholder="Enter your memory here"
                                            className="min-h-[100px] border-warm-200 resize-none"
                                        />

                                        <Button
                                            onClick={addMemory}
                                            className="bg-warm-500 hover:bg-warm-600 bg-secondary"
                                            disabled={isSubmitting || !newMemory.trim()}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Plus className="h-4 w-4 mr-2" />
                                            )}
                                            Save Memory
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="file-upload">
                                    Upload File (Video, Audio, or Image)
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        className="border-2 border-warm-200"
                                    />
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!fileUpload || isSubmitting}
                                        className="bg-warm-500 hover:bg-warm-600 "
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Upload className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link-input">Add Link (Audio or Video)</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="link-input"
                                        type="text"
                                        placeholder="Enter link for audio or video"
                                        value={linkInput}
                                        onChange={e => setLinkInput(e.target.value)}
                                        className="border-2 border-warm-200"
                                    />
                                    <Button
                                        onClick={handleLinkSubmit}
                                        disabled={!linkInput || isSubmitting}
                                        className="bg-warm-500 hover:bg-warm-600 "
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Add"
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file-upload">Add Images</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="border-2 border-warm-200"
                                    />
                                    <Button
                                        onClick={handleImageSubmit}
                                        disabled={!fileUpload || isSubmitting}
                                        className="bg-warm-500 hover:bg-warm-600 "
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Add"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <Link to={`/dashboard/memories/events/${id}`}>
                                <Button variant="outline" className="text-warm-700">
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Events
                                </Button>
                            </Link>
                            <Link to={`/dashboard/memories/donations/${id}`}>
                                <Button variant="outline" className="text-warm-700">
                                    Donations <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Memory</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this memory? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteMemory}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
