"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout";
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
    AlertCircle
} from "lucide-react";
import { MessageList } from "@/components/main-dashboard/messages/MessageList.jsx";
import { MessageView } from "@/components/main-dashboard/messages/MessageView.jsx";
import { ReplyModal } from "@/components/main-dashboard/messages/ReplyModal.jsx";
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
import {CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortBy, setSortBy] = useState("date-desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

    const messagesPerPage = 10;
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${server}/messages/${user.id}`);
            setMessages(response.data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages. Please try again later.");
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (messageId, isRead = true) => {
        try {
            await axios.put(`${server}/messages/${messageId}`, {
                is_read: isRead
            });

            setMessages(
                messages.map(msg =>
                    msg.id === messageId ? { ...msg, is_read: isRead } : msg
                )
            );

            toast({
                title: isRead ? "Message marked as read" : "Message marked as unread",
                description: "Message status updated successfully."
            });
        } catch (error) {
            console.error("Error updating message:", error);
            toast({
                title: "Error",
                description: "Failed to update message status. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteMessage = async messageId => {
        if (confirm("Are you sure you want to delete this message?")) {
            try {
                await axios.delete(`${server}/messages/${messageId}`);

                setMessages(messages.filter(msg => msg.id !== messageId));

                if (selectedMessage && selectedMessage.id === messageId) {
                    setSelectedMessage(null);
                }

                toast({
                    title: "Message Deleted",
                    description: "Message has been deleted successfully."
                });
            } catch (error) {
                console.error("Error deleting message:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete message. Please try again.",
                    variant: "destructive"
                });
            }
        }
    };

    const handleSendReply = async replyData => {
        try {
            await axios.post(`${server}/messages/reply`, {
                message_id: selectedMessage.id,
                ...replyData
            });

            toast({
                title: "Reply Sent",
                description: "Your reply has been sent successfully."
            });

            setIsReplyModalOpen(false);
        } catch (error) {
            console.error("Error sending reply:", error);
            toast({
                title: "Error",
                description: "Failed to send reply. Please try again.",
                variant: "destructive"
            });
        }
    };

    const filteredMessages = messages.filter(message => {
        const matchesSearch =
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.content.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === "all") return matchesSearch;
        if (filterType === "unread") return matchesSearch && !message.is_read;
        if (filterType === "read") return matchesSearch && message.is_read;

        return matchesSearch;
    });

    const sortedMessages = [...filteredMessages].sort((a, b) => {
        if (sortBy === "date-desc") {
            return new Date(b.date) - new Date(a.date);
        }
        if (sortBy === "date-asc") {
            return new Date(a.date) - new Date(b.date);
        }
        if (sortBy === "sender-asc") {
            return a.sender_name.localeCompare(b.sender_name);
        }
        if (sortBy === "sender-desc") {
            return b.sender_name.localeCompare(a.sender_name);
        }
        return 0;
    });

    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = sortedMessages.slice(
        indexOfFirstMessage,
        indexOfLastMessage
    );
    const totalPages = Math.ceil(sortedMessages.length / messagesPerPage);

    const viewMessage = message => {
        setSelectedMessage(message);

        if (!message.is_read) {
            handleMarkAsRead(message.id, true);
        }
    };

    const closeMessageView = () => {
        setSelectedMessage(null);
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">

            <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                    Messages
                </CardTitle>
                <CardDescription className="text-warm-600">
                    Messages from your family and friends
                </CardDescription>
                <Button
                    onClick={fetchMessages}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </CardHeader>


            <CardContent className="p-0">
                {/*{error && (*/}
                {/*    <Alert variant="destructive" className="mb-6">*/}
                {/*        <AlertCircle className="h-4 w-4" />*/}
                {/*        <AlertTitle>Error</AlertTitle>*/}
                {/*        <AlertDescription>{error}</AlertDescription>*/}
                {/*    </Alert>*/}
                {/*)}*/}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search messages..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Tabs
                                    defaultValue="all"
                                    value={filterType}
                                    onValueChange={setFilterType}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="all">All</TabsTrigger>
                                        <TabsTrigger value="unread">Unread</TabsTrigger>
                                        <TabsTrigger value="read">Read</TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date-desc">Newest first</SelectItem>
                                        <SelectItem value="date-asc">Oldest first</SelectItem>
                                        <SelectItem value="sender-asc">Sender (A-Z)</SelectItem>
                                        <SelectItem value="sender-desc">Sender (Z-A)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-3 w-full mt-3" />
                                        <Skeleton className="h-3 w-2/3 mt-1" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <MessageList
                                    messages={currentMessages}
                                    selectedMessageId={selectedMessage?.id}
                                    onSelectMessage={viewMessage}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDeleteMessage={handleDeleteMessage}
                                />

                                {sortedMessages.length > 0 && (
                                    <div className="flex justify-center mt-4">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    setCurrentPage(prev => Math.max(prev - 1, 1))
                                                }
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

                                {sortedMessages.length === 0 && (
                                    <div className="text-center py-8 border rounded-lg">
                                        <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                                        <h3 className="mt-4 text-lg font-medium">
                                            No messages found
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {searchTerm
                                                ? "Try adjusting your search or filters"
                                                : "You don't have any messages yet"}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        {selectedMessage ? (
                            <MessageView
                                message={selectedMessage}
                                onClose={closeMessageView}
                                onReply={() => setIsReplyModalOpen(true)}
                                onDelete={() => handleDeleteMessage(selectedMessage.id)}
                                onMarkAsUnread={() =>
                                    handleMarkAsRead(selectedMessage.id, false)
                                }
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center border rounded-lg p-8">
                                <div className="text-center">
                                    <MailOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                                    <h3 className="mt-4 text-lg font-medium">
                                        Select a message to view
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Choose a message from the list to view its contents
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {selectedMessage && (
                    <ReplyModal
                        isOpen={isReplyModalOpen}
                        onClose={() => setIsReplyModalOpen(false)}
                        onSend={handleSendReply}
                        recipient={selectedMessage}
                    />
                )}
            </CardContent>
        </div>
    );
}