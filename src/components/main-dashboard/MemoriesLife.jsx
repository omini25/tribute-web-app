import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
    User,
    Plus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"

export default function MemoriesLife() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [tributeData, setTributeData] = useState({
        bio: "",
        family: [],
        milestone: []
    })
    const [title, setTitle] = useState("TRIBUTE")
    const [newMilestone, setNewMilestone] = useState("")

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeData()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
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
                toast({
                    title: "Error",
                    description: "Failed to fetch tribute details. Please try again.",
                    variant: "destructive"
                })
            }
        }
    }

    const handleInputChange = (field, value) => {
        setTributeData(prev => ({ ...prev, [field]: value }))
    }

    const handleFamilyMemberChange = (index, field, value) => {
        setTributeData(prev => ({
            ...prev,
            family: prev.family.map((member, i) =>
                i === index ? { ...member, [field]: value } : member
            )
        }))
    }

    const addFamilyMember = () => {
        setTributeData(prev => ({
            ...prev,
            family: [...prev.family, { full_name: "", relationship: "" }]
        }))
    }

    const removeFamilyMember = index => {
        setTributeData(prev => ({
            ...prev,
            family: prev.family.filter((_, i) => i !== index)
        }))
    }

    const handleAddMilestone = () => {
        if (newMilestone.trim()) {
            setTributeData(prev => ({
                ...prev,
                milestone: [...prev.milestone, newMilestone.trim()]
            }))
            setNewMilestone("")
        }
    }

    const handleRemoveMilestone = index => {
        setTributeData(prev => ({
            ...prev,
            milestone: prev.milestone.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(
                `${server}/tributes/${id}/bio-family/update`,
                tributeData
            )
            if (response.data.status === "success") {
                toast({
                    title: "Success",
                    description: "Tribute details updated successfully!"
                })
            } else {
                throw new Error("Failed to update tribute details")
            }
        } catch (error) {
            console.error("Error updating tribute details:", error)
            toast({
                title: "Error",
                description: "Failed to update tribute details. Please try again.",
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
                        <CardTitle className="text-3xl font-bold text-warm-800 text-center">
                            {title}
                        </CardTitle>
                        <p className="text-xl text-warm-600 text-center">LIFE</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <BiographySection
                            bio={tributeData.bio}
                            onChange={value => handleInputChange("bio", value)}
                        />
                        <MilestonesSection
                            milestones={tributeData.milestone}
                            newMilestone={newMilestone}
                            setNewMilestone={setNewMilestone}
                            onAdd={handleAddMilestone}
                            onRemove={handleRemoveMilestone}
                        />
                        <FamilySection
                            family={tributeData.family}
                            onMemberChange={handleFamilyMemberChange}
                            onAddMember={addFamilyMember}
                            onRemoveMember={removeFamilyMember}
                        />
                        <NavigationButtons
                            id={id}
                            onSave={handleSubmit}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const BiographySection = ({ bio, onChange }) => (
    <section>
        <h3 className="text-xl font-semibold text-warm-700 mb-4">BIOGRAPHY</h3>
        <Textarea
            placeholder="Biography of the bereaved"
            className="min-h-[200px] border-warm-200 resize-none"
            value={bio}
            onChange={e => onChange(e.target.value)}
        />
    </section>
)

const MilestonesSection = ({
                               milestones,
                               newMilestone,
                               setNewMilestone,
                               onAdd,
                               onRemove
                           }) => (
    <section>
        <h3 className="text-xl font-semibold text-warm-700 mb-4">MILESTONES</h3>
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Input
                    type="text"
                    placeholder="Add new milestone"
                    value={newMilestone}
                    onChange={e => setNewMilestone(e.target.value)}
                    className="flex-1 border-warm-200"
                />
                <Button
                    onClick={onAdd}
                    className="bg-warm-500 hover:bg-warm-600 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>
            <ScrollArea className="h-[200px] border border-warm-200 rounded-md p-4">
                {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-warm-700">{milestone}</span>
                        <Button
                            variant="ghost"
                            onClick={() => onRemove(index)}
                            className="text-warm-500 hover:text-warm-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </ScrollArea>
        </div>
    </section>
)

const FamilySection = ({
                           family,
                           onMemberChange,
                           onAddMember,
                           onRemoveMember
                       }) => (
    <section>
        <h3 className="text-xl font-semibold text-warm-700 mb-4">FAMILY</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {family.map((member, index) => (
                <FamilyMemberCard
                    key={index}
                    member={member}
                    index={index}
                    onChange={onMemberChange}
                    onRemove={onRemoveMember}
                />
            ))}
            <AddFamilyButton onClick={onAddMember} />
        </div>
    </section>
)

const FamilyMemberCard = ({ member, index, onChange, onRemove }) => (
    <Card>
        <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`fullName-${index}`} className="text-warm-700">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                </Label>
                <Input
                    id={`fullName-${index}`}
                    value={member.full_name}
                    onChange={e => onChange(index, "full_name", e.target.value)}
                    className="border-warm-200"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`relationship-${index}`} className="text-warm-700">
                    <User className="w-4 h-4 inline mr-2" />
                    Relationship
                </Label>
                <Select
                    value={member.relationship}
                    onValueChange={value => onChange(index, "relationship", value)}
                >
                    <SelectTrigger className="border-warm-200">
                        <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                        {["Spouse", "Child", "Parent", "Sibling"].map(relation => (
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
            <Button
                variant="ghost"
                onClick={() => onRemove(index)}
                className="w-full text-warm-500 hover:text-warm-700"
            >
                <Trash2 className="h-4 w-4 mr-2" /> Remove
            </Button>
        </CardContent>
    </Card>
)

const AddFamilyButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="border-2 border-dashed border-warm-300 rounded-lg p-8 text-warm-500 hover:bg-warm-50 transition-colors flex items-center justify-center"
    >
        <Plus className="h-6 w-6 mr-2" /> ADD FAMILY
    </button>
)

const NavigationButtons = ({ id, onSave, isLoading }) => (
    <div className="flex justify-between pt-8">
        <Link to={`/dashboard/memories-overview/${id}`}>
            <Button variant="outline" className="text-warm-700">
                <ChevronLeft className="h-4 w-4 mr-2" /> Tribute Overview
            </Button>
        </Link>
        <Button
            onClick={onSave}
            disabled={isLoading}
            className="bg-warm-500 hover:bg-warm-600"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Link to={`/dashboard/memories/events/${id}`}>
            <Button variant="outline" className="text-warm-700">
                Events <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </Link>
    </div>
)
