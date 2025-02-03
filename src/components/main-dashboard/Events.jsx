import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users, Plus, Search } from "lucide-react"
import { format } from "date-fns"

export default function Events() {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
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

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-warm-800">Events</h1>
                    <Button className="bg-warm-500 hover:bg-warm-600 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Create Event
                    </Button>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
                        <Input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 bg-warm-50 border-warm-200 focus:border-warm-500 focus:ring-warm-500"
                        />
                    </div>
                </div>

                {isLoading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-500 mx-auto"></div>
                        <p className="mt-4 text-warm-600">Loading events...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
                        <Button
                            onClick={fetchEvents}
                            className="mt-4 bg-warm-500 hover:bg-warm-600 text-white"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}

                {!isLoading && !error && filteredEvents.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-warm-600">No events found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function EventCard({ event }) {
    return (
        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="bg-warm-100">
                <CardTitle className="text-xl font-semibold text-warm-800">
                    {event.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div className="flex items-center text-warm-600">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.event_location}</span>
                    </div>
                    <div className="flex items-center text-warm-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{format(new Date(event.event_date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-warm-600">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{event.event_time}</span>
                    </div>
                    <div className="flex items-center text-warm-600">
                        <Users className="mr-2 h-4 w-4" />
                        <span>
                          {event.event_type.is_private ? "Private Event" : "Public Event"}
                        </span>
                    </div>
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            className="w-full border-warm-300 text-warm-700 hover:bg-warm-100"
                        >
                            {event.guest_option.can_rsvp ? "RSVP" : "View Details"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
