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
    Palette,
    Check,
    AlertCircle,
    ChevronRight,
    HelpCircle,
    LinkIcon,
    CreditCard,
    Eye,
    ChevronDown,
    ChevronUp,
    X,
    Layout,
    Crown,
    Zap,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { server } from "@/server.js"
import axios from "axios"
import ThemePreviewModal from "@/components/main-dashboard/ThemePreviewModal"

// Default theme images (fallback)
const defaultThemeImages = {
    serenity: "/images/themes/serenity-thumb.jpg",
    classic: "/images/themes/classic-thumb.jpg",
    vibrant: "/images/themes/vibrant-thumb.jpg",
    modern: "/images/themes/modern-thumb.jpg",
    celestial: "/images/themes/celestial-thumb.jpg",
}

export default function TributeFormOverview() {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState("subscription-check")
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [formErrors, setFormErrors] = useState({})
    const [selectedTheme, setSelectedTheme] = useState(null)
    const [themes, setThemes] = useState([])
    const [loadingThemes, setLoadingThemes] = useState(true)
    const [subscriptionStatus, setSubscriptionStatus] = useState(null)
    const [loadingSubscription, setLoadingSubscription] = useState(true)
    const [previewTheme, setPreviewTheme] = useState(null)

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

    // Check subscription status on component mount
    useEffect(() => {
        checkSubscriptionStatus()
    }, [])

    const checkSubscriptionStatus = async () => {
        try {
            setLoadingSubscription(true);
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication error. Please log in again.");
                setLoadingSubscription(false);
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${server}/users/${user.id}/subscriptions`, config);
            
            const subscriptions = response.data;
            const activeSubscription = Array.isArray(subscriptions) 
                ? subscriptions.find(sub => sub.status === 'active')
                : null;

            if (activeSubscription && activeSubscription.tributes > 0) {
                setSubscriptionStatus({
                    has_active_subscription: true,
                    active_subscription: activeSubscription,
                    available_tributes: activeSubscription.tributes
                });
                setActiveStep("basic");
            } else {
                const availableTributes = activeSubscription ? activeSubscription.tributes : 0;
                setSubscriptionStatus({
                    has_active_subscription: !!activeSubscription,
                    active_subscription: activeSubscription,
                    available_tributes: availableTributes,
                    subscription_options: null
                });
                setActiveStep("subscription-required");
            }
        } catch (error) {
            console.error("Failed to check subscription:", error);
            toast.error("Failed to check subscription status.");
            setSubscriptionStatus({
                has_active_subscription: false,
                active_subscription: null,
                available_tributes: 0,
            });
            setActiveStep("subscription-required");
        } finally {
            setLoadingSubscription(false);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
        if (formErrors[id]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[id]
                return newErrors
            })
        }
    }

    const handleSelectChange = (value, field) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
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
        setFormData((prev) => ({ ...prev, [field]: formattedDate }))
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
                setFormData((prev) => ({ ...prev, image: file }))
            }
            reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        const errors = {}
        if (!formData.firstName.trim()) errors.firstName = "First name is required"
        if (!formData.lastName.trim()) errors.lastName = "Last name is required"
        if (!formData.relationship) errors.relationship = "Relationship is required"
        if (!formData.dateOfDeath) errors.dateOfDeath = "Date of death is required"
        setFormErrors(errors)
        return Object.keys(errors).length === 0
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
            setActiveStep("theme")
        } else if (activeStep === "theme") {
            if (!selectedTheme) {
                toast.error("Please select a theme to continue")
                return
            }
            setActiveStep("overview")
        }
    }

    const handlePrevStep = () => {
        if (activeStep === "additional") setActiveStep("basic")
        else if (activeStep === "quote") setActiveStep("additional")
        else if (activeStep === "theme") setActiveStep("quote")
        else if (activeStep === "overview") setActiveStep("theme")
    }

    const handleFinalSubmit = async () => {
        setIsLoading(true)
        toast.loading("Creating tribute...")

        try {
            const formDataToSend = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    formDataToSend.append(key, value)
                }
            })
            formDataToSend.append("theme_id", selectedTheme.id)

            const response = await axios.post(`${server}/tribute/start/${user.id}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.data.status === 'success') {
                toast.dismiss()
                toast.success("Tribute created successfully!")
                const slug = `${formData.firstName}-${formData.lastName}`.toLowerCase().replace(/\s+/g, '-');
                navigate(`/tribute/${slug}`);
            } else {
                throw new Error(response.data.message)
            }
        } catch (error) {
            console.error("Tribute creation failed:", error)
            toast.dismiss()

            if (error.response?.status === 402) {
                if (error.response.data.status === 'subscription_required') {
                    setSubscriptionStatus(prev => ({
                        ...prev,
                        subscription_options: error.response.data.subscription_options
                    }))
                    setActiveStep("subscription-required")
                }
            } else {
                toast.error(error.response?.data?.message || "An error occurred while creating the tribute.")
            }
            setIsLoading(false)
        }
    }

    const getStepProgress = () => {
        const steps = {
            "subscription-check": 0,
            "subscription-required": 0,
            "basic": 20,
            "additional": 40,
            "quote": 60,
            "theme": 80,
            "overview": 100
        }
        return steps[activeStep] || 0
    }

    // Fetch themes from backend
    useEffect(() => {
        const fetchThemes = async () => {
            try {
                setLoadingThemes(true)
                const response = await fetch(`${server}/themes`)
                if (!response.ok) {
                    throw new Error('Failed to fetch themes')
                }
                const themesData = await response.json()
                const themesFromBackend = themesData.data || []

                const themesWithImages = themesFromBackend.map(theme => ({
                    id: theme.id,
                    name: theme.name,
                    description: theme.description || "A beautiful memorial theme",
                    allowed_plans: theme.allowed_plans || ['free'],
                    colors: theme.colors || {
                        primary: '#1f2937',
                        background: '#f9fafb',
                        card: '#ffffff',
                        text: '#374151',
                        accent: '#4f46e5'
                    },
                    layout_type: theme.layout_type || 'single',
                    image: theme.image_url || defaultThemeImages[theme.id] || defaultThemeImages.serenity,
                    is_active: theme.is_active !== false
                }))

                setThemes(themesWithImages.filter(theme => theme.is_active))
            } catch (error) {
                console.error("Failed to fetch themes:", error)
                toast.error("Could not load themes. Please try again later.")
            } finally {
                setLoadingThemes(false)
            }
        }

        if (activeStep === "theme" || activeStep === "overview") {
            fetchThemes()
        }
    }, [activeStep])

    if (loadingSubscription) {
        return (
            <div className="min-h-screen bg-[#f8f4f0] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#fcd34d] mx-auto mb-4" />
                    <p className="text-[#4a5568]">Checking your subscription status...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#f8f4f0] min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {activeStep !== "subscription-check" && activeStep !== "subscription-required" && (
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-[#4a5568] mb-2">
                            <span className={activeStep === "basic" ? "font-medium text-[#2a3342]" : ""}>Basic Info</span>
                            <span className={activeStep === "additional" ? "font-medium text-[#2a3342]" : ""}>Details</span>
                            <span className={activeStep === "quote" ? "font-medium text-[#2a3342]" : ""}>Quote</span>
                            <span className={activeStep === "theme" ? "font-medium text-[#2a3342]" : ""}>Theme</span>
                            <span className={activeStep === "overview" ? "font-medium text-[#2a3342]" : ""}>Overview</span>
                        </div>
                        <Progress value={getStepProgress()} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                    </div>
                )}

                <Card className="border-none shadow-lg bg-white">
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-3xl font-serif text-[#2a3342]">Create A Tribute</CardTitle>
                        <CardDescription className="text-[#4a5568]">
                            Honour your loved one's memory with a beautiful online tribute
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
                            {/* Subscription Required Step */}
                            <TabsContent value="subscription-required" className="mt-0">
                                <SubscriptionRequiredSection
                                    subscriptionStatus={subscriptionStatus}
                                    onCheckAgain={checkSubscriptionStatus}
                                />
                            </TabsContent>

                            {/* Basic Info Step */}
                            <TabsContent value="basic" className="mt-0 space-y-6">
                                <BasicInfoSection
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    handleSelectChange={handleSelectChange}
                                    handleDateChange={handleDateChange}
                                    formErrors={formErrors}
                                />
                            </TabsContent>

                            {/* Additional Details Step */}
                            <TabsContent value="additional" className="mt-0 space-y-6">
                                <AdditionalDetailsSection
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    handleDateChange={handleDateChange}
                                    imagePreview={imagePreview}
                                    handleImageChange={handleImageChange}
                                />
                            </TabsContent>

                            {/* Quote Step */}
                            <TabsContent value="quote" className="mt-0 space-y-6">
                                <QuoteSection quote={formData.quote} handleInputChange={handleInputChange} />
                            </TabsContent>

                            {/* Theme Selection Step */}
                            <TabsContent value="theme" className="mt-0 space-y-6">
                                <ThemeSelectionSection
                                    themes={themes}
                                    selectedTheme={selectedTheme}
                                    onThemeSelect={setSelectedTheme}
                                    onPreviewTheme={setPreviewTheme}
                                    loadingThemes={loadingThemes}
                                />
                            </TabsContent>

                            {/* Overview Step */}
                            <TabsContent value="overview" className="mt-0 space-y-6">
                                <OverviewSection
                                    formData={formData}
                                    selectedTheme={selectedTheme}
                                    subscriptionStatus={subscriptionStatus}
                                    imagePreview={imagePreview}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    {/* Navigation Footer */}
                    {activeStep !== "subscription-required" && activeStep !== "subscription-check" && (
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
                                {activeStep !== "overview" ? (
                                    <Button
                                        onClick={handleNextStep}
                                        className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                    >
                                        Continue <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleFinalSubmit}
                                        disabled={isLoading}
                                        className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Create Tribute
                                        <Heart className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>

            {/* Theme Preview Modal */}
            {previewTheme && (
                <ThemePreviewModal
                    theme={previewTheme}
                    onClose={() => setPreviewTheme(null)}
                />
            )}
        </div>
    )
}

// New Subscription Required Section
const SubscriptionRequiredSection = ({ subscriptionStatus, onCheckAgain }) => {
    const navigate = useNavigate()

    const handlePurchasePlan = async (planType) => {
        try {
            const response = await axios.post(`${server}/purchase-additional-tribute`, {
                plan_type: planType
            })

            if (response.data.payment_url) {
                window.location.href = response.data.payment_url
            }
        } catch (error) {
            console.error("Failed to initiate payment:", error)
            toast.error("Failed to initiate payment. Please try again.")
        }
    }

    const subscriptionOptions = subscriptionStatus?.subscription_options || {
        free: { name: 'Free Plan', tributes: 1, price: 0, features: ['Basic features', '1 tribute'] },
        premium: { name: 'Premium Plan', tributes: 3, price: 1000, features: ['3 tributes', 'Unlimited photos', 'Priority support'] },
        one_time: { name: 'One-Time Plan', tributes: 1, price: 1500, features: ['1 tribute for 30 days', 'All premium features'] },
        lifetime: { name: 'Lifetime Plan', tributes: 1000, price: 15000, features: ['Unlimited tributes', 'Lifetime access', 'All features'] }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <Crown className="h-16 w-16 text-[#fcd34d] mx-auto mb-4" />
                <h3 className="text-2xl font-serif text-[#2a3342]">Subscription Required</h3>
                <p className="text-[#4a5568] max-w-2xl mx-auto">
                    You need an active subscription to create tributes. Choose a plan that fits your needs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(subscriptionOptions).map(([key, plan]) => (
                    <Card key={key} className="border-[#e5e0d9] hover:border-[#fcd34d] transition-all">
                        <CardHeader className="text-center">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription>
                                {plan.tributes} tribute{plan.tributes !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="text-2xl font-bold text-[#2a3342]">
                                {plan.price === 0 ? 'Free' : `₦${plan.price.toLocaleString()}`}
                            </div>
                            <div className="space-y-2">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm text-[#4a5568]">
                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => handlePurchasePlan(key)}
                                className="w-full bg-[#fcd34d] hover:bg-[#645a52] text-white"
                            >
                                {plan.price === 0 ? 'Get Started' : 'Purchase'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="text-center">
                <Button
                    variant="outline"
                    onClick={onCheckAgain}
                    className="border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                >
                    <Zap className="h-4 w-4 mr-2" />
                    I already have a subscription
                </Button>
            </div>
        </div>
    )
}


// Plan Selection Section (unchanged)
const PlanSelectionSection = ({ plans, selectedPlan, onPlanSelect, expandedFeatures, toggleFeatures, FeatureItem, getPriceDisplay }) => (
    <div className="space-y-8">
        <div className="text-center">
            <h3 className="text-2xl font-serif text-[#2a3342]">Choose Your Plan</h3>
            <p className="text-[#4a5568] max-w-2xl mx-auto">
                Select the perfect plan to honour your loved one's memory. Each plan offers different features and capabilities.
            </p>
        </div>

        <RadioGroup
            value={selectedPlan?.id}
            onValueChange={(id) => {
                const plan = plans.find(p => p.id === id)
                onPlanSelect(plan)
            }}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
            {plans.map((plan) => {
                const initialFeatures = plan.features.slice(0, 5)
                const extraFeatures = plan.features.slice(5)
                const showViewMore = extraFeatures.length > 0
                const isExpanded = expandedFeatures[plan.id]

                return (
                    <div key={plan.id} className="w-full">
                        <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                        <Label htmlFor={plan.id} className="block cursor-pointer h-full">
                            <Card
                                className={`h-full transition-all duration-300 ${
                                    selectedPlan?.id === plan.id
                                        ? "border-[#fcd34d] ring-2 ring-[#fcd34d] shadow-lg"
                                        : "hover:border-[#fcd34d]/50 hover:shadow-md"
                                } ${plan.popular ? "relative" : ""}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 right-4 bg-[#fcd34d] text-white text-xs px-3 py-1 rounded-full">
                                        Popular
                                    </div>
                                )}
                                <CardHeader className="space-y-2">
                                    <CardTitle className="text-xl text-[#2a3342]">{plan.name}</CardTitle>
                                    <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                                    <div className="pt-2">
                                        <span className="text-2xl font-bold text-[#2a3342]">{getPriceDisplay(plan)}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-1">
                                    {initialFeatures.map((feature, index) => (
                                        <FeatureItem key={index} {...feature} />
                                    ))}

                                    {isExpanded &&
                                        extraFeatures.map((feature, index) => <FeatureItem key={`extra-${index}`} {...feature} />)}
                                </CardContent>

                                {showViewMore && (
                                    <CardFooter className="pt-0 pb-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="w-full text-[#fcd34d] hover:text-[#645a52] hover:bg-[#f5f0ea]"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                toggleFeatures(plan.id)
                                            }}
                                        >
                                            {isExpanded ? (
                                                <span className="flex items-center">
                                                  View Less <ChevronUp className="ml-1 h-4 w-4" />
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                  View More <ChevronDown className="ml-1 h-4 w-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </Label>
                    </div>
                )
            })}
        </RadioGroup>

        {!selectedPlan && (
            <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
                <AlertCircle className="h-4 w-4 text-[#fcd34d]" />
                <AlertDescription className="text-[#4a5568]">
                    Please select a plan to continue. You can compare features between plans to choose the best option for your needs.
                </AlertDescription>
            </Alert>
        )}
    </div>
)

// Updated Theme Selection Section to use backend themes
const ThemeSelectionSection = ({ themes, selectedTheme, onThemeSelect, onPreviewTheme, loadingThemes }) => {
    if (loadingThemes) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h3 className="text-2xl font-serif text-[#2a3342]">Choose a Theme</h3>
                    <p className="text-[#4a5568] max-w-2xl mx-auto">
                        Loading available themes...
                    </p>
                </div>
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcd34d] mx-auto"></div>
                        <p className="mt-4 text-[#4a5568]">Loading themes...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-serif text-[#2a3342]">Choose a Theme</h3>
                <p className="text-[#4a5568] max-w-2xl mx-auto">
                    Select a beautiful theme that reflects the spirit and personality of your loved one.
                </p>
            </div>

            {themes.length === 0 ? (
                <div className="text-center py-12 bg-[#f8f4f0] rounded-lg">
                    <Palette className="h-12 w-12 text-[#fcd34d] mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-[#2a3342] mb-2">No Themes Available</h4>
                    <p className="text-[#4a5568]">
                        No themes are currently available. Please try again later.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themes.map((theme) => {
                        const isSelected = selectedTheme?.id === theme.id

                        return (
                            <div key={theme.id}>
                                <Card
                                    className={`transition-all cursor-pointer ${
                                        isSelected
                                            ? "ring-2 ring-[#fcd34d] shadow-md"
                                            : "hover:border-[#fcd34d]/50 hover:shadow-sm"
                                    }`}
                                    onClick={() => onThemeSelect(theme)}
                                >
                                    <div className="aspect-video relative group overflow-hidden rounded-t-lg">
                                        <img
                                            src={theme.image}
                                            alt={theme.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = "/images/themes/default-thumb.jpg"
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    onPreviewTheme(theme)
                                                }}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Preview
                                            </Button>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-3 left-3 bg-[#fcd34d] text-white rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-[#2a3342]">{theme.name}</h4>
                                            <Badge variant="outline" className="text-xs capitalize">
                                                {theme.layout_type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>

                                        {/* Color Palette Preview */}
                                        <div className="flex space-x-1 mb-2">
                                            {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="w-6 h-6 rounded border flex-1"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-[#4a5568]">
                                            <div className="flex items-center">
                                                <Layout className="h-3 w-3 mr-1" />
                                                {theme.layout_type === 'tabs' ? 'Tabbed Layout' : 'Single Page'}
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="h-3 w-3 mr-1" />
                                                Click to select
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })}
                </div>
            )}

            {themes.length > 0 && !selectedTheme && (
                <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
                    <HelpCircle className="h-4 w-4 text-[#fcd34d]" />
                    <AlertDescription className="text-[#4a5568]">
                        Please select a theme to continue. You can preview each theme by clicking the "Preview" button.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}

// Update OverviewSection to show subscription info
const OverviewSection = ({ formData, selectedTheme, subscriptionStatus, imagePreview }) => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-serif text-[#2a3342]">Review Your Tribute</h3>
                <p className="text-[#4a5568]">Please review all details before creating your tribute.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tribute Details */}
                <Card className="border-[#e5e0d9]">
                    <CardHeader className="bg-[#f8f4f0] border-b">
                        <CardTitle className="text-lg flex items-center">
                            <User className="h-5 w-5 mr-2 text-[#fcd34d]" />
                            Tribute Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center space-x-4">
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-full object-cover" />
                            )}
                            <div>
                                <h4 className="font-semibold text-lg">{formData.firstName} {formData.lastName}</h4>
                                {formData.nickname && (
                                    <p className="text-[#4a5568]">"{formData.nickname}"</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Relationship:</span>
                                <p className="text-[#4a5568]">{formData.relationship || "N/A"}</p>
                            </div>
                            <div>
                                <span className="font-medium">Date of Death:</span>
                                <p className="text-[#4a5568]">
                                    {formData.dateOfDeath ? format(new Date(formData.dateOfDeath), "MMMM d, yyyy") : "N/A"}
                                </p>
                            </div>
                            {formData.dateOfBirth && (
                                <div>
                                    <span className="font-medium">Date of Birth:</span>
                                    <p className="text-[#4a5568]">
                                        {format(new Date(formData.dateOfBirth), "MMMM d, yyyy")}
                                    </p>
                                </div>
                            )}
                            {formData.quote && (
                                <div className="col-span-2">
                                    <span className="font-medium">Memorial Quote:</span>
                                    <p className="text-[#4a5568] italic">"{formData.quote}"</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription & Theme */}
                <Card className="border-[#e5e0d9]">
                    <CardHeader className="bg-[#f8f4f0] border-b">
                        <CardTitle className="text-lg flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-[#fcd34d]" />
                            Subscription & Theme
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h4 className="font-semibold mb-2">Your Plan</h4>
                            {subscriptionStatus?.has_active_subscription ? (
                                <div className="bg-[#f8f4f0] p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium capitalize">
                                                {subscriptionStatus.active_subscription.plan_id} Plan
                                            </p>
                                            <p className="text-sm text-[#4a5568]">
                                                {subscriptionStatus.available_tributes} tribute{subscriptionStatus.available_tributes !== 1 ? 's' : ''} remaining
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="bg-green-500 text-white">
                                            Active
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[#4a5568]">No active subscription</p>
                            )}
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Selected Theme</h4>
                            {selectedTheme ? (
                                <div className="bg-[#f8f4f0] p-4 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-12 h-12 rounded border"
                                            style={{ backgroundColor: selectedTheme.colors.primary }}
                                        />
                                        <div>
                                            <p className="font-medium">{selectedTheme.name}</p>
                                            <p className="text-sm text-[#4a5568]">{selectedTheme.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[#4a5568]">No theme selected</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
                <AlertCircle className="h-4 w-4 text-[#fcd34d]" />
                <AlertDescription className="text-[#4a5568]">
                    After creating this tribute, you will have {Math.max(0, (subscriptionStatus?.available_tributes || 0) - 1)} tribute{Math.max(0, (subscriptionStatus?.available_tributes || 0) - 1) !== 1 ? 's' : ''} remaining in your current plan.
                </AlertDescription>
            </Alert>
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
                <InputField label="First Name" id="firstName" value={formData.firstName} onChange={handleInputChange} required error={formErrors.firstName} />
                <InputField label="Middle Name" id="middleName" value={formData.middleName} onChange={handleInputChange} />
                <InputField label="Last Name" id="lastName" value={formData.lastName} onChange={handleInputChange} required error={formErrors.lastName} />
                <InputField label="Nickname" id="nickname" value={formData.nickname} onChange={handleInputChange} />
            </div>
        </div>
        <div className="bg-[#f8f4f0] p-6 rounded-lg">
            <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-xl font-medium text-[#2a3342]">Relationship</h3>
            </div>
            <RelationshipField value={formData.relationship} onChange={(value) => handleSelectChange(value, "relationship")} error={formErrors.relationship} />
        </div>
        <div className="bg-[#f8f4f0] p-6 rounded-lg">
            <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-xl font-medium text-[#2a3342]">Important Date</h3>
            </div>
            <DateField label="Date of Death" value={formData.dateOfDeath} onChange={(date) => handleDateChange(date, "dateOfDeath")} required error={formErrors.dateOfDeath} />
        </div>
        <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
            <AlertCircle className="h-4 w-4 text-[#fcd34d]" />
            <AlertDescription className="text-[#4a5568]">Please provide accurate information to create a meaningful tribute for your loved one.</AlertDescription>
        </Alert>
    </div>
)

const AdditionalDetailsSection = ({ formData, handleInputChange, handleDateChange, imagePreview, handleImageChange }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div className="bg-[#f8f4f0] p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Calendar className="h-5 w-5 text-[#fcd34d] mr-2" />
                        <h3 className="text-xl font-medium text-[#2a3342]">Birth Information</h3>
                    </div>
                    <DateField label="Date of Birth" value={formData.dateOfBirth} onChange={(date) => handleDateChange(date, "dateOfBirth")} />
                    <div className="mt-4">
                        <InputField label="Country of Birth" id="countryOfBirth" value={formData.countryOfBirth} onChange={handleInputChange} icon={<Globe className="h-4 w-4 text-[#fcd34d]" />} />
                    </div>
                </div>
                <div className="bg-[#f8f4f0] p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Globe className="h-5 w-5 text-[#fcd34d] mr-2" />
                        <h3 className="text-xl font-medium text-[#2a3342]">Country of Death</h3>
                    </div>
                    <InputField label="Country Died" id="countryDied" value={formData.countryDied} onChange={handleInputChange} icon={<Globe className="h-4 w-4 text-[#fcd34d]" />} />
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
                        value={formData.customMemorialWebsite || `www.rememberedalways.org/tribute/${formData.firstName?.toLowerCase() || ""}-${formData.lastName?.toLowerCase() || ""}`}
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

const QuoteSection = ({ quote, handleInputChange }) => (
    <div className="bg-[#f8f4f0] p-6 rounded-lg">
        <div className="flex items-center mb-4">
            <Quote className="h-5 w-5 text-[#fcd34d] mr-2" />
            <h3 className="text-xl font-medium text-[#2a3342]">Memorial Quote</h3>
        </div>
        <p className="text-[#4a5568] mb-6">Add a meaningful quote that captures the essence of your loved one or provides comfort to visitors.</p>
        <div className="relative max-w-3xl mx-auto text-center py-8">
            <div className="text-6xl text-[#e5e0d9] absolute top-0 left-0">"</div>
            <div className="text-6xl text-[#e5e0d9] absolute bottom-0 right-0">"</div>
            <Textarea
                placeholder="Enter a meaningful quote..."
                className="bg-white border-[#e5e0d9] text-center italic text-lg min-h-[150px] resize-none px-12 py-6 focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                value={quote}
                onChange={handleInputChange}
                id="quote"
            />
            <p className="text-sm text-[#4a5568] mt-4">This quote will be displayed prominently on your tribute page</p>
        </div>
    </div>
)

const InputField = ({ label, id, value, onChange, required, error, icon, ...props }) => (
    <div className="space-y-1">
        <Label htmlFor={id} className="text-sm font-medium text-[#4a5568]">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
            {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
            <Input
                id={id}
                value={value || ""}
                onChange={onChange}
                className={`w-full border-[#e5e0d9] bg-white focus:border-[#fcd34d] focus:ring-[#fcd34d]/20 ${
                    icon ? "pl-10" : ""
                } ${error ? "border-red-500" : ""}`}
                {...props}
            />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
)

const DateField = ({ label, value, onChange, required, error }) => (
    <div className="space-y-1">
        <Label className="text-sm font-medium text-[#4a5568]">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full border-[#e5e0d9] bg-white focus:border-[#fcd34d] focus:ring-[#fcd34d]/20 ${
                error ? "border-red-500" : ""
            }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
)

const RelationshipField = ({ value, onChange, error }) => (
    <div className="space-y-1">
        <Label className="text-sm font-medium text-[#4a5568]">
            Relationship to the deceased <span className="text-red-500">*</span>
        </Label>
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className={`w-full border-[#e5e0d9] bg-white focus:border-[#fcd34d] focus:ring-[#fcd34d]/20 ${error ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select a relationship" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#e5e0d9]">
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Spouse">Spouse</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Grandparent">Grandparent</SelectItem>
                <SelectItem value="Grandchild">Grandchild</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Colleague">Colleague</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
        </Select>
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
)

const ImageUpload = ({ imagePreview, onChange }) => (
    <div className="bg-[#f8f4f0] p-6 rounded-lg text-center">
        <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center space-y-2">
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" />
                ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-[#e5e0d9] bg-white">
                        <Upload className="h-8 w-8 text-[#fcd34d]" />
                    </div>
                )}
                <span className="font-medium text-[#2a3342]">Upload a Photo</span>
                <p className="text-xs text-[#4a5568]">PNG, JPG, GIF up to 5MB</p>
            </div>
        </Label>
        <Input id="image-upload" type="file" className="sr-only" onChange={onChange} accept="image/png, image/jpeg, image/gif" />
    </div>
)