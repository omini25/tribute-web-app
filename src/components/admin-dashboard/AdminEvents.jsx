"use client"

import { useEffect, useState } from "react"
import axios from "axios"
// import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout" // Assuming this is not used directly in this file
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter, CardDescription
} from "@/components/ui/card"
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Plus,
    Search,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Link as LinkIcon // Added for linking to tribute
} from "lucide-react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { EventDetailsModal } from "@/components/main-dashboard/events/EventDetailsModal.jsx"
import { CreateEventModal } from "@/components/main-dashboard/events/CreateEventModal.jsx"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"; // Import Link for navigation

// Helper function to generate URL-friendly slugs (if not already available globally)
const generateSlug = (title = "") => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};


export default function AdminEvents() {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [sortBy, setSortBy] = useState("date-asc")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const eventsPerPage = 9
    // Ensure user is parsed safely, especially in SSR or non-browser environments
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                    // Handle error, e.g., redirect to login
                }
            } else {
                // Handle case where user is not in localStorage, e.g., redirect to login
            }
        }
    }, []);


    const fetchEvents = async () => {
        if (!user || !user.id) { // Check if user and user.id are available
            setIsLoading(false);
            setError("User information is not available. Cannot fetch events.");
            return;
        }
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(
                `${server}/admin/tributes/allevents/${user.id}`
            )
            // Ensure each event has a tribute object, even if it's a default/fallback
            const eventsWithTribute = response.data.map(event => ({
                ...event,
                tribute: event.tribute || { id: null, title: "Unknown Tribute", theme: "default" } // Fallback tribute
            }));
            setEvents(eventsWithTribute)
        } catch (error) {
            console.error("Error fetching events:", error)
            setError("Failed to load events. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user && user.id) { // Fetch events only when user data is available
            fetchEvents()
        }
    }, [user]) // Re-run when user state changes


    const handleCreateEvent = async newEvent => {
        if (!user || !user.id) {
            toast.error("User information is not available. Cannot create event.");
            return;
        }
        setIsLoading(true) // Consider a more specific loading state like isCreatingEvent
        try {
            const response = await axios.post(`${server}/tributes/events`, {
                ...newEvent,
                user_id: user.id // Ensure user_id is correctly passed if needed by backend
            })
            // Add the new event, ensuring it has the tribute structure if your backend returns it
            const newEventWithTribute = {
                ...response.data,
                tribute: response.data.tribute || newEvent.tribute || { id: newEvent.trubute_id, title: "Associated Tribute", theme: "default" }
            };
            setEvents(prevEvents => [newEventWithTribute, ...prevEvents]); // Add to the beginning for better UX
            toast.success("Event Created: Your event has been created successfully.")
            setIsCreateModalOpen(false)
        } catch (error) {
            console.error("Error creating event:", error)
            const errorMessage = error.response?.data?.message || "Failed to create event. Please try again.";
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteEvent = async eventId => {
        // Using window.confirm is generally discouraged for better UX, consider a modal
        if (window.confirm("Are you sure you want to delete this event?")) {
            setIsLoading(true) // Consider a more specific loading state like isDeletingEvent
            try {
                await axios.delete(`${server}/tributes/events/${eventId}`)
                setEvents(events.filter(event => event.id !== eventId))
                toast.success("Event Deleted: The event has been deleted successfully.")
            } catch (error) {
                console.error("Error deleting event:", error)
                const errorMessage = error.response?.data?.message || "Failed to delete event. Please try again.";
                toast.error(`Error: ${errorMessage}`);
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Filter events based on search term and filter type
    const filteredEvents = events.filter(event => {
        const eventTitle = event.title || "";
        const tributeTitle = event.tribute?.title || "";

        const matchesSearch =
            eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tributeTitle.toLowerCase().includes(searchTerm.toLowerCase());


        if (filterType === "all") return matchesSearch
        // Ensure event.event_date is valid before creating a Date object
        const eventDate = event.event_date ? new Date(event.event_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

        if (filterType === "upcoming") {
            return matchesSearch && eventDate && eventDate >= today;
        }
        if (filterType === "past") {
            return matchesSearch && eventDate && eventDate < today;
        }

        // Safe parsing of event_type
        let isPrivateEvent = false;
        try {
            if (event.event_type) {
                const eventTypeObj = JSON.parse(event.event_type);
                isPrivateEvent = eventTypeObj.is_private === true;
            }
        } catch (e) {
            console.warn("Failed to parse event_type for event ID:", event.id, e);
        }

        if (filterType === "private") {
            return matchesSearch && isPrivateEvent;
        }
        if (filterType === "public") {
            return matchesSearch && !isPrivateEvent;
        }

        return matchesSearch
    })

    // Sort events
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortBy === "date-asc") {
            return new Date(a.event_date) - new Date(b.event_date)
        }
        if (sortBy === "date-desc") {
            return new Date(b.event_date) - new Date(a.event_date)
        }
        if (sortBy === "title-asc") {
            return (a.title || "").localeCompare(b.title || "")
        }
        if (sortBy === "title-desc") {
            return (b.title || "").localeCompare(a.title || "")
        }
        return 0
    })

    // Pagination
    const indexOfLastEvent = currentPage * eventsPerPage
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
    const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent)
    const totalPages = Math.ceil(sortedEvents.length / eventsPerPage)

    const openEventDetails = event => {
        setSelectedEvent(event)
        setIsDetailsModalOpen(true)
    }

    // Reset current page when filters or search term change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, sortBy]);


    return (
        <>
            <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
                <CardHeader className="p-0 mb-6"> {/* Added mb-6 for spacing */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold text-slate-800 sm:text-3xl">
                                Memorial Events
                            </CardTitle>
                            <CardDescription className="text-slate-600 mt-1">
                                <span className="hidden sm:inline">
                                    Manage all memorial events associated with tributes. Create, view, and organize upcoming and past events.
                                </span>
                                <span className="sm:hidden">
                                    Manage all memorial events.
                                </span>
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto" // Consistent button styling
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0"> {/* Removed default padding, manage within */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-slate-200"> {/* Filter/Search bar container */}
                        <Tabs defaultValue="all" value={filterType} onValueChange={setFilterType} className="w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <TabsList className="bg-slate-100 p-1 rounded-lg flex-wrap">
                                    {/* Simplified TabsTrigger styling */}
                                    <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600 px-3 py-1.5 text-sm rounded-md">All Events</TabsTrigger>
                                    <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600 px-3 py-1.5 text-sm rounded-md">Upcoming</TabsTrigger>
                                    <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600 px-3 py-1.5 text-sm rounded-md">Past</TabsTrigger>
                                    <TabsTrigger value="private" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600 px-3 py-1.5 text-sm rounded-md">Private</TabsTrigger>
                                    <TabsTrigger value="public" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600 px-3 py-1.5 text-sm rounded-md">Public</TabsTrigger>
                                </TabsList>

                                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search events or tributes..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="pl-10 w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                        />
                                    </div>

                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full md:w-[180px] border-slate-300 focus:border-amber-500 focus:ring-amber-500">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                                            <SelectItem value="date-desc">Date (Newest first)</SelectItem>
                                            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                                            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Removed redundant TabsContent, renderEventsList will handle filtered data */}
                        </Tabs>
                    </div>

                    {renderEventsList()}


                    {/* Pagination */}
                    {!isLoading && !error && sortedEvents.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 pt-4 border-t border-slate-200">
                            <Button
                                variant="outline"
                                size="sm" // Standardized size
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="border-slate-300 text-slate-600 hover:bg-slate-100"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> {/* Added icon */}
                                Previous
                            </Button>
                            <span className="text-sm text-slate-600 mx-4">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm" // Standardized size
                                onClick={() =>
                                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                                className="border-slate-300 text-slate-600 hover:bg-slate-100"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" /> {/* Added icon */}
                            </Button>
                        </div>
                    )}

                    {/* Event Details Modal */}
                    {selectedEvent && (
                        <EventDetailsModal
                            event={selectedEvent}
                            isOpen={isDetailsModalOpen}
                            onClose={() => setIsDetailsModalOpen(false)}
                            onDelete={() => {
                                handleDeleteEvent(selectedEvent.id)
                                setIsDetailsModalOpen(false)
                            }}
                        />
                    )}

                    {/* Create Event Modal */}
                    <CreateEventModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSubmit={handleCreateEvent}
                        // Pass tributes for selection if your CreateEventModal needs it
                        // tributes={tributes.map(t => ({ id: t.id, title: t.title }))}
                    />
                </CardContent>
            </div>
        </>
    )

    function renderEventsList() {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="overflow-hidden border-slate-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-6 w-3/4 mb-2 bg-slate-200" />
                                <Skeleton className="h-4 w-1/2 bg-slate-200" />
                            </CardHeader>
                            <CardContent className="pt-3 space-y-2">
                                <Skeleton className="h-4 w-full bg-slate-200" />
                                <Skeleton className="h-4 w-full bg-slate-200" />
                                <Skeleton className="h-4 w-2/3 bg-slate-200" />
                            </CardContent>
                            <CardFooter className="pt-3">
                                <Skeleton className="h-9 w-full bg-slate-200" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )
        }

        if (error) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-red-200 p-6">
                    <p className="text-red-600 font-medium">{error}</p>
                    <Button onClick={fetchEvents} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
                        Try Again
                    </Button>
                </div>
            )
        }

        if (currentEvents.length === 0) {
            return (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-slate-600 text-lg font-medium mb-2">No events found.</p>
                    <p className="text-slate-500 mb-6">
                        {searchTerm || filterType !== "all" ? "Try adjusting your search or filters." : "Create an event to get started."}
                    </p>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create Event
                    </Button>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onView={() => openEventDetails(event)}
                        onDelete={() => handleDeleteEvent(event.id)}
                    />
                ))}
            </div>
        )
    }
}

function EventCard({ event, onView, onDelete }) {
    const isUpcoming = event.event_date ? new Date(event.event_date) >= new Date() : false;
    const eventDate = event.event_date ? new Date(event.event_date) : null;

    // Safe parsing of event_type
    let isPrivateEvent = false;
    let eventTypeDisplay = "Public Event";
    try {
        if (event.event_type) {
            const eventTypeObj = JSON.parse(event.event_type);
            isPrivateEvent = eventTypeObj.is_private === true;
            if (isPrivateEvent) eventTypeDisplay = "Private Event";
        }
    } catch (e) {
        console.warn("Failed to parse event_type for event card ID:", event.id, e);
        eventTypeDisplay = "Type N/A"; // Fallback if parsing fails
    }


    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-slate-200 flex flex-col h-full bg-white">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-800 leading-tight">
                            {event.title || "Untitled Event"}
                        </CardTitle>
                        {event.tribute && (
                            <Link
                                to={`/admin/dashboard/memories-overview/${event.tribute.id}`} // Link to admin view of tribute
                                className="text-xs text-amber-600 hover:underline mt-1 inline-flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()} // Prevent card's onView from triggering
                            >
                                <LinkIcon size={12} /> For: {event.tribute.title || "Unknown Tribute"}
                            </Link>
                        )}
                    </div>
                    <Badge
                        variant={isUpcoming ? "default" : "secondary"} // Use variants for better styling
                        className={`text-xs px-2 py-1 rounded-full ${isUpcoming
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                    >
                        {isUpcoming ? "Upcoming" : "Past"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-2 flex-grow space-y-2.5 text-sm">
                {event.description && (
                    <p className="text-slate-600 line-clamp-2">
                        {event.description}
                    </p>
                )}
                <div className="flex items-center text-slate-500">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span>{event.event_location || "Location not specified"}</span>
                </div>
                {eventDate && (
                    <div className="flex items-center text-slate-500">
                        <Calendar className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>
                            {format(eventDate, "MMMM d, yyyy")}
                        </span>
                    </div>
                )}
                {event.event_time && (
                    <div className="flex items-center text-slate-500">
                        <Clock className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>{event.event_time}</span>
                    </div>
                )}
                <div className="flex items-center text-slate-500">
                    <Users className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span>{eventTypeDisplay}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-3 border-t border-slate-100 bg-slate-50/50 p-3">
                <Button variant="ghost" size="sm" onClick={onView} className="text-slate-700 hover:bg-slate-200">
                    <Eye className="mr-1.5 h-4 w-4" />
                    Details
                </Button>
                <Button
                    variant="ghost" // Changed to ghost for less visual weight, destructive color comes from icon/text
                    size="icon" // Made it an icon button for compactness
                    onClick={e => {
                        e.stopPropagation()
                        onDelete()
                    }}
                    className="text-red-500 hover:bg-red-100 hover:text-red-600"
                    title="Delete Event"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}