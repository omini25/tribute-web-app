import React, {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {InfoCircledIcon} from "@radix-ui/react-icons";

export default function DeceasedInfoForm({ onSubmit }) {
    const [customMemorialWebsite, setCustomMemorialWebsite] = useState('');
    const [isEditingWebsite, setIsEditingWebsite] = useState(false);


    const [formData, setFormData] = useState({
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
        notYetPassed: false,
    })

    const handleChange = (name, value) => {  // Takes name and value
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit(formData)

        console.log(formData)
    }

    useEffect(() => {
        if (!isEditingWebsite) { // Only update if not manually editing
            const generateWebsiteLink = () => { // ... (same as before)
            };
            generateWebsiteLink();
        }
    }, [formData.deadFirstName, formData.deadLastName, isEditingWebsite]);

    useEffect(() => {
        const generateWebsiteLink = () => {
            if (formData.deadFirstName && formData.deadLastName) {
                const link = `www.rememberedalways/tribute/${formData.deadFirstName.toLowerCase()}-${formData.deadLastName.toLowerCase()}`;
                setCustomMemorialWebsite(link);
            } else {
                setCustomMemorialWebsite(''); // Clear if names are empty
            }
        };

        generateWebsiteLink(); // Call initially
    }, [formData.deadFirstName, formData.deadLastName]); // Watch for name changes


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Information about the Deceased</h2>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="deadFirstName">First Name</Label>
                    <Input
                        id="deadFirstName"
                        name="deadFirstName"
                        type="text"
                        placeholder="John"
                        value={formData.deadFirstName}
                        onChange={(e) => handleChange("deadFirstName", e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="deadLastName">Last Name</Label>
                    <Input
                        id="deadLastName"
                        name="deadLastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.deadLastName}
                        onChange={(e)=> handleChange("deadLastName", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                        id="middleName"
                        name="middleName"
                        type="text"
                        placeholder="Middle"
                        value={formData.middleName}
                        onChange={(e)=> handleChange("middleName", e.target.value)}

                    />
                </div>
                <div>
                    <Label htmlFor="nickname">Nick Name</Label>
                    <Input
                        id="nickname"
                        name="nickname"
                        type="text"
                        placeholder="Johnny"
                        value={formData.nickname}
                        onChange={(e)=> handleChange("nickname", e.target.value)}

                    />
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
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
                        onChange={(e) => handleChange("dateOfDeath", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="stateAndCountryLived">Country of Birth</Label>
                    <Input
                        id="stateAndCountryLived"
                        name="stateAndCountryLived"
                        type="text"
                        placeholder="E.g USA"
                        value={formData.stateAndCountryLived}
                        onChange={(e) => handleChange("stateAndCountryLived", e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="countryLivedIn">Country of Death</Label>
                    <Input
                        id="countryLivedIn"
                        name="countryLivedIn"
                        type="text"
                        placeholder="E.g Canada"
                        value={formData.countryLivedIn}
                        onChange={(e) => handleChange("countryLivedIn", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="relationshipWithBereaved">
                    Relationship with bereaved
                </label>
                <Select
                    label="Relationship with bereaved"
                    onValueChange={(value) => handleChange("relationshipWithBereaved", value)}
                    value={formData.relationshipWithBereaved}
                    >
                        <SelectTrigger className="bg-blue-50/50 border-secondary">
                           <SelectValue placeholder="Relationship with deceased"/>
                        </SelectTrigger>
                        <SelectContent className="bg-quaternary border-secondary">
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                        </SelectContent>
                    </Select>
            </div>

            {/* Custom memorial website */}
            <div>
                <label htmlFor="customMemorialWebsite">
                    Custom memorial website
                </label>
                <div className="relative">
                    <Input
                        label="Custom memorial website"
                        type="text"
                        placeholder="www.rememberedalways/tribute/johndoe"
                        value={customMemorialWebsite}
                        onChange={(e) => {
                            setIsEditingWebsite(true);
                            setCustomMemorialWebsite(e.target.value);
                        }}
                        className="bg-blue-50/50 border-secondary pr-10"
                        readOnly={!!(formData.deadFirstName && formData.deadLastName)}
                        rightIcon={<InfoCircledIcon className="text-blue-500"/>}
                        helperText="not available"
                    />
                </div>
                {/*<p className="text-sm text-gray-500 mt-1">not available</p>*/}
            </div>

                <Button type="submit" className="w-full">
                    Next
                </Button>
        </form>
)
}
