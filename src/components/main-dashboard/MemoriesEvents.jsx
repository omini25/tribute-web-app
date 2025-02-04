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
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"

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
        }
    })
    const [editingEventId, setEditingEventId] = useState(null)
    const [title, setTitle] = useState("TRIBUTE")

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
            setIsLoading(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load events. Please try again.",
                variant: "destructive"
            })
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
            toast({
                title: "Success",
                description: "Event added successfully"
            })
            resetEventForm()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add event. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditEvent = eventId => {
        const eventToEdit = events.find(event => event.id === eventId)
        if (eventToEdit) {
            setNewEvent({
                ...eventToEdit,
                event_type: JSON.parse(eventToEdit.event_type),
                guest_option: JSON.parse(eventToEdit.guest_option)
            })
            setEditingEventId(eventId)
        }
    }

    const handleSaveEvent = async () => {
        setIsSubmitting(true)
        try {
            const eventToUpdate = events.find(event => event.id === editingEventId)
            if (!eventToUpdate) throw new Error("Event not found")
            const payload = {
                trubute_id: id,
                ...eventToUpdate,
                event_type: JSON.stringify(eventToUpdate.event_type),
                guest_option: JSON.stringify(eventToUpdate.guest_option)
            }
            await axios.put(`${server}/events/${editingEventId}`, payload)
            toast({
                title: "Success",
                description: "Event updated successfully"
            })
            setEditingEventId(null)
            resetEventForm()
            fetchEvents()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update event. Please try again.",
                variant: "destructive"
            })
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
            }
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
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        onClick={
                                            editingEventId !== null ? handleSaveEvent : handleAddEvent
                                        }
                                        disabled={isSubmitting}
                                        className="bg-warm-500 hover:bg-warm-600 "
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
                                <ScrollArea className="h-[400px] pr-4">
                                    <div className="space-y-4">
                                        {events.map(event => (
                                            <Card key={event.id} className="p-4">
                                                <CardContent className="space-y-2">
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
                              {new Date(event.event_date).toLocaleDateString(
                                  "en-GB"
                              )}
                            </span>
                                                    </div>
                                                    <div className="flex items-center text-warm-600">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        <span>{event.event_time}</span>
                                                    </div>
                                                    <div className="flex items-center text-warm-600">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        <span>
                              {event.event_type.is_private
                                  ? "Private Event"
                                  : "Public Event"}
                            </span>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleEditEvent(event.id)}
                                                        variant="outline"
                                                        className="mt-2"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

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
