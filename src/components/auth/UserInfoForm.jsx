import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UserInfoForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            return
        }
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Information</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">Name Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@johndoe.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="568928973"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

            </div>

            {/*<Button type="submit" className="w-full">Next</Button>*/}
        </form>
    )
}

