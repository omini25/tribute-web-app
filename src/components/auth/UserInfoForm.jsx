import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const InputField = ({ label, id, type = "text", placeholder, value, onChange, required = true, className = "" }) => (
    <div className="w-full">
        <Label htmlFor={id} className="block mb-2 text-sm font-medium">
            {label}
        </Label>
        <Input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full p-2 rounded-md border ${className}`}
        />
    </div>
)

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string
}

export default function UserInfoForm({ onSubmit }) {
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('signupFormData');
        return savedData ? JSON.parse(savedData).user : {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        };
    });

    const handleChange = (name, value) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            const existingData = JSON.parse(localStorage.getItem('signupFormData') || '{}');
            localStorage.setItem('signupFormData', JSON.stringify({
                ...existingData,
                user: newData
            }));
            return newData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            return
        }
        onSubmit(formData)
        localStorage.removeItem('userFormData')
    }

    useEffect(() => {
        return () => {
            if (!document.location.pathname.includes('next-step')) {
                localStorage.removeItem('userFormData')
            }
        }
    }, [])

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Your Information</h2>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="First Name"
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                />
                <InputField
                    label="Last Name"
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="email@johndoe.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
                <InputField
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    placeholder="568928973"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Password"
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                />
                <InputField
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full mt-6">
                Next
            </Button>
        </form>
    )
}