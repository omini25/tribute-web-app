import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"
import {Link, useParams} from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {server} from "@/server.js";

export default function MemoriesFamilyTree() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [familyData, setFamilyData] = useState({
        tribute_title: "",
        main_person: {
            name: "",
            id: null
        },
        parent: null,
        left_family: null,
        right_family: null,
        child: null
    })

    const [newFamilyMember, setNewFamilyMember] = useState({
        name: "",
        birth_date: "",
        death_date: "",
        relationship: "",
        bio: ""
    })

    const [title, setTitle] = useState("TRIBUTE");
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`${server}/tribute/title/image/${user.id}`)
            .then(response => {
                const { title } = response.data;
                console.log(response.data);
                setTitle(title || "TRIBUTE");
            })
            .catch(error => {
                console.error('Error fetching tribute data:', error);
            });
    }, []);

    useEffect(() => {
        fetchFamilyTreeData()
    }, [])

    const fetchFamilyTreeData = async () => {
        try {
            const response = await axios.get(`${server}/tributes/${id}/family-tree`)
            setFamilyData(response.data)
            setIsLoading(false)
        } catch (error) {
            // toast.error("Failed to load family tree data")
            setIsLoading(false)
        }
    }

    const handleAddFamilyClick = (position) => {
        setSelectedPosition(position)
        setNewFamilyMember({
            name: "",
            birth_date: "",
            death_date: "",
            relationship: position,
            bio: ""
        })
        setIsModalOpen(true)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewFamilyMember(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await axios.post(`${server}/tributes/family-tree/update`, {
                ...newFamilyMember,
                position: selectedPosition,
                tribute_id: id,
                people_id: familyData.main_person.id
            })

            setFamilyData(prev => ({
                ...prev,
                [selectedPosition]: response.data
            }))

            toast.success("Family member added successfully")
            setIsModalOpen(false)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add family member")
        } finally {
            setIsSubmitting(false)
        }
    }

    const AddFamilyMemberModal = () => (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Family Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={newFamilyMember.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="birth_date">Birth Date</Label>
                        <Input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            value={newFamilyMember.birth_date}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="death_date">Death Date</Label>
                        <Input
                            id="death_date"
                            name="death_date"
                            type="date"
                            value={newFamilyMember.death_date}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="relationship">Relationship</Label>
                        <Input
                            id="relationship"
                            name="relationship"
                            value={selectedPosition}
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={newFamilyMember.bio}
                            onChange={handleInputChange}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner className="mr-2" /> : null}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

    const FamilyMemberCard = ({ member, position }) => {
        if (member) {
            return (
                <Card className="w-48 h-32 bg-blue-100">
                    <div className="h-full flex flex-col items-center justify-center space-y-2">
                        <User className="w-8 h-8 text-blue-500" />
                        <span className="font-medium text-blue-700">{member.name}</span>
                        {member.birth_date && (
                            <span className="text-sm text-blue-600">
                                {new Date(member.birth_date).getFullYear()}
                                {member.death_date && ` - ${new Date(member.death_date).getFullYear()}`}
                            </span>
                        )}
                    </div>
                </Card>
            )
        }

        return (
            <button
                onClick={() => handleAddFamilyClick(position)}
                disabled={isSubmitting}
                className="w-48 h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
            >
                ADD FAMILY
            </button>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">

            <AddFamilyMemberModal />

            <div className="space-y-2 mb-16">
                <h1 className="text-4xl font-medium text-gray-600">{title}</h1>
            </div>

            <div className="grid grid-cols-3 gap-8 place-items-center mb-16">
                {/* Parent Position */}
                <div className="col-start-2">
                    <FamilyMemberCard position="parent" member={familyData.parent} />
                </div>

                {/* Left Sibling/Spouse Position */}
                <div className="col-start-1 row-start-2">
                    <FamilyMemberCard position="left_family" member={familyData.left_family} />
                </div>

                {/* Center Profile */}
                <Card className="w-48 h-32 bg-blue-100 col-start-2 row-start-2">
                    <div className="h-full flex flex-col items-center justify-center space-y-2">
                        <User className="w-8 h-8 text-blue-500" />
                        <span className="font-medium text-blue-700">{familyData.main_person.name}</span>
                    </div>
                </Card>

                {/* Right Sibling/Spouse Position */}
                <div className="col-start-3 row-start-2">
                    <FamilyMemberCard position="right_family" member={familyData.right_family} />
                </div>

                {/* Child Position */}
                <div className="col-start-2 row-start-3">
                    <FamilyMemberCard position="child" member={familyData.child} />
                </div>
            </div>

            <div className="flex justify-between mt-16">
                <Link to={`/dashboard/tribute-life/${id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                        LIFE
                    </Button>
                </Link>
                <Link to={`/dashboard/memories/events/${id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                        EVENTS
                    </Button>
                </Link>
            </div>
        </div>
    )
}