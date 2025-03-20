"use client"

import { format } from "date-fns"
import { ArrowLeft, Reply, Trash2, MailOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function MessageView({
                                message,
                                onClose,
                                onReply,
                                onDelete,
                                onMarkAsUnread
                            }) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-4 flex flex-row items-start justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="md:hidden"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-semibold">{message.subject}</h2>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(message.date), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={onMarkAsUnread}>
                        <MailOpen className="mr-2 h-4 w-4" />
                        Mark as Unread
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-grow">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(message.sender_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{message.sender_name}</p>
                        <p className="text-sm text-muted-foreground">
                            {message.sender_email}
                        </p>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none">
                    {message.content.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="pt-4 border-t">
                <Button onClick={onReply} className="gap-2">
                    <Reply className="h-4 w-4" />
                    Reply
                </Button>
            </CardFooter>
        </Card>
    )
}

function getInitials(name) {
    return name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
}
