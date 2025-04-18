import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import {Loader2, Upload, Calendar, Globe, LinkIcon, ChevronRight} from "lucide-react"
import { server } from "@/server.js"
import { assetServer } from "@/assetServer.js"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"

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
        date_of_death: "",
        date_of_birth: "",
        country_of_birth: "",
        country_died: "",
        customMemorialWebsite: "",
        quote: ""
    })
    const [title, setTitle] = useState("TRIBUTE")
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
            setTitle(response.data.title[0] || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            const tributeData = response.data
            setTribute({
                ...tributeData,
                date_of_death: tributeData.date_of_death
                    ? format(new Date(tributeData.date_of_death), "yyyy-MM-dd")
                    : "",
                date_of_birth: tributeData.date_of_birth
                    ? format(new Date(tributeData.date_of_birth), "yyyy-MM-dd")
                    : ""
            })
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
        setTribute(prev => ({ ...prev, [field]: date }))
    }

    const handleFileChange = e => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const formData = new FormData()

        Object.entries(tribute).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value)
        })

        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
            if (!validImageTypes.includes(file.type)) {
                toast({
                    title: "Error",
                    description: "Invalid image type. Please upload a jpeg, png, jpg, or gif file.",
                    variant: "destructive"
                })
                setIsLoading(false)
                return
            }
            formData.append("image", file)
        }

        try {
            const response = await axios.post(
                `${server}/tribute/overview/update/${id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )

            if (response.data.status === "success") {
                toast.success("Tribute updated successfully")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error("Error updating tribute details:", error)
            // toast({
            //     title: "Error",
            //     description: "Failed to update tribute. Please try again.",
            //     variant: "destructive"
            // })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card className="p-0">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                            {title}
                        </CardTitle>
                        <p className="text-xl text-warm-600 text-center">OVERVIEW</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
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
                                <InputField
                                    label="Country of birth"
                                    id="country_of_birth"
                                    value={tribute.country_of_birth}
                                    onChange={handleInputChange}
                                    icon={<Globe className="h-4 w-4 text-warm-500" />}
                                />
                            </div>

                            <div className="space-y-6">
                                <ImageUpload
                                    imagePreview={imagePreview}
                                    tributeImage={tribute.image}
                                    handleFileChange={handleFileChange}
                                />
                                <DateField
                                    label="Date of Birth"
                                    value={tribute.date_of_birth}
                                    onChange={date => handleDateChange(date, "date_of_birth")}
                                />
                                <InputField
                                    label="Country died"
                                    id="country_died"
                                    value={tribute.country_died}
                                    onChange={handleInputChange}
                                    icon={<Globe className="h-4 w-4 text-warm-500" />}
                                />
                                <InputField
                                    label="Custom memorial website"
                                    id="customMemorialWebsite"
                                    value={`www.rememberedalways/tribute/${tribute.first_name}-${tribute.last_name}`}
                                    onChange={handleInputChange}
                                    icon={<LinkIcon className="h-4 w-4 text-warm-500" />}
                                />
                            </div>
                        </div>

                        <QuoteSection
                            quote={tribute.quote}
                            handleInputChange={handleInputChange}
                        />

                        <div className="flex justify-center space-x-4">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="bg-warm-500 hover:bg-warm-600 "
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                onClick={() => navigate(`/dashboard/tribute-life/${id}`)}
                                disabled={isLoading}
                                variant="outline"
                                className="text-warm-700"
                            >
                                Life of person <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
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

const InputField = ({ label, id, value, onChange, icon }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-warm-700">
            {label}
        </Label>
        <div className="relative">
            <Input
                id={id}
                value={value}
                onChange={onChange}
                className="pl-8 border-warm-200 focus:border-warm-300 focus:ring focus:ring-warm-200 focus:ring-opacity-50"
            />
            {icon && (
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    {icon}
                </div>
            )}
        </div>
    </div>
)

const RelationshipField = ({ tribute, handleSelectChange }) => (
    <div className="space-y-2">
        <Label className="text-warm-700">Relationship with bereaved</Label>
        <Select
            value={tribute.relationship}
            onValueChange={value => handleSelectChange(value, "relationship")}
        >
            <SelectTrigger className="border-warm-200">
                <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
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
        <Label className="text-warm-700">{label}</Label>
        <div className="relative">
            <Input
                type="date"
                className="pl-8 border-warm-200 focus:border-warm-300 focus:ring focus:ring-warm-200 focus:ring-opacity-50"
                value={value || ""}
                onChange={e => onChange(e.target.value)}
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-warm-500" />
        </div>
    </div>
)

const ImageUpload = ({ imagePreview, tributeImage, handleFileChange }) => (
    <div className="relative bg-warm-100 p-6 rounded-lg text-center">
        <input
            type="file"
            id="image"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
        />
        <label
            htmlFor="image"
            className="cursor-pointer block w-full h-full min-h-[200px]"
        >
            {imagePreview || tributeImage ? (
                <img
                    src={imagePreview || `${assetServer}/images/people/${tributeImage}`}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <Upload className="h-8 w-8 mb-2 text-warm-500" />
                    <span className="text-warm-500">UPLOAD PERSON'S IMAGE</span>
                </div>
            )}
        </label>
    </div>
)

const QuoteSection = ({ quote, handleInputChange }) => (
    <div className="relative max-w-3xl mx-auto text-center py-8">
        <div className="text-6xl text-warm-200 absolute top-0 left-0">""</div>
        <Textarea
            placeholder="Enter a short quote about the bereaved or about death"
            className="bg-warm-50 border-warm-100 text-center italic text-lg min-h-[100px] resize-none"
            value={quote}
            onChange={handleInputChange}
            id="quote"
        />
    </div>
)
