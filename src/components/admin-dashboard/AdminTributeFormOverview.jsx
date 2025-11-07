"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import {
    Loader2,
    Upload,
    Calendar,
    User,
    Heart,
    Globe,
    Quote,
    Check,
    AlertCircle,
    ChevronRight,
    HelpCircle,
    LinkIcon,
    Palette,
    Layout,
    Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { server } from "@/server.js"

export default function AdminTributeFormOverview() {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState("basic")
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [formErrors, setFormErrors] = useState({})
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [selectedTheme, setSelectedTheme] = useState(null)
    const [availableThemes, setAvailableThemes] = useState([])
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
        image: null,
    })

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    // Fetch available themes
    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const response = await fetch(`${server}/themes`)
                if (response.ok) {
                    const data = await response.json()
                    setAvailableThemes(data.data || [])
                }
            } catch (error) {
                console.error("Failed to fetch themes:", error)
            }
        }
        fetchThemes()
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))

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
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

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
        const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null
        setFormData((prev) => ({
            ...prev,
            [field]: formattedDate,
        }))

        // Clear error for this field if it exists
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
            if (!validImageTypes.includes(file.type)) {
                toast.error("The image must be a file of type: jpeg, png, jpg, gif.")
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
                setFormData((prev) => ({
                    ...prev,
                    image: file,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        const errors = {}

        // Basic information validation
        if (!formData.firstName.trim()) errors.firstName = "First name is required"
        if (!formData.lastName.trim()) errors.lastName = "Last name is required"
        if (!formData.relationship) errors.relationship = "Relationship is required"
        if (!formData.dateOfDeath) errors.dateOfDeath = "Date of death is required"

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan)
    }

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme)
    }

    const handleNextStep = () => {
        if (activeStep === "basic") {
            if (validateForm()) {
                setActiveStep("additional")
            } else {
                toast.error("Please fill in all required fields")
            }
        } else if (activeStep === "additional") {
            setActiveStep("quote")
        } else if (activeStep === "quote") {
            setActiveStep("plan")
        } else if (activeStep === "plan") {
            setActiveStep("theme")
        }
    }

    const handlePrevStep = () => {
        if (activeStep === "additional") {
            setActiveStep("basic")
        } else if (activeStep === "quote") {
            setActiveStep("additional")
        } else if (activeStep === "plan") {
            setActiveStep("quote")
        } else if (activeStep === "theme") {
            setActiveStep("plan")
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields")
            setActiveStep("basic")
            return
        }

        if (!selectedPlan) {
            toast.error("Please select a plan to continue")
            return
        }

        setIsLoading(true)
        try {
            // Create FormData object to handle file upload
            const formDataToSend = new FormData()
            formDataToSend.append("firstName", formData.firstName)
            formDataToSend.append("middleName", formData.middleName)
            formDataToSend.append("lastName", formData.lastName)
            formDataToSend.append("nickname", formData.nickname)
            formDataToSend.append("relationship", formData.relationship)
            formDataToSend.append("dateOfDeath", formData.dateOfDeath)
            formDataToSend.append("dateOfBirth", formData.dateOfBirth)
            formDataToSend.append("countryOfBirth", formData.countryOfBirth)
            formDataToSend.append("countryDied", formData.countryDied)
            formDataToSend.append("customMemorialWebsite", formData.customMemorialWebsite)
            formDataToSend.append("quote", formData.quote)
            formDataToSend.append("plan", selectedPlan.id)

            // Add theme_id if selected
            if (selectedTheme) {
                formDataToSend.append("theme_id", selectedTheme.id)
            }

            if (formData.image) {
                formDataToSend.append("image", formData.image)
            }

            // Submit the form details
            const response = await fetch(`${server}/admin/tribute/start/${user.id}`, {
                method: "POST",
                body: formDataToSend,
            })

            if (!response.ok) {
                throw new Error("Failed to create tribute")
            }

            const data = await response.json()

            if (data.status === "success") {
                toast.success("Tribute created successfully!")
                // Redirect to the newly created tribute
                if (data.data && data.data.id) {
                    navigate(`/dashboard/tributes/${data.data.id}`)
                } else {
                    navigate("/dashboard/tributes")
                }
            } else {
                throw new Error(data.message || "Failed to create tribute")
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create tribute")
        } finally {
            setIsLoading(false)
        }
    }

    const getStepProgress = () => {
        if (activeStep === "basic") return 20
        if (activeStep === "additional") return 40
        if (activeStep === "quote") return 60
        if (activeStep === "plan") return 80
        if (activeStep === "theme") return 100
        return 0
    }

    return (
        <div className="bg-[#f8f4f0] min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-[#4a5568] mb-2">
                        <span className={activeStep === "basic" ? "font-medium text-[#2a3342]" : ""}>Basic Info</span>
                        <span className={activeStep === "additional" ? "font-medium text-[#2a3342]" : ""}>Additional Details</span>
                        <span className={activeStep === "quote" ? "font-medium text-[#2a3342]" : ""}>Memorial Quote</span>
                        <span className={activeStep === "plan" ? "font-medium text-[#2a3342]" : ""}>Select Plan</span>
                        <span className={activeStep === "theme" ? "font-medium text-[#2a3342]" : ""}>Choose Theme</span>
                    </div>
                    <Progress value={getStepProgress()} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                </div>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-3xl font-serif text-[#2a3342]">Create A Tribute</CardTitle>
                        <CardDescription className="text-[#4a5568]">
                            Honour your loved one's memory with a beautiful online tribute
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
                            <TabsContent value="basic" className="mt-0 space-y-6">
                                <BasicInfoSection
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    handleSelectChange={handleSelectChange}
                                    handleDateChange={handleDateChange}
                                    formErrors={formErrors}
                                />
                            </TabsContent>

                            <TabsContent value="additional" className="mt-0 space-y-6">
                                <AdditionalDetailsSection
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    handleDateChange={handleDateChange}
                                    imagePreview={imagePreview}
                                    handleImageChange={handleImageChange}
                                    formErrors={formErrors}
                                />
                            </TabsContent>

                            <TabsContent value="quote" className="mt-0 space-y-6">
                                <QuoteSection quote={formData.quote} handleInputChange={handleInputChange} />
                            </TabsContent>

                            <TabsContent value="plan" className="mt-0 space-y-6">
                                <PricingPlansSection selectedPlan={selectedPlan} handlePlanSelect={handlePlanSelect} />
                            </TabsContent>

                            <TabsContent value="theme" className="mt-0 space-y-6">
                                <ThemeSelectionSection
                                    selectedTheme={selectedTheme}
                                    handleThemeSelect={handleThemeSelect}
                                    availableThemes={availableThemes}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse sm:flex-row justify-between items-center border-t p-6 gap-4">
                        {activeStep !== "basic" && (
                            <Button
                                variant="outline"
                                onClick={handlePrevStep}
                                className="w-full sm:w-auto border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                            >
                                Back
                            </Button>
                        )}

                        <div className="flex gap-3 w-full sm:w-auto">
                            {activeStep !== "theme" ? (
                                <Button
                                    onClick={handleNextStep}
                                    className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                >
                                    Continue <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !selectedPlan}
                                    className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    {isLoading ? "Creating Tribute..." : "Create Tribute"} <Heart className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

const BasicInfoSection = ({ formData, handleInputChange, handleSelectChange, handleDateChange, formErrors }) => (
    <div className="space-y-6">
        <div className="bg-[#f8f4f0] p-6 rounded-lg">
            <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-xl font-medium text-[#2a3342]">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="First Name"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    error={formErrors.firstName}
                />
                <InputField label="Middle Name" id="middleName" value={formData.middleName} onChange={handleInputChange} />
                <InputField
                    label="Last Name"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    error={formErrors.lastName}
                />
                <InputField label="Nickname" id="nickname" value={formData.nickname} onChange={handleInputChange} />
            </div>
        </div>

        <div className="bg-[#f8f4f0] p-6 rounded-lg">
            <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-xl font-medium text-[#2a3342]">Relationship</h3>
            </div>

            <RelationshipField
                value={formData.relationship}
                onChange={(value) => handleSelectChange(value, "relationship")}
                error={formErrors.relationship}
            />
        </div>

        <div className="bg-[#f8f4f0] p-6 rounded-lg">
            <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-xl font-medium text-[#2a3342]">Important Date</h3>
            </div>

            <DateField
                label="Date of Death"
                value={formData.dateOfDeath}
                onChange={(date) => handleDateChange(date, "dateOfDeath")}
                required
                error={formErrors.dateOfDeath}
            />
        </div>

        <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
            <AlertCircle className="h-4 w-4 text-[#fcd34d]" />
            <AlertDescription className="text-[#4a5568]">
                Please provide accurate information to create a meaningful tribute for your loved one.
            </AlertDescription>
        </Alert>
    </div>
)

const AdditionalDetailsSection = ({
                                      formData,
                                      handleInputChange,
                                      handleDateChange,
                                      imagePreview,
                                      handleImageChange,
                                      formErrors,
                                  }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div className="bg-[#f8f4f0] p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Calendar className="h-5 w-5 text-[#fcd34d] mr-2" />
                        <h3 className="text-xl font-medium text-[#2a3342]">Birth Information</h3>
                    </div>

                    <DateField
                        label="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(date) => handleDateChange(date, "dateOfBirth")}
                    />

                    <div className="mt-4">
                        <InputField
                            label="Country of Birth"
                            id="countryOfBirth"
                            value={formData.countryOfBirth}
                            onChange={handleInputChange}
                            icon={<Globe className="h-4 w-4 text-[#fcd34d]" />}
                        />
                    </div>
                </div>

                <div className="bg-[#f8f4f0] p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Globe className="h-5 w-5 text-[#fcd34d] mr-2" />
                        <h3 className="text-xl font-medium text-[#2a3342]">Country of Death</h3>
                    </div>

                    <InputField
                        label="Country Died"
                        id="countryDied"
                        value={formData.countryDied}
                        onChange={handleInputChange}
                        icon={<Globe className="h-4 w-4 text-[#fcd34d]" />}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <ImageUpload imagePreview={imagePreview} onChange={handleImageChange} />

                <div className="bg-[#f8f4f0] p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <LinkIcon className="h-5 w-5 text-[#fcd34d] mr-2" />
                        <h3 className="text-xl font-medium text-[#2a3342]">Memorial Website</h3>
                    </div>

                    <InputField
                        label="Custom Memorial URL"
                        id="customMemorialWebsite"
                        value={
                            formData.customMemorialWebsite ||
                            `www.rememberedalways.org/tribute/${formData.firstName?.toLowerCase() || ""}-${formData.lastName?.toLowerCase() || ""}`
                        }
                        onChange={handleInputChange}
                        icon={<LinkIcon className="h-4 w-4 text-[#fcd34d]" />}
                        disabled
                    />
                    <p className="text-sm text-[#4a5568] mt-2">This is the unique URL for your tribute page</p>
                </div>
            </div>
        </div>
    </div>
)

const InputField = ({ label, id, value, onChange, icon, required = false, error, disabled = false }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-[#2a3342] flex items-center">
            {label} {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative">
            <Input
                id={id}
                value={value || ""}
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

const RelationshipField = ({ value, onChange, error }) => (
    <div className="space-y-2">
        <Label className="text-[#2a3342] flex items-center">
            Relationship with bereaved
            <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={`border-[#e5e0d9] ${error ? "border-red-300" : ""}`}>
                <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent className={`bg-white`}>
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
            {label} {required && <span className="text-red-500 ml-1">*</span>}
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

const ImageUpload = ({ imagePreview, onChange }) => (
    <div className="bg-[#f8f4f0] p-6 rounded-lg">
        <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-[#fcd34d] mr-2" />
            <h3 className="text-xl font-medium text-[#2a3342]">Profile Image</h3>
        </div>
        <p className="text-[#4a5568] mb-4">Upload a memorable photo of your loved one</p>

        <div className="relative bg-white border border-dashed border-[#e5e0d9] rounded-lg overflow-hidden">
            <input type="file" id="image" accept="image/*" className="hidden" onChange={onChange} />
            <label htmlFor="image" className="cursor-pointer block w-full h-full min-h-[300px]">
                {imagePreview ? (
                    <div className="relative group">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-[300px] object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="h-6 w-6 text-[#fcd34d]" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                        <div className="bg-[#f0ece6] rounded-full p-4 mb-4">
                            <Upload className="h-8 w-8 text-[#fcd34d]" />
                        </div>
                        <h4 className="font-medium text-[#2a3342] mb-2">Upload Photo</h4>
                        <p className="text-[#4a5568] text-sm text-center max-w-xs">
                            Drag and drop an image here, or click to browse your files
                        </p>
                        <p className="text-[#4a5568] text-xs mt-4">Supported formats: JPG, PNG, GIF</p>
                    </div>
                )}
            </label>
        </div>
    </div>
)

const QuoteSection = ({ quote, handleInputChange }) => (
    <div className="bg-[#f8f4f0] p-6 rounded-lg">
        <div className="flex items-center mb-4">
            <Quote className="h-5 w-5 text-[#fcd34d] mr-2" />
            <h3 className="text-xl font-medium text-[#2a3342]">Memorial Quote</h3>
        </div>
        <p className="text-[#4a5568] mb-6">
            Add a meaningful quote that captures the essence of your loved one or provides comfort to visitors.
        </p>

        <div className="relative max-w-3xl mx-auto text-center py-8">
            <div className="text-6xl text-[#e5e0d9] absolute top-0 left-0">"</div>
            <div className="text-6xl text-[#e5e0d9] absolute bottom-0 right-0">"</div>
            <Textarea
                placeholder="Enter a meaningful quote that captures the essence of your loved one..."
                className="bg-white border-[#e5e0d9] text-center italic text-lg min-h-[150px] resize-none px-12 py-6 focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                value={quote}
                onChange={handleInputChange}
                id="quote"
            />
            <p className="text-sm text-[#4a5568] mt-4">This quote will be displayed prominently on your tribute page</p>
        </div>
    </div>
)

const PricingPlansSection = ({ selectedPlan, handlePlanSelect }) => {
    const plans = [
        {
            id: "free",
            name: "Basic",
            description: "For individuals creating a single memorial",
            features: [
                "1 memorial page",
                "Basic customization",
                "Photo gallery (up to 50 photos)",
                "Visitor guestbook",
                "Share on social media",
            ],
        },
        {
            id: "premium",
            name: "Premium",
            description: "For families wanting enhanced features",
            features: [
                "3 memorial pages",
                "Advanced customization",
                "Unlimited photos and videos",
                "Timeline of life events",
                "Donation collection",
                "Remove ads",
            ],
            popular: true,
        },
        {
            id: "one_time",
            name: "One-Time Service",
            description: "For those who need a single memorial service",
            features: [
                "Professional memorial design",
                "Event coordination",
                "Photo and video compilation",
                "Printed memorial booklets",
                "30-day online memorial page",
                "Technical support",
            ],
        },
    ]

    return (
        <div className="space-y-8">
            <div className="bg-[#f8f4f0] p-6 rounded-lg">
                <div className="flex items-center mb-4">
                    <Layout className="h-5 w-5 text-[#fcd34d] mr-2" />
                    <h3 className="text-xl font-medium text-[#2a3342]">Select Your Plan</h3>
                </div>
                <p className="text-[#4a5568] mb-6">Choose the perfect plan to honour and celebrate your loved one's memory</p>

                <RadioGroup
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    value={selectedPlan?.id}
                    onValueChange={(value) => handlePlanSelect(plans.find((plan) => plan.id === value))}
                >
                    {plans.map((plan) => (
                        <div key={plan.id} className="relative">
                            <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                            <Label
                                htmlFor={plan.id}
                                className={`flex flex-col h-full bg-white border rounded-lg p-6 cursor-pointer transition-all ${
                                    selectedPlan?.id === plan.id
                                        ? "border-[#fcd34d] ring-2 ring-[#fcd34d] shadow-lg"
                                        : "border-[#e5e0d9] hover:border-[#fcd34d] hover:shadow-md"
                                }`}
                            >
                                {plan.popular && <Badge className="absolute -top-3 right-4 bg-[#fcd34d]">Popular</Badge>}
                                <div className="mb-4">
                                    <h4 className="text-xl font-medium text-[#2a3342]">{plan.name}</h4>
                                    <div className="mt-2 text-2xl font-bold text-[#2a3342]">
                                        {plan.id === "free" ? "Free" : "Included"}
                                    </div>
                                    <p className="text-sm text-[#4a5568] mt-1">{plan.description}</p>
                                </div>
                                <div className="flex-grow space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center">
                                            <Check className="h-5 w-5 text-[#fcd34d] mr-3 flex-shrink-0" />
                                            <span className="text-[#4a5568]">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
                <div className="flex items-start">
                    <HelpCircle className="h-5 w-5 text-[#fcd34d] mr-3 mt-0.5 flex-shrink-0" />
                    <AlertDescription className="text-[#4a5568]">
                        <p className="font-medium text-[#2a3342] mb-1">Plan Information</p>
                        The Premium plan is our most popular option as it provides all the essential features for creating a
                        meaningful memorial, including unlimited photos and videos, timeline of life events, and donation
                        collection.
                    </AlertDescription>
                </div>
            </Alert>
        </div>
    )
}

const ThemeSelectionSection = ({ selectedTheme, handleThemeSelect, availableThemes }) => {
    const defaultThemes = [
        {
            id: "minimalist",
            name: "Minimalist",
            description: "Clean and simple design with elegant typography",
            colors: {
                primary: "#1f2937",
                background: "#f9fafb",
                accent: "#4f46e5"
            },
            layout_type: "single"
        },
        {
            id: "classic",
            name: "Classic",
            description: "Traditional design with warm, comforting colors",
            colors: {
                primary: "#7c2d12",
                background: "#fef7ed",
                accent: "#ea580c"
            },
            layout_type: "single"
        },
        {
            id: "modern",
            name: "Modern",
            description: "Contemporary design with bold colors and layout",
            colors: {
                primary: "#1e40af",
                background: "#eff6ff",
                accent: "#3b82f6"
            },
            layout_type: "tabs"
        }
    ]

    const themes = availableThemes.length > 0 ? availableThemes : defaultThemes

    return (
        <div className="space-y-8">
            <div className="bg-[#f8f4f0] p-6 rounded-lg">
                <div className="flex items-center mb-4">
                    <Palette className="h-5 w-5 text-[#fcd34d] mr-2" />
                    <h3 className="text-xl font-medium text-[#2a3342]">Choose a Theme</h3>
                </div>
                <p className="text-[#4a5568] mb-6">
                    Select a theme that best reflects your loved one's personality and style. You can customize this later.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all ${
                                selectedTheme?.id === theme.id
                                    ? "border-[#fcd34d] ring-2 ring-[#fcd34d] shadow-lg"
                                    : "border-[#e5e0d9] hover:border-[#fcd34d] hover:shadow-md"
                            }`}
                            onClick={() => handleThemeSelect(theme)}
                        >
                            {/* Theme Preview */}
                            <div className="h-32 relative" style={{ backgroundColor: theme.colors?.background || "#f9fafb" }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: theme.colors?.primary || "#1f2937" }}
                                    >
                                        M
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2">
                                    <Badge variant="outline" className="text-xs bg-white/80">
                                        {theme.layout_type === 'tabs' ? 'Tabbed' : 'Single Page'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-[#2a3342]">{theme.name}</h4>
                                    {selectedTheme?.id === theme.id && (
                                        <Check className="h-5 w-5 text-[#fcd34d]" />
                                    )}
                                </div>
                                <p className="text-sm text-[#4a5568] mb-3">{theme.description}</p>

                                {/* Color Palette Preview */}
                                <div className="flex space-x-1 mb-3">
                                    {Object.values(theme.colors || {}).slice(0, 3).map((color, index) => (
                                        <div
                                            key={index}
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center text-xs text-[#4a5568]">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Click to preview
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
                <div className="flex items-start">
                    <HelpCircle className="h-5 w-5 text-[#fcd34d] mr-3 mt-0.5 flex-shrink-0" />
                    <AlertDescription className="text-[#4a5568]">
                        <p className="font-medium text-[#2a3342] mb-1">Theme Selection</p>
                        Don't worry if you're not sure which theme to choose - you can always change it later and customize
                        the appearance of your tribute page in the theme editor.
                    </AlertDescription>
                </div>
            </Alert>
        </div>
    )
}