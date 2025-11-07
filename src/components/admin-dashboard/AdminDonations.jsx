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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { DollarSign, Search, Download, CheckCircle, XCircle, TrendingUp, TrendingDown, FileText, AlertTriangleIcon } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"; // DialogOverlay might not be needed if using Shadcn Dialog fully
import Decimal from "decimal.js";

// Fee percentage
const FEE_PERCENTAGE = 2.5; // 2.5%

const mapUserData = (item) => ({
    ...item,
    name: item.user?.name || item.name || 'Anonymous',
    email: item.user?.email || item.email || 'N/A'
});


export default function DonationsAndPayments() {
    const [donations, setDonations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTermDonations, setSearchTermDonations] = useState(""); // Separate search term for donations
    const [searchTermPayments, setSearchTermPayments] = useState("");   // Separate search term for payments
    const [searchTermRequests, setSearchTermRequests] = useState(""); // Separate search term for requests
    const [isRedrawModalOpen, setIsRedrawModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [donationsResponse, paymentsResponse, requestsResponse] = await Promise.all([
                axios.get(`${server}/admin/donations`),
                axios.get(`${server}/admin/payments`),
                axios.get(`${server}/admin/payment-requests`),
            ]);

            const donationsData = donationsResponse.data.data || [];
            const paymentsData = paymentsResponse.data.data || [];
            const requestsData = requestsResponse.data.data || [];

            setDonations(donationsData.map(mapUserData));
            setPayments(paymentsData.map(mapUserData));
            setPaymentRequests(requestsData);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data. Please try again later.");
            setDonations([]);
            setPayments([]);
            setPaymentRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array as server URL is constant

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredDonations = donations.filter(
        donation =>
            (donation.name && donation.name.toLowerCase().includes(searchTermDonations.toLowerCase())) ||
            (donation.email && donation.email.toLowerCase().includes(searchTermDonations.toLowerCase())) ||
            (donation.tribute?.title && donation.tribute.title.toLowerCase().includes(searchTermDonations.toLowerCase()))
    );

    const filteredPayments = payments.filter(
        payment =>
            (payment.name && payment.name.toLowerCase().includes(searchTermPayments.toLowerCase())) ||
            (payment.email && payment.email.toLowerCase().includes(searchTermPayments.toLowerCase())) ||
            (payment.tribute?.title && payment.tribute.title.toLowerCase().includes(searchTermPayments.toLowerCase()))
    );

    const filteredPaymentRequests = Array.isArray(paymentRequests)
        ? paymentRequests.filter(request =>
            (request.user_email?.toLowerCase().includes(searchTermRequests.toLowerCase())) ||
            (request.user?.name?.toLowerCase().includes(searchTermRequests.toLowerCase())) // Assuming user object might have name
        )
        : [];


    const totalDonations = donations.reduce((sum, donation) => { // Calculate on all donations, not filtered
        return sum.plus(new Decimal(donation.amount || 0));
    }, new Decimal(0));

    const totalPayments = payments.reduce((sum, payment) => { // Calculate on all payments, not filtered
        return sum.plus(new Decimal(payment.amount || 0));
    }, new Decimal(0));

    const totalAvailable = totalDonations.minus(totalPayments);

    const handleApproveRequest = async (requestId) => {
        // TODO: Implement API call to approve payment request
        alert(`Simulating approval for request ID: ${requestId}`);
        // Optimistically update UI or refetch
        setPaymentRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'approved' } : req));
        // fetchData(); // Or refetch for server source of truth
    };

    const handleRejectRequest = async (requestId) => {
        // TODO: Implement API call to reject payment request
        alert(`Simulating rejection for request ID: ${requestId}`);
        setPaymentRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req));
        // fetchData();
    };

    const calculateFee = (amount) => {
        return new Decimal(amount || 0).times(FEE_PERCENTAGE / 100).toFixed(2);
    };

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

    const renderEmptyState = (message = "No data available.") => (
        <div className="text-center py-12 text-slate-500">
            <FileText className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <p>{message}</p>
        </div>
    );


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
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Financial Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track donations, manage payments, and process withdrawal requests.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 bg-slate-200/70 p-1 rounded-lg">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Overview</TabsTrigger>
                        <TabsTrigger value="donations" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Donations</TabsTrigger>
                        <TabsTrigger value="payments" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Payments</TabsTrigger>
                        <TabsTrigger value="payment-requests" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Requests</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-slate-700">Summary</CardTitle>
                                <CardDescription>Key financial metrics at a glance.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? renderLoading() : error ? renderError() : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        <SummaryCard title="Total Donations Received" value={totalDonations.toFixed(2)} description={`${donations.length} donations`} icon={TrendingUp} />
                                        <SummaryCard title="Total Payments Made" value={totalPayments.toFixed(2)} description={`${payments.length} payments`} icon={TrendingDown} />
                                        <SummaryCard title="Net Available Funds" value={totalAvailable.toFixed(2)} description="Donations minus payments" icon={DollarSign} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

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
                                            placeholder="Search donations by name, email, or tribute..."
                                            value={searchTermDonations}
                                            onChange={(e) => setSearchTermDonations(e.target.value)}
                                            className="pl-9 w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                        />
                                    </div>
                                    {/* Optional: Add export button here if needed */}
                                </div>
                                {isLoading ? renderLoading() : error ? renderError() : (
                                    filteredDonations.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>User Name</TableHead>
                                                        <TableHead>User Email</TableHead>
                                                        <TableHead>Tribute</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                        <TableHead>Message</TableHead>
                                                        <TableHead>Anonymous</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredDonations.map((donation) => (
                                                        <TableRow key={donation.id}>
                                                            <TableCell className="font-medium">{donation.name}</TableCell>
                                                            <TableCell>{donation.email}</TableCell>
                                                            <TableCell>{donation.tribute?.title || 'N/A'}</TableCell>
                                                            <TableCell className="text-right">₦{Number(donation.amount || 0).toFixed(2)}</TableCell>
                                                            <TableCell className="max-w-xs truncate" title={donation.message}>{donation.message || '-'}</TableCell>
                                                            <TableCell>{donation.is_anonymous ? 'Yes' : 'No'}</TableCell>
                                                            <TableCell>
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${donation.status === 'successful' || donation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                    {donation.status || 'N/A'}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>{format(new Date(donation.created_at), "MMM d, yyyy")}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        renderEmptyState(searchTermDonations ? "No donations found matching your search." : "No donations recorded yet.")
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

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
                                            placeholder="Search payments by name, email, or tribute..."
                                            value={searchTermPayments}
                                            onChange={(e) => setSearchTermPayments(e.target.value)}
                                            className="pl-9 w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                {isLoading ? renderLoading() : error ? renderError() : (
                                    filteredPayments.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>User Name</TableHead>
                                                        <TableHead>User Email</TableHead>
                                                        <TableHead>Tribute</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Method</TableHead>
                                                        <TableHead>Reference</TableHead>
                                                        <TableHead>Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredPayments.map((payment) => (
                                                        <TableRow key={payment.id}>
                                                            <TableCell className="font-medium">{payment.name}</TableCell>
                                                            <TableCell>{payment.email}</TableCell>
                                                            <TableCell>{payment.tribute?.title || 'N/A'}</TableCell>
                                                            <TableCell className="text-right">₦{Number(payment.amount || 0).toFixed(2)}</TableCell>
                                                            <TableCell>{payment.payment_type}</TableCell>
                                                            <TableCell>
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${payment.payment_status === 'successful' || payment.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                    {payment.payment_status}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>{payment.payment_method}</TableCell>
                                                            <TableCell className="max-w-[100px] truncate" title={payment.payment_reference}>{payment.payment_reference}</TableCell>
                                                            <TableCell>{format(new Date(payment.created_at), "MMM d, yyyy")}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        renderEmptyState(searchTermPayments ? "No payments found matching your search." : "No payments recorded yet.")
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payment-requests">
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-slate-700">Payment Withdrawal Requests</CardTitle>
                                <CardDescription>Manage and process user requests for fund withdrawals.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search requests by user email or name..."
                                            value={searchTermRequests}
                                            onChange={(e) => setSearchTermRequests(e.target.value)}
                                            className="pl-9 w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                                        />
                                    </div>
                                    {/* Optional: Add a general "Request Redraw" button if it's not tied to a specific user context */}
                                    {/* <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setIsRedrawModalOpen(true)}>
                                        <Download className="mr-2 h-4 w-4" /> Request Redraw (Admin)
                                    </Button> */}
                                </div>
                                {isLoading ? renderLoading() : error ? renderError() : (
                                    filteredPaymentRequests.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>User Email</TableHead>
                                                        <TableHead className="text-right">Amount Requested</TableHead>
                                                        <TableHead className="text-right">Fee ({FEE_PERCENTAGE}%)</TableHead>
                                                        <TableHead className="text-right">Net Payout</TableHead>
                                                        <TableHead>Date Requested</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-center">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredPaymentRequests.map((request) => {
                                                        const amountRequested = new Decimal(request.amount || 0);
                                                        const fee = amountRequested.times(FEE_PERCENTAGE / 100);
                                                        const netPayout = amountRequested.minus(fee);
                                                        return (
                                                            <TableRow key={request.id}>
                                                                <TableCell>{request.user_email || request.user?.email || 'N/A'}</TableCell>
                                                                <TableCell className="text-right">₦{amountRequested.toFixed(2)}</TableCell>
                                                                <TableCell className="text-right">₦{fee.toFixed(2)}</TableCell>
                                                                <TableCell className="text-right">₦{netPayout.toFixed(2)}</TableCell>
                                                                <TableCell>{format(new Date(request.created_at), "MMM d, yyyy, h:mm a")}</TableCell>
                                                                <TableCell>
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' : request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                        {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex justify-center space-x-2">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="text-xs text-green-600 border-green-500 hover:bg-green-50 disabled:opacity-50"
                                                                            onClick={() => handleApproveRequest(request.id)}
                                                                            disabled={request.status === 'approved' || request.status === 'rejected'}
                                                                        >
                                                                            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="text-xs text-red-600 border-red-500 hover:bg-red-50 disabled:opacity-50"
                                                                            onClick={() => handleRejectRequest(request.id)}
                                                                            disabled={request.status === 'approved' || request.status === 'rejected'}
                                                                        >
                                                                            <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        renderEmptyState(searchTermRequests ? "No payment requests found matching your search." : "No pending payment requests.")
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <RequestRedrawModal isOpen={isRedrawModalOpen} onClose={() => setIsRedrawModalOpen(false)} />
            </div>
        </div>
    );
}

// Basic RequestRedrawModal - implement form handling and submission logic as needed
const RequestRedrawModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        amount: "",
        accountNumber: "",
        bankName: "",
        routingNumber: "", // This might be specific to certain banking systems, adjust if needed
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // TODO: Implement API call to submit redraw request
            // Example: await axios.post(`${server}/admin/redraw-requests`, formData);
            console.log("Submitting redraw request:", formData);
            alert("Redraw request submitted (simulated). This feature is for admin initiated redraws.");
            onClose();
            setFormData({ amount: "", accountNumber: "", bankName: "", routingNumber: "" });
        } catch (err) {
            console.error("Error submitting redraw request:", err);
            setSubmitError(err.response?.data?.message || "Failed to submit request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when modal is closed or isOpen changes to false
    useEffect(() => {
        if (!isOpen) {
            setFormData({ amount: "", accountNumber: "", bankName: "", routingNumber: "" });
            setSubmitError(null);
        }
    }, [isOpen]);


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* DialogOverlay is implicitly handled by Shadcn Dialog */}
            <DialogContent className="bg-white p-5 sm:p-6 w-full max-w-lg rounded-lg shadow-xl">
                <CardHeader className="px-0 pt-0 pb-4 mb-4 border-b border-slate-200">
                    <CardTitle className="text-xl font-semibold text-slate-800">Request Fund Redraw (Admin)</CardTitle>
                    <CardDescription className="text-sm text-slate-500 mt-1">
                        Manually initiate a fund redraw. Ensure all details are correct.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
                            <Input id="amount" type="number" name="amount" placeholder="e.g., 5000.00" value={formData.amount} onChange={handleChange} className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-1">Bank Account Number</label>
                            <Input id="accountNumber" type="text" name="accountNumber" placeholder="Enter account number" value={formData.accountNumber} onChange={handleChange} className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label htmlFor="bankName" className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                            <Input id="bankName" type="text" name="bankName" placeholder="Enter bank name" value={formData.bankName} onChange={handleChange} className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500" required />
                        </div>
                        {/* Routing number might not be applicable for all regions, e.g., Nigeria often uses just bank name and account number. */}
                        {/* <div>
                            <label htmlFor="routingNumber" className="block text-sm font-medium text-slate-700 mb-1">Bank Routing Number (Optional)</label>
                            <Input id="routingNumber" type="text" name="routingNumber" value={formData.routingNumber} onChange={handleChange} className="w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500" />
                        </div> */}
                    </div>
                    {submitError && <p className="text-sm text-red-500 mt-4">{submitError}</p>}
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto order-2 sm:order-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto order-1 sm:order-2 bg-amber-500 hover:bg-amber-600 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
