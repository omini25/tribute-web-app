import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { Upload } from "lucide-react"
import { server } from "@/server.js"
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

export default function MemoriesOverview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [tribute, setTribute] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        nickname: "",
        relationship: "",
        date_of_death: null,
        date_of_birth: null,
        country_lived: "",
        customMemorialWebsite: "",
        quote: ""
    })
    const [title, setTitle] = useState("TRIBUTE")
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, []) // Removed unnecessary dependency 'id'

    const fetchTributeTitle = async () => {
        try {
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            setTribute(response.data)
        } catch (error) {
            console.error("Error fetching tribute details:", error)
        }
    }

    const handleInputChange = e => {
        const { id, value } = e.target
        setTribute(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (value, field) => {
        setTribute(prev => ({ ...prev, [field]: value }))
    }

    const handleDateChange = (date, field) => {
        const formattedDate = date ? format(date, "yyyy-MM-dd") : null
        setTribute(prev => ({ ...prev, [field]: formattedDate }))
    }

    const handleFileChange = e => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const formData = new FormData()

        Object.entries(tribute).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value)
        })

        if (file) formData.append("image", file)

        try {
            const response = await axios.post(
                `${server}/tribute/overview/update/${id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )

            if (response.data.status === "success") {
                toast.success("Tribute updated successfully!")
            } else {
                toast.error("Failed to update tribute")
            }
        } catch (error) {
            console.error("Error updating tribute details:", error)
            toast.error(error.response?.data?.message || "Failed to update tribute")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="text-gray-700">Saving changes...</span>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-4xl font-light text-gray-600">{title}</h1>
                    <h2 className="text-2xl font-light text-gray-500">OVERVIEW</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <NameFields
                            tribute={tribute}
                            handleInputChange={handleInputChange}
                        />
                        <RelationshipField
                            tribute={tribute}
                            handleSelectChange={handleSelectChange}
                        />
                        <DateField
                            label="Date of death"
                            value={tribute.date_of_death}
                            onChange={date => handleDateChange(date, "date_of_death")}
                        />
                    </div>

                    <div className="space-y-6">
                        <ImageUpload file={file} handleFileChange={handleFileChange} />
                        <DateField
                            label="Date of Birth"
                            value={tribute.date_of_birth}
                            onChange={date => handleDateChange(date, "date_of_birth")}
                        />
                        <InputField
                            label="State and country lived"
                            id="country_lived"
                            value={tribute.country_lived}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Custom memorial website"
                            id="customMemorialWebsite"
                            value={`www.rememberedalways/tribute/${tribute.first_name}-${tribute.last_name}`}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <QuoteSection
                    quote={tribute.quote}
                    handleInputChange={handleInputChange}
                />

                <div className="flex justify-center space-x-4">
                    <Button
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8"
                        onClick={() => navigate(`/dashboard/tribute-life/${id}`)}
                        disabled={isLoading}
                    >
                        Life of person
                    </Button>
                </div>
            </div>
        </div>
    )
}

const NameFields = ({ tribute, handleInputChange }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["first_name", "middle_name", "last_name", "nickname"].map(field => (
            <InputField
                key={field}
                label={field
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                id={field}
                value={tribute[field]}
                onChange={handleInputChange}
            />
        ))}
    </div>
)

const InputField = ({ label, id, value, onChange }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-gray-700">
            {label}
        </Label>
        <Input
            id={id}
            value={value}
            onChange={onChange}
            className="bg-blue-50 border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
    </div>
)

const RelationshipField = ({ tribute, handleSelectChange }) => (
    <div className="space-y-2">
        <Label className="text-gray-700">Relationship with bereaved</Label>
        <Select
            value={tribute.relationship}
            onValueChange={value => handleSelectChange(value, "relationship")}
        >
            <SelectTrigger className="bg-blue-50 border-blue-100">
                <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-100">
                {["Father", "Mother", "Sibling", "Spouse", "Child"].map(relation => (
                    <SelectItem
                        key={relation.toLowerCase()}
                        value={relation.toLowerCase()}
                    >
                        {relation}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
)

const DateField = ({ label, value, onChange }) => (
    <div className="space-y-2">
        <Label className="text-gray-700">{label}</Label>
        <input
            type="date"
            className="bg-blue-50 border-blue-100 p-2 rounded w-full focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={value || ""}
            onChange={e => onChange(e.target.valueAsDate)}
        />
        {!value && <p className="text-gray-500 text-sm">None</p>}
    </div>
)

const ImageUpload = ({ file, handleFileChange }) => (
    <div className="bg-blue-50 p-6 rounded-lg text-center">
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
            <Button
                variant="ghost"
                className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-blue-700"
            >
                {file ? (
                    <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-lg"
                    />
                ) : (
                    <>
                        <Upload className="h-8 w-8 mb-2" />
                        <span>UPLOAD PERSON'S IMAGE</span>
                    </>
                )}
            </Button>
        </label>
    </div>
)

const QuoteSection = ({ quote, handleInputChange }) => (
    <div className="relative max-w-3xl mx-auto text-center py-8">
        <div className="text-6xl text-blue-200 absolute top-0 left-0">""</div>
        <Input
            placeholder="Enter a short quote about the bereaved or about death"
            className="bg-blue-50 border-blue-100 text-center italic text-lg"
            value={quote}
            onChange={handleInputChange}
            id="quote"
        />
    </div>
)
