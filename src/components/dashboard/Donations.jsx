import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { server } from "@/server.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Search, Download, AlertTriangleIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader as ShadcnDialogHeader, // Renamed to avoid conflict if CardHeader is used locally
    DialogTitle as ShadcnDialogTitle,
    DialogDescription as ShadcnDialogDescription,
    DialogFooter as ShadcnDialogFooter
} from "@/components/ui/dialog";
import Decimal from "decimal.js";

// Helper to safely parse user from localStorage and get ID
const getUserId = () => {
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            return user?.id;
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
    }
    return null;
};


export default function DonationsAndPaymentsPage() {
    const [donations, setDonations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTermDonations, setSearchTermDonations] = useState("");
    const [searchTermPayments, setSearchTermPayments] = useState("");
    const [isRedrawModalOpen, setIsRedrawModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // State for Redraw Modal is now managed by the main component
    const [redrawForm, setRedrawForm] = useState({
        amount: "",
        accountNumber: "",
        bankName: "",
        routingNumber: "" // This might be optional depending on your region
    });
    const [redrawLoading, setRedrawLoading] = useState(false);
    const [redrawError, setRedrawError] = useState(null);
    const [redrawSuccess, setRedrawSuccess] = useState(null);

    const NairaIcon = ({ className }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
            <path d="M7 5v14" />
            <path d="M17 5v14" />
        </svg>
    );


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const userId = getUserId();

        if (!userId) {
            setError("User ID is missing. Please log in to view your financial data.");
            setIsLoading(false);
            setDonations([]); // Clear data if user ID is missing
            setPayments([]);
            return;
        }

        try {
            const [donationsResponse, paymentsResponse] = await Promise.all([
                axios.get(`${server}/donations?user_id=${userId}`),
                axios.get(`${server}/payments?user_id=${userId}`)
            ]);

            setDonations(donationsResponse.data.data || []);
            setPayments(paymentsResponse.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load financial data. Please try again later.");
            setDonations([]);
            setPayments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRequestRedrawClick = () => {
        // Reset modal state each time it's opened
        setRedrawForm({ amount: "", accountNumber: "", bankName: "", routingNumber: "" });
        setRedrawError(null);
        setRedrawSuccess(null);
        setIsRedrawModalOpen(true);
    };

    const handleRedrawSubmit = async (e) => {
        e.preventDefault();
        setRedrawLoading(true);
        setRedrawError(null);
        setRedrawSuccess(null);
        const userId = getUserId();

        if (!userId) {
            setRedrawError("User session expired. Please log in again.");
            setRedrawLoading(false);
            return;
        }

        try {
            // Assuming your backend expects user_id for redraw requests
            await axios.post(`${server}/redraw-requests`, {
                ...redrawForm,
                user_id: userId,
            });
            setRedrawSuccess("Redraw request submitted successfully.");
            setTimeout(() => {
                setRedrawSuccess(null);
                setIsRedrawModalOpen(false);
                setRedrawForm({ amount: "", accountNumber: "", bankName: "", routingNumber: "" }); // Reset form
            }, 2000); // Auto-close after 2 seconds
        } catch (err) {
            setRedrawError(err.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setRedrawLoading(false);
        }
    };

    const filteredDonations = donations.filter(
        donation =>
            (donation.name && donation.name.toLowerCase().includes(searchTermDonations.toLowerCase())) ||
            (donation.email && donation.email.toLowerCase().includes(searchTermDonations.toLowerCase()))
    );

    const filteredPayments = payments.filter(
        payment =>
            (payment.name && payment.name.toLowerCase().includes(searchTermPayments.toLowerCase())) ||
            (payment.email && payment.email.toLowerCase().includes(searchTermPayments.toLowerCase()))
    );

    // Calculate totals based on ALL donations/payments for the summary cards
    const totalDonationsAmount = donations.reduce((sum, donation) => {
        return sum.plus(new Decimal(donation.amount || 0));
    }, new Decimal(0));

    const totalPaymentsAmount = payments.reduce((sum, payment) => {
        return sum.plus(new Decimal(payment.amount || 0));
    }, new Decimal(0));

    const availableForWithdrawal = totalDonationsAmount.times(0.9);

    // Reusable UI components for loading, error, and empty states
    const renderLoading = () => (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-3 text-sm text-slate-500">Loading data...</p>
        </div>
    );

    const renderError = () => (
        <div className="text-center py-12 bg-red-50 p-6 rounded-lg border border-red-200">
            <AlertTriangleIcon className="mx-auto h-10 w-10 text-red-400 mb-3" />
            <p className="text-red-600 font-medium mb-1">Oops! Something went wrong.</p>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button onClick={fetchData} className="bg-red-500 hover:bg-red-600 text-white">
                Try Again
            </Button>
        </div>
    );

    const renderEmptyState = (message = "No data available for this section.") => (
        <div className="text-center py-12 text-slate-500">
            <FileText className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <p>{message}</p>
        </div>
    );

    // Reusable Summary Card Component
    const SummaryCard = ({ title, value, description, icon: Icon }) => (
        <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
                <Icon className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-800">₦{value}</div>
                {description && <p className="text-xs text-slate-500 pt-1">{description}</p>}
            </CardContent>
        </Card>
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Finances</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Track your donations, payments, and manage fund withdrawals.
                        </p>
                    </div>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto" onClick={handleRequestRedrawClick}>
                        <Download className="mr-2 h-4 w-4" /> Request Redraw
                    </Button>
                </div>

                {/* Tabs Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 bg-slate-200/70 p-1 rounded-lg">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Overview</TabsTrigger>
                        <TabsTrigger value="donations" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Donations</TabsTrigger>
                        <TabsTrigger value="payments" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Payments</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab Content */}
                    <TabsContent value="overview">
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-slate-700">Financial Summary</CardTitle>
                                <CardDescription>Key metrics at a glance.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? renderLoading() : error ? renderError() : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        <SummaryCard title="Total Donations Received" value={totalDonationsAmount.toFixed(2)} description={`${donations.length} donations`} icon={NairaIcon} />
                                        <SummaryCard title="Total Payments Made" value={totalPaymentsAmount.toFixed(2)} description={`${payments.length} payments`} icon={NairaIcon} />
                                        <SummaryCard title="Available For Withdrawal" value={availableForWithdrawal.toFixed(2)} description="Net balance after payments" icon={NairaIcon} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Donations Tab Content */}
                    <TabsContent value="donations">
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-slate-700">All Donations</CardTitle>
                                <CardDescription>Browse and search through all received donations.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search donations by name or email..."
                                            value={searchTermDonations}
                                            onChange={(e) => setSearchTermDonations(e.target.value)}
                                            className="pl-9 w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                        />
                                    </div>
                                    {/* You can add an "Export Donations" button here if needed */}
                                </div>
                                {isLoading ? renderLoading() : error ? renderError() : (
                                    filteredDonations.length > 0 ? (
                                        <div className="overflow-x-auto rounded-md border border-slate-200">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow>
                                                        <TableHead className="px-4 py-3">Name</TableHead>
                                                        <TableHead className="px-4 py-3">Email</TableHead>
                                                        <TableHead className="text-right px-4 py-3">Amount</TableHead>
                                                        <TableHead className="px-4 py-3">Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredDonations.map((donation) => (
                                                        <TableRow key={donation.id} className="hover:bg-slate-50/50">
                                                            <TableCell className="font-medium px-4 py-3">{donation.name}</TableCell>
                                                            <TableCell className="px-4 py-3">{donation.email}</TableCell>
                                                            <TableCell className="text-right px-4 py-3">₦{Number(donation.amount || 0).toFixed(2)}</TableCell>
                                                            <TableCell className="px-4 py-3">{format(new Date(donation.created_at), "MMM d, yyyy")}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        renderEmptyState(searchTermDonations ? "No donations found matching your search." : "No donations have been recorded yet.")
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payments Tab Content */}
                    <TabsContent value="payments">
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-slate-700">All Payments</CardTitle>
                                <CardDescription>Review all payments made for services or features.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search payments by name or email..."
                                            value={searchTermPayments}
                                            onChange={(e) => setSearchTermPayments(e.target.value)}
                                            className="pl-9 w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                {isLoading ? renderLoading() : error ? renderError() : (
                                    filteredPayments.length > 0 ? (
                                        <div className="overflow-x-auto rounded-md border border-slate-200">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow>
                                                        <TableHead className="px-4 py-3">Name</TableHead>
                                                        <TableHead className="px-4 py-3">Email</TableHead>
                                                        <TableHead className="text-right px-4 py-3">Amount</TableHead>
                                                        <TableHead className="px-4 py-3">Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredPayments.map((payment) => (
                                                        <TableRow key={payment.id} className="hover:bg-slate-50/50">
                                                            <TableCell className="font-medium px-4 py-3">{payment.name || 'N/A'}</TableCell>
                                                            <TableCell className="px-4 py-3">{payment.email}</TableCell>
                                                            <TableCell className="text-right px-4 py-3">₦{Number(payment.amount || 0).toFixed(2)}</TableCell>
                                                            <TableCell className="px-4 py-3">{format(new Date(payment.created_at), "MMM d, yyyy")}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        renderEmptyState(searchTermPayments ? "No payments found matching your search." : "No payments have been recorded yet.")
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Request Redraw Modal */}
                <RequestRedrawModal
                    isOpen={isRedrawModalOpen}
                    onClose={() => setIsRedrawModalOpen(false)}
                    redrawForm={redrawForm}
                    setRedrawForm={setRedrawForm}
                    redrawLoading={redrawLoading}
                    redrawError={redrawError}
                    redrawSuccess={redrawSuccess}
                    onSubmit={handleRedrawSubmit}
                />
            </div>
        </div>
    );
}

// Enhanced RequestRedrawModal using Shadcn Dialog components
const RequestRedrawModal = ({
                                isOpen,
                                onClose,
                                redrawForm,
                                setRedrawForm,
                                redrawLoading,
                                redrawError,
                                redrawSuccess,
                                onSubmit
                            }) => {

    // Effect to clear form when modal is closed (optional, parent also resets on open)
    useEffect(() => {
        if (!isOpen) {
            // Parent component handles resetting error/success messages when opening.
            // This ensures form fields are also cleared if modal is closed without submission.
            // setRedrawForm({ amount: "", accountNumber: "", bankName: "", routingNumber: "" });
        }
    }, [isOpen, setRedrawForm]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white p-0 w-full max-w-md rounded-lg shadow-xl">
                <ShadcnDialogHeader className="px-6 pt-5 pb-4 border-b border-slate-200">
                    <ShadcnDialogTitle className="text-xl font-semibold text-slate-800">Request Fund Redraw</ShadcnDialogTitle>
                    <ShadcnDialogDescription className="text-sm text-slate-500 mt-1">
                        Enter your bank details to request a withdrawal of available funds.
                    </ShadcnDialogDescription>
                </ShadcnDialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="px-6 py-5 space-y-4">
                        <div>
                            <label htmlFor="redrawAmount" className="block text-sm font-medium text-slate-700 mb-1">
                                Amount (₦)
                            </label>
                            <Input
                                id="redrawAmount"
                                type="number"
                                name="amount"
                                placeholder="e.g., 5000.00"
                                value={redrawForm.amount}
                                onChange={e => setRedrawForm(f => ({ ...f, amount: e.target.value }))}
                                className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                required
                                min="1" // Basic validation
                            />
                        </div>
                        <div>
                            <label htmlFor="redrawAccountNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                Bank Account Number
                            </label>
                            <Input
                                id="redrawAccountNumber"
                                type="text"
                                name="accountNumber"
                                placeholder="Enter account number"
                                value={redrawForm.accountNumber}
                                onChange={e => setRedrawForm(f => ({ ...f, accountNumber: e.target.value }))}
                                className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="redrawBankName" className="block text-sm font-medium text-slate-700 mb-1">
                                Bank Name
                            </label>
                            <Input
                                id="redrawBankName"
                                type="text"
                                name="bankName"
                                placeholder="Enter bank name"
                                value={redrawForm.bankName}
                                onChange={e => setRedrawForm(f => ({ ...f, bankName: e.target.value }))}
                                className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="redrawRoutingNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                Bank Routing Number (If applicable)
                            </label>
                            <Input
                                id="redrawRoutingNumber"
                                type="text"
                                name="routingNumber"
                                value={redrawForm.routingNumber}
                                onChange={e => setRedrawForm(f => ({ ...f, routingNumber: e.target.value }))}
                                className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    {redrawError && <div className="px-6 text-red-600 text-sm mb-3">{redrawError}</div>}
                    {redrawSuccess && <div className="px-6 text-green-600 text-sm mb-3">{redrawSuccess}</div>}

                    <ShadcnDialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto order-2 sm:order-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                            onClick={onClose}
                            disabled={redrawLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto order-1 sm:order-2 bg-amber-500 hover:bg-amber-600 text-white"
                            disabled={redrawLoading || !redrawForm.amount || !redrawForm.accountNumber || !redrawForm.bankName} // Basic form validation for submit button
                        >
                            {redrawLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : "Submit Request"}
                        </Button>
                    </ShadcnDialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )};