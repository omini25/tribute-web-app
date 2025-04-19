import React, { useEffect, useState } from "react"
import axios from "axios"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { DollarSign, Search, Download } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import Decimal from "decimal.js";

export default function DonationsAndPayments() {
    const [donations, setDonations] = useState([])
    const [payments, setPayments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData()
    }, [])

    const handleRequestRedrawClick = () => {
        setIsModalOpen(true);
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;

            if (!userId) {
                setError("User ID is missing.");
                setIsLoading(false);
                return;
            }

            const [donationsResponse, paymentsResponse] = await Promise.all([
                axios.get(`${server}/donations?user_id=${userId}`),
                axios.get(`${server}/payments?user_id=${userId}`)
            ]);

            setDonations(donationsResponse.data.data);
            setPayments(paymentsResponse.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredDonations = donations.filter(
        donation =>
            donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredPayments = payments.filter(
        payment =>
            (payment.name && payment.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (payment.email && payment.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalDonations = filteredDonations.reduce((sum, donation) => {
        return sum.plus(new Decimal(donation.amount));
    }, new Decimal(0));

    const totalPayments = filteredPayments.reduce((sum, payment) => {
        return sum.plus(new Decimal(payment.amount));
    }, new Decimal(0));

    return (
        <div>
            <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">

                <CardHeader className="p-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                                Donations & Payments
                            </CardTitle>
                            <CardDescription className="text-warm-600">
                                Manage your donations and payments here.
                            </CardDescription>
                        </div>
                        <Button className="bg-warm-500 hover:bg-warm-600" onClick={handleRequestRedrawClick}>
                            <Download className="mr-2 h-4 w-4" /> Request Redraw
                        </Button>
                    </div>
                    <RequestRedrawModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </CardHeader>



                <CardContent className="p-0 pt-6">

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
                                    Total Payments
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-warm-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${totalPayments.toFixed(2)}
                                </div>
                                <p className="text-xs text-warm-500">
                                    {filteredPayments.length} payments
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Available For Withdrawal
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-warm-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${totalDonations.toFixed(2)}
                                </div>
                                <p className="text-xs text-warm-500">
                                    From {filteredDonations.length} donations
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
                                    <p className="mt-4 text-warm-600">Loading data...</p>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-10">
                                    <p className="text-red-500">{error}</p>
                                    <Button
                                        onClick={fetchData}
                                        className="mt-4 bg-warm-500 hover:bg-warm-600 text-white"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {!isLoading && !error && (
                                <>
                                    <h2 className="text-xl font-bold mb-4">Donations</h2>
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
                                                    <TableCell>${Number(donation.amount).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        {format(new Date(donation.created_at), "MMM d, yyyy")}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <h2 className="text-xl font-bold mb-4 mt-8">Payments</h2>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {/*<TableHead>Name</TableHead>*/}
                                                <TableHead>Email</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPayments.map(payment => (
                                                <TableRow key={payment.id}>
                                                    {/*<TableCell className="font-medium">*/}
                                                    {/*    {payment.name}*/}
                                                    {/*</TableCell>*/}
                                                    <TableCell>{payment.email}</TableCell>
                                                    <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        {format(new Date(payment.created_at), "MMM d, yyyy")}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </>
                            )}

                            {!isLoading && !error && filteredDonations.length === 0 && filteredPayments.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-warm-600">No donations or payments found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </CardContent>
            </div>
        </div>
    )
}

const RequestRedrawModal = ({ isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose} >
        <DialogOverlay />
        <DialogContent className="bg-white">
            <h2 className="text-xl font-bold mb-4">Request Redraw</h2>
            <p>Fill in the details to request a redraw.</p>
            <form>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <Input type="number" name="amount" className="mt-1 block w-full" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Bank Account Number
                    </label>
                    <Input type="text" name="accountNumber" className="mt-1 block w-full" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Bank Name
                    </label>
                    <Input type="text" name="bankName" className="mt-1 block w-full" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Bank Routing Number
                    </label>
                    <Input type="text" name="routingNumber" className="mt-1 block w-full" required />
                </div>
                <Button type="submit" className="mt-4 bg-warm-500 hover:bg-warm-600">
                    Submit
                </Button>
                <Button className="mt-4 ml-2 bg-gray-500 hover:bg-gray-600" onClick={onClose}>
                    Cancel
                </Button>
            </form>
        </DialogContent>
    </Dialog>
);