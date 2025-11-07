"use client"

import { useState } from "react"
import axios from "axios"
import { server } from "@/server.js"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, Mail, Edit } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { GuestList } from "@/components/main-dashboard/events/GuestList.jsx"
import { SendEmailModal } from "@/components/main-dashboard/events/SendEmailModal.jsx"
import { toast } from "react-hot-toast"

export function EventDetailsModal({ event, isOpen, onClose, onDelete }) {
    const [activeTab, setActiveTab] = useState("details")
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [selectedGuests, setSelectedGuests] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const isUpcoming = new Date(event.event_date) >= new Date()

    const handleSendEmailToAll = () => {
        // Get all guest emails
        const allGuests = event.guests || []
        setSelectedGuests(allGuests)
        setIsEmailModalOpen(true)
    }

    const handleSendEmailToSelected = guests => {
        setSelectedGuests(guests)
        setIsEmailModalOpen(true)
    }

    const handleDisinviteGuests = async guests => {
        if (!guests.length) return

        if (
            confirm(`Are you sure you want to disinvite ${guests.length} guest(s)?`)
        ) {
            setIsLoading(true)
            try {
                // In a real app, you would call your API to disinvite guests
                await axios.post(`${server}/tributes/events/${event.id}/disinvite`, {
                    guestIds: guests.map(guest => guest.id)
                })

                toast({
                    title: "Guests Disinvited",
                    description: `${guests.length} guest(s) have been disinvited successfully.`
                })
            } catch (error) {
                console.error("Error disinviting guests:", error)
                toast({
                    title: "Error",
                    description: "Failed to disinvite guests. Please try again.",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleSendEmail = async emailData => {
        setIsLoading(true)
        try {
            // In a real app, you would call your API to send emails
            await axios.post(`${server}/tributes/events/${event.id}/send-email`, {
                ...emailData,
                recipients: selectedGuests.map(guest => guest.email)
            })

            toast({
                title: "Email Sent",
                description: `Email sent to ${selectedGuests.length} recipient(s) successfully.`
            })
            setIsEmailModalOpen(false)
        } catch (error) {
            console.error("Error sending email:", error)
            toast({
                title: "Error",
                description: "Failed to send email. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{event.title}</DialogTitle>
                        <DialogDescription>
                            <Badge
                                variant={isUpcoming ? "default" : "secondary"}
                                className="mt-2"
                            >
                                {isUpcoming ? "Upcoming" : "Past"}
                            </Badge>
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs
                        defaultValue="details"
                        value={activeTab}
                        onValueChange={setActiveTab}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="details">Event Details</TabsTrigger>
                            <TabsTrigger value="guests">Guest List</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-5 w-5 flex-shrink-0" />
                                        <span>
                      {format(new Date(event.event_date), "MMMM d, yyyy")}
                    </span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Clock className="mr-2 h-5 w-5 flex-shrink-0" />
                                        <span>{event.event_time}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="mr-2 h-5 w-5 flex-shrink-0" />
                                        <span>{event.event_location}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Users className="mr-2 h-5 w-5 flex-shrink-0" />
                                        <span>
                      {event.event_type?.is_private
                          ? "Private Event"
                          : "Public Event"}
                    </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-muted-foreground">
                                        {event.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="font-medium mb-2">Additional Information</h3>
                                <p className="text-muted-foreground">
                                    {event.additional_info ||
                                        "No additional information provided."}
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="guests">
                            <div className="py-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                    <h3 className="font-medium">Guest List</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSendEmailToAll}
                                            disabled={isLoading || !event.guests?.length}
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            Email All Guests
                                        </Button>
                                    </div>
                                </div>

                                <GuestList
                                    guests={event.guests || []}
                                    onSendEmail={handleSendEmailToSelected}
                                    onDisinvite={handleDisinviteGuests}
                                    isLoading={isLoading}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        <Button variant="destructive" onClick={onDelete}>
                            Delete Event
                        </Button>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Event
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <SendEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={handleSendEmail}
                recipients={selectedGuests}
                isLoading={isLoading}
            />
        </>
    )
}
