import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Plus, Upload, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { toast } from "react-hot-toast"
import axios from "axios"

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
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            toast({
                title: "Error",
                description: "Failed to fetch tribute details. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }



    const handleCheckboxChange = () => {
        setTribute(prev => ({ ...prev, event_private: !prev.event_private }))
    }



    const addMemory = async () => {
        if (!newMemory) return;

        try {
            // const user = JSON.parse(localStorage.getItem("user") || "{}")
            // const userId = user?.id;

            const response = await axios.post(`${server}/memories/add/text`, {
                tribute_id: id,
                memory: newMemory,
                // uploader_name: storedUser?.name || "Guest"
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                setTribute(prev => ({
                    ...prev,
                    memories: prev.memories ? `${prev.memories}\n${newMemory}` : newMemory
                }));
                setNewMemory("");
                toast.success("Memory added successfully.");
            } else {
                toast.error("An error occurred. Please try again.");
                console.error(response);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(`Error: ${error.response.data.message || 'An error occurred. Please try again.'}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('No response received from the server. Please try again.');
            } else {
                console.error('Error message:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const handleFileChange = e => {
        if (e.target.files) {
            setFileUpload(e.target.files[0])
        }
    }

    const handleSubmit = async () => {
        if (!fileUpload) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('tribute_id', id);
        formData.append('files[]', fileUpload);
        formData.append('uploader_name', JSON.parse(localStorage.getItem("user"))?.name || "Guest");

        try {
            const response = await axios.post(`${server}/memories/add/video`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                toast.success("Video uploaded successfully.");
                fetchTributeDetails(); // Refresh the tribute details to show the new video
            } else {
                toast.error("An error occurred. Please try again.");
                console.error(response);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(`Error: ${error.response.data.message || 'An error occurred. Please try again.'}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('No response received from the server. Please try again.');
            } else {
                console.error('Error message:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageSubmit = async () => {
        if (!fileUpload) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('tribute_id', id);
        formData.append('files[]', fileUpload);
        formData.append('uploader_name', JSON.parse(localStorage.getItem("user"))?.name || "Guest");

        try {
            const response = await axios.post(`${server}/memories/add/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                toast.success("Image uploaded successfully.");
                fetchTributeDetails(); // Refresh the tribute details to show the new image
            } else {
                toast.error("An error occurred. Please try again.");
                console.error(response);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(`Error: ${error.response.data.message || 'An error occurred. Please try again.'}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('No response received from the server. Please try again.');
            } else {
                console.error('Error message:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLinkSubmit = async () => {
        if (!linkInput) return
        setIsSubmitting(true)
        try {
            setTribute(prev => ({ ...prev, links: [...prev.links, linkInput] }))
            toast({
                title: "Link Added",
                description: "Your link has been added successfully."
            })
            setLinkInput("")
            fetchTributeDetails()
        } catch (error) {
            console.error("Error adding link:", error)
            toast({
                title: "Error",
                description: "Failed to add link. Please try again.",
                variant: "destructive"
            })
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
                                <ScrollArea className="h-[200px]">
                                    <ul className="list-disc list-inside space-y-2">
                                        {JSON.parse(tribute.memories).map((memory, index) => (
                                            <li key={index} className="text-warm-600">
                                                {memory}
                                            </li>
                                        ))}
                                    </ul>
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
                                        <DialogTitle >Add New Memory</DialogTitle>
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
                                        >
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
        </div>
    )
}
