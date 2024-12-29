import { MapPin, Phone, Mail } from 'lucide-react'

export function ContactInfo() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Memorial Lane, Remembrance City, RC 12345</span>
            </div>
            <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>support@memorywebsite.com</span>
            </div>
        </div>
    )
}

