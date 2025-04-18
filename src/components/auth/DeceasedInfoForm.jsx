import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoCircledIcon } from "@radix-ui/react-icons"

const InputField = ({ label, id, type = "text", placeholder, value, onChange, required = false, readOnly = false, className = "" }) => (
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
            onChange={(e) => onChange(id, e.target.value)}
            required={required}
            readOnly={readOnly}
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
    readOnly: PropTypes.bool,
    className: PropTypes.string
}

export default function DeceasedInfoForm({ onSubmit }) {
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('signupFormData');
        return savedData ? JSON.parse(savedData).deceased : {
            deadFirstName: "",
            middleName: "",
            deadLastName: "",
            nickname: "",
            dateOfBirth: "",
            dateOfDeath: "",
            stateAndCountryLived: "",
            countryLivedIn: "",
            customMemorialWebsite: "",
            relationshipWithBereaved: "",
            notYetPassed: false
        };
    });

    // const [formData, setFormData] = useState(() => {
    //     const savedData = localStorage.getItem('deceasedFormData')
    //     return savedData ? JSON.parse(savedData) : initialFormData
    // })

    const [customMemorialWebsite, setCustomMemorialWebsite] = useState('')
    const [isEditingWebsite, setIsEditingWebsite] = useState(false)

    const handleChange = (name, value) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            const existingData = JSON.parse(localStorage.getItem('signupFormData') || '{}');
            localStorage.setItem('signupFormData', JSON.stringify({
                ...existingData,
                deceased: newData
            }));
            return newData;
        });
    };

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit(formData)
        localStorage.removeItem('deceasedFormData')
    }

    useEffect(() => {
        if (!isEditingWebsite && formData.deadFirstName && formData.deadLastName) {
            const link = `www.rememberedalways/tribute/${formData.deadFirstName.toLowerCase()}-${formData.deadLastName.toLowerCase()}`
            setCustomMemorialWebsite(link)
        }
    }, [formData.deadFirstName, formData.deadLastName, isEditingWebsite])


    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Information about the Deceased</h2>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="First Name"
                    id="deadFirstName"
                    placeholder="John"
                    value={formData.deadFirstName}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Last Name"
                    id="deadLastName"
                    placeholder="Doe"
                    value={formData.deadLastName}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Middle Name and Nickname */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Middle Name"
                    id="middleName"
                    placeholder="Middle"
                    value={formData.middleName}
                    onChange={handleChange}
                />
                <InputField
                    label="Nick Name"
                    id="nickname"
                    placeholder="Johnny"
                    value={formData.nickname}
                    onChange={handleChange}
                />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Date of Birth"
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Date of Death"
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Country Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Country of Birth"
                    id="stateAndCountryLived"
                    placeholder="E.g USA"
                    value={formData.stateAndCountryLived}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Country of Death"
                    id="countryLivedIn"
                    placeholder="E.g Canada"
                    value={formData.countryLivedIn}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Relationship Dropdown */}
            <div className="w-full">
                <Label htmlFor="relationshipWithBereaved" className="block mb-2 text-sm font-medium">
                    Relationship with deceased
                </Label>
                <Select
                    onValueChange={(value) => handleChange("relationshipWithBereaved", value)}
                    value={formData.relationshipWithBereaved}
                >
                    <SelectTrigger className="w-full bg-white border-secondary">
                        <SelectValue placeholder="Relationship with deceased"/>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-secondary w-full">
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Memorial Website */}
            <div className="w-full">
                <Label htmlFor="customMemorialWebsite" className="block mb-2 text-sm font-medium">
                    Custom memorial website
                </Label>
                <div className="relative">
                    <Input
                        id="customMemorialWebsite"
                        name="customMemorialWebsite"
                        type="text"
                        placeholder="www.rememberedalways/tribute/johndoe"
                        value={customMemorialWebsite}
                        onChange={(e) => {
                            setIsEditingWebsite(true)
                            setCustomMemorialWebsite(e.target.value)
                        }}
                        className="w-full bg-blue-50/50 border-secondary pr-10"
                        readOnly={!!(formData.deadFirstName && formData.deadLastName)}
                    />
                    <InfoCircledIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"/>
                </div>
            </div>

            <Button type="submit" className="w-full mt-6">
                Next
            </Button>
        </form>
    )
}

DeceasedInfoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}