"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription
} from "@/components/ui/card.jsx"
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Lock,
    Globe,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    Loader2
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button.jsx"
import { server } from "@/server.js"
import { Badge } from "@/components/ui/badge.jsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { toast } from "react-hot-toast"
import { ScrollArea } from "@/components/ui/scroll-area.jsx"

export const Events = ({ id, user_id }) => {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedEventId, setExpandedEventId] = useState(null)
    const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [rsvpData, setRsvpData] = useState({
        name: "",
        email: "",
        phone: "",
        attendees: "1",
        message: "",
        event_id: "",
        tribute_id: id
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [guestList, setGuestList] = useState({})
    const [isGuestListLoading, setIsGuestListLoading] = useState({})

    useEffect(() => {
        fetchEvents()
    }, [id])

    const fetchEvents = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${server}/tributes/allmemories/${id}`)
            setEvents(response.data)

            // Initialize guest list loading state for each event
            const loadingState = {}
            response.data.forEach(event => {
                loadingState[event.id] = false
            })
            setIsGuestListLoading(loadingState)
        } catch (error) {
            console.error("Error fetching events:", error)
            setError("Failed to load events. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchGuestList = async eventId => {
        if (guestList[eventId]) return // Already loaded

        setIsGuestListLoading(prev => ({ ...prev, [eventId]: true }))
        try {
            const response = await axios.get(`${server}/events/${eventId}/guests`)
            setGuestList(prev => ({ ...prev, [eventId]: response.data }))
        } catch (error) {
            console.error("Error fetching guest list:", error)
            toast.error("Failed to load guest list")
        } finally {
            setIsGuestListLoading(prev => ({ ...prev, [eventId]: false }))
        }
    }

    const toggleEventDetails = eventId => {
        if (expandedEventId === eventId) {
            setExpandedEventId(null)
        } else {
            setExpandedEventId(eventId)
            fetchGuestList(eventId)
        }
    }

    const openRsvpModal = event => {
        setSelectedEvent(event)
        setRsvpData(prev => ({
            ...prev,
            event_id: event.id
        }))
        setIsRsvpModalOpen(true)
    }

    const handleRsvpInputChange = e => {
        const { name, value } = e.target
        setRsvpData(prev => ({ ...prev, [name]: value }))
    }

    const handleRsvpSubmit = async e => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await axios.post(`${server}/events/rsvp`, rsvpData)
            if (response.status === 200) {
                toast.success("RSVP submitted successfully")
                setRsvpData({
                    name: "",
                    email: "",
                    phone: "",
                    attendees: "1",
                    message: "",
                    event_id: "",
                    tribute_id: id
                })
                setIsRsvpModalOpen(false)

                // Refresh guest list for this event
                delete guestList[selectedEvent.id]
                fetchGuestList(selectedEvent.id)
            }
        } catch (error) {
            console.error("Error submitting RSVP:", error)
            toast.error("Failed to submit RSVP. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-warm-500" />
                <span className="ml-2 text-warm-700">Loading events...</span>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4 border-red-300 text-red-600 hover:bg-red-100"
                            onClick={fetchEvents}
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (events.length === 0) {
        return (
            <Card className="bg-gray-50">
                <CardContent className="pt-6">
                    <div className="text-center text-gray-500 py-8">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">No Events Scheduled</p>
                        <p className="text-sm">
                            There are no memorial events scheduled at this time.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {events.map(event => (
                <Card
                    key={event.id}
                    className={`overflow-hidden transition-all duration-300 ${
                        expandedEventId === event.id
                            ? "shadow-lg ring-1 ring-warm-300"
                            : "hover:shadow-md"
                    }`}
                >
                    <CardHeader
                        className={`${
                            event.event_type?.is_private
                                ? "bg-warm-50 border-b border-warm-100"
                                : "bg-warm-100"
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-xl font-semibold text-warm-800">
                                        {event.title}
                                    </CardTitle>
                                    {event.event_type?.is_private ? (
                                        <Badge
                                            variant="outline"
                                            className="border-warm-300 text-warm-700 flex items-center gap-1"
                                        >
                                            <Lock className="h-3 w-3" />
                                            Private
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="border-green-300 text-green-700 bg-green-50 flex items-center gap-1"
                                        >
                                            <Globe className="h-3 w-3" />
                                            Public
                                        </Badge>
                                    )}
                                </div>
                                {event.description && (
                                    <CardDescription className="mt-1 text-warm-600">
                                        {event.description}
                                    </CardDescription>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-warm-700 hover:bg-warm-100"
                                onClick={() => toggleEventDetails(event.id)}
                            >
                                {expandedEventId === event.id ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center text-warm-600">
                                <MapPin className="mr-2 h-4 w-4 text-warm-500 flex-shrink-0" />
                                <span className="text-sm">{event.event_location}</span>
                            </div>
                            <div className="flex items-center text-warm-600">
                                <Calendar className="mr-2 h-4 w-4 text-warm-500 flex-shrink-0" />
                                <span className="text-sm">
                  {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
                </span>
                            </div>
                            <div className="flex items-center text-warm-600">
                                <Clock className="mr-2 h-4 w-4 text-warm-500 flex-shrink-0" />
                                <span className="text-sm">{event.event_time}</span>
                            </div>
                            <div className="flex items-center text-warm-600">
                                <Users className="mr-2 h-4 w-4 text-warm-500 flex-shrink-0" />
                                <span className="text-sm">
                  {guestList[event.id]
                      ? `${guestList[event.id].length} attending`
                      : "Guest list available when expanded"}
                </span>
                            </div>
                        </div>

                        {expandedEventId === event.id && (
                            <div className="mt-6 pt-4 border-t border-warm-100">
                                <h4 className="text-warm-800 font-medium mb-3">
                                    Event Details
                                </h4>
                                <p className="text-warm-600 text-sm mb-4">
                                    {event.details ||
                                        "Join us for this memorial event to honor and remember our loved one."}
                                </p>

                                <h4 className="text-warm-800 font-medium mb-3 mt-6 flex items-center">
                                    <Users className="mr-2 h-4 w-4" />
                                    Guest List
                                </h4>

                                {isGuestListLoading[event.id] ? (
                                    <div className="text-center py-4">
                                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-warm-500" />
                                        <p className="text-warm-600 text-sm mt-2">
                                            Loading guest list...
                                        </p>
                                    </div>
                                ) : guestList[event.id] && guestList[event.id].length > 0 ? (
                                    <ScrollArea className="h-[200px] rounded-md border border-warm-100 p-4">
                                        <div className="space-y-3">
                                            {guestList[event.id].map((guest, index) => (
                                                <div key={index} className="flex items-center">
                                                    <Avatar className="h-8 w-8 mr-2">
                                                        <AvatarFallback className="bg-warm-200 text-warm-700">
                                                            {guest.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-warm-800">
                                                            {guest.name}
                                                        </p>
                                                        <p className="text-xs text-warm-500">
                                                            {guest.attendees > 1
                                                                ? `+${guest.attendees - 1} guests`
                                                                : "Attending alone"}
                                                        </p>
                                                    </div>
                                                    <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="text-center py-4 bg-warm-50 rounded-md">
                                        <p className="text-warm-600 text-sm">
                                            No guests have RSVP'd yet. Be the first!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="bg-gray-50 py-3 px-6 flex justify-end">
                        {event.guest_option?.can_rsvp !== false && (
                            <Button
                                className="bg-warm-500 hover:bg-warm-600 text-black"
                                onClick={() => openRsvpModal(event)}
                            >
                                RSVP for this Event
                            </Button>
                        )}
                        {event.guest_option?.can_rsvp === false && (
                            <Button
                                variant="outline"
                                className="border-warm-300 text-warm-700 hover:bg-warm-100"
                                disabled
                            >
                                RSVP Unavailable
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}

            {/* RSVP Modal */}
            <Dialog open={isRsvpModalOpen} onOpenChange={setIsRsvpModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white">
                    <DialogHeader>
                        <DialogTitle>RSVP for Event</DialogTitle>
                        <DialogDescription>
                            {selectedEvent
                                ? `Confirm your attendance for ${selectedEvent.title}`
                                : "Confirm your attendance for this event"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleRsvpSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={rsvpData.name}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={rsvpData.email}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={rsvpData.phone}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="attendees" className="text-right">
                                    Attendees
                                </Label>
                                <Input
                                    id="attendees"
                                    name="attendees"
                                    type="number"
                                    min="1"
                                    value={rsvpData.attendees}
                                    onChange={handleRsvpInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="message" className="text-right pt-2">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={rsvpData.message}
                                    onChange={handleRsvpInputChange}
                                    placeholder="Any special requests or notes"
                                    className="col-span-3"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="bg-warm-500 hover:bg-warm-600 text-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isSubmitting ? "Submitting..." : "Confirm Attendance"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

Events.propTypes = {
    id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
