"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
    Plus,
    Loader2,
    Edit,
    Save,
    Calendar,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Info,
    CalendarPlus,
    AlertCircle,
    Heart,
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminMemoriesEvents() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [events, setEvents] = useState([])
    const [newEvent, setNewEvent] = useState({
        id: "",
        title: "",
        event_location: "",
        event_date: "",
        event_time: "",
        description: "",
        event_type: {
            is_private: false,
            is_work_in_progress: false,
            is_no_event: false,
            is_nothing_to_share: false,
        },
        guest_option: {
            can_rsvp: false,
            limited_rsvp: false,
            allow_guestlist: false,
        },
    })
    const [title, setTitle] = useState("TRIBUTE")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [eventToDelete, setEventToDelete] = useState(null)
    const [activeTab, setActiveTab] = useState("add")
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        fetchTributeTitle()
        fetchEvents()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(`${server}/tribute/title/image/${user.id}`)
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${server}/events/${id}`)
            setEvents(Array.isArray(response.data) ? response.data : [response.data])
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn("Resource not found, proceeding with default data.")
                setEvents([])
            } else {
                toast.error("Failed to load events. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewEvent((prev) => ({ ...prev, [name]: value }))

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target
        setEditingEvent((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (category, name) => {
        setNewEvent((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [name]: !prev[category][name],
            },
        }))
    }

    const handleEditCheckboxChange = (category, name) => {
        setEditingEvent((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [name]: !prev[category][name],
            },
        }))
    }

    const validateEventForm = (event) => {
        const errors = {}

        if (!event.title.trim()) {
            errors.title = "Event title is required"
        }

        if (!event.event_date) {
            errors.event_date = "Event date is required"
        }

        if (!event.event_time) {
            errors.event_time = "Event time is required"
        }

        return errors
    }

    const handleAddEvent = async () => {
        const errors = validateEventForm(newEvent)

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                trubute_id: id,
                ...newEvent,
                event_type: JSON.stringify(newEvent.event_type),
                guest_option: JSON.stringify(newEvent.guest_option),
            }
            const response = await axios.post(`${server}/events/${id}`, payload)
            setEvents([...events, response.data])
            toast.success("Event added successfully")
            resetEventForm()
            setActiveTab("list")
        } catch (error) {
            toast.error("Failed to add event. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditEvent = (eventId) => {
        const eventToEdit = events.find((event) => event.id === eventId)
        if (eventToEdit) {
            setEditingEvent({
                ...eventToEdit,
                event_type:
                    typeof eventToEdit.event_type === "string" ? JSON.parse(eventToEdit.event_type) : eventToEdit.event_type,
                guest_option:
                    typeof eventToEdit.guest_option === "string"
                        ? JSON.parse(eventToEdit.guest_option)
                        : eventToEdit.guest_option,
            })
            setIsModalOpen(true)
        }
    }

    const handleEditingEvent = async () => {
        const errors = validateEventForm(editingEvent)

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        try {
            // Format the time to match H:i format (24-hour)
            const formattedTime = new Date(`2000-01-01T${editingEvent.event_time}`).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })

            const payload = {
                title: editingEvent.title,
                event_location: editingEvent.event_location,
                event_date: editingEvent.event_date,
                event_time: formattedTime,
                description: editingEvent.description,
                event_type: JSON.stringify(editingEvent.event_type),
                guest_option: JSON.stringify(editingEvent.guest_option),
            }

            await axios.put(`${server}/events/${editingEvent.id}`, payload)
            setIsModalOpen(false)
            fetchEvents()
            toast.success("Event updated successfully")
        } catch (error) {
            console.error("Error updating event:", error)
            toast.error("Failed to update event. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteClick = (event) => {
        setEventToDelete(event)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return

        setIsSubmitting(true)
        try {
            await axios.delete(`${server}/tributes/delete/events/${eventToDelete.id}`)
            setEvents(events.filter((event) => event.id !== eventToDelete.id))
            toast.success("Event deleted successfully")
            setIsDeleteDialogOpen(false)
            setEventToDelete(null)
        } catch (error) {
            toast.error("Failed to delete event. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetEventForm = () => {
        setNewEvent({
            id: "",
            title: "",
            event_location: "",
            event_date: "",
            event_time: "",
            description: "",
            event_type: {
                is_private: false,
                is_work_in_progress: false,
                is_no_event: false,
                is_nothing_to_share: false,
            },
            guest_option: {
                can_rsvp: false,
                limited_rsvp: false,
                allow_guestlist: false,
            },
        })
        setFormErrors({})
    }

    const getCompletionPercentage = () => {
        // Consider the section complete if at least one event has been added
        return events.length > 0 ? 100 : 0
    }

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        } catch (e) {
            return dateString
        }
    }

    const formatTime = (timeString) => {
        try {
            // Handle different time formats
            let time = timeString
            if (!timeString.includes(":")) {
                time = `${timeString}:00`
            }

            return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })
        } catch (e) {
            return timeString
        }
    }

    return (
        <div className="bg-[#f8f4f0] min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-between text-xs sm:text-sm text-[#4a5568] mb-2 gap-2">
                        <span className="font-medium text-[#2a3342]">Basic Info</span>
                        <span>Life</span>
                        <span>Events & Donations</span>
                        <span>Memories</span>
                    </div>
                    <Progress value={60} className="h-2 bg-[#e5e0d9]" indicatorClassName="bg-[#fcd34d]" />
                </div>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="pb-2 border-b">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <CardTitle className="text-3xl font-serif text-[#2a3342]">{title}</CardTitle>
                                <CardDescription className="text-[#4a5568]">
                                    Add memorial events, services, and gatherings
                                </CardDescription>
                            </div>

                            {/* Completion Badge */}
                            <Badge
                                variant={getCompletionPercentage() === 100 ? "default" : "outline"}
                                className={`${
                                    getCompletionPercentage() === 100
                                        ? "bg-[#fcd34d] hover:bg-[#645a52]"
                                        : "text-[#fcd34d] border-[#fcd34d]"
                                }`}
                            >
                                {getCompletionPercentage() === 100 ? (
                                    <span className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" /> Complete
                  </span>
                                ) : (
                                    <span>Add at least one event</span>
                                )}
                            </Badge>
                        </div>
                    </CardHeader>

                    {isLoading ? (
                        <CardContent className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#fcd34d]" />
                        </CardContent>
                    ) : (
                        <>
                            <CardContent className="p-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid grid-cols-2 mb-6 bg-[#f0ece6]">
                                        <TabsTrigger
                                            value="add"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                        >
                                            <CalendarPlus className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Add Event
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="list"
                                            className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white"
                                        >
                                            <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
                                            Event List {events.length > 0 && `(${events.length})`}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="add" className="mt-0 space-y-6">
                                        <AddEventForm
                                            newEvent={newEvent}
                                            handleInputChange={handleInputChange}
                                            handleCheckboxChange={handleCheckboxChange}
                                            handleAddEvent={handleAddEvent}
                                            isSubmitting={isSubmitting}
                                            formErrors={formErrors}
                                        />
                                    </TabsContent>

                                    <TabsContent value="list" className="mt-0 space-y-6">
                                        <EventList
                                            events={events}
                                            handleEditEvent={handleEditEvent}
                                            handleDeleteClick={handleDeleteClick}
                                            formatDate={formatDate}
                                            formatTime={formatTime}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>

                            <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t p-6 gap-4">
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Link to={`/admin/dashboard/tribute-life/${id}`} className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full border-[#fcd34d]  hover:bg-[#f5f0ea]">
                                            <ChevronLeft className="h-4 w-4 mr-2" /> Life Story
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Link to={`/admin/dashboard/memories/donations/${id}`} className="w-full sm:w-auto">
                                        <Button className="w-full bg-[#fcd34d] hover:bg-[#645a52] text-white">
                                            Continue <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>

            {/* Edit Event Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-white max-w-4xl mx-auto rounded-lg overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif text-[#2a3342]">Edit Event</DialogTitle>
                        <DialogDescription className="text-[#4a5568]">Make changes to the event details below</DialogDescription>
                    </DialogHeader>

                    {editingEvent && (
                        <div className="space-y-6 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-title" className="text-[#4a5568] flex items-center">
                                        Event Title <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Input
                                        id="edit-title"
                                        name="title"
                                        value={editingEvent.title}
                                        onChange={handleEditInputChange}
                                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                        placeholder="Memorial Service, Celebration of Life, etc."
                                    />
                                    {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-event_location" className="text-[#4a5568]">
                                        Location
                                    </Label>
                                    <Input
                                        id="edit-event_location"
                                        name="event_location"
                                        value={editingEvent.event_location}
                                        onChange={handleEditInputChange}
                                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                        placeholder="Church, Cemetery, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-event_date" className="text-[#4a5568] flex items-center">
                                        Date <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Input
                                        id="edit-event_date"
                                        name="event_date"
                                        type="date"
                                        value={editingEvent.event_date}
                                        onChange={handleEditInputChange}
                                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                    />
                                    {formErrors.event_date && <p className="text-red-500 text-xs mt-1">{formErrors.event_date}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-event_time" className="text-[#4a5568] flex items-center">
                                        Time <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Input
                                        id="edit-event_time"
                                        name="event_time"
                                        type="time"
                                        value={editingEvent.event_time}
                                        onChange={handleEditInputChange}
                                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                                    />
                                    {formErrors.event_time && <p className="text-red-500 text-xs mt-1">{formErrors.event_time}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description" className="text-[#4a5568]">
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    name="description"
                                    rows="3"
                                    value={editingEvent.description}
                                    onChange={handleEditInputChange}
                                    className="min-h-[100px] border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 resize-none"
                                    placeholder="Enter event details, directions, or special instructions..."
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[#4a5568]">Event Type</Label>
                                    <div className="flex items-center space-x-2 bg-[#f8f4f0] p-3 rounded-md">
                                        <Checkbox
                                            id="edit-is_private"
                                            checked={editingEvent.event_type.is_private}
                                            onCheckedChange={() => handleEditCheckboxChange("event_type", "is_private")}
                                            className="data-[state=checked]:bg-[#fcd34d] data-[state=checked]:border-[#fcd34d]"
                                        />
                                        <Label htmlFor="edit-is_private" className="text-[#4a5568] cursor-pointer">
                                            Private Event
                                        </Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-4 w-4 text-[#fcd34d] ml-1" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Private events are only visible to invited guests</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4a5568]">Guest Options</Label>
                                    <div className="flex items-center space-x-2 bg-[#f8f4f0] p-3 rounded-md">
                                        <Checkbox
                                            id="edit-can_rsvp"
                                            checked={editingEvent.guest_option.can_rsvp}
                                            onCheckedChange={() => handleEditCheckboxChange("guest_option", "can_rsvp")}
                                            className="data-[state=checked]:bg-[#fcd34d] data-[state=checked]:border-[#fcd34d]"
                                        />
                                        <Label htmlFor="edit-can_rsvp" className="text-[#4a5568] cursor-pointer">
                                            Allow RSVP
                                        </Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-4 w-4 text-[#fcd34d] ml-1" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Let visitors RSVP to this event</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="mt-3 sm:mt-0 border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleEditingEvent}
                            disabled={isSubmitting}
                            className="bg-[#fcd34d] hover:bg-[#645a52] text-white"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-white max-w-md mx-auto rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-medium text-[#2a3342]">Delete Event</DialogTitle>
                        <DialogDescription className="text-[#4a5568]">
                            Are you sure you want to delete this event? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {eventToDelete && (
                        <div className="py-4">
                            <div className="bg-[#f8f4f0] p-4 rounded-md mb-4">
                                <h4 className="font-medium text-[#2a3342]">{eventToDelete.title}</h4>
                                <p className="text-sm text-[#4a5568]">
                                    {formatDate(eventToDelete.event_date)} at {formatTime(eventToDelete.event_time)}
                                </p>
                            </div>
                            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>This will permanently remove the event from the tribute.</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="mt-3 sm:mt-0 border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleDeleteEvent}
                            disabled={isSubmitting}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            {isSubmitting ? "Deleting..." : "Delete Event"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const AddEventForm = ({
                          newEvent,
                          handleInputChange,
                          handleCheckboxChange,
                          handleAddEvent,
                          isSubmitting,
                          formErrors,
                      }) => (
    <div className="bg-[#f8f4f0] p-6 rounded-lg">
        <div className="flex items-center mb-4">
            <CalendarPlus className="h-5 w-5 text-[#fcd34d] mr-2" />
            <h3 className="text-xl font-medium text-[#2a3342]">Create New Event</h3>
        </div>
        <p className="text-[#4a5568] mb-6">Add memorial services, gatherings, or other events related to your loved one.</p>

        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-[#4a5568] flex items-center">
                        Event Title <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        className={`border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 ${
                            formErrors.title ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
                        }`}
                        placeholder="Memorial Service, Celebration of Life, etc."
                    />
                    {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event_location" className="text-[#4a5568]">
                        Location
                    </Label>
                    <Input
                        id="event_location"
                        name="event_location"
                        value={newEvent.event_location}
                        onChange={handleInputChange}
                        className="border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20"
                        placeholder="Church, Cemetery, etc."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event_date" className="text-[#4a5568] flex items-center">
                        Date <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                        id="event_date"
                        name="event_date"
                        type="date"
                        value={newEvent.event_date}
                        onChange={handleInputChange}
                        className={`border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 ${
                            formErrors.event_date ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
                        }`}
                    />
                    {formErrors.event_date && <p className="text-red-500 text-xs mt-1">{formErrors.event_date}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event_time" className="text-[#4a5568] flex items-center">
                        Time <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                        id="event_time"
                        name="event_time"
                        type="time"
                        value={newEvent.event_time}
                        onChange={handleInputChange}
                        className={`border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 ${
                            formErrors.event_time ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
                        }`}
                    />
                    {formErrors.event_time && <p className="text-red-500 text-xs mt-1">{formErrors.event_time}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-[#4a5568]">
                    Description
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="min-h-[100px] border-[#e5e0d9] focus:border-[#fcd34d] focus:ring focus:ring-[#fcd34d]/20 resize-none"
                    placeholder="Enter event details, directions, or special instructions..."
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[#4a5568]">Event Type</Label>
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-md border border-[#e5e0d9]">
                        <Checkbox
                            id="is_private"
                            checked={newEvent.event_type.is_private}
                            onCheckedChange={() => handleCheckboxChange("event_type", "is_private")}
                            className="data-[state=checked]:bg-[#fcd34d] data-[state=checked]:border-[#fcd34d]"
                        />
                        <Label htmlFor="is_private" className="text-[#4a5568] cursor-pointer">
                            Private Event
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-[#fcd34d] ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Private events are only visible to invited guests</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[#4a5568]">Guest Options</Label>
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-md border border-[#e5e0d9]">
                        <Checkbox
                            id="can_rsvp"
                            checked={newEvent.guest_option.can_rsvp}
                            onCheckedChange={() => handleCheckboxChange("guest_option", "can_rsvp")}
                            className="data-[state=checked]:bg-[#fcd34d] data-[state=checked]:border-[#fcd34d]"
                        />
                        <Label htmlFor="can_rsvp" className="text-[#4a5568] cursor-pointer">
                            Allow RSVP
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-[#fcd34d] ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Let visitors RSVP to this event</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    onClick={handleAddEvent}
                    disabled={isSubmitting}
                    className="bg-[#fcd34d] hover:bg-[#645a52] text-white px-8"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {isSubmitting ? "Adding..." : "Add Event"}
                </Button>
            </div>
        </div>
    </div>
)

const EventList = ({ events, handleEditEvent, handleDeleteClick, formatDate, formatTime }) => (
    <div className="space-y-6">
        <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-[#fcd34d] mr-2" />
            <h3 className="text-xl font-medium text-[#2a3342]">Scheduled Events</h3>
        </div>

        {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#e5e0d9] rounded-lg bg-white">
                <Calendar className="h-12 w-12 text-[#e5e0d9] mb-4" />
                <p className="text-[#4a5568] text-center mb-2">No events added yet</p>
                <p className="text-sm text-[#4a5568] text-center max-w-md mb-6">
                    Add memorial services, gatherings, or other events to help visitors know when and where to pay their respects.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                    <Card key={event.id} className="border border-[#e5e0d9] hover:shadow-md transition-shadow overflow-hidden">
                        <div className="bg-[#fcd34d] h-2" />
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-medium text-[#2a3342] line-clamp-2">{event.title}</h3>
                                    {typeof event.event_type === "string" ? (
                                        JSON.parse(event.event_type).is_private
                                    ) : event.event_type.is_private ? (
                                        <Badge variant="outline" className="text-xs border-[#fcd34d] text-[#fcd34d]">
                                            Private
                                        </Badge>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-[#4a5568]">
                                        <Calendar className="mr-2 h-4 w-4 text-[#fcd34d] flex-shrink-0" />
                                        <span>{formatDate(event.event_date)}</span>
                                    </div>
                                    <div className="flex items-center text-[#4a5568]">
                                        <Clock className="mr-2 h-4 w-4 text-[#fcd34d] flex-shrink-0" />
                                        <span>{formatTime(event.event_time)}</span>
                                    </div>
                                    {event.event_location && (
                                        <div className="flex items-center text-[#4a5568]">
                                            <MapPin className="mr-2 h-4 w-4 text-[#fcd34d] flex-shrink-0" />
                                            <span className="line-clamp-1">{event.event_location}</span>
                                        </div>
                                    )}
                                </div>

                                {event.description && (
                                    <div className="text-sm text-[#4a5568] border-t border-[#e5e0d9] pt-3 mt-3">
                                        <p className="line-clamp-3">{event.description}</p>
                                    </div>
                                )}

                                <div className="flex space-x-2 pt-2">
                                    <Button
                                        onClick={() => handleEditEvent(event.id)}
                                        variant="outline"
                                        className="flex-1 border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                                    >
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteClick(event)}
                                        variant="outline"
                                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
    </div>
)
