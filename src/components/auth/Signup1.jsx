import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { InfoCircledIcon } from "@radix-ui/react-icons"

export default function Signup1({ onNext }) {
    const [step] = useState(1)

    return (
        <div className="max-w-3xl mx-auto p-6 mt-28">
            {/* Progress Tracker */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex-1 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="flex-1 h-[2px] bg-blue-500"></div>
                </div>
                <div className="flex-1 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                    <div className="flex-1 h-[2px] bg-gray-200"></div>
                </div>
                <div className="flex-1 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 -mt-8 mb-12">
                <span className="text-blue-500">MEMORIAL OWNER</span>
                <span>ABOUT YOU</span>
                <span>PLANS AND FEATURES</span>
            </div>

            {/* Form */}
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Added grid for two columns */}
                    <div>
                        <label className="block text-blue-500 mb-2">First Name</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            className="bg-blue-50/50 border-blue-100"
                        />
                    </div>

                    <div>  {/* Date of Birth now starts the second column */}
                        <label className="block text-blue-500 mb-2">Date of birth</label>
                        <Select>
                            <SelectTrigger className="bg-blue-50/50 border-blue-100">
                                <SelectValue placeholder="Select"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date1">January 1, 1990</SelectItem>
                                {/* Add more date options */}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">Middle Name</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            className="bg-blue-50/50 border-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">
                            State and country lived
                        </label>
                        <Select>
                            <SelectTrigger className="bg-blue-50/50 border-blue-100">
                                <SelectValue placeholder="Select 1"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us-ca">California, United States</SelectItem>
                                {/* Add more locations */}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">Last Name</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            className="bg-blue-50/50 border-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">
                            Custom memorial website
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="www.twa/tribute/johndoe"
                                className="bg-blue-50/50 border-blue-100 pr-10"
                            />
                            <InfoCircledIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"/>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">not available</p>
                    </div>


                    <div>
                        <label className="block text-blue-500 mb-2">Nickname</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            className="bg-blue-50/50 border-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">
                            Relationship with bereaved
                        </label>
                        <Select>
                            <SelectTrigger className="bg-blue-50/50 border-blue-100">
                                <SelectValue placeholder="Father"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="father">Father</SelectItem>
                                <SelectItem value="mother">Mother</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="spouse">Spouse</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    <div>
                        <label className="block text-blue-500 mb-2">Date of death</label>
                        <Select>
                            <SelectTrigger className="bg-blue-50/50 border-blue-100">
                                <SelectValue placeholder="05 / 21"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="05/21">05 / 21</SelectItem>
                                {/* Add more date options */}
                            </SelectContent>
                        </Select>
                        <div className="mt-2 flex items-center gap-2">
                            <Checkbox id="not-passed"/>
                            <label htmlFor="not-passed" className="text-sm text-gray-600">
                                Not yet passed
                            </label>
                        </div>
                    </div>
                </div>


                <div className="flex justify-end pt-4">
                    <Button
                        className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                        onClick={onNext}  // Call onNext when the button is clicked
                    >
                        NEXT
                    </Button>
                </div>
            </form>
        </div>
    )
}
