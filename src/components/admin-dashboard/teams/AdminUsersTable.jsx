import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, AlertTriangle, Loader2, Eye, ListChecks } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyUsersState } from "@/components/main-dashboard/teams/EmptyUsersState.jsx";
import { server } from "@/server.js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {Link} from "react-router-dom";

// Constants for roles and statuses
const USER_ROLES = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "super admin", label: "Super Admin" },
];

const USER_STATUSES = [
    { value: "Active", label: "Active", colorClass: "bg-green-100 text-green-800 border-green-300" },
    { value: "Pending", label: "Pending", colorClass: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    { value: "Inactive", label: "Inactive", colorClass: "bg-slate-100 text-slate-800 border-slate-300" },
];

const initialFormData = {
    name: '',
    email: '',
    role: '',
    status: '',
};

// Simple component to display a tribute item in the modal
const TributeListItem = ({ tribute }) => (
    <div className="py-3 px-1 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
        <Link
            to={`/admin/dashboard/memories-overview/${tribute.id}`}
            className="block hover:bg-slate-100 transition-colors rounded"
        >
            <h4 className="font-medium text-slate-800 text-sm">{tribute.title || "Untitled Tribute"}</h4>
            <div className="flex items-center gap-2 mt-1">
                <Badge
                    variant={tribute.status === 'active' ? 'successOutline' : 'secondaryOutline'}
                    className="text-xs px-1.5 py-0.5"
                >
                    {tribute.status || "Unknown"}
                </Badge>
                <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0.5 border-slate-300 text-slate-600"
                >
                    {tribute.is_public ? "Public" : "Private"}
                </Badge>
            </div>
        </Link>
    </div>
);


export function AdminUsersTable({ onAddUser }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // State for "View Tributes" Modal
    const [isViewTributesModalOpen, setIsViewTributesModalOpen] = useState(false);
    const [selectedUserForTributes, setSelectedUserForTributes] = useState(null);
    // userTributes will be directly derived from selectedUserForTributes.tribute
    // isLoadingUserTributes and viewTributesError are no longer needed for this modal

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${server}/admin/view-teams`);
            const usersData = (response.data || []).map(user => ({
                ...user,
                // Use the length of the embedded tribute array for tribute_count
                // or fallback to the provided tribute_count if the array isn't there
                tribute_count: Array.isArray(user.tribute) ? user.tribute.length : (typeof user.tribute_count === 'number' ? user.tribute_count : 0),
                // Ensure 'tribute' is always an array, even if null/undefined from API
                tribute: Array.isArray(user.tribute) ? user.tribute : [],
            }));
            setUsers(usersData);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.response?.data?.message || "Failed to fetch users. Please try again.");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        setFormData(initialFormData);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        const toastId = toast.loading("Updating user...");
        try {
            const response = await axios.put(
                `${server}/admin/users/${selectedUser.id}`,
                formData
            );
            // When updating, we need to merge the response with existing non-editable fields
            // like tribute array and its count, as the PUT response might only return updated fields.
            const updatedUserFromServer = response.data;
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id ? { ...user, ...updatedUserFromServer, tribute: user.tribute, tribute_count: user.tribute_count } : user
                )
            );
            closeEditModal();
            toast.success("User updated successfully", { id: toastId });
        } catch (err) {
            console.error("Error updating user:", err);
            toast.error(err.response?.data?.message || "Failed to update user", { id: toastId });
        }
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        const toastId = toast.loading("Deleting user...");
        try {
            await axios.patch(`${server}/admin/user/${userToDelete.id}/suspend`);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userToDelete.id)
            );
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            toast.success("User suspended successfully", { id: toastId });
            window.location.reload();
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error(err.response?.data?.message || "Failed to suspend user", { id: toastId });
        }
    };

    const openViewTributesModal = (user) => {
        // Now, we directly use the tributes from the user object
        setSelectedUserForTributes(user);
        setIsViewTributesModalOpen(true);
        // No need to fetch, isLoadingUserTributes, or viewTributesError for this modal
    };

    const getStatusBadge = (statusValue) => {
        const statusConfig = USER_STATUSES.find(s => s.value === statusValue);
        if (statusConfig) {
            return <Badge className={`${statusConfig.colorClass} border text-xs font-medium px-2 py-0.5`}>{statusConfig.label}</Badge>;
        }
        return <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5 text-white">{statusValue || "Unknown"}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 border border-slate-100 rounded-lg bg-white">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/5" />
                            <Skeleton className="h-3 w-2/5" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-red-700 bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm">
                <AlertTriangle className="h-12 w-12 mb-3 text-red-500" />
                <p className="text-xl font-semibold mb-1">Oops! Something went wrong.</p>
                <p className="text-sm text-red-600 mb-5">{error}</p>
                <Button onClick={fetchUsers} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Try Again
                </Button>
            </div>
        );
    }

    if (!users.length) {
        return <EmptyUsersState onAddUser={onAddUser} message="No users found. Start by adding a new user." />;
    }

    return (
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-x-auto">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="px-4 py-3 text-slate-600 font-semibold">Name</TableHead>
                        <TableHead className="px-4 py-3 text-slate-600 font-semibold">Email</TableHead>
                        <TableHead className="px-4 py-3 text-slate-600 font-semibold">Role</TableHead>
                        <TableHead className="px-4 py-3 text-slate-600 font-semibold text-center">Tributes</TableHead>
                        <TableHead className="px-4 py-3 text-slate-600 font-semibold">Date Added</TableHead>
                        <TableHead className="px-4 py-3 text-slate-600 font-semibold">Status</TableHead>
                        <TableHead className="px-4 py-3 text-slate-600 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-medium px-4 py-3 text-slate-800">{user.name}</TableCell>
                            <TableCell className="px-4 py-3 text-slate-600">{user.email}</TableCell>
                            <TableCell className="px-4 py-3 text-slate-600 capitalize">{user.role}</TableCell>
                            <TableCell className="px-4 py-3 text-slate-600 text-center font-medium">
                                {user.tribute_count ?? 0}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-slate-600">
                                {user.created_at
                                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                                        year: "numeric", month: "short", day: "numeric",
                                    })
                                    : "N/A"}
                            </TableCell>
                            <TableCell className="px-4 py-3">{getStatusBadge(user.status)}</TableCell>
                            <TableCell className="text-right px-4 py-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-slate-200 w-48">
                                        <DropdownMenuLabel className="text-slate-500 px-3 py-1.5 text-xs">Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-slate-100" />
                                        <DropdownMenuItem onSelect={() => openEditModal(user)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
                                            <Edit className="h-4 w-4 text-slate-500" />
                                            <span>Edit User</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => openViewTributesModal(user)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
                                            <Eye className="h-4 w-4 text-slate-500" />
                                            <span>View Tributes</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-100"/>
                                        <DropdownMenuItem onSelect={() => openDeleteModal(user)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                                            {/*<Trash2 className="h-4 w-4" />*/}
                                            <span>Suspend/Un Suspend User</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
                <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl">
                    <DialogHeader className="p-6 border-b border-slate-200">
                        <DialogTitle className="text-xl font-semibold text-slate-800">Edit User Details</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 mt-1">
                            Update the information for {selectedUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <form onSubmit={handleEditSubmit}>
                            <div className="space-y-5 p-6">
                                <div>
                                    <Label htmlFor="edit-name" className="text-sm font-medium text-slate-700">Name</Label>
                                    <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 border-slate-300 rounded-md"/>
                                </div>
                                <div>
                                    <Label htmlFor="edit-email" className="text-sm font-medium text-slate-700">Email</Label>
                                    <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1 border-slate-300 rounded-md"/>
                                </div>
                                <div>
                                    <Label htmlFor="edit-role" className="text-sm font-medium text-slate-700">Role</Label>
                                    <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                        <SelectTrigger id="edit-role" className="mt-1 border-slate-300 rounded-md">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white shadow-lg rounded-md border-slate-200">
                                            {USER_ROLES.map(role => (
                                                <SelectItem key={role.value} value={role.value} className="hover:bg-slate-100">
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="edit-status" className="text-sm font-medium text-slate-700">Status</Label>
                                    <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                        <SelectTrigger id="edit-status" className="mt-1 border-slate-300 rounded-md">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white shadow-lg rounded-md border-slate-200">
                                            {USER_STATUSES.map(status => (
                                                <SelectItem key={status.value} value={status.value} className="hover:bg-slate-100">
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                                <Button type="button" variant="outline" onClick={closeEditModal} className="rounded-md border-slate-300">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-md">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* User Delete Modal */}
            <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <AlertDialogContent className="bg-white rounded-lg shadow-xl sm:max-w-md">
                    <AlertDialogHeader className="p-6">
                        <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-full bg-red-100 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-slate-900 text-center">
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-slate-500 text-center mt-2">
                            This will suspend {userToDelete?.name}'s account. This action can be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="p-6 bg-slate-50 rounded-b-lg flex sm:justify-end gap-3">
                        <AlertDialogCancel onClick={() => setUserToDelete(null)} className="w-full sm:w-auto rounded-md border-slate-300">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-md"
                        >
                            Yes, suspend user
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View User Tributes Modal */}
            {selectedUserForTributes && (
                <Dialog open={isViewTributesModalOpen} onOpenChange={() => {
                    setIsViewTributesModalOpen(false);
                    setSelectedUserForTributes(null); // Clear selected user when closing
                }}>
                    <DialogContent className="sm:max-w-lg bg-white rounded-lg shadow-xl max-h-[80vh] flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-200">
                            <DialogTitle className="text-xl font-semibold text-slate-800">
                                Tributes by {selectedUserForTributes.name}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 mt-1">
                                A list of all tributes created by this user.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-grow">
                            <div className="px-6 py-4">
                                {/* No loading state needed here as data is pre-loaded */}
                                {(selectedUserForTributes.tribute && selectedUserForTributes.tribute.length > 0) ? (
                                    <div className="space-y-0">
                                        {selectedUserForTributes.tribute.map((tribute) => (
                                            <TributeListItem key={tribute.id} tribute={tribute} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <ListChecks className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                        <p className="text-slate-500 text-sm">No tributes found for this user.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsViewTributesModalOpen(false);
                                    setSelectedUserForTributes(null);
                                }}
                                className="rounded-md border-slate-300"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}