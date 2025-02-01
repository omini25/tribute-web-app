import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Plus, Upload, Loader2 } from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Modal from "react-modal";

export default function MemoriesMemories() {
    const { id } = useParams();
    const [tribute, setTribute] = useState({
        event_private: false,
        memories: "",
        images: [],
        videos: [],
        audio: [],
        links: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("TRIBUTE");
    const [fileUpload, setFileUpload] = useState(null);
    const [linkInput, setLinkInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"))
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${server}/tributes/memories/${id}`);
            setTribute(response.data);
        } catch (error) {
            console.error("Error fetching tribute details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = () => {
        setTribute((prev) => ({ ...prev, event_private: !prev.event_private }));
    };

    const addMemory = (memory) => {
        setTribute((prev) => ({ ...prev, memories: prev.memories ? `${prev.memories}\n${memory}` : memory }));
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${server}/tributes/memories/${id}`, tribute);
            toast.success("Tribute updated successfully!");
        } catch (error) {
            console.error("Error updating tribute:", error);
            toast.error("Failed to update tribute");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = async () => {
        if (!fileUpload) return
        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("file", fileUpload)
        try {
            await axios.post(`${server}/tributes/memories/${id}/upload`, formData)
            toast.success("File uploaded successfully!")
            fetchTributeDetails()
        } catch (error) {
            console.error("Error uploading file:", error)
            toast.error("Failed to upload file")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLinkSubmit = async () => {
        if (!linkInput) return
        setIsSubmitting(true)
        try {
            await axios.post(`${server}/tributes/memories/${id}/link`, {
                link: linkInput
            })
            toast.success("Link added successfully!")
            setLinkInput("")
            fetchTributeDetails()
        } catch (error) {
            console.error("Error adding link:", error)
            toast.error("Failed to add link")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Header title={title} />
            <div className="space-y-8">
                <PrivacyOption isPrivate={tribute.event_private} onChange={handleCheckboxChange} />
                <MemoriesSection memories={tribute.memories} />
                <div className="flex justify-center">
                    <Button onClick={() => setIsModalOpen(true)} className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white">
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
                <SubmitButton onClick={handleSubmit} isSubmitting={isSubmitting} />
                <UploadSection
                    fileUpload={fileUpload}
                    setFileUpload={setFileUpload}
                    handleFileUpload={handleFileUpload}
                    linkInput={linkInput}
                    setLinkInput={setLinkInput}
                    handleLinkSubmit={handleLinkSubmit}
                    isSubmitting={isSubmitting}
                />
                <NavigationButtons id={id} />
            </div>
            <NewMemoryModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onSave={addMemory} />
        </div>
    );
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
)

const Header = ({ title }) => (
    <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-medium text-gray-600">{title}</h1>
        <h2 className="text-2xl text-gray-500">MEMORIES</h2>
    </div>
)

const PrivacyOption = ({ isPrivate, onChange }) => (
    <div className="flex items-center space-x-2">
        <Checkbox id="private" checked={isPrivate} onCheckedChange={onChange} />
        <Label htmlFor="private" className="text-blue-500">
            Allow Anyone Add Memories To Tribute
        </Label>
    </div>
)

const MemoriesSection = ({ memories }) => (
    <div className="space-y-2">
        <h3 className="text-xl text-gray-500">MEMORIES</h3>
        <Card className="p-0">
            <ul className="list-disc list-inside">
                {memories.split('\n').map((memory, index) => (
                    <li key={index}>{memory}</li>
                ))}
            </ul>
        </Card>
    </div>
)

const SubmitButton = ({ onClick, isSubmitting }) => (
    <div className="flex justify-center">
        <Button
            onClick={onClick}
            disabled={isSubmitting}
            className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
        >
            {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
                <Plus className="h-6 w-6" />
            )}
        </Button>
    </div>
)

const UploadSection = ({
                           fileUpload,
                           setFileUpload,
                           handleFileUpload,
                           linkInput,
                           setLinkInput,
                           handleLinkSubmit,
                           isSubmitting
                       }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File (Video or Audio)</Label>
            <div className="flex items-center space-x-2">
                <Input
                    id="file-upload"
                    type="file"
                    accept="video/*,audio/*"
                    onChange={e => setFileUpload(e.target.files[0])}
                    className="border-2 border-blue-300"
                />
                <Button
                    onClick={handleFileUpload}
                    disabled={!fileUpload || isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
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
                    className="border-2 border-blue-300"
                />
                <Button
                    onClick={handleLinkSubmit}
                    disabled={!linkInput || isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                </Button>
            </div>
        </div>
    </div>
)

const NavigationButtons = ({ id }) => (
    <div className="flex justify-between mt-16">
        <Link to={`/dashboard/memories/events/${id}`}>
            <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]">
                Events
            </Button>
        </Link>
        <Link to={`/dashboard/memories/donations/${id}`}>
            <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]">
                Donations
            </Button>
        </Link>
    </div>
)

const NewMemoryModal = ({ isOpen, onRequestClose, onSave }) => {
    const [newMemory, setNewMemory] = useState('');

    const handleSave = () => {
        onSave(newMemory);
        setNewMemory('');
        onRequestClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal">
            <div className="p-4">
                <h3 className="text-xl mb-4">Add New Memory</h3>
                <Textarea
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="Enter your memory here"
                    className="min-h-[100px] border-blue-100 resize-none mb-4"
                />
                <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Save
                </Button>
            </div>
        </Modal>
    );
};
