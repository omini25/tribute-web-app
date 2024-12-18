"use client"

import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {User} from "lucide-react"
import {Link} from "react-router-dom";

export default function TributeLife() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-medium text-gray-600">TRIBUTE TITLE</h1>
                <h2 className="text-2xl text-gray-500">LIFE OF JOHN DOE</h2>
            </div>

            <div className="space-y-8">
                <section>
                    <h3 className="text-xl text-gray-500 mb-4">BIOGRAPHY</h3>
                    <Textarea
                        placeholder="Biography of the bereaved"
                        className="min-h-[200px] border-blue-100"
                    />
                </section>

                <section>
                    <h3 className="text-xl text-gray-500 mb-4">MILESTONES</h3>
                    <Textarea
                        placeholder="Milestones of the bereaved"
                        className="min-h-[200px] border-blue-100"
                    />
                </section>

                <section>
                    <h3 className="text-xl text-gray-500 mb-4">FAMILY</h3>
                    <div className="grid gap-8">
                        <Card className="p-6 max-w-xs">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">
                                        <User className="w-4 h-4 inline mr-2"/>
                                        Full Name
                                    </Label>
                                    <Input id="fullName"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="relationship">
                                        <User className="w-4 h-4 inline mr-2"/>
                                        Relationship
                                    </Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select relationship"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="spouse">Spouse</SelectItem>
                                            <SelectItem value="child">Child</SelectItem>
                                            <SelectItem value="parent">Parent</SelectItem>
                                            <SelectItem value="sibling">Sibling</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </Card>

                        <button
                            className="border-2 border-dashed border-blue-300 rounded-lg p-8 max-w-xs text-blue-500 hover:bg-blue-50 transition-colors">
                            ADD FAMILY
                        </button>
                    </div>
                </section>

                <div className="flex justify-between pt-8">
                   <Link to={`/dashboard/create-tribute`}>
                       <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                           TRIBUTE OVERVIEW
                       </Button>
                   </Link>
                    <Link to={`/dashboard/family-tree`}>
                        <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                            FAMILY TREE
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

