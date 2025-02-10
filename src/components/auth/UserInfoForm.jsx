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

    const FormField = ({ label, id, type = "text", placeholder, required = true }) => (
        <div className="w-full">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={formData[id]}
                onChange={handleChange}
                required={required}
                className="w-full"
            />
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Your Information</h2>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label="First Name"
                    id="firstName"
                    placeholder="John"
                />
                <FormField
                    label="Last Name"
                    id="lastName"
                    placeholder="Doe"
                />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="email@johndoe.com"
                />
                <FormField
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    placeholder="568928973"
                />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label="Password"
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                />
                <FormField
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••••"
                />
            </div>

            <Button type="submit" className="w-full mt-6">
                Next
            </Button>
        </form>
    )
}