// src/components/main-dashboard/messages/ReplyModal.jsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // For better accessibility

export function ReplyModal({ isOpen, onClose, onSend, recipientName }) { // recipientName is just for display
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            // Optionally, show a toast or an inline error message
            return;
        }
        onSend(message); // Pass only the message string
        setMessage(""); // Clear form after sending
        // onClose(); // Parent component (AdminMessagesPage) will close it after successful send
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Send Reply
                    </DialogTitle>
                    {recipientName && (
                        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                            Replying to ticket from: {recipientName}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="reply-message" className="sr-only">Your Reply</Label>
                        <Textarea
                            id="reply-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your reply here..."
                            className="min-h-[120px] sm:min-h-[150px] border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                            required
                            rows={5}
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={!message.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Send Reply
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}