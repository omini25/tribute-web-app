// src/components/main-dashboard/messages/ReplyModal.jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReplyModal({ isOpen, onClose, onSend, recipient }) {
    const [message, setMessage] = useState("");

    console.log(message)

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate message before sending
        if (!message.trim()) {
            return;
        }

        onSend({ message });
        setMessage(""); // Clear form after sending
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                    Reply to {recipient.sender_name}
                </h2>
                <form onSubmit={handleSubmit}>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your reply here..."
                        className="min-h-[100px] mb-4"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Send Reply</Button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}