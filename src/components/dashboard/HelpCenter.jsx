import { useState, useEffect } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Plus, Send } from "lucide-react"
import { server } from "@/server.js"
import {toast} from "react-hot-toast";

export default function HelpCenter() {
    const [tickets, setTickets] = useState([])
    const [newTicket, setNewTicket] = useState({ subject: "", description: "" })
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [response, setResponse] = useState("")

    const user = localStorage.getItem("user")
    const userId = user ? JSON.parse(user).id : null


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${server}/tickets?userId=${userId}`)
                setTickets(response.data)
            } catch (error) {
                console.error("Error fetching tickets:", error)
            }
        }

        fetchTickets()
    }, [userId])

    const handleCreateTicket = async () => {
        if (!newTicket.subject || !newTicket.description) {
            alert("Please fill in all fields.")
            return
        }

        try {
            const response = await axios.post(`${server}/tickets`, {
                userId,
                ...newTicket
            })
            setTickets([...tickets, response.data])
            setNewTicket({ subject: "", description: "" })
            toast.success("Ticket created successfully")
        } catch (error) {
            console.error("Error creating ticket:", error)
            toast.error("Error creating ticket")
        }
    }

    const handleRespond = async (ticketId, responseText) => {
        try {
            const response = await axios.post(`${server}/tickets/${ticketId}/response`, {
                response: responseText
            })
            const updatedTickets = tickets.map(ticket =>
                ticket.id === ticketId
                    ? {
                        ...ticket,
                        responses: [...ticket.responses, response.data],
                        status: "responded"
                    }
                    : ticket
            )
            setTickets(updatedTickets)
            setSelectedTicket(null)
            setResponse("")
            toast.success("Response sent successfully")
        } catch (error) {
            console.error("Error responding to ticket:", error)
            toast.error("Error responding to ticket")
        }
    }

    const handleSendEmail = () => {
        window.location.href =
            "mailto:support@example.com?subject=Support%20Request"
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">

                <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                       Help Center
                    </CardTitle>
                    <CardDescription className="text-warm-600">
                        How can we assist you today?
                    </CardDescription>
                </CardHeader>


                <CardContent className="p-0 pt-6">
                    <Tabs defaultValue="create" className="space-y-8">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="create">Create Ticket</TabsTrigger>
                            <TabsTrigger value="list">Your Tickets</TabsTrigger>
                            <TabsTrigger value="email">Email Support</TabsTrigger>
                        </TabsList>

                        <TabsContent value="create">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create a New Ticket</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Input
                                        placeholder="Subject"
                                        value={newTicket.subject}
                                        onChange={e =>
                                            setNewTicket({ ...newTicket, subject: e.target.value })
                                        }
                                    />
                                    <Textarea
                                        placeholder="Description"
                                        value={newTicket.description}
                                        onChange={e =>
                                            setNewTicket({ ...newTicket, description: e.target.value })
                                        }
                                        rows={4}
                                    />
                                    <Button onClick={handleCreateTicket} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" /> Submit Ticket
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="list">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Tickets</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {tickets.length > 0 ? (
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-4">
                                                {tickets.map(ticket => (
                                                    <Card
                                                        key={ticket.id}
                                                        className="cursor-pointer hover:bg-warm-50 transition duration-300"
                                                        onClick={() => setSelectedTicket(ticket)}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h3 className="font-semibold text-warm-800">
                                                                    {ticket.subject}
                                                                </h3>
                                                                <Badge
                                                                    variant={
                                                                        ticket.status === "open"
                                                                            ? "secondary"
                                                                            : "default"
                                                                    }
                                                                >
                                                                    {ticket.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-warm-600 line-clamp-2">
                                                                {ticket.description}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <p className="text-warm-600 text-center">No tickets found.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="email">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Support via Email</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-warm-600 mb-4">
                                        If you prefer to contact us via email, click the button below.
                                    </p>
                                    <Button onClick={handleSendEmail} variant="outline">
                                        <Mail className="mr-2 h-4 w-4" /> Send Email
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {selectedTicket && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Respond to Ticket</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-warm-800 mb-2">
                                        Subject: {selectedTicket.subject}
                                    </h3>
                                    <p className="text-warm-600 mb-4">
                                        Description: {selectedTicket.description}
                                    </p>
                                </div>
                                <Textarea
                                    placeholder="Your response"
                                    value={response}
                                    onChange={e => setResponse(e.target.value)}
                                    rows={4}
                                />
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedTicket(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => handleRespond(selectedTicket.id, response)}
                                    >
                                        <Send className="mr-2 h-4 w-4" /> Submit Response
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </div>
        </div>
    )
}