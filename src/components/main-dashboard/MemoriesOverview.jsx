"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import {
    Loader2,
    Upload,
    Calendar,
    Globe,
    LinkIcon,
    ChevronRight,
    User,
    Quote,
    Heart,
    Info,
    ChevronLeft,
    Eye, // Import Eye icon
    EyeOff, // Import EyeOff icon
    Trash2, // Import Trash2 icon
    AlertTriangle, // Import AlertTriangle icon
} from "lucide-react"
import { server } from "@/server.js"
import { assetServer } from "@/assetServer.js"
import { Button } from "@/components/ui/button" // Use shadcn Button
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch" // Import shadcn Switch
import { // Import shadcn Dialog components
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Copy } from "lucide-react";


export default function MemoriesOverview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false) // State for delete loading
    const [file, setFile] = useState(null)
    const [tribute, setTribute] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        nickname: "",
        relationship: "",
        date_of_death: "",
        date_of_birth: "",
        country_of_birth: "",
        country_died: "",
        customMemorialWebsite: "",
        quote: "",
        is_public: true,
    })
    const [title, setTitle] = useState("TRIBUTE")
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const [imagePreview, setImagePreview] = useState(null)
    const [activeTab, setActiveTab] = useState("basic")
    const [formErrors, setFormErrors] = useState({})
    // Removed isPublic state, using tribute.is_public directly
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false) // State for delete modal visibility

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(tribute)

    const fetchTributeTitle = async () => {
        try {
            if (!user || !user.id) {
                console.warn("User ID not found for fetching tribute title.");
                setTitle("TRIBUTE"); // Default title
                return;
            }
            const response = await axios.get(`${server}/tribute/title/image/${user.id}`)
            // Assuming response.data is an object with a 'title' property
            setTitle(response.data.title || "TRIBUTE") // Use response.data.title directly
        } catch (error) {
            console.error("Error fetching tribute title:", error)
            setTitle("TRIBUTE"); // Default on error
        }
    }

    const fetchTributeDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            const tributeData = response.data
            setTribute({
                ...tributeData,
                date_of_death: tributeData.date_of_death ? format(new Date(tributeData.date_of_death), "yyyy-MM-dd") : "",
                date_of_birth: tributeData.date_of_birth ? format(new Date(tributeData.date_of_birth), "yyyy-MM-dd") : "",
                is_public: !!tributeData.is_public, // Convert to boolean for consistent state management
                // Ensure customMemorialWebsite is handled
                customMemorialWebsite: tributeData.customMemorialWebsite || `www.rememberedalways.org/tribute/${tributeData.first_name?.toLowerCase() || ''}-${tributeData.last_name?.toLowerCase() || ''}`
            })
            if (tributeData.image) {
                setImagePreview(`${assetServer}/images/people/${tributeData.image}`);
            }
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            toast.error("Failed to load tribute details")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setTribute((prev) => ({ ...prev, [id]: value }))

        // Clear error for this field if it exists
        if (formErrors[id]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[id]
                return newErrors
            })
        }
    }

    const handleSelectChange = (value, field) => {
        setTribute((prev) => ({ ...prev, [field]: value }))

        // Clear error for this field if it exists
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const handleDateChange = (date, field) => {
        // Ensure date is formatted or null
        const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null;
        setTribute((prev) => ({ ...prev, [field]: formattedDate }));

        // Clear error for this field if it exists
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
            if (!validImageTypes.includes(selectedFile.type)) {
                toast.error("Invalid image type. Please upload JPEG, PNG, JPG, or GIF.");
                e.target.value = ""; // Reset file input
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) { // 2MB limit
                toast.error("Image size should not exceed 2MB.");
                e.target.value = ""; // Reset file input
                return;
            }
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    // Handler for the public/private switch
    const handleTogglePublic = async (checked) => {
        const originalIsPublic = tribute.is_public;
        setTribute((prev) => ({ ...prev, is_public: checked }));
        try {
            const response = await axios.patch(`${server}/tribute/update-visibility/${id}`, { is_public: checked });
            if (response.data.status === "success") {
                toast.success(`Tribute set to ${checked ? 'Public' : 'Private'}`);
            } else {
                toast.error(response.data.message || "Failed to update visibility");
                setTribute(prev => ({ ...prev, is_public: originalIsPublic }));
            }
        } catch (err) {
            console.error("Failed to update visibility", err);
            toast.error(err.response?.data?.message || "Failed to update visibility");
            setTribute(prev => ({ ...prev, is_public: originalIsPublic }));
        }
    };


    const validateForm = () => {
        const errors = {}

        if (!tribute.first_name?.trim()) { // Use optional chaining for safety
            errors.first_name = "First name is required"
        }

        if (!tribute.last_name?.trim()) { // Use optional chaining for safety
            errors.last_name = "Last name is required"
        }

        if (!tribute.relationship) {
            errors.relationship = "Relationship is required"
        }

        // date_of_death is not always required here, but might be in other contexts
        // if (!tribute.date_of_death) errors.date_of_death = "Date of death is required for some features";


        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields marked with *")
            // Potentially switch to the tab with the first error
            if (formErrors.first_name || formErrors.last_name || formErrors.relationship) {
                setActiveTab("basic");
            } else if (formErrors.date_of_death) {
                setActiveTab("details");
            }
            return
        }

        setIsSaving(true)
        const formDataToSubmit = new FormData()

        // Append all tribute fields, ensuring nulls are handled if backend expects them or omits them
        Object.entries(tribute).forEach(([key, value]) => {
            if (value !== null && value !== undefined) { // Send non-null/undefined values
                if (key === 'date_of_birth' || key === 'date_of_death') {
                    formDataToSubmit.append(key, value ? format(new Date(value), "yyyy-MM-dd") : '');
                } else {
                    formDataToSubmit.append(key, value);
                }
            }
        });

        if (file) {
            // File type and size validation already done in handleFileChange
            formDataToSubmit.append("image", file)
        }

        try {
            const response = await axios.post(`${server}/tribute/overview/update/${id}`, formDataToSubmit, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if (response.data.status === "success") {
                toast.success("Tribute updated successfully")
                if (response.data.tribute && response.data.tribute.image) {
                    setTribute(prev => ({ ...prev, image: response.data.tribute.image }));
                    setImagePreview(`${assetServer}/images/people/${response.data.tribute.image}`);
                    setFile(null); // Clear the file input state after successful upload
                }
            } else {
                toast.error(response.data.message || "Failed to update tribute")
            }
        } catch (error) {
            console.error("Error updating tribute details:", error)
            toast.error(error.response?.data?.message || "Failed to update tribute. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    // Handler for confirming deletion from the modal
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            // Replace with your delete API endpoint
            const response = await axios.delete(`${server}/tribute/delete/${id}`);
            if (response.data.status === "success") {
                toast.success("Tribute deleted successfully");
                navigate("/dashboard/main"); // Navigate to dashboard or tributes list
            } else {
                toast.error(response.data.message || "Failed to delete tribute.");
            }
        } catch (err) {
            console.error("Error deleting tribute:", err);
            toast.error(err.response?.data?.message || "An error occurred while deleting the tribute.");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false); // Close modal regardless of success/failure
        }
    }

    const getCompletionPercentage = () => {
        const requiredFields = ["first_name", "last_name", "relationship", "date_of_death"]
        const completedFields = requiredFields.filter((field) => tribute[field] && String(tribute[field]).trim() !== "")
        return (completedFields.length / requiredFields.length) * 100
    }


    return (
        <div className="bg-[#f8f4f0] min-h-screen py-6 sm:py-8">
            <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
                {/* Progress Bar */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-wrap justify-between text-xs sm:text-sm text-[#4a5568] mb-2 gap-2">
                        <span className="font-medium text-[#2a3342]">Basic Info</span>
                        <span>Life</span>
                        <span>Events & Donations</span>
                        <span>Memories</span>
                    </div>
                    <Progress value={20} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                </div>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b">
                        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                            <div>
                                <CardTitle className="text-2xl sm:text-3xl font-serif text-[#2a3342]">{title}</CardTitle>
                                <CardDescription className="text-[#4a5568] text-sm sm:text-base">
                                    Manage your loved one's tribute details.
                                </CardDescription>
                            </div>
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
                                    <span>{Math.round(getCompletionPercentage())}% Complete</span>
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
                            <CardContent className="p-3 sm:p-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 bg-[#f0ece6]">
                                        <TabsTrigger
                                            value="basic"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base"
                                        >
                                            <User className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Basic Info
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="details"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base"
                                        >
                                            <Info className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Additional Details
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="quote"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base"
                                        >
                                            <Quote className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Quote
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="basic" className="mt-0 space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-6">
                                                <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
                                                    <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-4">Personal Information</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <InputField
                                                            label="First Name"
                                                            id="first_name"
                                                            value={tribute.first_name}
                                                            onChange={handleInputChange}
                                                            required
                                                            error={formErrors.first_name}
                                                        />
                                                        <InputField
                                                            label="Middle Name"
                                                            id="middle_name"
                                                            value={tribute.middle_name}
                                                            onChange={handleInputChange}
                                                        />
                                                        <InputField
                                                            label="Last Name"
                                                            id="last_name"
                                                            value={tribute.last_name}
                                                            onChange={handleInputChange}
                                                            required
                                                            error={formErrors.last_name}
                                                        />
                                                        <InputField
                                                            label="Nickname"
                                                            id="nickname"
                                                            value={tribute.nickname}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
                                                    <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-4">Relationship</h3>
                                                    <RelationshipField
                                                        tribute={tribute}
                                                        handleSelectChange={handleSelectChange}
                                                        error={formErrors.relationship}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <ImageUpload
                                                    imagePreview={imagePreview}
                                                    tributeImage={tribute.image}
                                                    handleFileChange={handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="details" className="mt-0 space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-6">
                                                <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
                                                    <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-4">Important Dates</h3>
                                                    <div className="space-y-4">
                                                        <DateField
                                                            label="Date of Birth"
                                                            value={tribute.date_of_birth}
                                                            onChange={(date) => handleDateChange(date, "date_of_birth")}
                                                        />
                                                        <DateField
                                                            label="Date of Death"
                                                            value={tribute.date_of_death}
                                                            onChange={(date) => handleDateChange(date, "date_of_death")}
                                                            required
                                                            error={formErrors.date_of_death}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Memorial Website & Settings Card - Updated */}
                                                <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg space-y-6">
                                                    <div>
                                                        <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-4">Memorial Website & Settings</h3>
                                                       <div className="relative">
                                                            <InputField
                                                                label="Custom Memorial URL"
                                                                id="customMemorialWebsite"
                                                                value={tribute.customMemorialWebsite || `www.rememberedalways.org/tribute/${tribute.first_name?.toLowerCase() || ""}-${tribute.last_name?.toLowerCase() || ""}`}
                                                                onChange={handleInputChange}
                                                                icon={<LinkIcon className="h-4 w-4 text-[#fcd34d]" />}
                                                                disabled
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-2 top-[32px] hover:bg-transparent"
                                                                onClick={() => {
                                                                    const url = tribute.customMemorialWebsite ||
                                                                        `www.rememberedalways.org/tribute/${tribute.first_name?.toLowerCase() || ""}-${tribute.last_name?.toLowerCase() || ""}`;
                                                                    navigator.clipboard.writeText(url)
                                                                        .then(() => toast.success("URL copied to clipboard"))
                                                                        .catch(() => toast.error("Failed to copy URL"));
                                                                }}
                                                            >
                                                                <Copy className="h-4 w-4 text-[#fcd34d]" />
                                                                <span className="sr-only">Copy URL</span>
                                                            </Button>
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-[#4a5568] mt-2">This is the unique URL for the tribute page.</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="is_public" className="text-[#2a3342] flex items-center">
                                                            Tribute Visibility
                                                        </Label>
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center space-x-3">
                                                                <Switch
                                                                    id="is_public"
                                                                    checked={tribute.is_public}
                                                                    onCheckedChange={handleTogglePublic}
                                                                    aria-label="Tribute visibility"
                                                                />
                                                                <span className="text-sm text-[#4a5568] flex items-center">
                                                                    {tribute.is_public ? (
                                                                        <><Eye className="h-4 w-4 mr-1 text-green-600" /> Public</>
                                                                    ) : (
                                                                        <><EyeOff className="h-4 w-4 mr-1 text-red-600" /> Private</>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-[#4a5568]">
                                                            Public tributes are visible to anyone with the link. Private tributes may require login or special access (if implemented).
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
                                                    <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-4">Location Information</h3>
                                                    <div className="space-y-4">
                                                        <InputField
                                                            label="Country of Birth"
                                                            id="country_of_birth"
                                                            value={tribute.country_of_birth}
                                                            onChange={handleInputChange}
                                                            icon={<Globe className="h-4 w-4 text-[#fcd34d]" />}
                                                        />
                                                        <InputField
                                                            label="Country of Death"
                                                            id="country_died"
                                                            value={tribute.country_died}
                                                            onChange={handleInputChange}
                                                            icon={<Globe className="h-4 w-4 text-[#fcd34d]" />}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Danger Zone for Deletion - Updated */}
                                                <div className="bg-red-50 dark:bg-red-900/20 p-4 sm:p-6 rounded-lg border border-red-200 dark:border-red-700">
                                                    <h3 className="text-lg sm:text-xl font-medium text-red-700 dark:text-red-400 mb-3">Danger Zone</h3>
                                                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                                                        Deleting this tribute is permanent and cannot be undone. All associated memories, photos, and information will be lost.
                                                    </p>
                                                    {/* Use shadcn Button with destructive variant */}
                                                    <Button
                                                        variant="destructive"
                                                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                                                        onClick={() => setIsDeleteModalOpen(true)} // Open the shadcn Dialog
                                                        disabled={isDeleting}
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                        )}
                                                        Delete Tribute
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="quote" className="mt-0">
                                        <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
                                            <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-4">Memorial Quote</h3>
                                            <p className="text-[#4a5568] mb-4 sm:mb-6 text-sm sm:text-base">
                                                Add a meaningful quote that captures the essence of your loved one or provides comfort to visitors.
                                            </p>
                                            <QuoteSection quote={tribute.quote} handleInputChange={handleInputChange} />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>

                            <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t p-3 sm:p-6 gap-3 sm:gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                                    onClick={() => navigate(`/dashboard/main`)}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Dashboard
                                </Button>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading || isSaving || isDeleting} // Disable save while deleting
                                        className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        onClick={() => navigate(`/dashboard/tribute-life/${id}`)}
                                        disabled={isLoading || isSaving || isDeleting} // Disable continue while saving/deleting
                                        className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                    >
                                        Continue <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </>
                    )}
                </Card>


                {/* Delete Confirmation Modal (using shadcn Dialog) */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white">
                        <DialogHeader>
                            <DialogTitle className="flex items-center text-xl font-semibold text-red-600">
                                <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
                                Confirm Tribute Deletion
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-gray-600">
                                Are you absolutely sure you want to delete the tribute for{" "}
                                <strong>{tribute.first_name} {tribute.last_name}</strong>?
                                This action is irreversible and will permanently remove all associated data.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 sm:justify-end gap-2">
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isDeleting}> {/* Disable cancel while deleting */}
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={handleConfirmDelete} // Call the delete handler
                                disabled={isDeleting} // Disable delete button while deleting
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                Yes, Delete Tribute
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

// ... (InputField, RelationshipField, DateField, ImageUpload, QuoteSection components remain the same)

const InputField = ({ label, id, value, onChange, icon, required = false, error, disabled = false }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-[#2a3342] flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative">
            <Input
                id={id}
                value={value || ""} // Ensure value is not null/undefined for controlled input
                onChange={onChange}
                className={`${icon ? "pl-8" : ""} border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 ${
                    error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
                }`}
                disabled={disabled}
            />
            {icon && <div className="absolute left-2 top-1/2 transform -translate-y-1/2">{icon}</div>}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
)

const RelationshipField = ({ tribute, handleSelectChange, error }) => (
    <div className="space-y-2">
        <Label className="text-[#2a3342] flex items-center">
            Relationship with bereaved
            <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select value={tribute.relationship || ""} onValueChange={(value) => handleSelectChange(value, "relationship")}>
            <SelectTrigger className={`border-[#e5e0d9] ${error ? "border-red-300" : ""}`}>
                <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
                {["Father", "Mother", "Sibling", "Spouse", "Child", "Friend", "Grandparent", "Colleague", "Other"].map(
                    (relation) => (
                        <SelectItem key={relation.toLowerCase()} value={relation.toLowerCase()}>
                            {relation}
                        </SelectItem>
                    ),
                )}
            </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
)

const DateField = ({ label, value, onChange, required = false, error }) => (
    <div className="space-y-2">
        <Label className="text-[#2a3342] flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative">
            <Input
                type="date"
                className={`pl-8 border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 ${
                    error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
                }`}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fcd34d]" />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
)

const ImageUpload = ({ imagePreview, tributeImage, handleFileChange }) => (
    <div className="bg-[#f8f4f0] p-6 rounded-lg">
        <h3 className="text-xl font-medium text-[#2a3342] mb-4">Profile Image</h3>
        <p className="text-[#4a5568] mb-4">Upload a memorable photo of your loved one (Max 2MB)</p>

        <div className="relative bg-white border border-dashed border-[#e5e0d9] rounded-lg overflow-hidden">
            <input type="file" id="image" accept="image/jpeg,image/png,image/gif,image/jpg" className="hidden" onChange={handleFileChange} />
            <label htmlFor="image" className="cursor-pointer block w-full h-full min-h-[300px]">
                {imagePreview || (tributeImage && `${assetServer}/images/people/${tributeImage}`) ? (
                    <div className="relative group">
                        <img
                            src={imagePreview || `${assetServer}/images/people/${tributeImage}`}
                            alt="Tribute"
                            className="w-full h-[300px] object-cover"
                            onError={(e) => { e.target.src = "/placeholder.svg"; }} // Fallback for broken image links
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="h-6 w-6 text-[#fcd34d]" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <div className="bg-[#f0ece6] rounded-full p-4 mb-4">
                            <Upload className="h-8 w-8 text-[#fcd34d]" />
                        </div>
                        <h4 className="font-medium text-[#2a3342] mb-2">Upload Photo</h4>
                        <p className="text-[#4a5568] text-sm max-w-xs">
                            Drag and drop an image here, or click to browse.
                        </p>
                        <p className="text-[#4a5568] text-xs mt-4">Supported: JPG, PNG, GIF. Max 2MB.</p>
                    </div>
                )}
            </label>
        </div>
    </div>
)

const QuoteSection = ({ quote, handleInputChange }) => (
    <div className="relative max-w-3xl mx-auto text-center py-8">
        <div className="text-6xl text-[#e5e0d9] absolute top-0 left-0 select-none">"</div>
        <div className="text-6xl text-[#e5e0d9] absolute bottom-0 right-0 select-none">"</div>
        <Textarea
            placeholder="Enter a meaningful quote that captures the essence of your loved one..."
            className="bg-white border-[#e5e0d9] text-center italic text-lg min-h-[150px] resize-none px-12 py-6 focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
            value={quote || ""}
            onChange={handleInputChange}
            id="quote"
        />
        <p className="text-sm text-[#4a5568] mt-4">This quote will be displayed prominently on your tribute page</p>
    </div>
)