import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"


export default function TributeFormOverview() {
    const [notPassed, setNotPassed] = useState(false)

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-light text-gray-600">TRIBUTE TITLE</h1>
                    <h2 className="text-2xl font-light text-gray-500">OVERVIEW</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form Fields */}
                    <div className="space-y-6">
                        {/* Name Fields */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-blue-500">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    placeholder="John Doe"
                                    className="bg-blue-50 border-blue-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="middleName" className="text-blue-500">
                                    Middle Name
                                </Label>
                                <Input
                                    id="middleName"
                                    placeholder="John Doe"
                                    className="bg-blue-50 border-blue-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-blue-500">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    placeholder="John Doe"
                                    className="bg-blue-50 border-blue-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nickname" className="text-blue-500">
                                    Nickname
                                </Label>
                                <Input
                                    id="nickname"
                                    placeholder="John Doe"
                                    className="bg-blue-50 border-blue-100"
                                />
                            </div>
                        </div>

                        {/* Relationship Field */}
                        <div className="space-y-2">
                            <Label className="text-blue-500">
                                Relationship with bereaved
                            </Label>
                            <Select>
                                <SelectTrigger className="bg-blue-50 border-blue-100">
                                    <SelectValue placeholder="Father" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="father">Father</SelectItem>
                                    <SelectItem value="mother">Mother</SelectItem>
                                    <SelectItem value="sibling">Sibling</SelectItem>
                                    <SelectItem value="spouse">Spouse</SelectItem>
                                    <SelectItem value="child">Child</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date of Death */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-blue-500">Date of death</Label>
                                <Select disabled={notPassed}>
                                    <SelectTrigger className="bg-blue-50 border-blue-100">
                                        <SelectValue placeholder="05 / 21" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="05/21">05 / 21</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="notPassed"
                                    checked={notPassed}
                                    onCheckedChange={checked => setNotPassed(checked)}
                                />
                                <Label htmlFor="notPassed" className="text-gray-500">
                                    Not yet passed
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image Upload and Additional Fields */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="bg-blue-100 p-6 rounded-lg text-center">
                            <Button
                                variant="ghost"
                                className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-blue-500"
                            >
                                <Upload className="h-8 w-8 mb-2" />
                                <span>UPLOAD PERSON'S IMAGE</span>
                            </Button>
                        </div>

                        {/* Additional Fields */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-blue-500">Date of birth</Label>
                                <Select>
                                    <SelectTrigger className="bg-blue-50 border-blue-100">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Select Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-blue-500">State and country lived</Label>
                                <Select>
                                    <SelectTrigger className="bg-blue-50 border-blue-100">
                                        <SelectValue placeholder="Select 1" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="location">Select Location</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-blue-500">Custom memorial website</Label>
                                <Input
                                    placeholder="www.twaf/tribute/johndoe"
                                    className="bg-blue-50 border-blue-100"
                                />
                                <p className="text-sm text-gray-400">not available</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote Section */}
                <div className="relative max-w-2xl mx-auto text-center py-8">
                    <div className="text-6xl text-blue-200 absolute top 0 left-0">"</div>
                    <p className="text-blue-400 italic text-lg">
                        User Enter Short quote about the bereaved
                        <br />
                        or about death
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <Link to="/dashboard/tribute-life">  {/* Wrap the button in a Link */}
                        <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8">
                            LIFE OF PERSON
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
