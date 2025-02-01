import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { User } from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

export default function MemoriesLife() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [tributeData, setTributeData] = useState({
        bio: "",
        family: [],
        milestone: []
    })
    const [title, setTitle] = useState("TRIBUTE")

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeData()
    }, []) // Removed unnecessary dependency 'id'

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"))
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
            console.error("Error fetching tribute details:", error)
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

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(
                `${server}/tributes/${id}/bio-family/update`,
                tributeData
            )
            if (response.data.status === "success") {
                toast.success("Tribute details updated successfully!")
            } else {
                toast.error("Failed to update tribute details")
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update tribute details"
            )
            console.error("Error updating tribute details:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {isLoading && <LoadingOverlay />}
            <Header title={title} />
            <div className="space-y-8">
                <BiographySection
                    bio={tributeData.bio}
                    onChange={value => handleInputChange("bio", value)}
                />
                <MilestonesSection
                    milestones={tributeData.milestone}
                    onChange={value => handleInputChange("milestone", value)}
                />
                <FamilySection
                    family={tributeData.family}
                    onMemberChange={handleFamilyMemberChange}
                    onAddMember={addFamilyMember}
                />
                <NavigationButtons
                    id={id}
                    onSave={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">Saving changes...</span>
        </div>
    </div>
)

const Header = ({ title }) => (
    <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-medium text-gray-600">{title}</h1>
    </div>
)

const BiographySection = ({ bio, onChange }) => (
    <section>
        <h3 className="text-xl text-gray-500 mb-4">BIOGRAPHY</h3>
        <Textarea
            placeholder="Biography of the bereaved"
            className="min-h-[200px] border-blue-100"
            value={bio}
            onChange={e => onChange(e.target.value)}
        />
    </section>
)

const MilestonesSection = ({ milestones, onChange }) => {
    const handleDelete = (index) => {
        const updatedMilestones = milestones.filter((_, i) => i !== index);
        onChange(updatedMilestones);
    };

    const handleAddMilestone = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            onChange([...milestones, e.target.value.trim()]);
            e.target.value = '';
        }
    };

    return (
        <section>
            <h3 className="text-xl text-gray-500 mb-4">MILESTONES</h3>
            <div className="space-y-2">
                <Input
                    type="text"
                    placeholder="Add new milestone"
                    onKeyDown={handleAddMilestone}
                    className="flex-1"
                />
                {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Input
                            type="text"
                            value={milestone}
                            onChange={(e) => {
                                const updatedMilestones = [...milestones];
                                updatedMilestones[index] = e.target.value;
                                onChange(updatedMilestones);
                            }}
                            className="flex-1"
                        />
                        <Button
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => handleDelete(index)}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};

const FamilySection = ({ family, onMemberChange, onAddMember }) => (
    <section>
        <h3 className="text-xl text-gray-500 mb-4">FAMILY</h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {family.map((member, index) => (
                <FamilyMemberCard
                    key={index}
                    member={member}
                    index={index}
                    onChange={onMemberChange}
                />
            ))}
            <AddFamilyButton onClick={onAddMember} />
        </div>
    </section>
)

const FamilyMemberCard = ({ member, index, onChange }) => (
    <Card className="p-6">
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`fullName-${index}`}>
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                </Label>
                <Input
                    id={`fullName-${index}`}
                    value={member.full_name}
                    onChange={e => onChange(index, "full_name", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`relationship-${index}`}>
                    <User className="w-4 h-4 inline mr-2" />
                    Relationship
                </Label>
                <Select
                    value={member.relationship}
                    onValueChange={value => onChange(index, "relationship", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                        {["Spouse", "Child", "Parent", "Sibling"].map(relation => (
                            <SelectItem
                                key={relation.toLowerCase()}
                                value={relation.toLowerCase()}
                                className={`bg-white`}
                            >
                                {relation}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    </Card>
)

const AddFamilyButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center"
    >
        ADD FAMILY
    </button>
)

const NavigationButtons = ({ id, onSave, isLoading }) => (
    <div className="flex justify-between pt-8">
        <Link to={`/dashboard/memories-overview/${id}`}>
            <Button variant="default" className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8">
                Tribute Overview
            </Button>

        </Link>
        <Button
            variant="default"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8"
            onClick={onSave}
            disabled={isLoading}
        >
            {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Link to={`/dashboard/memories/events/${id}`}>
            <Button variant="default" className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8">
                Events
            </Button>
        </Link>
    </div>
)
