"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Mail, UserMinus, Search } from "lucide-react"

export function GuestList({ guests, onSendEmail, onDisinvite, isLoading }) {
    const [selectedGuests, setSelectedGuests] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const filteredGuests = guests.filter(
        guest =>
            guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectAll = () => {
        if (selectedGuests.length === filteredGuests.length) {
            setSelectedGuests([])
        } else {
            setSelectedGuests(filteredGuests)
        }
    }

    const handleSelectGuest = guest => {
        if (selectedGuests.find(g => g.id === guest.id)) {
            setSelectedGuests(selectedGuests.filter(g => g.id !== guest.id))
        } else {
            setSelectedGuests([...selectedGuests, guest])
        }
    }

    const handleSendEmail = () => {
        if (selectedGuests.length > 0) {
            onSendEmail(selectedGuests)
        }
    }

    const handleDisinvite = () => {
        if (selectedGuests.length > 0) {
            onDisinvite(selectedGuests)
            setSelectedGuests([])
        }
    }

    if (guests.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    No guests have been invited to this event yet.
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search guests..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {selectedGuests.length > 0 && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSendEmail}
                            disabled={isLoading}
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Email Selected ({selectedGuests.length})
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDisinvite}
                            disabled={isLoading}
                        >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Disinvite Selected
                        </Button>
                    </div>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        selectedGuests.length === filteredGuests.length &&
                                        filteredGuests.length > 0
                                    }
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>RSVP Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredGuests.map(guest => (
                            <TableRow key={guest.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedGuests.some(g => g.id === guest.id)}
                                        onCheckedChange={() => handleSelectGuest(guest)}
                                        aria-label={`Select ${guest.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{guest.name}</TableCell>
                                <TableCell>{guest.email}</TableCell>
                                <TableCell>{guest.rsvp_status || "Pending"}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onSendEmail([guest])}
                                            disabled={isLoading}
                                        >
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDisinvite([guest])}
                                            disabled={isLoading}
                                        >
                                            <UserMinus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
