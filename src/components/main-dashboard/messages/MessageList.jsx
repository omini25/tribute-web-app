"use client"

import { format } from "date-fns"
import { MailOpen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MessageList({
                                messages,
                                selectedMessageId,
                                onSelectMessage,
                                onMarkAsRead,
                                onDeleteMessage
                            }) {
    if (messages.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            {messages.map(message => (
                <MessageItem
                    key={message.id}
                    message={message}
                    isSelected={message.id === selectedMessageId}
                    onSelect={() => onSelectMessage(message)}
                    onMarkAsRead={() => onMarkAsRead(message.id, true)}
                    onDelete={() => onDeleteMessage(message.id)}
                />
            ))}
        </div>
    )
}

function MessageItem({
                         message,
                         isSelected,
                         onSelect,
                         onMarkAsRead,
                         onDelete
                     }) {
    const handleMarkAsRead = e => {
        e.stopPropagation()
        onMarkAsRead()
    }

    const handleDelete = e => {
        e.stopPropagation()
        onDelete()
    }

    return (
        <div
            className={cn(
                "p-3 border rounded-lg cursor-pointer transition-colors",
                isSelected ? "bg-primary/10 border-primary/30" : "hover:bg-muted/50",
                !message.is_read && "border-primary/20 bg-primary/5"
            )}
            onClick={onSelect}
        >
            <div className="flex justify-between items-start mb-1">
                <div>
                    <h3
                        className={cn(
                            "font-medium text-sm",
                            !message.is_read && "font-semibold"
                        )}
                    >
                        {message.sender_name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {message.sender_email}
                    </p>
                </div>
                <span className="text-xs text-muted-foreground">
          {format(new Date(message.date), "MMM d")}
        </span>
            </div>

            <h4 className="text-sm mb-1 truncate">
                {message.subject}
            </h4>

            <p className="text-xs text-muted-foreground line-clamp-2">
                {message.description}
            </p>

            <div className="flex justify-end mt-2 gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    title="Delete ticket"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
