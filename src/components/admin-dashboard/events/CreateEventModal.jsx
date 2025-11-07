import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
// import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function CreateEventModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        event_date: new Date(),
        event_time: "12:00",
        event_location: "",
        additional_info: "",
        is_private: false
    })

    const [errors, setErrors] = useState({})

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    const handleDateChange = date => {
        setFormData(prev => ({
            ...prev,
            event_date: date
        }))

        if (errors.event_date) {
            setErrors(prev => ({
                ...prev,
                event_date: null
            }))
        }
    }

    const handlePrivateChange = checked => {
        setFormData(prev => ({
            ...prev,
            is_private: checked
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!formData.event_location.trim()) {
            newErrors.event_location = "Location is required"
        }

        if (!formData.event_date) {
            newErrors.event_date = "Date is required"
        }

        if (!formData.event_time.trim()) {
            newErrors.event_time = "Time is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (validateForm()) {
            // Create event_type object to match the expected structure
            const eventData = {
                ...formData,
                event_type: {
                    is_private: formData.is_private
                }
            }

            // Remove the is_private from the root level
            delete eventData.is_private

            onSubmit(eventData)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px] bg-white">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new memorial event.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter event title"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter event description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="event_date">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.event_date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.event_date ? (
                                            format(formData.event_date, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    {/*<Calendar*/}
                                    {/*    mode="single"*/}
                                    {/*    selected={formData.event_date}*/}
                                    {/*    onSelect={handleDateChange}*/}
                                    {/*    initialFocus*/}
                                    {/*/>*/}
                                </PopoverContent>
                            </Popover>
                            {errors.event_date && (
                                <p className="text-sm text-red-500">{errors.event_date}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="event_time">Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="event_time"
                                    name="event_time"
                                    type="time"
                                    value={formData.event_time}
                                    onChange={handleChange}
                                    className="pl-10"
                                />
                            </div>
                            {errors.event_time && (
                                <p className="text-sm text-red-500">{errors.event_time}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="event_location">Location</Label>
                        <Input
                            id="event_location"
                            name="event_location"
                            value={formData.event_location}
                            onChange={handleChange}
                            placeholder="Enter event location"
                        />
                        {errors.event_location && (
                            <p className="text-sm text-red-500">{errors.event_location}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="additional_info">Additional Information</Label>
                        <Textarea
                            id="additional_info"
                            name="additional_info"
                            value={formData.additional_info}
                            onChange={handleChange}
                            placeholder="Enter any additional information"
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_private"
                            checked={formData.is_private}
                            onCheckedChange={handlePrivateChange}
                        />
                        <Label htmlFor="is_private">Private Event</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Event</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
