import React, { useState, useEffect } from "react"
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
    Users, ChevronLeft, ChevronRight
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Trash } from "lucide-react";


export default function MemoriesEvents() {
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
            is_nothing_to_share: false
        },
        guest_option: {
            can_rsvp: false,
            limited_rsvp: false,
            allow_guestlist: false
        },
    })
    const [editingEventId, setEditingEventId] = useState(null)
    const [title, setTitle] = useState("TRIBUTE")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)

    useEffect(() => {
        fetchTributeTitle()
        fetchEvents()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
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
                toast({
                    title: "Error",
                    description: "Failed to load events. Please try again.",
                    variant: "destructive"
                })
            }
        } finally {
            setIsLoading(false)
        }
    }



    const handleInputChange = e => {
        const { name, value } = e.target
        if (editingEventId !== null) {
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === editingEventId ? { ...event, [name]: value } : event
                )
            )
        } else {
            setNewEvent(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleCheckboxChange = (category, name) => {
        if (editingEventId !== null) {
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === editingEventId
                        ? {
                            ...event,
                            [category]: {
                                ...event[category],
                                [name]: !event[category][name]
                            }
                        }
                        : event
                )
            )
        } else {
            setNewEvent(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [name]: !prev[category][name]
                }
            }))
        }
    }

    const handleAddEvent = async () => {
        setIsSubmitting(true)
        try {
            const payload = {
                trubute_id: id,
                ...newEvent,
                event_type: JSON.stringify(newEvent.event_type),
                guest_option: JSON.stringify(newEvent.guest_option)
            }
            const response = await axios.post(`${server}/events/${id}`, payload)
            setEvents([...events, response.data])
            toast.success("Event added successfully")
            resetEventForm()
        } catch (error) {
           toast.error("Failed to add event. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditEvent = eventId => {
        const eventToEdit = events.find(event => event.id === eventId)
        if (eventToEdit) {
            setEditingEvent({
                ...eventToEdit,
                event_type: JSON.parse(eventToEdit.event_type),
                guest_option: JSON.parse(eventToEdit.guest_option)
            })
            setIsModalOpen(true)
        }

    }

   const handleEditingEvent = async () => {
       try {
           // Format the time to match H:i format (24-hour)
           const formattedTime = new Date(`2000-01-01T${editingEvent.event_time}`)
               .toLocaleTimeString('en-GB', {
                   hour: '2-digit',
                   minute: '2-digit',
                   hour12: false
               });

           const payload = {
               title: editingEvent.title,
               event_location: editingEvent.event_location,
               event_date: editingEvent.event_date,
               event_time: formattedTime,
               description: editingEvent.description,
               event_type: JSON.stringify(editingEvent.event_type),
               guest_option: JSON.stringify(editingEvent.guest_option)
           };

           await axios.put(`${server}/events/${editingEvent.id}`, payload);
           setIsModalOpen(false);
           fetchEvents();
           toast.success("Event updated successfully");
       } catch (error) {
           console.error("Error updating event:", error);
           toast.error("Failed to update event. Please try again.");
       }
   };

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingEvent(null)
    }

    // Add this function near the other event handlers
    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`${server}/tributes/delete/events/${eventId}`);
            setEvents(events.filter(event => event.id !== eventId));
            toast.success("Event deleted successfully");
        } catch (error) {
            toast.error("Failed to delete event. Please try again.");
        }
    };

    const handleSaveEvent = async () => {
        setIsSubmitting(true)
        try {
            const eventToUpdate = events.find(event => event.id === editingEventId)
            if (!eventToUpdate) throw new Error("Event not found")
            const payload = {
                trubute_id: id,
                ...eventToUpdate,
                event_type: JSON.stringify(eventToUpdate.event_type),
                guest_option: JSON.stringify(eventToUpdate.guest_option),
                description: eventToUpdate.description,
                guestlist: eventToUpdate.guestlist
            }
            await axios.put(`${server}/events/${editingEventId}`, payload)
            toast.success("Event updated successfully")
            setEditingEventId(null)
            resetEventForm()
            fetchEvents()
        } catch (error) {
            toast.error("Failed to update event. Please try again.")
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
                is_nothing_to_share: false
            },
            guest_option: {
                can_rsvp: false,
                limited_rsvp: false,
                allow_guestlist: false
            },
            guestlist: ""
        })
    }



    if (isLoading) {
        return (
            <div>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-warm-500" />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-warm-800">
                            {title}
                        </CardTitle>
                        <p className="text-xl text-warm-600">EVENTS</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Card for adding/editing events */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-warm-700">
                                    {editingEventId !== null ? "Edit Event" : "Add New Event"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Event Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={
                                                editingEventId !== null
                                                    ? events.find(e => e.id === editingEventId)?.title
                                                    : newEvent.title
                                            }
                                            onChange={handleInputChange}
                                            className="border-warm-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_location">Location</Label>
                                        <Input
                                            id="event_location"
                                            name="event_location"
                                            value={
                                                editingEventId !== null
                                                    ? events.find(e => e.id === editingEventId)
                                                        ?.event_location
                                                    : newEvent.event_location
                                            }
                                            onChange={handleInputChange}
                                            className="border-warm-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_date">Date</Label>
                                        <Input
                                            id="event_date"
                                            name="event_date"
                                            type="date"
                                            value={
                                                editingEventId !== null
                                                    ? events.find(e => e.id === editingEventId)
                                                        ?.event_date
                                                    : newEvent.event_date
                                            }
                                            onChange={handleInputChange}
                                            className="border-warm-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_time">Time</Label>
                                        <Input
                                            id="event_time"
                                            name="event_time"
                                            type="time"
                                            value={
                                                editingEventId !== null
                                                    ? events.find(e => e.id === editingEventId)
                                                        ?.event_time
                                                    : newEvent.event_time
                                            }
                                            onChange={handleInputChange}
                                            className="border-warm-200"
                                        />
                                    </div>
                                </div>

                                {/* New Description Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={
                                            editingEventId !== null
                                                ? events.find(e => e.id === editingEventId)
                                                    ?.description
                                                : newEvent.description
                                        }
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-warm-200 rounded-md"
                                        placeholder="Enter event description..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Event Type</Label>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_private"
                                                checked={
                                                    editingEventId !== null
                                                        ? events.find(e => e.id === editingEventId)
                                                            ?.event_type.is_private
                                                        : newEvent.event_type.is_private
                                                }
                                                onCheckedChange={() =>
                                                    handleCheckboxChange("event_type", "is_private")
                                                }
                                            />
                                            <Label htmlFor="is_private">Private Event</Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Guest Options</Label>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="can_rsvp"
                                                checked={
                                                    editingEventId !== null
                                                        ? events.find(e => e.id === editingEventId)
                                                            ?.guest_option.can_rsvp
                                                        : newEvent.guest_option.can_rsvp
                                                }
                                                onCheckedChange={() =>
                                                    handleCheckboxChange("guest_option", "can_rsvp")
                                                }
                                            />
                                            <Label htmlFor="can_rsvp">Allow RSVP</Label>
                                        </div>

                                        {/* New option for guest list */}
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="allow_guestlist"
                                                checked={
                                                    editingEventId !== null
                                                        ? events.find(e => e.id === editingEventId)
                                                            ?.guest_option.allow_guestlist
                                                        : newEvent.guest_option.allow_guestlist
                                                }
                                                onCheckedChange={() =>
                                                    handleCheckboxChange("guest_option", "allow_guestlist")
                                                }
                                            />
                                            <Label htmlFor="allow_guestlist">Enable Guest List</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Guest List Section - Only shows when allow_guestlist is checked */}
                                {/*{((editingEventId !== null &&*/}
                                {/*        events.find(e => e.id === editingEventId)?.guest_option.allow_guestlist) ||*/}
                                {/*    (!editingEventId && newEvent.guest_option.allow_guestlist)) && (*/}
                                {/*    <div className="space-y-2 p-4 bg-warm-50 rounded-md">*/}
                                {/*        <Label htmlFor="guestlist">Guest List</Label>*/}
                                {/*        <div className="space-y-3">*/}
                                {/*            <textarea*/}
                                {/*                id="guestlist"*/}
                                {/*                name="guestlist"*/}
                                {/*                rows="4"*/}
                                {/*                value={*/}
                                {/*                    editingEventId !== null*/}
                                {/*                        ? events.find(e => e.id === editingEventId)*/}
                                {/*                        ?.guestlist || ""*/}
                                {/*                        : newEvent.guestlist || ""*/}
                                {/*                }*/}
                                {/*                onChange={handleInputChange}*/}
                                {/*                className="w-full p-2 border border-warm-200 rounded-md"*/}
                                {/*                placeholder="Enter guest names (one per line)"*/}
                                {/*            />*/}
                                {/*            <p className="text-sm text-warm-500">*/}
                                {/*                Add each guest on a new line. You can include their email addresses.*/}
                                {/*            </p>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                <div className="flex justify-center">
                                    <Button
                                        onClick={
                                            editingEventId !== null ? handleSaveEvent : handleAddEvent
                                        }
                                        disabled={isSubmitting}
                                        className="bg-warm-500 hover:bg-warm-600"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : editingEventId !== null ? (
                                            <Save className="h-4 w-4 mr-2" />
                                        ) : (
                                            <Plus className="h-4 w-4 mr-2" />
                                        )}
                                        {editingEventId !== null ? "Save Event" : "Add Event"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-warm-700">
                                    Event List
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {events.map(event => (
                                            <Card key={event.id} className="border border-warm-200 rounded-md">
                                                <CardContent className="space-y-2 p-6 bg-warm-50 rounded-md">
                                                    <h3 className="text-lg font-semibold text-warm-800">
                                                        {event.title}
                                                    </h3>
                                                    <div className="flex items-center text-warm-600">
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        <span>{event.event_location}</span>
                                                    </div>
                                                    <div className="flex items-center text-warm-600">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        <span>
                                                            {new Date(event.event_date).toLocaleDateString("en-GB")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-warm-600">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        <span>{event.event_time}</span>
                                                    </div>
                                                    <div className="flex items-center text-warm-600">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        <span>
                                                            {event.event_type && event.event_type.is_private
                                                                ? "Private Event"
                                                                : "Public Event"}
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            onClick={() => handleEditEvent(event.id)}
                                                            variant="outline"
                                                            className="flex-1"
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" /> Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                            variant="destructive"
                                                            className="flex-1"
                                                        >
                                                            <Trash className="h-4 w-4 mr-2" /> Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {isModalOpen && (
                            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                                <DialogContent className="bg-white max-w-4xl mx-auto p-4 rounded-md shadow-lg overflow-y-auto max-h-[90vh]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Event</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Event Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={editingEvent.title}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                            className="border-warm-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_location">Location</Label>
                                        <Input
                                            id="event_location"
                                            name="event_location"
                                            value={editingEvent.event_location}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, event_location: e.target.value })}
                                            className="border-warm-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_date">Date</Label>
                                        <Input
                                            id="event_date"
                                            name="event_date"
                                            type="date"
                                            value={editingEvent.event_date}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                                            className="border-warm-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_time">Time</Label>
                                        <Input
                                            id="event_time"
                                            name="event_time"
                                            type="time"
                                            value={editingEvent.event_time}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, event_time: e.target.value })}
                                            className="border-warm-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={editingEvent.description}
                                            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                            className="w-full p-2 border border-warm-200 rounded-md"
                                            placeholder="Enter event description..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Event Type</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_private"
                                                checked={editingEvent.event_type.is_private}
                                                onCheckedChange={() => setEditingEvent({
                                                    ...editingEvent,
                                                    event_type: { ...editingEvent.event_type, is_private: !editingEvent.event_type.is_private }
                                                })}
                                            />
                                            <Label htmlFor="is_private">Private Event</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Guest Options</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="can_rsvp"
                                                checked={editingEvent.guest_option.can_rsvp}
                                                onCheckedChange={() => setEditingEvent({
                                                    ...editingEvent,
                                                    guest_option: { ...editingEvent.guest_option, can_rsvp: !editingEvent.guest_option.can_rsvp }
                                                })}
                                            />
                                            <Label htmlFor="can_rsvp">Allow RSVP</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="allow_guestlist"
                                                checked={editingEvent.guest_option.allow_guestlist}
                                                onCheckedChange={() => setEditingEvent({
                                                    ...editingEvent,
                                                    guest_option: { ...editingEvent.guest_option, allow_guestlist: !editingEvent.guest_option.allow_guestlist }
                                                })}
                                            />
                                            <Label htmlFor="allow_guestlist">Enable Guest List</Label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCloseModal} className="mr-2">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleEditingEvent} className="bg-warm-500 hover:bg-warm-600">
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        <div className="flex justify-between mt-8">
                            <Link to={`/dashboard/tribute-life/${id}`}>
                                <Button variant="outline" className="text-warm-700">
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Life
                                </Button>
                            </Link>
                            <Link to={`/dashboard/memories/memories/${id}`}>
                                <Button variant="outline" className="text-warm-700">
                                    Memories <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}