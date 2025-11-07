"use client"

import { format } from "date-fns";
import { ArrowLeft, Reply as ReplyIcon, Trash2, XCircle, CheckCircle } from "lucide-react"; // Renamed Reply to ReplyIcon
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added AvatarImage
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function formatDate(dateString) {
    if (!dateString) return 'Date not available';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        return format(date, "MMMM d, yyyy 'at' h:mm a");
    } catch {
        return 'Invalid date';
    }
}

function getInitials(name) {
    if (!name || typeof name !== 'string') return '??';
    return name
        .split(" ")
        .map(part => part[0])
        .filter(Boolean) // Ensure no empty strings if there are multiple spaces
        .join("")
        .toUpperCase()
        .substring(0, 2);
}

// Mapping status to badge variants
const statusVariants = {
    open: "bg-blue-100 text-blue-700 border-blue-300",
    responded: "bg-yellow-100 text-yellow-700 border-yellow-300",
    closed: "bg-green-100 text-green-700 border-green-300",
    default: "bg-gray-100 text-gray-700 border-gray-300",
};


export function MessageView({
                                ticket, // Renamed from 'message' to 'ticket'
                                onClose,
                                onReply,
                                onDeleteOrClose, // Renamed from onDelete
                                // adminUserId // ID of the currently logged-in admin
                            }) {
    if (!ticket) return null; // Should be handled by parent, but good practice

    const ticketStatus = ticket.status || "open";
    const badgeVariant = statusVariants[ticketStatus] || statusVariants.default;

    return (
        <Card className="h-full flex flex-col shadow-lg">
            <CardHeader className="pb-4 flex flex-row items-start justify-between border-b">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="md:hidden mr-1" // Show on mobile to go back
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-grow">
                        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">{ticket.subject}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-gray-500">
                            From: {ticket.sender_name} ({ticket.sender_email})
                            <span className="mx-1">·</span>
                            Created: {formatDate(ticket.date)}
                        </CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${badgeVariant}`}>
                        {ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1)}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDeleteOrClose}
                        className={cn(
                            "text-sm",
                            ticket.status === 'closed'
                                ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                : "text-destructive hover:text-destructive hover:bg-destructive/10"
                        )}
                    >
                        {ticket.status === 'closed' ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        {ticket.status === 'closed' ? "Reopen" : "Close"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-grow overflow-auto p-4 sm:p-6 space-y-6">
                {/* Initial Ticket Message from User */}
                <div className="flex gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                        {/* <AvatarImage src={ticket.user?.avatar_url} alt={ticket.sender_name} /> */}
                        <AvatarFallback>{getInitials(ticket.sender_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow p-3 bg-gray-100 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-medium text-sm text-gray-700">{ticket.sender_name} (User)</p>
                            <p className="text-xs text-gray-500">{formatDate(ticket.date)}</p>
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-800">
                            {ticket.initial_content?.split("\n")?.map((paragraph, index) => (
                                <p key={`initial-${index}`} className="mb-2 last:mb-0">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Replies */}
                {ticket.replies && ticket.replies.length > 0 && (
                    <>
                        <Separator className="my-4" />
                        {ticket.replies.map((reply) => {
                            const isUserReply = reply.senderType === 'user';
                            const senderName = isUserReply ? ticket.sender_name : "Support Team (Admin)";
                            // const avatarUrl = isUserReply ? ticket.user?.avatar_url : adminUser?.avatar_url; // Example

                            return (
                                <div key={reply.id} className={cn("flex gap-3", isUserReply ? "" : "flex-row-reverse")}>
                                    {!isUserReply && <div className="flex-grow min-w-[10%] sm:min-w-[20%]"></div> /* Spacer for admin replies */}
                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                        {/* <AvatarImage src={avatarUrl} alt={senderName} /> */}
                                        <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                        "flex-grow p-3 rounded-lg shadow-sm max-w-[80%]",
                                        isUserReply ? "bg-gray-100" : "bg-primary/10 text-primary-foreground"
                                    )}>
                                        <div className={cn(
                                            "flex items-center mb-1",
                                            isUserReply ? "justify-between" : "justify-between flex-row-reverse"
                                        )}>
                                            <p className={cn("font-medium text-sm", isUserReply ? "text-gray-700" : "text-primary-foreground/90")}>{senderName}</p>
                                            <p className={cn("text-xs", isUserReply ? "text-gray-500" : "text-primary-foreground/70")}>{formatDate(reply.date)}</p>
                                        </div>
                                        <div className={cn("prose prose-sm max-w-none", isUserReply ? "text-gray-800" : "text-primary-foreground")}>
                                            {reply.content?.split("\n")?.map((paragraph, index) => (
                                                <p key={`reply-${reply.id}-${index}`} className="mb-2 last:mb-0">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    {isUserReply && <div className="flex-grow min-w-[10%] sm:min-w-[20%]"></div> /* Spacer for user replies */}
                                </div>
                            );
                        })}
                    </>
                )}
            </CardContent>

            {ticket.status !== 'closed' && (
                <CardFooter className="pt-4 border-t">
                    <Button onClick={onReply} className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <ReplyIcon className="h-4 w-4" />
                        Reply to Ticket
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}