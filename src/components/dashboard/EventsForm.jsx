import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import {Link} from "react-router-dom";

export default function EventsForm() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-medium text-gray-600">TRIBUTE TITLE</h1>
                <h2 className="text-2xl text-gray-500">EVENTS</h2>
            </div>

            <Card className="p-6">
                <div className="space-y-8">
                    {/* Event Status Options */}
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="private"/>
                            <Label htmlFor="private" className="text-blue-500">
                                Event is private
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="progress"/>
                            <Label htmlFor="progress" className="text-blue-500">
                                Event is still work in progress
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="noEvent"/>
                            <Label htmlFor="noEvent" className="text-blue-500">
                                No Event
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="nothing"/>
                            <Label htmlFor="nothing" className="text-blue-500">
                                Nothing to share
                            </Label>
                        </div>
                    </div>

                    {/* Event Details Form */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="eventName" className="text-blue-500">
                                Event Name
                            </Label>
                            <Input
                                id="eventName"
                                defaultValue="John Doe Tribute"
                                className="border-blue-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-blue-500">
                                Location
                            </Label>
                            <Input
                                id="location"
                                defaultValue="Dokota USA"
                                className="border-blue-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-blue-500">
                                Date
                            </Label>
                            <Input
                                id="date"
                                type="text"
                                defaultValue="15/21"
                                className="border-blue-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-blue-500">
                                Time
                            </Label>
                            <Input
                                id="time"
                                type="text"
                                defaultValue="15:39"
                                className="border-blue-100"
                            />
                        </div>
                    </div>

                    {/* RSVP Options */}
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="canRsvp"/>
                            <Label htmlFor="canRsvp" className="text-blue-500">
                                Can be RSVP
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="limitedRsvp"/>
                            <Label htmlFor="limitedRsvp" className="text-blue-500">
                                Limited RSVP
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="guestlist"/>
                            <Label htmlFor="guestlist" className="text-blue-500">
                                Allow Guestlist
                            </Label>
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="flex justify-center">
                        <Button
                            size="icon"
                            className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600"
                        >
                            <Plus className="h-6 w-6"/>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="flex justify-between mt-16">
                <Link to={`/dashboard/tribute-life`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                        LIFE
                    </Button>
                </Link>
                <Link to={`/dashboard/memories-form`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                       MEMORIES
                    </Button>
                </Link>
            </div>
        </div>
    )
}
