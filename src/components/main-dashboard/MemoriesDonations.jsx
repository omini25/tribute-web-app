import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
    Loader2,
    DollarSign,
    Calendar,
    User,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"

export default function DonationForm() {
    const { id } = useParams()
    const [tribute, setTribute] = useState({
        no_donations: false,
        allow_anonymous: false,
        no_limit: false,
        tribute_name: "",
        notify_users: "",
        end_date: ""
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
            const user = JSON.parse(localStorage.getItem("user") || "{}")
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
            toast({
                title: "Error",
                description: "Failed to load tribute details. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setTribute(prev => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = name => {
        setTribute(prev => ({ ...prev, [name]: !prev[name] }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await axios.put(`${server}/tributes/donations/${id}`, tribute)
            toast({
                title: "Success",
                description: "Tribute updated successfully!"
            })
        } catch (error) {
            console.error("Error updating tribute:", error)
            toast({
                title: "Error",
                description: "Failed to update tribute. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-warm-500" />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-warm-800 text-center">
                            {title}
                        </CardTitle>
                        <p className="text-xl text-warm-600 text-center">DONATIONS</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <DonationOptions
                                tribute={tribute}
                                onChange={handleSwitchChange}
                            />
                            <FormFields tribute={tribute} onChange={handleInputChange} />
                            <NoLimitOption
                                checked={tribute.no_limit}
                                onChange={() => handleSwitchChange("no_limit")}
                            />
                            <SubmitButton isSubmitting={isSubmitting} />
                        </form>
                    </CardContent>
                </Card>
                <NavigationButtons id={id} />
            </div>
        </div>
    )
}

const DonationOptions = ({ tribute, onChange }) => (
    <div className="grid gap-6 md:grid-cols-2">
        {[
            { name: "no_donations", label: "No Donations", icon: DollarSign },
            { name: "allow_anonymous", label: "Allow Anonymous", icon: User }
        ].map(({ name, label, icon: Icon }) => (
            <div key={name} className="flex items-center space-x-4">
                <Switch
                    id={name}
                    checked={tribute[name]}
                    onCheckedChange={() => onChange(name)}
                />
                <Label
                    htmlFor={name}
                    className="text-warm-700 flex items-center space-x-2 cursor-pointer"
                >
                    <Icon className="h-5 w-5 text-warm-500" />
                    <span>{label}</span>
                </Label>
            </div>
        ))}
    </div>
)

const FormFields = ({ tribute, onChange }) => (
    <div className="grid md:grid-cols-2 gap-6">
        {[
            {
                name: "tribute_name",
                label: "Tribute Donation Name",
                type: "text",
                icon: DollarSign
            },
            { name: "end_date", label: "Date To End", type: "date", icon: Calendar }
        ].map(field => (
            <div key={field.name} className="space-y-2">
                <Label
                    htmlFor={field.name}
                    className="text-warm-700 flex items-center space-x-2"
                >
                    <field.icon className="h-5 w-5 text-warm-500" />
                    <span>{field.label}</span>
                </Label>
                <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={tribute[field.name]}
                    onChange={onChange}
                    className="border-warm-200"
                />
            </div>
        ))}
    </div>
)

const NoLimitOption = ({ checked, onChange }) => (
    <div className="flex items-center space-x-2">
        <Checkbox id="no_limit" checked={checked} onCheckedChange={onChange} />
        <Label htmlFor="no_limit" className="text-warm-700">
            No Limit on Donations
        </Label>
    </div>
)

const SubmitButton = ({ isSubmitting }) => (
    <div className="flex justify-center mt-8">
        <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-warm-500 hover:bg-warm-600  px-8 min-w-[120px]"
        >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
        </Button>
    </div>
)

const NavigationButtons = ({ id }) => (
    <div className="flex justify-between mt-8">
        <Link to={`/dashboard/memories/memories/${id}`}>
            <Button variant="outline" className="text-warm-700">
                <ChevronLeft className="h-4 w-4 mr-2" /> Memories
            </Button>
        </Link>
        <Link to={`/dashboard/memories/music-theme/${id}`}>
            <Button variant="outline" className="text-warm-700">
                Music and Theme <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </Link>
    </div>
)
