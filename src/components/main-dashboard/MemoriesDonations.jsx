"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
    Loader2,
    Calendar,
    User,
    ChevronLeft,
    ChevronRight,
    Heart,
    AlertCircle,
    CreditCard,
    HelpCircle,
    Check,
    X,
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function DonationForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [tribute, setTribute] = useState({
        no_donations: false,
        allow_anonymous: false,
        no_limit: false,
        tribute_name: "",
        notify_users: "",
        end_date: "",
        donation_goal: "",
        donation_message: "",
        donation_options: [
            { amount: "1000", label: "₦1,000" },
            { amount: "5000", label: "₦5,000" },
            { amount: "10000", label: "₦10,000" },
        ],
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title, setTitle] = useState("TRIBUTE")
    const [activeTab, setActiveTab] = useState("basic")
    const [showUpgradeOverlay, setShowUpgradeOverlay] = useState(false)
    const [plan, setPlan] = useState(null)

    console.log(showUpgradeOverlay, plan, tribute)

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(`${server}/tribute/title/image/${user.id}`)
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            setTribute((prev) => ({
                ...prev,
                ...response.data,
            }))
            setPlan(response.data.plan)
            if (response.data.plan === "Basic" || response.data.plan === "free") {
                setShowUpgradeOverlay(true)
            }
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            toast.error("Failed to load tribute details. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setTribute((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (name) => {
        setTribute((prev) => ({ ...prev, [name]: !prev[name] }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await axios.put(`${server}/tributes/donations/${id}`, tribute)
            toast.success("Donation settings updated successfully!")
        } catch (error) {
            console.error("Error updating tribute:", error)
            toast.error("Failed to update donation settings. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getCompletionPercentage = () => {
        if (tribute.no_donations) return 100
        const requiredFields = ["tribute_name"]
        const completedFields = requiredFields.filter((field) => tribute[field])
        return (completedFields.length / requiredFields.length) * 100
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f4f0]">
                <Loader2 className="h-8 w-8 animate-spin text-[#fcd34d]" />
            </div>
        )
    }

    return (
        <div className="bg-[#f8f4f0] min-h-screen py-8 relative">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-between text-xs sm:text-sm text-[#4a5568] mb-2 gap-2">
                        <span className="font-medium text-[#2a3342]">Basic Info</span>
                        <span>Life</span>
                        <span>Events & Donations</span>
                        <span>Memories</span>
                    </div>
                    <Progress value={70} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                </div>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <CardTitle className="text-3xl font-serif text-[#2a3342]">{title}</CardTitle>
                                <CardDescription className="text-[#4a5568]">
                                    Configure donation settings for your tribute page
                                </CardDescription>
                            </div>

                            {/* Completion Badge */}
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

                    <CardContent className="p-6 relative">
                        {showUpgradeOverlay && (
                            <div className="absolute inset-0 z-10 bg-white bg-opacity-90 flex flex-col items-center justify-center p-6 rounded-lg">
                                <div className="text-center max-w-md">
                                    <AlertCircle className="h-12 w-12 mx-auto text-[#fcd34d] mb-4" />
                                    <h3 className="text-2xl font-medium text-[#2a3342] mb-2">Donations Not Available</h3>
                                    <p className="text-[#4a5568] mb-6">
                                        The donation feature is not available on your current {plan} plan. Upgrade to a premium plan to access this feature and accept donations for your tribute.
                                    </p>
                                    <Button
                                        onClick={() => navigate(`/dashboard/memories/music-theme/${id}`)}
                                        className="bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                    >
                                        Upgrade Plan
                                    </Button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid grid-cols-2 mb-6 bg-[#f0ece6]">
                                    <TabsTrigger
                                        value="basic"
                                        className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                    >
                                        <span className="mr-2">₦</span>
                                        Basic Settings
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="advanced"
                                        className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                    >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Advanced Options
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="mt-0 space-y-6">
                                    <BasicSettings
                                        tribute={tribute}
                                        handleSwitchChange={handleSwitchChange}
                                        handleInputChange={handleInputChange}
                                        showUpgradeOverlay={showUpgradeOverlay}
                                    />
                                </TabsContent>

                                <TabsContent value="advanced" className="mt-0 space-y-6">
                                    <AdvancedSettings
                                        tribute={tribute}
                                        handleInputChange={handleInputChange}
                                        handleSwitchChange={handleSwitchChange}
                                        showUpgradeOverlay={showUpgradeOverlay}
                                    />
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-center pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || showUpgradeOverlay}
                                    className="bg-[#fcd34d] hover:bg-[#645a52] text-white px-8 min-w-[150px]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        <Check className="h-5 w-5 mr-2" />
                                    )}
                                    {isSubmitting ? "Saving..." : "Save Settings"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t p-6 gap-4">
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link to={`/dashboard/memories/events/${id}`} className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full border-[#fcd34d] hover:bg-[#f5f0ea]">
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Events
                                </Button>
                            </Link>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link to={`/dashboard/memories/memories/${id}`} className="w-full sm:w-auto">
                                <Button className="w-full bg-[#fcd34d] hover:bg-[#645a52] text-white">
                                    Continue <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

const BasicSettings = ({ tribute, handleSwitchChange, handleInputChange, showUpgradeOverlay }) => (
    <div className="space-y-6">
        <div className="bg-[#f8f4f0] p-6 rounded-lg relative">
            {/*{showUpgradeOverlay && (*/}
            {/*    <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center rounded-lg">*/}
            {/*        <div className="text-center p-4">*/}
            {/*            <AlertCircle className="h-8 w-8 mx-auto text-[#fcd34d] mb-2" />*/}
            {/*            <p className="text-[#2a3342] font-medium">Donations feature requires a premium plan</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            <div className="flex items-center mb-4">
                <span className="text-xl mr-2">₦</span>
                <h3 className="text-xl font-medium text-[#2a3342]">Donation Settings</h3>
            </div>
            <p className="text-[#4a5568] mb-6">
                Configure whether you want to accept donations and how they should be handled.
            </p>

            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e5e0d9]">
                    <div className="flex items-center space-x-3">
                        <span className="text-[#fcd34d]">₦</span>
                        <div>
                            <Label htmlFor="no_donations" className="font-medium text-[#2a3342]">
                                Enable Donations
                            </Label>
                            <p className="text-sm text-[#4a5568]">Allow visitors to make donations in memory of your loved one</p>
                        </div>
                    </div>
                    <Switch
                        id="no_donations"
                        checked={!tribute.no_donations}
                        onCheckedChange={() => handleSwitchChange("no_donations")}
                        className="data-[state=checked]:bg-[#fcd34d] data-[state=unchecked]:border-[#645a52]"
                        disabled={showUpgradeOverlay}
                    />
                </div>

                {!tribute.no_donations && (
                    <>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tribute_name" className="text-[#2a3342] flex items-center">
                                    Donation Fund Name <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="tribute_name"
                                    name="tribute_name"
                                    value={tribute.tribute_name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Memorial Fund for John Doe"
                                    className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                    disabled={showUpgradeOverlay}
                                />
                                <p className="text-xs text-[#4a5568]">This name will appear on the donation page</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date" className="text-[#2a3342] flex items-center">
                                    End Date <span className="text-[#4a5568] text-sm ml-1">(Optional)</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="end_date"
                                        name="end_date"
                                        type="date"
                                        value={tribute.end_date}
                                        onChange={handleInputChange}
                                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 pl-10"
                                        disabled={showUpgradeOverlay}
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fcd34d]" />
                                </div>
                                <p className="text-xs text-[#4a5568]">Leave blank for no end date</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e5e0d9]">
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-[#fcd34d]" />
                                <div>
                                    <Label htmlFor="allow_anonymous" className="font-medium text-[#2a3342]">
                                        Allow Anonymous Donations
                                    </Label>
                                    <p className="text-sm text-[#4a5568]">Let donors choose to hide their names</p>
                                </div>
                            </div>
                            <Switch
                                id="allow_anonymous"
                                checked={tribute.allow_anonymous}
                                onCheckedChange={() => handleSwitchChange("allow_anonymous")}
                                className="data-[state=checked]:bg-[#fcd34d]"
                                disabled={showUpgradeOverlay}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>

        {tribute.no_donations && (
            <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
                <AlertCircle className="h-4 w-4 text-[#fcd34d]" />
                <AlertDescription className="text-[#4a5568]">
                    Donations are currently disabled. Enable donations above to configure additional settings.
                </AlertDescription>
            </Alert>
        )}
    </div>
)

const AdvancedSettings = ({ tribute, handleInputChange, handleSwitchChange, showUpgradeOverlay }) => (
    <div className="space-y-6">
        <div className="bg-[#f8f4f0] p-6 rounded-lg relative">
            {showUpgradeOverlay && (
                <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center rounded-lg">
                    <div className="text-center p-4">
                        <AlertCircle className="h-8 w-8 mx-auto text-[#fcd34d] mb-2" />
                        <p className="text-[#2a3342] font-medium">Advanced donation settings require a premium plan</p>
                    </div>
                </div>
            )}

            <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-xl font-medium text-[#2a3342]">Advanced Donation Options</h3>
            </div>
            <p className="text-[#4a5568] mb-6">Configure additional settings for your donation campaign.</p>

            {tribute.no_donations ? (
                <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
                    <AlertCircle className="h-4 w-4 text-[#fcd34d]" />
                    <AlertDescription className="text-[#4a5568]">
                        Donations are currently disabled. Enable donations in the Basic Settings tab to configure advanced options.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="donation_goal" className="text-[#2a3342]">
                                    Donation Goal
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-4 w-4 text-[#fcd34d]" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Set a target amount for your donation campaign</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="relative">
                                <Input
                                    id="donation_goal"
                                    name="donation_goal"
                                    type="number"
                                    value={tribute?.donation_settings?.donation_goal}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 100000"
                                    className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 pl-10"
                                    disabled={tribute.no_limit || showUpgradeOverlay}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#fcd34d]">₦</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox
                                    id="no_limit"
                                    checked={tribute.no_limit}
                                    onCheckedChange={() => handleSwitchChange("no_limit")}
                                    className="data-[state=checked]:bg-[#fcd34d] data-[state=checked]:border-[#fcd34d]"
                                    disabled={showUpgradeOverlay}
                                />
                                <Label htmlFor="no_limit" className="text-sm text-[#4a5568] cursor-pointer">
                                    No limit on donations
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notify_users" className="text-[#2a3342]">
                                Notification Email
                            </Label>
                            <Input
                                id="notify_users"
                                name="notify_users"
                                type="email"
                                value={tribute?.donation_settings?.notify_users}
                                onChange={handleInputChange}
                                placeholder="e.g., your@email.com"
                                className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                disabled={showUpgradeOverlay}
                            />
                            <p className="text-xs text-[#4a5568]">Receive notifications when donations are made</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="donation_message" className="text-[#2a3342]">
                            Thank You Message
                        </Label>
                        <textarea
                            id="donation_message"
                            name="donation_message"
                            value={tribute?.donation_settings?.donation_message}
                            onChange={handleInputChange}
                            placeholder="Enter a message to thank donors for their contribution..."
                            className="w-full min-h-[100px] rounded-md border border-[#e5e0d9] p-3 focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 resize-none"
                            disabled={showUpgradeOverlay}
                        />
                        <p className="text-xs text-[#4a5568]">This message will be shown to donors after they make a donation</p>
                    </div>
                </div>
            )}
        </div>
    </div>
)