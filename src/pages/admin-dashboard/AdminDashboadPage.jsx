"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AdminTributeCard } from "@/components/admin-dashboard/AdminTributeCard"
import { AdminTributeListItem } from "@/components/admin-dashboard/AdminTributeListItem" // Import the new list item
import axios from "axios"
import { server } from "@/server.js"
import { Plus, Settings, Search, AlertCircle, RefreshCw, BookOpen, Clock, MapPin, LayoutGrid, List, UserCircle, Heart, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog"
import { debounce } from 'lodash-es';
import {toast} from "react-hot-toast";

const ITEMS_PER_PAGE_GRID = 6;
const ITEMS_PER_PAGE_LIST = 8; // Can show a bit more in list view

// Helper function (can be moved to a utils file)
const generateSlug = (title) => {
    if (!title) return 'tribute';
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export default function DashboardPage() {
    const navigate = useNavigate()
    const [tributes, setTributes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [events, setEvents] = useState([])
    const [isLoadingEvents, setIsLoadingEvents] = useState(false)
    const [eventError, setEventError] = useState(null)
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTributeIdForDeletion, setSelectedTributeIdForDeletion] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = viewMode === 'grid' ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;


    useEffect(() => {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")
        if (!token) {
            navigate("/login", {
                state: { message: "You need to be logged in to access the dashboard." },
            })
        } else {
            if (userData) {
                try {
                    setUser(JSON.parse(userData))
                } catch (e) {
                    console.error("Failed to parse user data from localStorage", e);
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    navigate("/login", {
                        state: { message: "Session data corrupted. Please log in again." },
                    });
                }
            } else { // If no user data but token exists, treat as an error or attempt to fetch user
                localStorage.removeItem("token"); // Clear potentially invalid token
                navigate("/login", {
                    state: { message: "User session not found. Please log in again." },
                });
            }
        }
    }, [navigate])

    const fetchDashboardData = useCallback(async () => {
        if (!user?.id) return; // Ensure user and user.id exist
        setLoading(true);
        setError(null);
        try {
            // Ensure user.id is available before making the API call
            const tributeResponse = await axios.get(`${server}/admin/tribute/title/image/${user.id}`);
            const tributesWithCreator = (tributeResponse.data || []).map(t => ({
                ...t,
                // Ensure creator is an object, even if null from backend
                creator: t.creator || { name: 'Unknown Creator', id: null, avatar: null }
            }));
            setTributes(tributesWithCreator);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. Please try again.");
            setTributes([]);
        } finally {
            setLoading(false);
        }
    }, [user]);


    useEffect(() => {
        if (user?.id) { // Check for user.id
            fetchDashboardData();
        }
    }, [fetchDashboardData, user]);


    const fetchEvents = useCallback(async () => {
        if (!user?.id) return;
        setIsLoadingEvents(true);
        setEventError(null);
        try {
            const response = await axios.get(
                `${server}/admin/tributes/allevents/${user.id}`
            );
            setEvents(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEventError("Failed to load events. Please try again later.");
            setEvents([]);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            fetchEvents();
        }
    }, [fetchEvents, user]);

    const handleRefresh = () => {
        if (user?.id) {
            fetchDashboardData();
            fetchEvents();
            toast.success("Dashboard refreshed!");
        } else {
            toast.error("User data not available to refresh.");
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    const getInitials = (name) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const performSearch = useCallback(
        debounce((query) => {
            if (!user || query.trim().length < 2) {
                setSearchResults([]);
                setIsSearching(false);
                if (query.trim().length > 0 && query.trim().length < 2) {
                    setSearchError("Please enter at least 2 characters to search.");
                } else {
                    setSearchError(null);
                }
                return;
            }
            setIsSearching(true);
            setSearchError(null);
            const lowerCaseQuery = query.trim().toLowerCase();
            const foundResults = tributes
                .filter(tribute =>
                    (tribute.title && tribute.title.toLowerCase().includes(lowerCaseQuery)) ||
                    (tribute.creator?.name && tribute.creator.name.toLowerCase().includes(lowerCaseQuery))
                )
                .map(tribute => ({
                    type: 'tribute', // Simplified search result type
                    id: tribute.id,
                    title: tribute.title,
                    description: `Tribute by ${tribute.creator?.name || 'Unknown'}`,
                    theme: tribute.theme, // include theme for link generation
                }));

            setSearchResults(foundResults);
            setIsSearching(false);
        }, 300),
        [user, tributes]
    );


    useEffect(() => {
        if (isSearchModalOpen) {
            performSearch(modalSearchQuery);
        }
        return () => {
            performSearch.cancel();
        };
    }, [modalSearchQuery, isSearchModalOpen, performSearch]);

    const openSearchModal = () => {
        setModalSearchQuery('');
        setSearchResults([]);
        setSearchError(null);
        setIsSearchModalOpen(true);
    };

    const renderSearchResultItem = (item) => {
        const itemLink = `/admin/dashboard/memories-overview/${item.id}`; // Link to admin edit page
        const uniqueKey = `${item.type}-${item.id}`;

        return (
            <Link
                to={itemLink}
                key={uniqueKey}
                className="block p-3 -mx-3 hover:bg-amber-50 rounded-md transition-colors"
                onClick={() => setIsSearchModalOpen(false)}
            >
                <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{item.title}</p>
                        <p className="text-sm text-slate-500 truncate">{item.description}</p>
                    </div>
                </div>
            </Link>
        );
    };

    const indexOfLastTribute = currentPage * itemsPerPage;
    const indexOfFirstTribute = indexOfLastTribute - itemsPerPage;
    const currentTributes = tributes.slice(indexOfFirstTribute, indexOfLastTribute);
    const totalPages = Math.ceil(tributes.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when tributes/viewMode change
    }, [tributes.length, viewMode]);


    const handleDeleteRequest = (tributeId) => {
        setSelectedTributeIdForDeletion(tributeId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTributeIdForDeletion) return;
        setIsDeleting(true);
        try {
            const response = await axios.delete(`${server}/tribute/delete/${selectedTributeIdForDeletion}`);
            if (response.data.status === "success") {
                toast.success("Tribute deleted successfully");
                setTributes(prevTributes => prevTributes.filter(t => t.id !== selectedTributeIdForDeletion));
                if (currentTributes.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } else {
                toast.error(response.data.message || "Failed to delete tribute.");
            }
        } catch (err) {
            console.error("Error deleting tribute:", err);
            toast.error(err.response?.data?.message || "An error occurred while deleting the tribute.");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setSelectedTributeIdForDeletion(null);
        }
    }


    return (
        <div className="bg-slate-50 min-h-screen pb-16">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Welcome Section */}
                <div className="mb-8 p-5 sm:p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-4 border-amber-300">
                                <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} />
                                <AvatarFallback className="bg-amber-400 text-white text-xl sm:text-2xl">{getInitials(user?.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-800">
                                    {getGreeting()}, <span className="text-amber-500">{user?.name?.split(" ")[0] || "Admin"}</span>
                                </h1>
                                <p className="text-slate-600 text-sm sm:text-base">Manage all tributes and platform settings.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 text-sm" onClick={handleRefresh}>
                                <RefreshCw className="h-4 w-4 mr-1.5" />
                                Refresh Data
                            </Button>
                            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-1.5 text-sm" asChild>
                                <Link to="/admin/dashboard/settings">
                                    <Settings className="h-4 w-4 mr-1.5" />
                                    Settings
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-slate-500 pl-10 pr-3 py-2.5 border-slate-300 hover:border-amber-400 relative h-auto text-sm sm:text-base focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:ring-offset-2 bg-white"
                        onClick={openSearchModal}
                        aria-label="Open search modal"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                        Search tributes by title or creator...
                    </Button>
                </div>

                {/* Search Modal Dialog */}
                <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
                    <DialogContent className="sm:max-w-xl p-0 max-h-[80vh] flex flex-col bg-white rounded-lg">
                        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                            <div className="relative">
                                <Input
                                    type="search"
                                    placeholder="Type to search tributes..."
                                    className="w-full pl-10 pr-4 py-2 text-base border-slate-300 focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 ring-offset-0 rounded-md"
                                    value={modalSearchQuery}
                                    onChange={(e) => setModalSearchQuery(e.target.value)}
                                    autoFocus
                                    aria-label="Search input"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            </div>
                        </DialogHeader>
                        <div className="p-2 sm:p-4 flex-1 overflow-y-auto">
                            {isSearching && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <RefreshCw className="h-7 w-7 animate-spin text-amber-500 mb-2" />
                                    <p className="text-slate-600">Searching...</p>
                                </div>
                            )}
                            {!isSearching && searchError && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
                                    <p className="text-red-600 font-medium">Search Error</p>
                                    <p className="text-sm text-slate-600">{searchError}</p>
                                </div>
                            )}
                            {!isSearching && !searchError && (
                                <>
                                    {modalSearchQuery.trim().length === 0 && (
                                        <div className="text-center py-10 text-slate-500">
                                            <BookOpen className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                                            Start typing to find tributes.
                                        </div>
                                    )}
                                    {modalSearchQuery.trim().length > 0 && modalSearchQuery.trim().length < 2 && (
                                        <div className="text-center py-10 text-slate-500">
                                            Please enter at least 2 characters.
                                        </div>
                                    )}
                                    {modalSearchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
                                        <div className="text-center py-10 text-slate-500">
                                            No results found for <strong className="text-slate-700">"{modalSearchQuery}"</strong>.
                                        </div>
                                    )}
                                    {searchResults.length > 0 && (
                                        <div className="space-y-1.5">
                                            {/* <h3 className="text-xs font-medium text-slate-500 px-3 py-2 uppercase tracking-wider">Results:</h3> */}
                                            {searchResults.map(renderSearchResultItem)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="bg-white sm:max-w-md rounded-lg">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-slate-800">Confirm Deletion</DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 pt-2">
                                Are you sure you want to delete this tribute? This action is permanent and cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-end gap-2 pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => setIsDeleteModalOpen(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Tribute"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                {/* Main Content */}
                {error && !loading ? (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            className="ml-auto mt-2 sm:mt-0 border-red-300 text-red-700 hover:bg-red-100"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </Alert>
                ) : (
                    <Tabs defaultValue="tributes" className="space-y-4">
                        <TabsList className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
                            <TabsTrigger value="tributes" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:bg-amber-100 px-3 py-1.5 rounded-md text-sm sm:text-base">
                                <Heart className="h-4 w-4 mr-1.5" />
                                Tributes
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:bg-amber-100 px-3 py-1.5 rounded-md text-sm sm:text-base">
                                <Calendar className="h-4 w-4 mr-1.5" />
                                Events
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tributes" className="space-y-6 pt-2">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2 p-4 bg-white rounded-lg shadow-xs border border-slate-200">
                                <h2 className="text-xl sm:text-2xl font-semibold text-slate-700">
                                    All Tributes <span className="text-base font-normal text-slate-500">({tributes.length})</span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('grid')}
                                        className={`${viewMode === 'grid' ? 'bg-amber-500 text-white hover:bg-amber-600' : 'border-slate-300 text-slate-600 hover:bg-slate-100'} transition-colors`}
                                        aria-label="Grid view"
                                    >
                                        <LayoutGrid className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('list')}
                                        className={`${viewMode === 'list' ? 'bg-amber-500 text-white hover:bg-amber-600' : 'border-slate-300 text-slate-600 hover:bg-slate-100'} transition-colors`}
                                        aria-label="List view"
                                    >
                                        <List className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/admin/dashboard/create-tribute")}
                                        className="bg-amber-500 hover:bg-amber-600 text-white"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create New
                                    </Button>
                                </div>
                            </div>

                            {loading ? (
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-3"}>
                                    {[...Array(itemsPerPage)].map((_, i) => (
                                        viewMode === 'grid' ? (
                                            <Card key={i} className="border-slate-200 shadow-sm">
                                                <CardContent className="p-0">
                                                    <Skeleton className="h-40 w-full rounded-t-lg" />
                                                    <div className="p-4 space-y-2">
                                                        <Skeleton className="h-5 w-3/4" />
                                                        <Skeleton className="h-4 w-1/2" />
                                                        <div className="flex justify-between items-center pt-2">
                                                            <Skeleton className="h-8 w-20" />
                                                            <Skeleton className="h-8 w-20" />
                                                            <Skeleton className="h-8 w-20" />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                                                <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-5 w-3/4" />
                                                    <Skeleton className="h-4 w-1/2" />
                                                    <Skeleton className="h-3 w-1/3" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-8 w-8 rounded-md" />
                                                    <Skeleton className="h-8 w-8 rounded-md" />
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : tributes.length === 0 ? (
                                <EmptyState
                                    title="No Tributes Found"
                                    description="It looks like there are no tributes yet. Get started by creating one."
                                    actionLabel="Create First Tribute"
                                    onAction={() => navigate("/admin/dashboard/create-tribute")}
                                    icon={<Heart className="h-12 w-12 text-slate-300 mb-4" />}
                                />
                            ) : (
                                <>
                                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" : "space-y-3"}>
                                        {viewMode === 'grid' && <CreateTributeCard />}
                                        {currentTributes.map((tribute) => (
                                            viewMode === 'grid' ? (
                                                <AdminTributeCard
                                                    key={tribute.id}
                                                    tribute={tribute}
                                                    onView={() => window.open(`/${tribute.theme}/${tribute.id}/${generateSlug(tribute.title)}`, '_blank')}
                                                    onEdit={() => navigate(`/admin/dashboard/memories-overview/${tribute.id}`)}
                                                    onDeleteRequest={() => handleDeleteRequest(tribute.id)}
                                                />
                                            ) : (
                                                <AdminTributeListItem
                                                    key={tribute.id}
                                                    tribute={tribute}
                                                    onEdit={() => navigate(`/admin/dashboard/memories-overview/${tribute.id}`)}
                                                    onDeleteRequest={() => handleDeleteRequest(tribute.id)}
                                                />
                                            )
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-8 pt-4 border-t border-slate-200">
                                            <Button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                            >
                                                Previous
                                            </Button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(page => totalPages <= 5 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                                                .map((page, index, arr) => (
                                                    <React.Fragment key={page}>
                                                        {index > 0 && arr[index-1] !== page - 1 && <span className="text-slate-400">...</span>}
                                                        <Button
                                                            onClick={() => handlePageChange(page)}
                                                            variant={currentPage === page ? 'default' : 'outline'}
                                                            size="sm"
                                                            className={currentPage === page ? 'bg-amber-500 text-white hover:bg-amber-600' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}
                                                        >
                                                            {page}
                                                        </Button>
                                                    </React.Fragment>
                                                ))
                                            }
                                            <Button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </TabsContent>


                        <TabsContent value="calendar" className="pt-2">
                            <Card className="border-slate-200 shadow-sm bg-white">
                                <CardHeader className="pb-3 border-b border-slate-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>
                                            <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-700">Upcoming Events</CardTitle>
                                            <CardDescription className="text-slate-500 text-sm pt-1">
                                                Memorial services and remembrance events.
                                            </CardDescription>
                                        </div>
                                        {/* Optional: Add button to create event if applicable directly here */}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    {isLoadingEvents ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <Skeleton key={i} className="h-20 w-full rounded-md" />
                                            ))}
                                        </div>
                                    ) : eventError ? (
                                        <Alert variant="destructive" className="mb-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{eventError}</AlertDescription>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={fetchEvents}
                                                className="ml-auto mt-2 sm:mt-0 border-red-300 text-red-700 hover:bg-red-100"
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Retry
                                            </Button>
                                        </Alert>
                                    ) : events.length === 0 ? (
                                        <EmptyState
                                            title="No Upcoming Events"
                                            description="When events are added to tributes, they will appear here."
                                            icon={<Calendar className="h-12 w-12 text-slate-300 mb-4" />}
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {events.map(event => (
                                                <Card key={event.id} className="p-3 sm:p-4 hover:shadow-lg transition-shadow border-slate-200 rounded-lg">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                                        <div className="mb-2 sm:mb-0 flex-1">
                                                            <h4 className="font-semibold text-base sm:text-lg text-slate-800">{event.title}</h4>
                                                            <p className="text-sm text-slate-600 truncate max-w-md">{event.description}</p>
                                                            <Link to={`/admin/dashboard/memories-overview/${event.trubute_id}`} className="text-xs text-amber-600 hover:underline inline-flex items-center gap-1">
                                                                View Related Tribute <ExternalLink className="h-3 w-3"/>
                                                            </Link>
                                                        </div>
                                                        <div className="flex flex-col sm:items-end text-xs sm:text-sm text-slate-500 space-y-1 flex-shrink-0">
                                                            <span className="flex items-center">
                                                                <Calendar className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                                                                {new Date(event.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                                                                {event.event_time}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                                                                {event.event_location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    )
}

const CreateTributeCard = () => (
    <Card className="border-2 border-dashed border-slate-300 bg-white hover:border-amber-400 hover:shadow-sm transition-all duration-200 cursor-pointer group flex flex-col">
        <Link to="/admin/dashboard/create-tribute" className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center flex-grow min-h-[220px] sm:min-h-[300px]">
            <div className="bg-slate-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4 group-hover:bg-amber-50 transition-colors">
                <Plus className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-700 group-hover:text-amber-600 mb-1 sm:mb-2">Create New Tribute</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Honour a loved one with a beautiful memorial page.</p>
        </Link>
    </Card>
)

const EmptyState = ({ title, description, actionLabel, onAction, icon }) => (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center bg-white rounded-lg shadow-xs border border-slate-200 p-6">
        {icon || <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mb-3 sm:mb-4" />}
        <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-1.5 sm:mb-2">{title}</h3>
        <p className="text-slate-500 max-w-md mb-5 sm:mb-6 text-sm sm:text-base">{description}</p>
        {actionLabel && onAction && (
            <Button onClick={onAction} className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto px-6">
                {actionLabel}
            </Button>
        )}
    </div>
)