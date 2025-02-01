import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Plus, Loader2, Edit, Save } from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MemoriesEvents() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [events, setEvents] = useState([])
    const [newEvent, setNewEvent] = useState({
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
    }, []) // Removed unnecessary dependency 'id'

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"))
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
            toast.error("Failed to load events")
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
            toast.error(error.response?.data?.message || "Failed to add event")
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
            const payload = {
                trubute_id: id,
                ...eventToUpdate,
                event_type: JSON.stringify(eventToUpdate.event_type),
                guest_option: JSON.stringify(eventToUpdate.guest_option)
            }
            await axios.put(`${server}/events/${editingEventId}`, payload)
            toast.success("Event updated successfully")
            setEditingEventId(null)
            resetEventForm()
            fetchEvents()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update event")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetEventForm = () => {
        setNewEvent({
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
        return <LoadingSpinner />
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Header title={title} />
            <EventForm
                event={
                    editingEventId !== null
                        ? events.find(event => event.id === editingEventId)
                        : newEvent
                }
                onInputChange={handleInputChange}
                onCheckboxChange={handleCheckboxChange}
                onSubmit={editingEventId !== null ? handleSaveEvent : handleAddEvent}
                isSubmitting={isSubmitting}
                isEditing={editingEventId !== null}
            />
            <EventList events={events} onEditEvent={handleEditEvent} />
            <NavigationButtons id={id} />
        </div>
    )
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
)

const Header = ({ title }) => (
    <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-medium text-gray-600">{title}</h1>
        <h2 className="text-2xl text-gray-500">EVENTS</h2>
    </div>
)

const EventForm = ({
                       event,
                       onInputChange,
                       onCheckboxChange,
                       onSubmit,
                       isSubmitting,
                       isEditing
                   }) => (
    <Card className="p-6 mb-8">
        <div className="space-y-8">
            <EventTypeCheckboxes event={event} onCheckboxChange={onCheckboxChange} />
            <EventDetailsInputs event={event} onInputChange={onInputChange} />
            <RSVPOptions event={event} onCheckboxChange={onCheckboxChange} />
            <SubmitButton
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                isEditing={isEditing}
            />
        </div>
    </Card>
)

const EventTypeCheckboxes = ({ event, onCheckboxChange }) => (
    <div className="flex flex-wrap gap-6">
        {[
            "is_private",
        ].map(type => (
            <div key={type} className="flex items-center space-x-2">
                <Checkbox
                    id={type}
                    checked={event.event_type[type]}
                    onCheckedChange={() => onCheckboxChange("event_type", type)}
                />
                <Label htmlFor={type} className="text-blue-500">
                    {type
                        .split("_")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                </Label>
            </div>
        ))}
    </div>
)

const EventDetailsInputs = ({ event, onInputChange }) => (
    <div className="grid md:grid-cols-2 gap-6">
        {["title", "event_location", "event_date", "event_time"].map(field => (
            <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-blue-500">
                    {field
                        .split("_")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                </Label>
                <Input
                    id={field}
                    name={field}
                    type={
                        field.includes("date")
                            ? "date"
                            : field.includes("time")
                                ? "time"
                                : "text"
                    }
                    value={event[field]}
                    onChange={onInputChange}
                    className="border-blue-100"
                />
            </div>
        ))}
    </div>
)

const RSVPOptions = ({ event, onCheckboxChange }) => (
    <div className="flex flex-wrap gap-6">
        {["can_rsvp"].map(option => (
            <div key={option} className="flex items-center space-x-2">
                <Checkbox
                    id={option}
                    checked={event.guest_option[option]}
                    onCheckedChange={() => onCheckboxChange("guest_option", option)}
                />
                <Label htmlFor={option} className="text-blue-500">
                    {option
                        .split("_")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                </Label>
            </div>
        ))}
    </div>
)

const SubmitButton = ({ onSubmit, isSubmitting, isEditing }) => (
    <div className="flex justify-center">
        <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600"
        >
            {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
            ) : isEditing ? (
                <Save className="h-6 w-6" />
            ) : (
                <Plus className="h-6 w-6" />
            )}
        </Button>
    </div>
)

const EventList = ({ events, onEditEvent }) => (
    <div className="space-y-4">
        {events.map((event, index) => (
            <Card key={index} className="p-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <p>
                        <strong>Location:</strong> {event.event_location}
                    </p>
                    <p>
                        <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString('en-GB')}
                    </p>
                    <p>
                        <strong>Time:</strong> {event.event_time}
                    </p>
                    <p>
                        <strong>Event Type:</strong> {event.event_type.is_private ? "Private Event" : "Public Event"}
                    </p>
                    <p>
                        <strong>Guest Options:</strong> {event.guest_option.can_rsvp ? "Can RSVP" : "No RSVP"}
                    </p>
                    <Button
                        onClick={() => onEditEvent(event.id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8"
                    >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                </div>
            </Card>
        ))}
    </div>
)

const NavigationButtons = ({ id }) => (
    <div className="flex justify-between mt-16">
        <Link to={`/dashboard/tribute-life/${id}`}>
            <Button variant="default" className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8">
               Life
            </Button>
        </Link>
        <Link to={`/dashboard/memories/memories/${id}`}>
            <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]">
                Memories
            </Button>
        </Link>
    </div>
)
