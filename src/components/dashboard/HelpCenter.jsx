import { useState } from "react"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Plus, Send } from "lucide-react"

export default function HelpCenter() {
    const [tickets, setTickets] = useState([])
    const [newTicket, setNewTicket] = useState({ subject: "", description: "" })
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [response, setResponse] = useState("")

    const handleCreateTicket = () => {
        if (!newTicket.subject || !newTicket.description) {
            alert("Please fill in all fields.")
            return
        }
        const updatedTickets = [
            ...tickets,
            { id: Date.now(), ...newTicket, status: "open", responses: [] }
        ]
        setTickets(updatedTickets)
        setNewTicket({ subject: "", description: "" })
    }

    const handleRespond = (ticketId, responseText) => {
        const updatedTickets = tickets.map(ticket =>
            ticket.id === ticketId
                ? {
                    ...ticket,
                    responses: [...ticket.responses, responseText],
                    status: "responded"
                }
                : ticket
        )
        setTickets(updatedTickets)
        setSelectedTicket(null)
        setResponse("")
    }

    const handleSendEmail = () => {
        window.location.href =
            "mailto:support@example.com?subject=Support%20Request"
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-warm-800 mb-8">Help Center</h1>

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
            </div>
        </div>
    )
}
