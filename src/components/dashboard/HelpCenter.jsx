import { useState, useEffect } from "react";
import axios from "axios";
// import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"; // Assuming this is not used directly in this file for now
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Plus, Send } from "lucide-react";
import { server } from "@/server.js";
import { toast } from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function HelpCenter() {
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ subject: "", description: "" });
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [response, setResponse] = useState(""); // For the new response text area
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    // const [totalTickets, setTotalTickets] = useState(0); // Optional: if you want to use total_count

    // console.log(tickets); // Good for debugging, remove for production

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;

    useEffect(() => {
        const fetchTickets = async () => {
            if (!userId) return; // Don't fetch if no userId
            try {
                const res = await axios.get(
                    `${server}/tickets?userId=${userId}`
                );
                // API returns { tickets: [], total_count: X }
                if (res.data && Array.isArray(res.data.tickets)) {
                    // Map API responses to the structure your frontend expects for responses
                    const formattedTickets = res.data.tickets.map(ticket => ({
                        ...ticket,
                        responses: ticket.responses?.map(apiResponse => ({
                            id: apiResponse.id,
                            message: apiResponse.response, // API uses 'response' for message content
                            isSupport: apiResponse.person === "admin" || apiResponse.person === "support", // API uses 'person'
                            created_at: apiResponse.created_at,
                        })) || []
                    }));
                    setTickets(formattedTickets);
                    // setTotalTickets(res.data.total_count); // Optional
                } else {
                    setTickets([]); // Set to empty array if data is not as expected
                }
            } catch (error) {
                console.error("Error fetching tickets:", error);
                toast.error("Could not fetch your support tickets.");
                setTickets([]); // Clear tickets on error
            }
        };

        fetchTickets();
    }, [userId]);

    const handleCreateTicket = async () => {
        if (!newTicket.subject.trim() || !newTicket.description.trim()) {
            toast.error("Please fill in both subject and description.");
            return;
        }

        try {
            const res = await axios.post(`${server}/tickets`, {
                userId,
                ...newTicket,
            });
            // Assuming the API returns the newly created ticket directly
            // If it's nested like { ticket: {...} }, adjust accordingly: res.data.ticket
            const createdTicket = {
                ...res.data, // Spread the raw ticket data from API
                responses: res.data.responses?.map(apiResponse => ({ // Map its responses if any
                    id: apiResponse.id,
                    message: apiResponse.response,
                    isSupport: apiResponse.person === "admin" || apiResponse.person === "support",
                    created_at: apiResponse.created_at,
                })) || []
            };
            setTickets(prevTickets => [...prevTickets, createdTicket]);
            setNewTicket({ subject: "", description: "" });
            toast.success("Ticket created successfully");
        } catch (error) {
            console.error("Error creating ticket:", error);
            toast.error(error.response?.data?.message || "Error creating ticket");
        }
    };

    const handleRespond = async (ticketId, responseText) => {
        if (!responseText.trim()) {
            toast.error("Response cannot be empty.");
            return;
        }
        try {
            // The API expects 'response' field for the text
            const res = await axios.post(
                `${server}/tickets/${ticketId}/response`,
                {
                    response: responseText, // API expects 'response' for the message content
                    // userId: userId, // The backend might infer user from auth or expect it
                }
            );

            // Assuming API returns the new response object
            const newApiResponse = res.data;
            const newFrontendResponse = {
                id: newApiResponse.id,
                message: newApiResponse.response,
                isSupport: newApiResponse.person === "admin" || newApiResponse.person === "support",
                created_at: newApiResponse.created_at,
            };

            const updatedTickets = tickets.map(ticket => {
                if (ticket.id === ticketId) {
                    return {
                        ...ticket,
                        responses: ticket.responses
                            ? [...ticket.responses, newFrontendResponse]
                            : [newFrontendResponse],
                        status: "responded", // Or whatever status the API returns/implies
                    };
                }
                return ticket;
            });

            setTickets(updatedTickets);
            // Update selectedTicket as well if it's the one being responded to
            if (selectedTicket && selectedTicket.id === ticketId) {
                setSelectedTicket(prevSelected => ({
                    ...prevSelected,
                    responses: prevSelected.responses
                        ? [...prevSelected.responses, newFrontendResponse]
                        : [newFrontendResponse],
                    status: "responded",
                }));
            }
            setResponse(""); // Clear the textarea
            toast.success("Response sent successfully");
            // setIsTicketModalOpen(false); // Keep modal open to see the new response
        } catch (error) {
            console.error("Error responding to ticket:", error);
            toast.error(error.response?.data?.message || "Error responding to ticket");
        }
    };

    const handleSendEmail = () => {
        window.location.href =
            "mailto:support@rememberedalways.org?subject=Support%20Request"; // Replace with your actual support email
    };

    // When a ticket card is clicked to open the modal
    const handleTicketCardClick = (ticket) => {
        setSelectedTicket(ticket); // The ticket object from state already has formatted responses
        setIsTicketModalOpen(true);
    };


    return (
        <div> {/* Consider using DashboardLayout here if it's a standard page layout */}
            <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
                <CardHeader className="p-0 mb-6"> {/* Added mb-6 for spacing */}
                    <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                        Help Center
                    </CardTitle>
                    <CardDescription className="text-warm-600">
                        How can we assist you today?
                    </CardDescription>
                </CardHeader>

                {/* Removed CardContent wrapping Tabs for better structure */}
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
                                        setNewTicket({
                                            ...newTicket,
                                            description: e.target.value,
                                        })
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
                                                    onClick={() => handleTicketCardClick(ticket)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h3 className="font-semibold text-warm-800">
                                                                {ticket.subject}
                                                            </h3>
                                                            <Badge
                                                                className={
                                                                    ticket.status === "open" || ticket.status === "responded" // Assuming 'responded' might also be a distinct color
                                                                        ? "bg-[#fcd34d] text-white" // Example: yellow for open/responded
                                                                        : ticket.status === "closed"
                                                                            ? "bg-green-500 text-white" // Example: green for closed
                                                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100" // Default
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
                                    <p className="text-warm-600 text-center py-4"> {/* Added py-4 for spacing */}
                                        No tickets found.
                                    </p>
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
                                    If you prefer to contact us via email, click the button
                                    below.
                                </p>
                                <Button onClick={handleSendEmail} variant="outline">
                                    <Mail className="mr-2 h-4 w-4" /> Send Email
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Dialog for viewing and responding to a selected ticket */}
                <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-lg p-0 sm:p-6"> {/* Adjusted padding for consistency */}
                        {selectedTicket && (
                            <>
                                <DialogHeader className="p-4 sm:p-0 border-b sm:border-none mb-4"> {/* Added padding and border for mobile */}
                                    <DialogTitle>{selectedTicket.subject}</DialogTitle>
                                    <DialogDescription>
                                        Ticket status: <Badge
                                        className={
                                            selectedTicket.status === "open" || selectedTicket.status === "responded"
                                                ? "bg-[#fcd34d] text-white"
                                                : selectedTicket.status === "closed"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 text-gray-700"
                                        }
                                    >{selectedTicket.status}</Badge>
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="h-[300px] sm:h-[400px] w-full pr-4 px-4 sm:px-0"> {/* Adjusted height and padding */}
                                    <div className="space-y-4">
                                        <div className="border-l-4 border-warm-200 pl-4 py-2 bg-warm-50 rounded-r-md"> {/* Added some bg and padding */}
                                            <p className="text-xs text-muted-foreground font-medium">Initial request:</p>
                                            <p className="mt-1 text-sm">{selectedTicket.description}</p>
                                        </div>
                                        {/* Ensure selectedTicket.responses is the already formatted array */}
                                        {selectedTicket.responses?.map((resp, index) => (
                                            <div
                                                key={resp.id || index} // Use resp.id if available from mapping
                                                className={`border-l-4 pl-4 py-2 rounded-r-md ${
                                                    resp.isSupport
                                                        ? "border-blue-300 bg-blue-50"
                                                        : "border-warm-300 bg-warm-50 ml-4 sm:ml-8" // Indent user responses
                                                }`}
                                            >
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {resp.isSupport ? "Support" : "You"} -{" "}
                                                    {new Date(
                                                        resp.created_at
                                                    ).toLocaleDateString()}{" "}
                                                    {new Date(
                                                        resp.created_at
                                                    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="mt-1 text-sm">{resp.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                {selectedTicket.status !== "closed" && (
                                    <div className="space-y-4 mt-4 pt-4 border-t px-4 pb-4 sm:px-0 sm:pb-0"> {/* Added padding for mobile */}
                                        <Textarea
                                            placeholder="Type your response..."
                                            value={response}
                                            onChange={(e) => setResponse(e.target.value)}
                                            rows={3}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsTicketModalOpen(false);
                                                    setResponse(""); // Clear response on close
                                                }}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    handleRespond(selectedTicket.id, response);
                                                    // Optionally close modal or keep it open:
                                                    // setIsTicketModalOpen(false);
                                                }}
                                                disabled={!response.trim()}
                                            >
                                                <Send className="mr-2 h-4 w-4" /> Send
                                                Response
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* The section below for responding outside the modal seems redundant now
                    as the modal handles responses. I'm commenting it out.
                    If you need it, ensure it uses the correctly formatted selectedTicket.responses.
                */}
                {/*
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
                */}
            </div>
        </div>
    );
}