"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { TributeCard } from "@/components/dashboard/TributeCard"
import { Post } from "@/components/dashboard/Posts"
import axios from "axios"
import { server } from "@/server.js"
import { Plus, Bell, Calendar, Heart, Settings, Search, AlertCircle, RefreshCw, BookOpen, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { debounce } from 'lodash-es';

export default function DashboardPage() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [tributes, setTributes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({
        totalTributes: 0,
        recentVisits: 0,
        pendingTasks: 0,
    })
    const [selectedTributeId, setSelectedTributeId] = useState(null)
    const [memories, setMemories] = useState([])
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [eventError, setEventError] = useState(null)
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const apiClient = useMemo(() => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return axios.create({
            baseURL: server,
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!apiClient) {
            navigate("/login", {
                state: { message: "You need to be logged in to access the dashboard." },
            });
        } else {
            if (userData) setUser(JSON.parse(userData));
        }
    }, [apiClient, navigate]);

    const fetchDashboardData = async () => {
        if (!user || !apiClient) return;
        setLoading(true);
        setError(null);
        try {
            const tributeResponse = await apiClient.get(`/tribute/title/image/${user.id}`);
            const tributesData = tributeResponse.data;
            setTributes(tributesData);
            setStats({
                totalTributes: tributesData.length,
                recentVisits: 0, 
                pendingTasks: 0,
            });

            // if (tributesData.length > 0) {
            //     const memoriesResponse = await apiClient.get(`/tributes/memories/${tributesData[0].id}`);
            //     setPosts(Array.isArray(memoriesResponse.data) ? memoriesResponse.data : [memoriesResponse.data]);
            // }
        } catch (error) {
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        if (!user || !apiClient) return;
        setIsLoading(true);
        setEventError(null);
        try {
            const response = await apiClient.get(`/tributes/allevents/${user.id}`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEventError("Failed to load events. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMemories = async (tributeId) => {
        if (!tributeId || !apiClient) return;
        try {
            setLoading(true);
            const response = await apiClient.get(`/tributes/memories/${tributeId}`);
            setMemories(response.data);
        } catch (error) {
            setError('Failed to load memories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && apiClient) {
            fetchDashboardData();
            fetchEvents();
        }
    }, [user, apiClient]);

    const handleRefresh = () => {
        if (user && apiClient) {
            fetchDashboardData();
            fetchEvents();
        }
    };

    const performSearch = useCallback(
        debounce(async (query) => {
            if (!user || !apiClient || query.trim().length < 2) {
                setSearchResults([]);
                setIsSearching(false);
                setSearchError(query.trim().length > 0 ? "Please enter at least 2 characters." : null);
                return;
            }
            setIsSearching(true);
            setSearchError(null);
            try {
                const response = await apiClient.get(`/search/all`, { params: { q: query, userId: user.id } });
                setSearchResults(response.data.results || []);
            } catch (err) {
                console.error("Search error:", err);
                setSearchError("Failed to fetch search results.");
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500),
        [user, apiClient]
    );

    useEffect(() => {
        if (isSearchModalOpen) {
            performSearch(modalSearchQuery);
        }
        return () => {
            performSearch.cancel();
        };
    }, [modalSearchQuery, isSearchModalOpen, performSearch]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase();
    };

    const openSearchModal = () => {
        setModalSearchQuery('');
        setSearchResults([]);
        setSearchError(null);
        setIsSearchModalOpen(true);
    };

    const renderSearchResultItem = (item) => {
        let icon = <BookOpen className="h-5 w-5 text-gray-400 flex-shrink-0" />;
        let itemLink = "/dashboard/main";
        let itemDescription = item.description || `A ${item.type} related to your query.`;

        switch (item.type) {
            case 'tribute':
                icon = <Heart className="h-5 w-5 text-pink-500 flex-shrink-0" />;
                itemLink = `/dashboard/memories-overview/${item.id}`;
                itemDescription = item.description || `Tribute: ${item.title}`;
                break;
            case 'post':
            case 'memory':
                icon = <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />;
                itemLink = item.tributeId ? `/dashboard/memories-overview/${item.tributeId}` : `/dashboard/main`;
                itemDescription = item.description || `Memory in tribute: ${item.tributeTitle || item.title}`;
                break;
            case 'event':
                icon = <Calendar className="h-5 w-5 text-green-500 flex-shrink-0" />;
                itemLink = item.tributeId ? `/dashboard/memories/events/${item.tributeId}` : `/dashboard/events`;
                itemDescription = item.description || `Event: ${item.title}`;
                break;
            default:
                itemDescription = `Found item: ${item.title}`;
        }

        return (
            <Link
                to={itemLink}
                key={`${item.type}-${item.id}`}
                className="block p-3 -mx-3 hover:bg-[#f5f0ea] rounded-md transition-colors"
                onClick={() => setIsSearchModalOpen(false)}
            >
                <div className="flex items-start space-x-3">
                    {icon}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#2a3342] truncate">{item.title}</p>
                        <p className="text-sm text-[#4a5568] truncate">{itemDescription}</p>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="bg-[#f8f4f0] min-h-screen pb-12">
            <div className="container mx-auto px-2 sm:px-4 py-6">
                <div className="mb-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-14 w-14 border-2 border-[#fcd34d]">
                                <AvatarImage src={user?.avatar || "/placeholder.svg?height=64&width=64"} alt={user?.name || "User"} />
                                <AvatarFallback className="bg-[#fcd34d] text-white text-xl">{getInitials(user?.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-serif text-[#2a3342]">
                                    {getGreeting()}, {user?.name?.split(" ")[0] || "Friend"}
                                </h1>
                                <p className="text-[#4a5568] text-sm sm:text-base">Welcome to your personal dashboard</p>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" className="border-[#fcd34d] hover:bg-[#f5f0ea] px-2 py-1 text-sm" asChild>
                                <Link to="/dashboard/settings">
                                    <Settings className="h-4 w-4 mr-1" />
                                    Settings
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-[#4a5568] pl-10 pr-3 py-2 border-[#e5e0d9] hover:border-[#fcd34d] relative h-auto text-sm focus-visible:ring-1 focus-visible:ring-[#fcd34d] focus-visible:ring-offset-1"
                        onClick={openSearchModal}
                        aria-label="Open search modal"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fcd34d]" />
                        Search tributes, posts, or memories...
                    </Button>
                </div>

                <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
                    <DialogContent className="sm:max-w-2xl p-0 max-h-[80vh] flex flex-col bg-white">
                        <DialogHeader className="p-4 border-b border-[#e5e0d9]">
                            <div className="relative">
                                <Input
                                    type="search"
                                    placeholder="Search anything..."
                                    className="w-full pl-10 pr-4 py-2 text-base border-transparent focus-visible:ring-0 focus-visible:border-transparent focus:border-transparent ring-offset-0"
                                    value={modalSearchQuery}
                                    onChange={(e) => setModalSearchQuery(e.target.value)}
                                    autoFocus
                                    aria-label="Search input"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a5568]" />
                            </div>
                        </DialogHeader>
                        <div className="p-4 flex-1 overflow-y-auto">
                            {isSearching && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <RefreshCw className="h-7 w-7 animate-spin text-[#fcd34d] mb-2" />
                                    <p className="text-[#4a5568]">Searching...</p>
                                </div>
                            )}
                            {!isSearching && searchError && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
                                    <p className="text-red-600 font-medium">Search Error</p>
                                    <p className="text-sm text-[#4a5568]">{searchError}</p>
                                </div>
                            )}
                            {!isSearching && !searchError && (
                                <>
                                    {modalSearchQuery.trim().length === 0 && (
                                        <div className="text-center py-10">
                                            <p className="text-[#4a5568]">Start typing to find tributes, memories, and more.</p>
                                        </div>
                                    )}
                                    {modalSearchQuery.trim().length > 0 && searchResults.length === 0 && (
                                        <div className="text-center py-10">
                                            <p className="text-[#4a5568]">No results found for <strong className="text-[#2a3342]">"{modalSearchQuery}"</strong>.</p>
                                        </div>
                                    )}
                                    {searchResults.length > 0 && (
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-medium text-[#2a3342] px-3 py-2">Results:</h3>
                                            {searchResults.map(renderSearchResultItem)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {error ? (
                    <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            className="ml-auto border-red-200 text-red-800 hover:bg-red-100"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </Alert>
                ) : (
                    <Tabs defaultValue="tributes" className="space-y-4">
                        <TabsList className="flex flex-wrap gap-2 pb-4">
                            <TabsTrigger value="tributes" className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base">
                                <Heart className="h-4 w-4 mr-1" />
                                Tributes
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="data-[state=active]:bg-[#fcd34d] data-[state=active]:text-white text-xs sm:text-base">
                                <Calendar className="h-4 w-4 mr-1" />
                                Events
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tributes" className="space-y-4 mt-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <h2 className="text-xl sm:text-2xl font-serif text-[#2a3342]">My Tributes</h2>
                                <Button
                                    onClick={() => navigate("/dashboard/create-tribute")}
                                    className="bg-[#fcd34d] hover:bg-[#645a52] text-white w-full sm:w-auto"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Tribute
                                </Button>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="border-none shadow-sm">
                                            <CardContent className="p-0">
                                                <Skeleton className="h-40 w-full rounded-t-lg" />
                                                <div className="p-4 space-y-2">
                                                    <Skeleton className="h-5 w-3/4" />
                                                    <Skeleton className="h-4 w-1/2" />
                                                    <div className="flex justify-between items-center pt-2">
                                                        <Skeleton className="h-8 w-20" />
                                                        <Skeleton className="h-8 w-20" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <CreateTributeCard />
                                    {tributes.map((tribute) => (
                                        <TributeCard
                                            key={tribute.id}
                                            tribute={tribute}
                                            onView={() => navigate(`/tribute/${tribute.id}`)}
                                            onEdit={() => navigate(`/dashboard/memories-overview/${tribute.id}`)}
                                        />
                                    ))}
                                </div>
                            )}

                            {!loading && tributes.length === 0 && (
                                <EmptyState
                                    title="No tributes yet"
                                    description="Create your first tribute to Honour and remember your loved one."
                                    actionLabel="Create Tribute"
                                    onAction={() => navigate("/create-tribute")}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="calendar">
                            <Card className="border-none shadow-md">
                                <CardHeader className="pb-2 border-b">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>
                                            <CardTitle className="text-xl sm:text-2xl font-serif text-[#2a3342]">Events</CardTitle>
                                            <CardDescription className="text-[#4a5568] text-sm">
                                                Memorial services and remembrance events
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    {isLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))}
                                        </div>
                                    ) : eventError ? (
                                        <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{eventError}</AlertDescription>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={fetchEvents}
                                                className="ml-auto border-red-200 text-red-800 hover:bg-red-100"
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Retry
                                            </Button>
                                        </Alert>
                                    ) : events.length === 0 ? (
                                        <EmptyState
                                            title="No upcoming events"
                                            description="Schedule memorial services and remembrance events to see them here."
                                            actionLabel="Add Event"
                                            onAction={() => {}}
                                            icon={<Calendar className="h-10 w-10 text-[#e5e0d9]" />}
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {events.map(event => (
                                                <Card key={event.id} className="p-4">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                        <div>
                                                            <h4 className="font-semibold text-lg">{event.title}</h4>
                                                            <p className="text-sm text-muted-foreground">{event.description}</p>
                                                        </div>
                                                        <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
                                                            <span className="text-sm flex items-center">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                {new Date(event.event_date).toLocaleDateString("en-GB")}
                                                            </span>
                                                            <span className="text-sm flex items-center">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                {event.event_time}
                                                            </span>
                                                            <span className="text-sm flex items-center">
                                                                <MapPin className="h-4 w-4 mr-1" />
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
    <Card className="border-2 border-dashed border-[#e5e0d9] bg-white hover:border-[#fcd34d] transition-colors cursor-pointer group">
        <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[220px] sm:min-h-[300px] text-center">
            <div className="bg-[#f0ece6] p-3 sm:p-4 rounded-full mb-3 sm:mb-4 group-hover:bg-[#f5f0ea] transition-colors">
                <Plus className="h-7 w-7 sm:h-8 sm:w-8 text-[#fcd34d]" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-1 sm:mb-2">Create New Tribute</h3>
            <p className="text-[#4a5568] mb-4 sm:mb-6 text-sm sm:text-base">Honour and remember your loved one with a beautiful tribute page</p>
           <Button className="bg-[#fcd34d] hover:bg-[#645a52] text-white w-full sm:w-auto" asChild>
                <Link to="/dashboard/create-tribute">Get Started</Link>
            </Button>
        </CardContent>
    </Card>
)

const EmptyState = ({ title, description, actionLabel, onAction, icon }) => (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
        {icon || <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-[#e5e0d9] mb-3 sm:mb-4" />}
        <h3 className="text-lg sm:text-xl font-medium text-[#2a3342] mb-1 sm:mb-2">{title}</h3>
        <p className="text-[#4a5568] max-w-md mb-4 sm:mb-6 text-sm sm:text-base">{description}</p>
        {actionLabel && onAction && (
            <Button onClick={onAction} className="bg-[#fcd34d] hover:bg-[#645a52] text-white w-full sm:w-auto">
                {actionLabel}
            </Button>
        )}
    </div>
)
