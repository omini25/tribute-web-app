import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { server } from "@/server.js"

export default function TributeFormOverview() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        nickname: "",
        relationship: "",
        dateOfDeath: null,
        dateOfBirth: null,
        countryOfBirth: "",
        countryDied: "",
        customMemorialWebsite: "",
        quote: "",
        image: null
    })
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSelectChange = (value, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleDateChange = (date, field) => {
        const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null
        setFormData(prev => ({
            ...prev,
            [field]: formattedDate
        }))
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
                setFormData(prev => ({
                    ...prev,
                    image: file
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            // Validate required fields
            if (!formData.firstName || !formData.lastName) {
                throw new Error("First name and last name are required")
            }

            // Submit the form data to the external API
            const response = await fetch(`${server}/tribute/start/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Failed to submit form')
            }

            const data = await response.json()

            toast.success("Memory saved successfully!")
            // Navigate to next step with the response ID
            navigate(`/dashboard/tribute-life/${data.id}`)
        } catch (error) {
            toast.error(error.message || "Failed to save memory")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <span className="text-gray-700">Saving changes...</span>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2 ">
                    <h1 className="text-4xl font-light text-gray-600">Create A Tribute</h1>
                    <h2 className="text-2xl font-light text-gray-500">Overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Name Fields */}
                            <InputField
                                label="First Name"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <InputField
                                label="Middle Name"
                                id="middleName"
                                value={formData.middleName}
                                onChange={handleInputChange}
                            />
                            <InputField
                                label="Last Name"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            <InputField
                                label="Nickname"
                                id="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Relationship Field */}
                        <RelationshipField
                            value={formData.relationship}
                            onChange={(value) => handleSelectChange(value, "relationship")}
                        />

                        {/* Date of Death */}
                        <DateField
                            label="Date of Death"
                            value={formData.dateOfDeath}
                            onChange={(date) => handleDateChange(date, "dateOfDeath")}
                        />

                        <InputField
                            label="Country of Birth"
                            id="countryOfBirth"
                            value={formData.countryOfBirth}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="relative bg-blue-100 p-6 rounded-lg text-center">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <label
                                htmlFor="image"
                                className="cursor-pointer block w-full h-full min-h-[200px]"
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <Upload className="h-8 w-8 mb-2 text-blue-500" />
                                        <span className="text-blue-500">UPLOAD PERSON'S IMAGE</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Date of Birth */}
                        <DateField
                            label="Date of Birth"
                            value={formData.dateOfBirth}
                            onChange={(date) => handleDateChange(date, "dateOfBirth")}
                        />

                        <InputField
                            label="Country Died"
                            id="countryDied"
                            value={formData.countryDied}
                            onChange={handleInputChange}
                        />

                        <InputField
                            label="Memorial Website"
                            id="customMemorialWebsite"
                            value={formData.customMemorialWebsite || `www.rememberedalways.com/tribute/${formData.firstName?.toLowerCase()}-${formData.lastName?.toLowerCase()}`}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>

                {/* Quote Section */}
                <div className="relative max-w-3xl mx-auto text-center py-8">
                    <div className="text-6xl text-blue-200 absolute top-0 left-0">"</div>
                    <textarea
                        placeholder="Enter a short quote about the bereaved or about death"
                        className="w-full p-4 bg-blue-50 border-blue-100 rounded-lg text-center italic text-lg resize-none"
                        value={formData.quote}
                        onChange={(e) => handleInputChange({
                            target: { id: 'quote', value: e.target.value }
                        })}
                        rows={3}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="animate-spin" />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                    <Button
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8"
                        onClick={() => navigate(`/dashboard/tribute-life/${data.id}`)}
                        disabled={isLoading}
                    >
                        Next: Life of Person
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Component for Input Fields
const InputField = ({ label, id, value, onChange, required = false, disabled = false }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
            id={id}
            value={value || ''}
            onChange={onChange}
            className="bg-blue-50 border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            disabled={disabled}
        />
    </div>
)

// Component for Relationship Field
const RelationshipField = ({ value, onChange }) => (
    <div className="space-y-2">
        <Label className="text-gray-700">Relationship with bereaved</Label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="bg-blue-50 border-blue-100">
                <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-100">
                {["Father", "Mother", "Sibling", "Spouse", "Child", "Friend", "Other"].map(relation => (
                    <SelectItem key={relation.toLowerCase()} value={relation.toLowerCase()}>
                        {relation}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
)

// Component for Date Fields
const DateField = ({ label, value, onChange }) => (
    <div className="space-y-2">
        <Label className="text-gray-700">{label}</Label>
        <input
            type="date"
            className="w-full bg-blue-50 border-blue-100 p-2 rounded focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
)