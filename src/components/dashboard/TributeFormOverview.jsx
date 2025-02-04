import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { Loader2, Upload, Check } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { server } from "@/server.js"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"

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

    const handleInputChange = e => {
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

    const handleImageChange = event => {
        const file = event.target.files?.[0]
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
            if (!validImageTypes.includes(file.type)) {
                toast({
                    title: "Error",
                    description: "The image field must be a file of type: jpeg, png, jpg, gif.",
                    variant: "destructive"
                })
                return
            }

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

    const handleSubmit = async (plan, price) => {
        setIsLoading(true)
        try {
            if (!formData.firstName || !formData.lastName) {
                throw new Error("First name and last name are required")
            }

            // Convert price to kobo (Paystack expects the amount in the smallest currency unit)
            const amountInKobo = Math.round(price * 100)

            // Create FormData object to handle file upload
            const formDataToSend = new FormData()
            formDataToSend.append('firstName', formData.firstName)
            formDataToSend.append('middleName', formData.middleName)
            formDataToSend.append('lastName', formData.lastName)
            formDataToSend.append('nickname', formData.nickname)
            formDataToSend.append('relationship', formData.relationship)
            formDataToSend.append('dateOfDeath', formData.dateOfDeath)
            formDataToSend.append('dateOfBirth', formData.dateOfBirth)
            formDataToSend.append('countryOfBirth', formData.countryOfBirth)
            formDataToSend.append('countryDied', formData.countryDied)
            formDataToSend.append('customMemorialWebsite', formData.customMemorialWebsite)
            formDataToSend.append('quote', formData.quote)
            formDataToSend.append('plan', plan)
            formDataToSend.append('price', amountInKobo)
            if (formData.image) {
                formDataToSend.append('image', formData.image)
            }

            // Submit the form details
            const response = await fetch(`${server}/tribute/start/${user.id}`, {
                method: "POST",
                body: formDataToSend
            })

            if (!response.ok) {
                throw new Error("Failed to submit form")
            }

            const data = await response.json()

            if (data.status === 'success') {
                // Redirect to Paystack payment page
                window.location.href = data.payment_url
            } else {
                throw new Error("Payment initiation failed")
            }
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Failed to save memory",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-warm-800">
                            Create A Tribute
                        </CardTitle>
                        <CardDescription className="text-warm-600">
                            Provide details about your loved one
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <NameFields formData={formData} onChange={handleInputChange} />
                                <RelationshipField
                                    value={formData.relationship}
                                    onChange={value => handleSelectChange(value, "relationship")}
                                />
                                <DateField
                                    label="Date of Death"
                                    value={formData.dateOfDeath}
                                    onChange={date => handleDateChange(date, "dateOfDeath")}
                                />
                                <InputField
                                    label="Country of Birth"
                                    id="countryOfBirth"
                                    value={formData.countryOfBirth}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-6">
                                {/*<ImageUpload*/}
                                {/*    imagePreview={imagePreview}*/}
                                {/*    onChange={handleImageChange}*/}
                                {/*/>*/}
                                <DateField
                                    label="Date of Birth"
                                    value={formData.dateOfBirth}
                                    onChange={date => handleDateChange(date, "dateOfBirth")}
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
                                    value={
                                        formData.customMemorialWebsite ||
                                        `www.rememberedalways.com/tribute/${formData.firstName?.toLowerCase()}-${formData.lastName?.toLowerCase()}`
                                    }
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                        </div>
                        <QuoteSection quote={formData.quote} onChange={handleInputChange} />

                        <PricingPlans handleSubmit={handleSubmit} />

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const NameFields = ({ formData, onChange }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["firstName", "middleName", "lastName", "nickname"].map(field => (
            <InputField
                key={field}
                label={field
                    .split(/(?=[A-Z])/)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                id={field}
                value={formData[field]}
                onChange={onChange}
                required={field === "firstName" || field === "lastName"}
            />
        ))}
    </div>
)

const InputField = ({
                        label,
                        id,
                        value,
                        onChange,
                        required = false,
                        disabled = false
                    }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-warm-700">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
            id={id}
            value={value || ""}
            onChange={onChange}
            className="border-warm-200 focus:border-warm-300 focus:ring focus:ring-warm-200 focus:ring-opacity-50"
            disabled={disabled}
        />
    </div>
)

const RelationshipField = ({ value, onChange }) => (
    <div className="space-y-2">
        <Label className="text-warm-700">Relationship with bereaved</Label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="border-warm-200">
                <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
                {[
                    "Father",
                    "Mother",
                    "Sibling",
                    "Spouse",
                    "Child",
                    "Friend",
                    "Other"
                ].map(relation => (
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
        <Input
            type="date"
            className="border-warm-200 focus:border-warm-300 focus:ring focus:ring-warm-200 focus:ring-opacity-50"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
        />
    </div>
)

const ImageUpload = ({ imagePreview, onChange }) => (
    <div className="relative bg-warm-100 p-6 rounded-lg text-center">
        <input
            type="file"
            id="image"
            accept="image/*"
            className="hidden"
            onChange={onChange}
        />
        <label
            htmlFor="image"
            className="cursor-pointer block w-full h-full min-h-[200px]"
        >
            {imagePreview ? (
                <img
                    src={imagePreview || "/placeholder.svg"}
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

const QuoteSection = ({ quote, onChange }) => (
    <div className="relative max-w-3xl mx-auto text-center py-8">
        <div className="text-6xl text-warm-200 absolute top-0 left-0">""</div>
        <Textarea
            placeholder="Enter a short quote about the bereaved or about death"
            className="min-h-[100px] border-warm-200 text-center italic text-lg resize-none"
            value={quote}
            onChange={onChange}
            id="quote"
        />
    </div>
)

const PricingPlans = ({ handleSubmit }) => (
    <div className="mt-16">
        <h2 className="text-2xl font-semibold text-warm-800 mb-8 text-center">
            Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {
                    name: "Basic",
                    price: 999, // price in cents
                    features: ["Feature 1", "Feature 2", "Feature 3"]
                },
                {
                    name: "Pro",
                    price: 1999, // price in cents
                    features: ["All Basic features", "Feature 4", "Feature 5"]
                },
                {
                    name: "Premium",
                    price: 2999, // price in cents
                    features: ["All Pro features", "Feature 6", "Feature 7"]
                }
            ].map(plan => (
                <Card key={plan.name} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-warm-700">
                            {plan.name}
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold text-warm-800">
                            ${plan.price / 100}/month
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-warm-600">
                                    <Check className="h-5 w-5 text-warm-500 mr-2" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-warm-500 hover:bg-warm-600"
                            onClick={() => handleSubmit(plan.name, plan.price)}
                        >
                            Start Tribute
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
)