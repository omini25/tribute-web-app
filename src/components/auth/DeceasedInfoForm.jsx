import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function DeceasedInfoForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        dateOfDeath: "",
        biography: ""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold">Information about the Deceased</h2>

            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="dateOfDeath">Date of Death</Label>
                    <Input
                        id="dateOfDeath"
                        name="dateOfDeath"
                        type="date"
                        value={formData.dateOfDeath}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="biography">Biography</Label>
                <Textarea
                    id="biography"
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    rows={4}
                />
            </div>

            <Button type="submit" className="w-full">
                Next
            </Button>
        </form>
    )
}
