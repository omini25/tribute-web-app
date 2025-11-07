"use client"

import { format } from "date-fns";
import { Trash2, Edit3, CheckCircle, XCircle, MessageSquare } from "lucide-react"; // Added icons
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mapping status to badge variants
const statusVariants = {
    open: "bg-blue-100 text-blue-700 border-blue-300",
    responded: "bg-yellow-100 text-yellow-700 border-yellow-300",
    closed: "bg-green-100 text-green-700 border-green-300",
    default: "bg-gray-100 text-gray-700 border-gray-300",
};

export function MessageList({
                                tickets,
                                selectedTicketId,
                                onSelectTicket,
                                onDeleteTicket // Renamed from onDeleteMessage, handles delete/close
                            }) {
    if (!tickets || tickets.length === 0) {
        // This case is handled by the parent (AdminMessagesPage)
        // but good to have a fallback if used standalone.
        return null;
    }

    return (
        <div className="space-y-3">
            {tickets.map(ticket => (
                <TicketItem
                    key={ticket.id}
                    ticket={ticket}
                    isSelected={ticket.id === selectedTicketId}
                    onSelect={() => onSelectTicket(ticket)}
                    onDeleteOrClose={() => onDeleteTicket(ticket.id, ticket.status)}
                />
            ))}
        </div>
    );
}

function TicketItem({
                        ticket,
                        isSelected,
                        onSelect,
                        onDeleteOrClose
                    }) {
    const handleDeleteClick = e => {
        e.stopPropagation(); // Prevent onSelect from firing
        onDeleteOrClose();
    };

    const ticketStatus = ticket.status || "open";
    const badgeVariant = statusVariants[ticketStatus] || statusVariants.default;

    return (
        <div
            className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all duration-150 ease-in-out shadow-sm hover:shadow-md",
                "bg-white dark:bg-gray-800",
                isSelected ? "ring-2 ring-primary border-primary dark:ring-primary dark:border-primary" : "hover:border-gray-300 dark:hover:border-gray-600",
            )}
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-grow overflow-hidden">
                    <h3 className={cn("font-semibold text-sm truncate", isSelected ? "text-primary" : "text-gray-800 dark:text-gray-100")}>
                        {ticket.subject}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        From: {ticket.sender_name} ({ticket.sender_email})
                    </p>
                </div>
                <Badge variant="outline" className={`ml-2 text-xs ${badgeVariant}`}>
                    {ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1)}
                </Badge>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                {ticket.initial_content}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>
                    Last activity: {format(new Date(ticket.updated_at || ticket.date), "MMM d, HH:mm")}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDeleteClick}
                    title={ticket.status === 'closed' ? "Reopen Ticket" : "Close Ticket"}
                >
                    {ticket.status === 'closed' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}