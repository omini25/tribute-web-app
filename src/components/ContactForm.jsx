import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/components/ui/use-toast"

export function ContactForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    // const { toast } = useToast()

    const handleSubmit = e => {
        e.preventDefault()
        // Here you would typically send the form data to your backend
        console.log({ name, email, message })
        // toast({
        //     title: "Message Sent",
        //     description: "We've received your message and will get back to you soon."
        // })
        setName("")
        setEmail("")
        setMessage("")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name
                </label>
                <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                >
                    Message
                </label>
                <Textarea
                    id="message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                />
            </div>
            <Button type="submit">Send Message</Button>
        </form>
    )
}
