import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AdminUsersTable } from "@/components/admin-dashboard/teams/AdminUsersTable.jsx";
import { AddUserModal } from "@/components/main-dashboard/teams/AddUserModal.jsx"; // Assuming this is for adding team members/admins
import { Button } from "@/components/ui/button";
import { UserPlus, Search, X, Eye, ListChecks, AlertCircle, RefreshCw } from "lucide-react";
import { server } from "@/server.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx"; // For modal content
import { toast } from "react-hot-toast";

// Placeholder for a simple tribute item in the modal
const TributeListItem = ({ tribute }) => (
    <div className="p-3 border-b border-slate-200 hover:bg-slate-50 transition-colors">
        <h4 className="font-medium text-slate-700">{tribute.title || "Untitled Tribute"}</h4>
        <p className="text-xs text-slate-500">
            Status: <Badge variant={tribute.status === 'active' ? 'success' : 'secondary'} className="ml-1 text-xs">{tribute.status || "Unknown"}</Badge>
        </p>
        <p className="text-xs text-slate-500">
            Visibility: {tribute.is_public ? "Public" : "Private"}
        </p>
    </div>
);

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [isViewTributesModalOpen, setIsViewTributesModalOpen] = useState(false);
    const [selectedUserForTributes, setSelectedUserForTributes] = useState(null);
    const [userTributes, setUserTributes] = useState([]);
    const [isLoadingUserTributes, setIsLoadingUserTributes] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${server}/admin/view-teams`); // Assuming this endpoint returns users with tribute_count
            console.log(response.data)
            setUsers(response.data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please try again.");
            setUsers([]);
            toast.error("Could not fetch users.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (newUser) => {
        // This function should ideally post to the backend to create a new user
        // For now, it optimistically updates the UI and assumes success
        // A real implementation would involve an API call and then re-fetching or updating based on response.
        try {
            // Example: const response = await axios.post(`${server}/users/add`, newUser);
            // if (response.data.success) {
            //    setUsers(prevUsers => [...prevUsers, response.data.user]); // Assuming backend returns the created user
            //    toast.success("User added successfully!");
            // } else {
            //    toast.error(response.data.message || "Failed to add user.");
            // }

            // Optimistic update (current behavior)
            const id = (users.length + 1).toString(); // Temporary ID generation
            const today = new Date().toISOString().split("T")[0];
            setUsers(prevUsers => [
                ...prevUsers,
                {
                    id,
                    ...newUser,
                    dateAdded: today,
                    status: "Pending", // Or derive from backend
                    tribute_count: 0, // Default for new user
                },
            ]);
            toast.success("User added (locally). Backend integration needed.");
            setIsAddUserModalOpen(false);
        } catch (err) {
            console.error("Error adding user:", err);
            toast.error("An error occurred while adding the user.");
        }
    };

    const handleViewUserTributes = async (user) => {
        setSelectedUserForTributes(user);
        setIsViewTributesModalOpen(true);
        setIsLoadingUserTributes(true);
        setUserTributes([]);
        try {
            // Replace with your actual endpoint to fetch tributes for a user
            const response = await axios.get(`${server}/admin/users/${user.id}/tributes`);
            setUserTributes(response.data.tributes || []);
        } catch (err) {
            console.error(`Error fetching tributes for user ${user.id}:`, err);
            toast.error(`Could not fetch tributes for ${user.name || 'this user'}.`);
            setUserTributes([]);
        } finally {
            setIsLoadingUserTributes(false);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!searchQuery) {
            return users;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return users.filter(
            (user) =>
                user.name?.toLowerCase().includes(lowercasedQuery) ||
                user.email?.toLowerCase().includes(lowercasedQuery)
        );
    }, [users, searchQuery]);

    if (error && isLoading) { // If still loading but an error occurred during initial fetch
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                <p className="mt-4 text-lg text-red-600">Initial data load failed.</p>
                <p className="text-sm text-slate-500">{error}</p>
                <Button onClick={fetchUsers} className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Card className="border-none shadow-xl bg-white rounded-xl">
                    <CardHeader className="p-6 border-b border-slate-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-3xl font-serif text-slate-800">
                                    User Management
                                </CardTitle>
                                <CardDescription className="text-slate-500 mt-1">
                                    Oversee and manage all registered users and their activities.
                                </CardDescription>
                            </div>
                            {/*<Button*/}
                            {/*    onClick={() => setIsAddUserModalOpen(true)}*/}
                            {/*    className="bg-primary hover:bg-primary/90 text-white rounded-md shadow-md hover:shadow-lg transition-shadow"*/}
                            {/*>*/}
                            {/*    <UserPlus className="mr-2 h-5 w-5" />*/}
                            {/*    Add New User*/}
                            {/*</Button>*/}
                        </div>
                        <div className="mt-6 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border-slate-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-600"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {isLoading && !error ? ( // Show skeleton only if loading and no critical error
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-3 border border-slate-100 rounded-md">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-8 w-20 rounded-md" />
                                    </div>
                                ))}
                            </div>
                        ) : error && !isLoading ? ( // Show error if loading finished but there's an error
                            <div className="p-10 text-center">
                                <AlertCircle className="mx-auto h-10 w-10 text-red-400" />
                                <p className="mt-3 text-md text-red-600">{error}</p>
                                <Button onClick={fetchUsers} className="mt-4" variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Retry Fetching Users
                                </Button>
                            </div>
                        ) : (
                            <AdminUsersTable
                                users={filteredUsers}
                                onAddUser={() => setIsAddUserModalOpen(true)} // This prop might be redundant if button is in header
                                onViewTributes={handleViewUserTributes}
                            />
                        )}
                    </CardContent>
                </Card>

                <AddUserModal
                    isOpen={isAddUserModalOpen}
                    onClose={() => setIsAddUserModalOpen(false)}
                    onAddUser={handleAddUser}
                />

                {selectedUserForTributes && (
                    <Dialog open={isViewTributesModalOpen} onOpenChange={setIsViewTributesModalOpen}>
                        <DialogContent className="sm:max-w-lg bg-white rounded-lg max-h-[80vh] flex flex-col">
                            <DialogHeader className="p-6 border-b border-slate-200">
                                <DialogTitle className="text-xl font-serif text-slate-800">
                                    Tributes by {selectedUserForTributes.name}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-slate-500">
                                    A list of tributes created by this user.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="flex-grow p-1"> {/* Added p-1 to ScrollArea for slight internal padding */}
                                <div className="px-5 py-3"> {/* Content padding inside ScrollArea */}
                                    {isLoadingUserTributes ? (
                                        <div className="space-y-3 py-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="p-3 border border-slate-100 rounded-md">
                                                    <Skeleton className="h-4 w-3/4 mb-1" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : userTributes.length > 0 ? (
                                        userTributes.map((tribute) => (
                                            <TributeListItem key={tribute.id} tribute={tribute} />
                                        ))
                                    ) : (
                                        <div className="py-10 text-center">
                                            <ListChecks className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                                            <p className="text-slate-500">No tributes found for this user.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <DialogFooter className="p-6 border-t border-slate-200">
                                <Button variant="outline" onClick={() => setIsViewTributesModalOpen(false)} className="rounded-md">
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}