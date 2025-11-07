import React from 'react';
import { Button } from "@/components/ui/button";
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
import { ShieldCheck, CalendarClock, RefreshCw, Ban, History } from 'lucide-react';
import { format } from "date-fns";

const SubscriptionSection = () => {
  // Dummy data for demonstration
  const activeSubscription = {
    plan: 'Premium',
    status: 'Active',
    nextRenewal: '2024-08-01',
  };

  const subscriptionHistory = [
    {
      plan: 'Basic',
      status: 'Expired',
      date: '2023-07-01',
    },
    {
      plan: 'Premium',
      status: 'Cancelled',
      date: '2022-01-01',
    },
  ];

  return (
    <div className="bg-slate-50/50 p-4 sm:p-6 rounded-lg">
      <div className="grid gap-6">
        {/* Active Subscription Card */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">Active Subscription</CardTitle>
            <CardDescription>Your current plan details and actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-lg font-semibold text-slate-800">{activeSubscription.plan} Plan</span>
                </div>
                <div className="flex items-center text-slate-600 mb-2">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  <span>Next renewal on {format(new Date(activeSubscription.nextRenewal), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">{activeSubscription.status}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-2">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew
                </Button>
                <Button variant="destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription History Card */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">Subscription History</CardTitle>
            <CardDescription>A record of your past subscription statuses.</CardDescription>
          </CardHeader>
          <CardContent>
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
                  {subscriptionHistory.map((item, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium px-4 py-3">{item.plan}</TableCell>
                      <TableCell className="px-4 py-3">
                        <span className={`py-1 px-3 rounded-full font-medium text-sm ${item.status === 'Expired' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-4 py-3">{format(new Date(item.date), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSection;
