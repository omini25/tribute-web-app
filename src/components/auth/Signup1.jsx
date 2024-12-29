import React, {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { format } from 'date-fns';




export default function Signup1({ onNext, currentStep }) {
    const [customMemorialWebsite, setCustomMemorialWebsite] = useState('');
    const [isEditingWebsite, setIsEditingWebsite] = useState(false);

    const steps = ["MEMORIAL OWNER", "ABOUT YOU", "PLANS AND FEATURES"];


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
    });

    useEffect(() => {
        if (!isEditingWebsite) { // Only update if not manually editing
            const generateWebsiteLink = () => { // ... (same as before)
            };
            generateWebsiteLink();
        }
    }, [formData.deadFirstName, formData.deadLastName, isEditingWebsite]);

    const handleChange = (name, value) => {
        if (name === 'dateOfBirth' || name === 'dateOfDeath') {
            // Format the date value to 'YYYY-MM-DD'
            const formattedDate = format(value, 'yyyy-MM-dd');  // Use date-fns
            setFormData({ ...formData, [name]: formattedDate });
        } else {
            setFormData({ ...formData, [name]: value }); // handle other fields normally
        }

        if (name === 'deadFirstName' || name === 'deadLastName') {
            setIsEditingWebsite(false);
        }
    };

    const handleNext = () => {
        onNext(formData);
    };

    useEffect(() => {
        countries.registerLocale(enLocale);
    }, []);



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
        <div className="max-w-3xl mx-auto p-6 mt-28">
            {/* Progress Tracker */}
            <div className="flex justify-between items-center mb-12 relative">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex-1 flex items-center">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    index < currentStep ? "bg-primary" : "bg-gray-200"
                                }`}
                            />
                            {index < steps.length - 1 && ( // Only add line if not last step
                                <div
                                    className={`flex-1 h-[2px] ${
                                        index < currentStep - 1 ? "bg-primary" : "bg-gray-200"
                                    }`}
                                />
                            )}
                        </div>

                    </React.Fragment>
                ))}
            </div>

            <div className="flex justify-between text-sm text-gray-600 -mt-8 mb-12">
                {steps.map((step, index) => (
                    <span key={step} className={index + 1 === currentStep ? "text-primary font-semibold" : ""}>
                        {step}
                    </span>
                ))}
            </div>

            {/* Form */}
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Added grid for two columns */}
                    <div>
                        <label className="block text-primary mb-2">First Name</label>
                        <Input
                            label="First Name"
                            type="text"
                            placeholder="John"
                            value={formData.deadFirstName}
                            onChange={(e) => handleChange("deadFirstName", e.target.value)}
                            className="bg-blue-50/50 border-secondary"
                        />
                    </div>

                    {/* Relationship */}
                    <div>
                        <label className="block text-primary mb-2">
                            Relationship with bereaved
                        </label>
                        <Select
                            label="Relationship with bereaved"
                            onValueChange={(value) => handleChange("relationshipWithBereaved", value)}
                            value={formData.relationshipWithBereaved}
                        >
                            <SelectTrigger className="bg-blue-50/50 border-secondary">
                                <SelectValue placeholder="Father"/>
                            </SelectTrigger>
                            <SelectContent className="bg-quaternary border-secondary">
                                <SelectItem value="father">Father</SelectItem>
                                <SelectItem value="mother">Mother</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="spouse">Spouse</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-primary mb-2">Middle Name</label>
                        <Input
                            label="Middle Name"
                            type="text"
                            placeholder="Middle"
                            value={formData.middleName}
                            onChange={(e) => handleChange("middleName", e.target.value)}

                            className="bg-blue-50/50 border-secondary"
                        />
                    </div>

                    <div>
                        <label className="block text-primary mb-2">
                            Country From
                        </label>
                        <Select
                            onValueChange={(value) => handleChange("stateAndCountryLived", value)}
                            value={formData.stateAndCountryLived}
                        >
                            <SelectTrigger className="bg-blue-50/50 border-secondary">
                                <SelectValue placeholder="Select Country"/>
                            </SelectTrigger>
                            <SelectContent className="bg-quaternary border-secondary">
                                {Object.entries(countries.getNames('en', {select: 'official'})).map(([code, name]) => (
                                    <SelectItem key={code} value={code}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-primary mb-2">Last Name</label>
                        <Input
                            label="Last Name"
                            type="text"
                            placeholder="Doe"
                            value={formData.deadLastName}
                            onChange={(e) => handleChange("deadLastName", e.target.value)}
                            className="bg-blue-50/50 border-secondary"
                        />

                    </div>

                    {/* Country Lived In */}
                    <div>
                        <label className="block text-primary mb-2">
                            Country Lived In
                        </label>
                        <Select
                            onValueChange={(value) => handleChange("countryLivedIn", value)}  // Update correct state
                            value={formData.countryLivedIn}
                        >
                            <SelectTrigger className="bg-blue-50/50 border-secondary">
                                <SelectValue placeholder="Select Country"/>
                            </SelectTrigger>
                            <SelectContent className="bg-quaternary border-secondary">
                                {Object.entries(countries.getNames('en', {select: 'official'})).map(([code, name]) => (
                                    <SelectItem key={code} value={code}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nickname */}
                    <div>
                        <label className="block text-primary mb-2">Nickname</label>
                        <Input
                            label="Nickname"
                            type="text"
                            placeholder="Johnny"
                            value={formData.nickname}
                            onChange={(e) => handleChange("nickname", e.target.value)}
                            className="bg-blue-50/50 border-secondary"
                        />
                    </div>

                    {/* Custom memorial website */}
                    <div>
                        <label className="block text-primary mb-2">
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
                        <p className="text-sm text-gray-500 mt-1">not available</p>
                    </div>


                    {/* Date of birth */}
                    <div>
                        <label className="block text-primary mb-2">Date of birth</label>
                        <Calendar
                            onChange={(value) => handleChange("dateOfBirth", value)}
                            value={formData.dateOfBirth}
                        />
                    </div>


                    <div>
                        <label className="block text-primary mb-2">Date of death</label>
                        <Calendar
                            onChange={(value) => handleChange("dateOfDeath", value)}
                            value={formData.dateOfDeath}
                        />

                        <div className="mt-2 flex items-center gap-2"></div>

                        <div className="mt-2 flex items-center gap-2">
                            <Checkbox
                                id="not-passed"
                                checked={formData.notYetPassed}
                                onCheckedChange={(checked) => handleChange("notYetPassed", checked)}
                            />
                            <label htmlFor="not-passed" className="text-sm text-gray-600">
                                Not yet passed
                            </label>
                        </div>
                    </div>
                </div>


                <div className="flex justify-end pt-4">
                    <Button
                        className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                        onClick={handleNext}
                    >
                        NEXT
                    </Button>
                </div>
            </form>
        </div>
    )
}
