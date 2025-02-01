import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DonationForm() {
    const { id } = useParams()
    const [tribute, setTribute] = useState({
        no_donations: false,
        allow_anonymous: false,
        tribute_name: "",
        notify_users: "",
        end_date: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title, setTitle] = useState("TRIBUTE")

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

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

    const fetchTributeDetails = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            setTribute(response.data)
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            toast.error("Failed to load tribute details")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setTribute(prev => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = name => {
        setTribute(prev => ({ ...prev, [name]: !prev[name] }))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            await axios.put(`${server}/tributes/donations/${id}`, tribute)
            toast.success("Tribute updated successfully!")
        } catch (error) {
            console.error("Error updating tribute:", error)
            toast.error("Failed to update tribute")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Header title={title} />
            <Card className="p-6">
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    className="space-y-8"
                >
                    <DonationOptions tribute={tribute} onChange={handleCheckboxChange} />
                    <FormFields tribute={tribute} onChange={handleInputChange} />
                    <no_limitOption
                        checked={tribute.no_limit}
                        onChange={() => handleCheckboxChange("no_limit")}
                    />
                    <SubmitButton isSubmitting={isSubmitting} />
                </form>
            </Card>
            <NavigationButtons id={id} />
        </div>
    )
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
)

const Header = ({ title }) => (
    <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-medium text-gray-600">{title}</h1>
        <h2 className="text-2xl text-gray-500">DONATIONS</h2>
    </div>
)

const DonationOptions = ({ tribute, onChange }) => (
    <div className="flex flex-wrap gap-6">
        {["no_donations", "allow_anonymous"].map(option => (
            <div key={option} className="flex items-center space-x-2">
                <Checkbox
                    id={option}
                    checked={tribute[option]}
                    onCheckedChange={() => onChange(option)}
                />
                <Label htmlFor={option} className="text-blue-500">
                    {option === "no_donations" ? "No Donations" : "Allow Anonymous"}
                </Label>
            </div>
        ))}
    </div>
)

const FormFields = ({ tribute, onChange }) => (
    <div className="grid md:grid-cols-2 gap-6">
        {[
            { name: "tribute_name", label: "Tribute Donation Name", type: "text" },
            { name: "end_date", label: "Date To End", type: "date" },
        ].map(field => (
            <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-blue-500">
                    {field.label}
                </Label>
                <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    checked={field.type === "checkbox" ? tribute[field.name] : undefined}
                    value={field.type !== "checkbox" ? tribute[field.name] : undefined}
                    onChange={onChange}
                    className="border-blue-100"
                />
            </div>
        ))}
    </div>
)



const SubmitButton = ({ isSubmitting }) => (
    <div className="flex justify-center mt-8">
        <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]"
        >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
        </Button>
    </div>
)

const NavigationButtons = ({ id }) => (
    <div className="flex justify-between mt-16">
        <Link to={`/dashboard/memories/memories/${id}`}>
            <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]">
                Memories
            </Button>
        </Link>
        <Link to={`/dashboard/memories/music-theme/${id}`}>
            <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]">
                Music and Theme
            </Button>
        </Link>
    </div>
)
