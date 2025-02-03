import React, { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { DollarSign, Calendar, Search, Download } from "lucide-react"
import { format } from "date-fns"

export default function Donations() {
    const [donations, setDonations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchDonations()
    }, [])

    const fetchDonations = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${server}/donations`)
            setDonations(response.data.data)
        } catch (error) {
            console.error("Error fetching donations:", error)
            setError("Failed to load donations. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredDonations = donations.filter(
        donation =>
            donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalDonations = filteredDonations.reduce(
        (sum, donation) => sum + donation.amount,
        0
    )

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-warm-800">Donations</h1>
                    <Button className="bg-warm-500 hover:bg-warm-600">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Donations
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-warm-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${totalDonations.toFixed(2)}
                            </div>
                            <p className="text-xs text-warm-500">
                                {filteredDonations.length} donations
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Donation
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-warm-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${(totalDonations / filteredDonations.length || 0).toFixed(2)}
                            </div>
                            <p className="text-xs text-warm-500">Per donation</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Latest Donation
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-warm-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredDonations[0]
                                    ? format(
                                        new Date(filteredDonations[0].created_at),
                                        "MMM d, yyyy"
                                    )
                                    : "N/A"}
                            </div>
                            <p className="text-xs text-warm-500">
                                Date of most recent donation
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="mb-4 flex items-center">
                            <Search className="mr-2 h-4 w-4 text-warm-400" />
                            <Input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="flex-grow"
                            />
                        </div>

                        {isLoading && (
                            <div className="text-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-500 mx-auto"></div>
                                <p className="mt-4 text-warm-600">Loading donations...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-10">
                                <p className="text-red-500">{error}</p>
                                <Button
                                    onClick={fetchDonations}
                                    className="mt-4 bg-warm-500 hover:bg-warm-600 text-white"
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}

                        {!isLoading && !error && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDonations.map(donation => (
                                        <TableRow key={donation.id}>
                                            <TableCell className="font-medium">
                                                {donation.name}
                                            </TableCell>
                                            <TableCell>{donation.email}</TableCell>
                                            <TableCell>${donation.amount.toFixed(2)}</TableCell>
                                            <TableCell>
                                                {format(new Date(donation.created_at), "MMM d, yyyy")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {!isLoading && !error && filteredDonations.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-warm-600">No donations found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
