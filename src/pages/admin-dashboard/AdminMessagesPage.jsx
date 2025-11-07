"use client"

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { server } from "@/server.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Mail,
    MailOpen,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    AlertCircle,
    Loader2
} from "lucide-react";
import { MessageList } from "@/components/admin-dashboard/messages/MessageList"; // Adjusted path
import { MessageView } from "@/components/admin-dashboard/messages/MessageView";   // Adjusted path
import { ReplyModal } from "@/components/admin-dashboard/messages/ReplyModal";     // Adjusted path
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Helper to format a single reply from backend to frontend structure
const formatBackendReplyToFrontend = (backendReply) => {
    if (!backendReply) return null;
    return {
        id: backendReply.id,
        content: backendReply.message_content || backendReply.response,
        senderType: backendReply.sender_type || backendReply.person, // 'user' or 'admin'
        date: backendReply.created_at ? new Date(backendReply.created_at).toISOString() : new Date().toISOString(),
    };
};

export default function AdminMessagesPage() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // 'all', 'open', 'responded', 'closed'
    const [sortBy, setSortBy] = useState("updated_at-desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

    const ticketsPerPage = 10;
    // const adminUser = JSON.parse(localStorage.getItem("user") || "{}"); // Assuming admin user info is stored

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // The backend `indexAdmin` should now include responses
            const response = await axios.get(`${server}/admin/tickets`);

            if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
                const formattedTickets = response.data.data.map(ticket => ({
                    id: ticket.id,
                    user_id: ticket.user?.id,
                    sender_name: ticket.user?.name || "N/A", // User who created the ticket
                    sender_email: ticket.user?.email || "N/A",
                    subject: ticket.subject || "No Subject",
                    initial_content: ticket.description || "", // The user's first message
                    status: ticket.status || "open",
                    date: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
                    updated_at: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date(ticket.created_at).toISOString(),
                    replies: Array.isArray(ticket.responses)
                        ? ticket.responses.map(formatBackendReplyToFrontend).filter(Boolean)
                        : [],
                }));
                setTickets(formattedTickets);
            } else {
                setTickets([]);
                if (response.data?.message !== 'No tickets found') {
                    setError(response.data?.message || "Received an unexpected response from the server.");
                }
            }
        } catch (err) {
            console.error("Error fetching tickets:", err);
            const errorMessage = err.response?.data?.message || "Failed to load tickets. Please try again later.";
            setError(errorMessage);
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Removed server from dependencies as it's an imported constant

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 when search, filter, or sort changes
    }, [searchTerm, filterType, sortBy]);

    const handleRespond = async (ticketId, responseText) => {
        if (!responseText.trim()) {
            toast.error("Response cannot be empty.");
            return;
        }
        try {
            const responsePayload = { response: responseText }; // Backend expects 'response'
            const res = await axios.post(`${server}/admin/tickets/${ticketId}/response`, responsePayload);

            if (res.data && res.data.status === 'success' && res.data.data) {
                const newBackendReply = res.data.data; // This is the new TicketResponse from backend
                const newFrontendReply = formatBackendReplyToFrontend(newBackendReply);

                if (newFrontendReply) {
                    setTickets(prevTickets =>
                        prevTickets.map(ticket =>
                            ticket.id === ticketId
                                ? {
                                    ...ticket,
                                    replies: [...ticket.replies, newFrontendReply],
                                    status: "responded", // Backend updates status to 'responded'
                                    updated_at: newFrontendReply.date,
                                }
                                : ticket
                        )
                    );

                    if (selectedTicket && selectedTicket.id === ticketId) {
                        setSelectedTicket(prev => ({
                            ...prev,
                            replies: [...(prev.replies || []), newFrontendReply],
                            status: "responded",
                            updated_at: newFrontendReply.date,
                        }));
                    }
                }
                setIsReplyModalOpen(false);
                toast.success("Response sent successfully");
            } else {
                throw new Error(res.data?.message || "Failed to send response due to server error.");
            }
        } catch (error) {
            console.error("Error responding to ticket:", error);
            toast.error(error.message || error.response?.data?.message || "Error responding to ticket");
        }
    };

    const handleDeleteOrCloseTicket = async (ticketId, currentStatus) => {
        // For now, let's assume "delete" means "close" for admin.
        // If actual deletion is needed, the backend endpoint would be different.
        const actionText = currentStatus === 'closed' ? 'reopen' : 'close';
        const newStatus = currentStatus === 'closed' ? 'open' : 'closed';

        if (window.confirm(`Are you sure you want to ${actionText} this ticket?`)) {
            try {
                // You'll need a backend endpoint to update ticket status
                // For example: await axios.patch(`${server}/admin/tickets/${ticketId}/status`, { status: newStatus });
                // For now, we'll simulate it and update UI.
                // Replace with actual API call when ready.
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
                toast.info(`Ticket status update to '${newStatus}' would happen here with an API call.`);


                setTickets(prevTickets =>
                    prevTickets.map(ticket =>
                        ticket.id === ticketId ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() } : ticket
                    )
                );
                if (selectedTicket && selectedTicket.id === ticketId) {
                    setSelectedTicket(prev => ({ ...prev, status: newStatus, updated_at: new Date().toISOString() }));
                }
                // toast.success(`Ticket ${actionText}d successfully.`);
            } catch (error) {
                console.error(`Error ${actionText}ing ticket:`, error);
                toast.error(error.response?.data?.message || `Failed to ${actionText} ticket.`);
            }
        }
    };


    const filteredTickets = tickets.filter(ticket => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch =
            ticket.subject.toLowerCase().includes(lowerSearchTerm) ||
            ticket.sender_name.toLowerCase().includes(lowerSearchTerm) ||
            ticket.initial_content.toLowerCase().includes(lowerSearchTerm) ||
            (ticket.sender_email && ticket.sender_email.toLowerCase().includes(lowerSearchTerm));

        if (filterType === "all") return matchesSearch;
        return matchesSearch && ticket.status === filterType;
    });

    const sortedTickets = [...filteredTickets].sort((a, b) => {
        const dateA = new Date(a.updated_at || a.date);
        const dateB = new Date(b.updated_at || b.date);
        const nameA = a.sender_name || "";
        const nameB = b.sender_name || "";

        switch (sortBy) {
            case "updated_at-desc": return dateB - dateA;
            case "updated_at-asc": return dateA - dateB;
            case "sender_name-asc": return nameA.localeCompare(nameB);
            case "sender_name-desc": return nameB.localeCompare(nameA);
            default: return 0;
        }
    });

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTicketsOnPage = sortedTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(sortedTickets.length / ticketsPerPage);

    const viewTicketDetails = ticket => {
        setSelectedTicket(ticket);
    };

    const closeTicketView = () => {
        setSelectedTicket(null);
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
            <Card className="shadow-lg">
                <CardHeader className="border-b">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-800 sm:text-3xl">
                                Support Tickets
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Manage customer support tickets and inquiries.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={fetchTickets}
                            variant="outline"
                            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? "Refreshing..." : "Refresh Tickets"}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                    {error && (
                        <Alert variant="destructive" className="m-4 sm:m-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
                        <div className="lg:col-span-1 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Tabs defaultValue="all" value={filterType} onValueChange={setFilterType} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                                        <TabsTrigger value="all">All</TabsTrigger>
                                        <TabsTrigger value="open">Open</TabsTrigger>
                                        <TabsTrigger value="responded">Responded</TabsTrigger>
                                        <TabsTrigger value="closed">Closed</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="updated_at-desc">Newest Activity</SelectItem>
                                        <SelectItem value="updated_at-asc">Oldest Activity</SelectItem>
                                        <SelectItem value="sender_name-asc">Sender (A-Z)</SelectItem>
                                        <SelectItem value="sender_name-desc">Sender (Z-A)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {isLoading ? (
                                <div className="space-y-3 mt-4">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="p-4 border rounded-lg bg-white">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2 flex-grow">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                                <Skeleton className="h-3 w-16 ml-2" />
                                            </div>
                                            <Skeleton className="h-3 w-full mt-3" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <MessageList
                                        tickets={currentTicketsOnPage}
                                        selectedTicketId={selectedTicket?.id}
                                        onSelectTicket={viewTicketDetails}
                                        onDeleteTicket={handleDeleteOrCloseTicket}
                                    />
                                    {sortedTickets.length > 0 && totalPages > 1 && (
                                        <div className="flex justify-center items-center mt-4 space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {currentTicketsOnPage.length === 0 && !isLoading && (
                                        <div className="text-center py-8 border rounded-lg bg-gray-50 mt-4">
                                            <Mail className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-4 text-lg font-medium text-gray-700">No tickets found</h3>
                                            <p className="mt-2 text-sm text-gray-500">
                                                {searchTerm || filterType !== 'all' ? "Try adjusting your search or filters." : "There are no support tickets at the moment."}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            {selectedTicket ? (
                                <MessageView
                                    ticket={selectedTicket} // Pass the whole ticket object
                                    onClose={closeTicketView}
                                    onReply={() => setIsReplyModalOpen(true)}
                                    onDeleteOrClose={() => handleDeleteOrCloseTicket(selectedTicket.id, selectedTicket.status)}
                                    // adminUserId={adminUser?.id} // Pass admin's ID if needed for styling own messages
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center border rounded-lg p-8 bg-gray-50 min-h-[300px] lg:min-h-full">
                                    <MailOpen className="mx-auto h-16 w-16 text-gray-400" />
                                    <h3 className="mt-4 text-xl font-semibold text-gray-700">Select a Ticket</h3>
                                    <p className="mt-2 text-sm text-gray-500">Choose a ticket from the list to view its details and conversation history.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedTicket && (
                        <ReplyModal
                            isOpen={isReplyModalOpen}
                            onClose={() => setIsReplyModalOpen(false)}
                            onSend={(responseText) => handleRespond(selectedTicket.id, responseText)}
                            recipientName={selectedTicket.sender_name} // For display in modal title
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
