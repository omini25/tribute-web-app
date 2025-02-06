import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button.jsx";
import { server } from "@/server.js";

export const Events = ({ id, user_id }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${server}/tributes/allmemories/${id}`);
                setEvents(response.data);
                console.log(response)
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to load events. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [id]);

    if (isLoading) {
        return <p>Loading events...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            {events.map((event) => (
                <Card key={event.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
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
                                <span>{event.event_type.is_private ? "Private Event" : "Public Event"}</span>
                            </div>
                            {/*<div className="mt-4">*/}
                            {/*    <Button*/}
                            {/*        variant="outline"*/}
                            {/*        className="w-full border-warm-300 text-warm-700 hover:bg-warm-100"*/}
                            {/*    >*/}
                            {/*        {event.guest_option.can_rsvp ? "RSVP" : "View Details"}*/}
                            {/*    </Button>*/}
                            {/*</div>*/}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

Events.propTypes = {
    id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
};