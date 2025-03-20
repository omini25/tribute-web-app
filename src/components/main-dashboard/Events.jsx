"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
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
    ChevronRight
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

export default function Events() {
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
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(
                `${server}/tributes/allevents/${user.id}`
            )
            setEvents(response.data)
        } catch (error) {
            console.error("Error fetching events:", error)
            setError("Failed to load events. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }


    const handleCreateEvent = async newEvent => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${server}/tributes/events`, {
                ...newEvent,
                user_id: user.id
            })
            setEvents([...events, response.data])
            toast({
                title: "Event Created",
                description: "Your event has been created successfully."
            })
            setIsCreateModalOpen(false)
        } catch (error) {
            console.error("Error creating event:", error)
            toast({
                title: "Error",
                description: "Failed to create event. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteEvent = async eventId => {
        if (confirm("Are you sure you want to delete this event?")) {
            setIsLoading(true)
            try {
                await axios.delete(`${server}/tributes/events/${eventId}`)
                setEvents(events.filter(event => event.id !== eventId))
                toast({
                    title: "Event Deleted",
                    description: "The event has been deleted successfully."
                })
            } catch (error) {
                console.error("Error deleting event:", error)
                toast({
                    title: "Error",
                    description: "Failed to delete event. Please try again.",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Filter events based on search term and filter type
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())

        if (filterType === "all") return matchesSearch
        if (filterType === "upcoming") {
            return matchesSearch && new Date(event.event_date) >= new Date()
        }
        if (filterType === "past") {
            return matchesSearch && new Date(event.event_date) < new Date()
        }
        if (filterType === "private") {
            return matchesSearch && event.event_type.is_private
        }
        if (filterType === "public") {
            return matchesSearch && !event.event_type.is_private
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
            return a.title.localeCompare(b.title)
        }
        if (sortBy === "title-desc") {
            return b.title.localeCompare(a.title)
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

    return (
        <>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold">Memorial Events</h1>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                    </div>

                    <div className="mb-8">
                        <Tabs defaultValue="all" className="w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <TabsList>
                                    <TabsTrigger value="all" onClick={() => setFilterType("all")}>
                                        All Events
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="upcoming"
                                        onClick={() => setFilterType("upcoming")}
                                    >
                                        Upcoming
                                    </TabsTrigger>
                                    <TabsTrigger value="past" onClick={() => setFilterType("past")}>
                                        Past
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="private"
                                        onClick={() => setFilterType("private")}
                                    >
                                        Private
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="public"
                                        onClick={() => setFilterType("public")}
                                    >
                                        Public
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Search events..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full md:w-[180px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date-asc">
                                                Date (Oldest first)
                                            </SelectItem>
                                            <SelectItem value="date-desc">
                                                Date (Newest first)
                                            </SelectItem>
                                            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                                            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <TabsContent value="all" className="mt-0">
                                {renderEventsList()}
                            </TabsContent>
                            <TabsContent value="upcoming" className="mt-0">
                                {renderEventsList()}
                            </TabsContent>
                            <TabsContent value="past" className="mt-0">
                                {renderEventsList()}
                            </TabsContent>
                            <TabsContent value="private" className="mt-0">
                                {renderEventsList()}
                            </TabsContent>
                            <TabsContent value="public" className="mt-0">
                                {renderEventsList()}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Pagination */}
                    {!isLoading && !error && sortedEvents.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
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
                    />
                </div>


        </>
    )

    function renderEventsList() {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className="pb-0">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-9 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )
        }

        if (error) {
            return (
                <div className="text-center py-10">
                    <p className="text-red-500">{error}</p>
                    <Button onClick={fetchEvents} className="mt-4">
                        Try Again
                    </Button>
                </div>
            )
        }

        if (currentEvents.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">No events found.</p>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create Your First Event
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
    const isUpcoming = new Date(event.event_date) >= new Date()

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-semibold">
                            {event.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {event.description?.substring(0, 60)}
                            {event.description?.length > 60 ? "..." : ""}
                        </p>
                    </div>
                    <Badge variant={isUpcoming ? "default" : "secondary"}>
                        {isUpcoming ? "Upcoming" : "Past"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="space-y-3">
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{event.event_location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
              {format(new Date(event.event_date), "MMMM d, yyyy")}
            </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{event.event_time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
              {event.event_type?.is_private ? "Private Event" : "Public Event"}
            </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={onView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={e => {
                        e.stopPropagation()
                        onDelete()
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
