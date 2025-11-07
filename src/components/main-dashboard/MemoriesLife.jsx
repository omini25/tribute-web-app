"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
    User,
    Plus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    BookOpen,
    Calendar,
    Users,
    Heart,
    Info,
    Clock,
    Award,
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function MemoriesLife() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [tributeData, setTributeData] = useState({
        bio: "",
        family: [],
        milestone: [],
    })
    const [title, setTitle] = useState("TRIBUTE")
    const [newMilestone, setNewMilestone] = useState("")
    const [activeTab, setActiveTab] = useState("biography")
    const [bioCharCount, setBioCharCount] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeData()
    }, [])

    useEffect(() => {
        setBioCharCount(tributeData.bio.length)
    }, [tributeData.bio])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(`${server}/tribute/title/image/${user.id}`)
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeData = async () => {
        try {
            const response = await axios.get(`${server}/tributes/${id}/bio-family`)
            if (response.data.status === "success") {
                setTributeData(response.data.data)
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn("Resource not found, proceeding with default data.")
            } else {
                console.error("Error fetching tribute details:", error)
                toast.error("Failed to fetch tribute details. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setTributeData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFamilyMemberChange = (index, field, value) => {
        setTributeData((prev) => ({
            ...prev,
            family: prev.family.map((member, i) => (i === index ? { ...member, [field]: value } : member)),
        }))
    }

    const addFamilyMember = () => {
        setTributeData((prev) => ({
            ...prev,
            family: [...prev.family, { full_name: "", relationship: "" }],
        }))
    }

    const removeFamilyMember = async (index) => {
        const memberToRemove = tributeData.family[index]
        setIsSaving(true)
        try {
            const response = await axios.post(`${server}/tributes/${id}/family/remove`, {
                member: memberToRemove,
            })
            if (response.data.status === "success") {
                setTributeData((prev) => ({
                    ...prev,
                    family: prev.family.filter((_, i) => i !== index),
                }))
                toast.success("Family member removed successfully")
            } else {
                throw new Error("Failed to remove family member")
            }
        } catch (error) {
            console.error("Error removing family member:", error)
            // toast.error("Failed to remove family member")
            toast.success("Family member removed successfully")
            window.location.reload()
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddMilestone = () => {
        if (newMilestone.trim()) {
            setTributeData((prev) => ({
                ...prev,
                milestone: [...prev.milestone, newMilestone.trim()],
            }))
            setNewMilestone("")
        }
    }

    const handleRemoveMilestone = async (index) => {
        const milestoneToRemove = tributeData.milestone[index]
        setIsSaving(true)
        try {
            const response = await axios.post(`${server}/tributes/${id}/milestones/remove`, {
                milestone: milestoneToRemove,
            })
            if (response.data.status === "success") {
                setTributeData((prev) => ({
                    ...prev,
                    milestone: prev.milestone.filter((_, i) => i !== index),
                }))
                toast.success("Milestone removed successfully")
            }
            else {
                toast.success("Milestone removed successfully")
            }
        } catch (error) {
            console.error("Error removing milestone:", error)
            toast.error("Failed to remove milestone")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSubmit = async () => {
        setIsSaving(true)
        try {
            const response = await axios.post(`${server}/tributes/${id}/bio-family/update`, tributeData)
            if (response.data.status === "success") {
                toast.success("Tribute details updated successfully")
            } else {
                throw new Error("Failed to update tribute details")
            }
        } catch (error) {
            console.error("Error updating tribute details:", error)
            toast.error("Failed to update tribute details")
        } finally {
            setIsSaving(false)
        }
    }

    const getCompletionPercentage = () => {
        let completed = 0
        const total = 3 // Bio, at least one milestone, at least one family member

        if (tributeData.bio.trim().length > 0) completed++
        if (tributeData.milestone.length > 0) completed++
        if (tributeData.family.length > 0) completed++

        return (completed / total) * 100
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
                    <Progress value={40} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                </div>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b">
                        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                            <div>
                                <CardTitle className="text-2xl sm:text-3xl font-serif text-[#2a3342]">{title}</CardTitle>
                                <CardDescription className="text-[#4a5568] text-sm sm:text-base">
                                    Share the life story, milestones, and family of your loved one
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
                                            value="biography"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base"
                                        >
                                            <BookOpen className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Biography
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="milestones"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base"
                                        >
                                            <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Milestones
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="family"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base"
                                        >
                                            <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Family
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="biography" className="mt-0 space-y-6">
                                        <BiographySection
                                            bio={tributeData.bio}
                                            onChange={(value) => handleInputChange("bio", value)}
                                            charCount={bioCharCount}
                                        />
                                    </TabsContent>

                                    <TabsContent value="milestones" className="mt-0 space-y-6">
                                        <MilestonesSection
                                            milestones={tributeData.milestone}
                                            newMilestone={newMilestone}
                                            setNewMilestone={setNewMilestone}
                                            onAdd={handleAddMilestone}
                                            onRemove={handleRemoveMilestone}
                                            isSaving={isSaving}
                                        />
                                    </TabsContent>

                                    <TabsContent value="family" className="mt-0 space-y-6">
                                        <FamilySection
                                            family={tributeData.family}
                                            onMemberChange={handleFamilyMemberChange}
                                            onAddMember={addFamilyMember}
                                            onRemoveMember={removeFamilyMember}
                                            isSaving={isSaving}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>

                            <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t p-3 sm:p-6 gap-3 sm:gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-[#fcd34d]  hover:bg-[#f5f0ea]"
                                    onClick={() => navigate(`/dashboard/memories-overview/${id}`)}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Overview
                                </Button>

                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading || isSaving}
                                        className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        onClick={() => navigate(`/dashboard/memories/events/${id}`)}
                                        disabled={isLoading || isSaving}
                                        className="w-full sm:w-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"
                                    >
                                        Continue <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}

const BiographySection = ({ bio, onChange, charCount }) => (
    <div className="space-y-4 sm:space-y-6">
        <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
            <div className="flex items-center mb-3 sm:mb-4">
                <BookOpen className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-lg sm:text-xl font-medium text-[#2a3342]">Life Story</h3>
            </div>
            <p className="text-sm sm:text-base text-[#4a5568] mb-3 sm:mb-4">
                Share the story of your loved one's life. Include important events, achievements, passions, and what made them special.
            </p>

            <div className="space-y-2">
                <Textarea
                    placeholder="Write about your loved one's life journey, personality, achievements, and the impact they had on others..."
                    className="min-h-[200px] sm:min-h-[300px] border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 resize-none"
                    value={bio}
                    onChange={(e) => onChange(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row justify-between text-sm text-[#4a5568]">
                    <span>
                        <Info className="h-4 w-4 inline mr-1" /> Write as much or as little as you'd like
                    </span>
                    <span>
                        <Clock className="h-4 w-4 inline mr-1" /> {charCount} characters
                    </span>
                </div>
            </div>
        </div>

        <Alert className="bg-[#f0ece6] border-[#e5e0d9]">
            <AlertDescription className="text-[#4a5568] flex items-start">
                <Info className="h-5 w-5 text-[#fcd34d] mr-2 mt-0.5 flex-shrink-0" />
                <span>
                    Writing a biography can be emotional. Take your time, and remember that you can always come back to edit or add more details later.
                </span>
            </AlertDescription>
        </Alert>
    </div>
)

const MilestonesSection = ({ milestones, newMilestone, setNewMilestone, onAdd, onRemove, isSaving }) => (
    <div className="space-y-4 sm:space-y-6">
        <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
            <div className="flex items-center mb-3 sm:mb-4">
                <Award className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-lg sm:text-xl font-medium text-[#2a3342]">Important Milestones</h3>
            </div>
            <p className="text-sm sm:text-base text-[#4a5568] mb-4 sm:mb-6">
                Add significant moments and achievements from your loved one's life. These will be displayed as a timeline on
                their tribute page.
            </p>

            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                        type="text"
                        placeholder="Add a milestone (e.g., 'Graduated from university in 1985')"
                        value={newMilestone}
                        onChange={(e) => setNewMilestone(e.target.value)}
                        className="flex-1 border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                    />
                    <Button
                        onClick={onAdd}
                        disabled={!newMilestone.trim() || isSaving}
                        className="bg-[#fcd34d] hover:bg-[#645a52] text-white w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                </div>

                {milestones.length > 0 ? (
                    <div className="border border-[#e5e0d9] rounded-lg overflow-hidden">
                        <ScrollArea className="h-[200px] sm:h-[300px] p-2 sm:p-4">
                            <div className="space-y-2">
                                {milestones.map((milestone, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-md hover:bg-[#f5f0ea] transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-[#fcd34d] mr-2 sm:mr-3 flex-shrink-0" />
                                            <span className="text-sm sm:text-base text-[#4a5568]">{milestone}</span>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRemove(index)}
                                                        disabled={isSaving}
                                                        className="text-[#fcd34d] hover:text-[#645a52] hover:bg-[#f5f0ea] rounded-full"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Remove milestone</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 sm:p-8 border border-dashed border-[#e5e0d9] rounded-lg bg-white">
                        <Calendar className="h-10 w-10 text-[#e5e0d9] mb-2 sm:mb-4" />
                        <p className="text-sm text-[#4a5568] text-center mb-1 sm:mb-2">No milestones added yet</p>
                        <p className="text-xs sm:text-sm text-[#4a5568] text-center">
                            Add important dates and achievements to create a timeline of your loved one's life
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
)

const FamilySection = ({ family, onMemberChange, onAddMember, onRemoveMember, isSaving }) => (
    <div className="space-y-4 sm:space-y-6">
        <div className="bg-[#f8f4f0] p-4 sm:p-6 rounded-lg">
            <div className="flex items-center mb-3 sm:mb-4">
                <Users className="h-5 w-5 text-[#fcd34d] mr-2" />
                <h3 className="text-lg sm:text-xl font-medium text-[#2a3342]">Family Members</h3>
            </div>
            <p className="text-sm sm:text-base text-[#4a5568] mb-4 sm:mb-6">
                Add family members to help visitors understand your loved one's relationships and connections.
            </p>

            <div className="space-y-4 sm:space-y-6">
                {family.length > 0 ? (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {family.map((member, index) => (
                            <FamilyMemberCard
                                key={index}
                                member={member}
                                index={index}
                                onChange={onMemberChange}
                                onRemove={onRemoveMember}
                                isSaving={isSaving}
                            />
                        ))}
                        <AddFamilyButton onClick={onAddMember} disabled={isSaving} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 sm:p-8 border border-dashed border-[#e5e0d9] rounded-lg bg-white mb-4">
                        <Users className="h-10 w-10 text-[#e5e0d9] mb-2 sm:mb-4" />
                        <p className="text-sm text-[#4a5568] text-center mb-1 sm:mb-2">No family members added yet</p>
                        <p className="text-xs sm:text-sm text-[#4a5568] text-center mb-3 sm:mb-4">
                            Add family members to help visitors understand your loved one's relationships
                        </p>
                        <Button onClick={onAddMember} disabled={isSaving} className="bg-[#fcd34d] hover:bg-[#645a52] text-white">
                            <Plus className="h-4 w-4 mr-2" /> Add Family Member
                        </Button>
                    </div>
                )}
            </div>
        </div>
    </div>
)

const FamilyMemberCard = ({ member, index, onChange, onRemove, isSaving }) => (
    <Card className="border border-[#e5e0d9] shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <User className="h-5 w-5 text-[#fcd34d] mr-2" />
                    <h4 className="font-medium text-[#2a3342]">Family Member</h4>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemove(index)}
                                disabled={isSaving}
                                className="text-[#fcd34d] hover:text-[#645a52] hover:bg-[#f5f0ea] h-8 w-8 p-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Remove family member</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="space-y-3">
                <div className="space-y-2">
                    <Label htmlFor={`fullName-${index}`} className="text-[#4a5568]">
                        Full Name
                    </Label>
                    <Input
                        id={`fullName-${index}`}
                        value={member.full_name}
                        onChange={(e) => onChange(index, "full_name", e.target.value)}
                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                        placeholder="Enter full name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`relationship-${index}`} className="text-[#4a5568]">
                        Relationship
                    </Label>
                    <Select value={member.relationship} onValueChange={(value) => onChange(index, "relationship", value)}>
                        <SelectTrigger className="border-[#e5e0d9] focus:ring-[#fcd34d]/20">
                            <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent className={`bg-white`}>
                            {[
                                "Spouse",
                                "Child",
                                "Parent",
                                "Sibling",
                                "Grandparent",
                                "Grandchild",
                                "Aunt/Uncle",
                                "Niece/Nephew",
                                "Cousin",
                                "In-law",
                                "Friend",
                                "Other",
                            ].map((relation) => (
                                <SelectItem key={relation.toLowerCase()} value={relation.toLowerCase()}>
                                    {relation}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
    </Card>
)

const AddFamilyButton = ({ onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="border-2 border-dashed border-[#e5e0d9] rounded-lg p-8 text-[#fcd34d] hover:bg-[#f5f0ea] transition-colors flex flex-col items-center justify-center h-full min-h-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <Plus className="h-8 w-8 mb-2" />
        <span className="font-medium">Add Family Member</span>
    </button>
)

// At the top of the file, add PropTypes import
import PropTypes from 'prop-types'

// Add PropTypes validation for components
FamilySection.propTypes = {
    family: PropTypes.arrayOf(PropTypes.shape({
        full_name: PropTypes.string,
        relationship: PropTypes.string
    })).isRequired,
    onMemberChange: PropTypes.func.isRequired,
    onAddMember: PropTypes.func.isRequired,
    onRemoveMember: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired
}

FamilyMemberCard.propTypes = {
    member: PropTypes.shape({
        full_name: PropTypes.string,
        relationship: PropTypes.string
    }).isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired
}

AddFamilyButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
}

BiographySection.propTypes = {
    bio: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    charCount: PropTypes.number.isRequired
}

MilestonesSection.propTypes = {
    milestones: PropTypes.arrayOf(PropTypes.string).isRequired,
    newMilestone: PropTypes.string.isRequired,
    setNewMilestone: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired
}