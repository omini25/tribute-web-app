import React, { useState, useEffect, useMemo } from 'react';
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
import { ShieldCheck, CalendarClock, RefreshCw, Ban, Search, FileText, Loader2 } from 'lucide-react';
import { format } from "date-fns";
import axios from 'axios';
import { server } from '@/server.js';

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user data and token from localStorage
  const userData = useMemo(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }, []);

  const token = useMemo(() => localStorage.getItem('token'), []);

  // Create an Axios instance with auth headers
  const apiClient = useMemo(() => {
    if (!token) return null;
    return axios.create({
      baseURL: server,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
  }, [token]);

  const fetchSubscriptions = async () => {
    if (!apiClient || !userData?.id) {
      setError("You must be logged in to view subscriptions.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const activeResponse = await apiClient.get(`/users/${userData.id}/subscriptions`);
      setActiveSubscription(activeResponse.data.length > 0 ? activeResponse.data[0] : null);

      const historyResponse = await apiClient.get(`/users/${userData.id}/subscriptions/history`);
      setSubscriptionHistory(historyResponse.data);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      setError("Failed to load subscription data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [apiClient, userData?.id]);

  const handleRenew = async (subscriptionId) => {
    if (!apiClient) return;
    try {
      await apiClient.put(`/subscriptions/${subscriptionId}`, { action: 'renew' });
      alert("Subscription renewed successfully!");
      fetchSubscriptions(); // Re-fetch to update the UI
    } catch (err) {
      console.error("Failed to renew subscription:", err);
      alert("Failed to renew subscription.");
    }
  };

  const handleCancel = async (subscriptionId) => {
    if (!apiClient || !window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }
    try {
      await apiClient.delete(`/subscriptions/${subscriptionId}`);
      alert("Subscription cancelled successfully!");
      fetchSubscriptions(); // Re-fetch to update the UI
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      alert("Failed to cancel subscription.");
    }
  };

  const filteredHistory = subscriptionHistory.filter(item =>
    (item.plan?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to determine if a plan is recurring
  const isRecurringPlan = (planId) => {
    const nonRecurringPlans = ['free', 'one-time', 'life-time'];
    return !nonRecurringPlans.includes(planId);
  };

  const renderEmptyState = (message) => (
    <div className="text-center py-12 text-slate-500">
        <FileText className="mx-auto h-10 w-10 text-slate-400 mb-3" />
        <p>{message}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p className="ml-3 text-lg text-slate-700">Loading subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
        <Button onClick={fetchSubscriptions} className="mt-4 bg-amber-500 text-white hover:bg-amber-600">Retry</Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Subscription</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your plan, view history, and update your subscription.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-6 bg-slate-200/70 p-1 rounded-lg max-w-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">Overview</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-slate-600">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-700">Active Plan</CardTitle>
                <CardDescription>Details about your current subscription.</CardDescription>
              </CardHeader>
              <CardContent>
                {activeSubscription ? (
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <ShieldCheck className="h-6 w-6 text-green-500 mr-3" />
                          <span className="text-xl font-bold text-slate-800 capitalize">{activeSubscription.plan_id || 'Unknown'} Plan</span>
                        </div>
                        {isRecurringPlan(activeSubscription.plan_id) && activeSubscription.expires_at && (
                            <div className="flex items-center text-slate-600 mb-3">
                                <CalendarClock className="h-4 w-4 mr-2" />
                                <span>Next renewal on {format(new Date(activeSubscription.expires_at), "MMMM d, yyyy")}</span>
                            </div>
                        )}
                        <div className="flex items-center text-sm">
                          <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium capitalize">{activeSubscription.status}</span>
                        </div>
                      </div>
                      <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button
                          onClick={() => handleRenew(activeSubscription.id)}
                          className="flex items-center justify-center bg-amber-500 text-white hover:bg-amber-600 transition-colors duration-200"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew Now
                        </Button>
                        <Button
                          onClick={() => handleCancel(activeSubscription.id)}
                          variant="destructive"
                          className="flex items-center justify-center"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Cancel Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  renderEmptyState("No active subscription found.")
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-700">Subscription History</CardTitle>
                <CardDescription>A record of your past subscriptions and plan changes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search by plan or status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>
                {filteredHistory.length > 0 ? (
                  <div className="overflow-x-auto rounded-md border border-slate-200">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="px-4 py-3">Plan</TableHead>
                          <TableHead className="px-4 py-3">Status</TableHead>
                          <TableHead className="text-right px-4 py-3">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((item) => (
                          <TableRow key={item.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium px-4 py-3">{item.plan_id || "Plan not available"}</TableCell>
                            <TableCell className="px-4 py-3">
                              <span className={`py-1 px-3 rounded-full font-medium text-sm capitalize ${item.status === 'expired' ? 'bg-gray-100 text-gray-800' : item.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right px-4 py-3">{format(new Date(item.created_at), "MMM d, yyyy")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  renderEmptyState(searchTerm ? "No history found matching your search." : "No subscription history available.")
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Subscription;
