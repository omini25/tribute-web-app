"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { server } from "@/server.js"
import { assetServer } from "@/assetServer.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
    ImageIcon, VideoIcon, GridIcon, LayoutGridIcon, DownloadIcon, XIcon,
    ChevronLeft, ChevronRight, ExternalLinkIcon, InfoIcon, AlertTriangleIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to generate URL-friendly slugs
const generateSlug = (title = "") => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// New component for List View Item
function MediaListItem({ item, openLightbox }) {
    const tributeFullName = `${item.tribute.firstName} ${item.tribute.lastName}`.trim() || 'In Memory';
    return (
        <div
            className="flex items-center gap-3 sm:gap-4 p-3 bg-white dark:bg-warm-800/10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-warm-200 dark:border-warm-700/50"
            onClick={() => openLightbox(item)}
        >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-warm-100 dark:bg-warm-700/30">
                {item.type === "image" ? (
                    <img
                        src={`${assetServer}/images/gallery/${item.url}`}
                        alt={`Thumbnail for ${item.tribute.title}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg?height=80&width=80&text=Err";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <VideoIcon className="h-8 w-8 text-white opacity-70" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-warm-800 dark:text-warm-100 truncate" title={item.tribute.title}>
                    {item.tribute.title}
                </p>
                <p className="text-xs sm:text-sm text-warm-600 dark:text-warm-300 truncate" title={tributeFullName}>
                    {tributeFullName}
                </p>
                <p className="text-xs text-warm-500 dark:text-warm-400 mt-0.5 capitalize">
                    {item.type}
                </p>
            </div>
            <ChevronRight className="h-5 w-5 text-warm-400 dark:text-warm-500 flex-shrink-0" />
        </div>
    );
}


export default function AdminGallery() {
    const [allMediaItems, setAllMediaItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState("all")
    const [viewMode, setViewMode] = useState("grid")
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [retryCount, setRetryCount] = useState(0)

    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || 'null') : null

    const fetchMedia = useCallback(() => {
        if (user?.id) {
            setLoading(true)
            setError(null)
            axios
                .get(`${server}/admin/memories/all/user/${user.id}`)
                .then((response) => {
                    const rawData = response.data
                    const processedItems = []
                    if (rawData.memories && Array.isArray(rawData.memories) && rawData.tribute_details && Array.isArray(rawData.tribute_details)) {
                        const tributeDetailsMap = new Map(rawData.tribute_details.map(td => [td.id, td]))
                        rawData.memories.forEach(memory => {
                            const tributeInfo = tributeDetailsMap.get(memory.tribute_id)
                            const tribute = tributeInfo ? {
                                id: tributeInfo.id,
                                title: tributeInfo.title || "Untitled Tribute",
                                firstName: tributeInfo.first_name || "",
                                lastName: tributeInfo.last_name || "",
                                dob: tributeInfo.date_of_birth,
                                dod: tributeInfo.date_of_death,
                                theme: tributeInfo.theme || "default-theme",
                            } : {
                                id: memory.tribute_id,
                                title: `Tribute ID: ${memory.tribute_id} (Details Missing)`,
                                firstName: "", lastName: "", dob: null, dod: null, theme: "default-theme",
                            };

                            try {
                                const images = memory.images ? JSON.parse(memory.images) : []
                                images.forEach(imgFile => {
                                    processedItems.push({
                                        id: `img-${memory.id}-${imgFile.split('.')[0]}-${Math.random().toString(36).substring(7)}`,
                                        url: imgFile, type: 'image', tribute: tribute, originalMemoryId: memory.id,
                                    })
                                })
                            } catch (e) { console.error("Error parsing images JSON for memory_id:", memory.id, memory.images, e) }

                            try {
                                const videos = memory.videos ? JSON.parse(memory.videos) : []
                                videos.forEach(vidFile => {
                                    processedItems.push({
                                        id: `vid-${memory.id}-${vidFile.split('.')[0]}-${Math.random().toString(36).substring(7)}`,
                                        url: vidFile, type: 'video', tribute: tribute, originalMemoryId: memory.id,
                                    })
                                })
                            } catch (e) { console.error("Error parsing videos JSON for memory_id:", memory.id, memory.videos, e) }
                        })
                    } else {
                        console.warn("API response does not contain expected 'memories' or 'tribute_details' arrays.", rawData)
                    }
                    setAllMediaItems(processedItems)
                })
                .catch((error) => {
                    console.error("Error fetching media:", error)
                    setError("Unable to load your gallery. Please try again.")
                })
                .finally(() => { setLoading(false) })
        } else if (!user?.id && typeof window !== "undefined") {
            setLoading(false);
            setError("User information not found. Please log in again.");
        }
    }, [user?.id, retryCount])

    useEffect(() => { fetchMedia() }, [fetchMedia])

    const handleRetry = () => setRetryCount(prev => prev + 1)
    const openLightbox = (mediaItem) => setSelectedMedia(mediaItem)
    const closeLightbox = () => setSelectedMedia(null)

    const renderSkeletons = () => {
        const skeletonCount = viewMode === "grid" ? 8 : 4;
        return Array(skeletonCount).fill(0).map((_, index) => (
            viewMode === "grid" ? (
                <div key={index} className="flex flex-col space-y-2">
                    <Skeleton className="w-full aspect-square rounded-lg bg-warm-200 dark:bg-warm-700" />
                    <Skeleton className="w-2/3 h-4 rounded-md bg-warm-200 dark:bg-warm-700" />
                </div>
            ) : (
                <div key={index} className="flex items-center gap-4 p-3 bg-white dark:bg-warm-800/10 rounded-lg border border-warm-200 dark:border-warm-700/50">
                    <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-md flex-shrink-0 bg-warm-200 dark:bg-warm-700" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="w-3/4 h-5 rounded-md bg-warm-200 dark:bg-warm-700" />
                        <Skeleton className="w-1/2 h-4 rounded-md bg-warm-200 dark:bg-warm-700" />
                    </div>
                </div>
            )
        ));
    };

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-warm-100 dark:bg-warm-700/30 p-5 sm:p-6 rounded-full mb-4 sm:mb-6">
                <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-warm-500 dark:text-warm-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-warm-800 dark:text-warm-100 mb-2">Gallery is Empty</h3>
            <p className="text-warm-600 dark:text-warm-300 max-w-md mb-6 text-sm sm:text-base">
                Add photos and videos to your tributes, and they will appear here.
            </p>
        </div>
    )

    const renderErrorState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-red-100 dark:bg-red-700/30 p-5 sm:p-6 rounded-full mb-4 sm:mb-6">
                <AlertTriangleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-warm-800 dark:text-warm-100 mb-2">Oops! Something went wrong.</h3>
            <p className="text-warm-600 dark:text-warm-300 max-w-md mb-6 text-sm sm:text-base">{error || "We couldn't load your gallery."}</p>
            <Button onClick={handleRetry} className="bg-warm-600 hover:bg-warm-700 text-white px-6 py-2.5">
                Try Again
            </Button>
        </div>
    )

    const renderMediaGridOrList = (mediaItemsToRender) => {
        if (!mediaItemsToRender || mediaItemsToRender.length === 0) return null;

        if (viewMode === "list") {
            return (
                <div className="flex flex-col space-y-3">
                    {mediaItemsToRender.map((item) => (
                        <MediaListItem key={item.id} item={item} openLightbox={openLightbox} />
                    ))}
                </div>
            );
        }

        // Grid View
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {mediaItemsToRender.map((item) => (
                    <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer aspect-square bg-warm-100 dark:bg-warm-700/30"
                        onClick={() => openLightbox(item)}
                    >
                        {item.type === "image" ? (
                            <img
                                src={`${assetServer}/images/gallery/${item.url}`}
                                alt={`Gallery item for ${item.tribute.title}`}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.svg?height=200&width=200&text=Error";
                                }}
                            />
                        ) : (
                            <div className="relative h-full w-full bg-black flex items-center justify-center">
                                <video className="object-contain h-full w-full" preload="metadata">
                                    <source src={`${assetServer}/images/gallery/${item.url}#t=0.1`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
                                    <VideoIcon className="h-10 w-10 sm:h-12 sm:w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <div className="text-white">
                                <p className="text-xs sm:text-sm font-semibold truncate" title={item.tribute.title}>{item.tribute.title}</p>
                                <p className="text-[10px] sm:text-xs opacity-80 truncate" title={`${item.tribute.firstName} ${item.tribute.lastName}`.trim()}>
                                    {`${item.tribute.firstName} ${item.tribute.lastName}`.trim() || 'In Memory'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const imagesToDisplay = activeTab === "all" || activeTab === "images"
        ? allMediaItems.filter(item => item.type === 'image')
        : [];
    const videosToDisplay = activeTab === "all" || activeTab === "videos"
        ? allMediaItems.filter(item => item.type === 'video')
        : [];

    const hasAnyMedia = allMediaItems.length > 0;

    const getCurrentMediaArrayForLightbox = () => {
        if (!selectedMedia) return [];
        return allMediaItems.filter(item => item.type === selectedMedia.type);
    };

    const navigateLightbox = (direction) => {
        const currentArray = getCurrentMediaArrayForLightbox();
        if (!currentArray || currentArray.length === 0) return;
        const currentIndex = currentArray.findIndex(item => item.id === selectedMedia.id);
        if (currentIndex === -1) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = currentIndex < currentArray.length - 1 ? currentIndex + 1 : 0;
        } else {
            newIndex = currentIndex > 0 ? currentIndex - 1 : currentArray.length - 1;
        }
        setSelectedMedia(currentArray[newIndex]);
    };


    return (
        <div className="bg-warm-50 dark:bg-warm-900 min-h-screen">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
                <Card className="border-warm-200 dark:border-warm-700/50 shadow-lg bg-white dark:bg-warm-800 rounded-xl">
                    <CardHeader className="pb-4 border-b border-warm-200 dark:border-warm-700/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold text-warm-800 dark:text-warm-100 sm:text-3xl">Media Gallery</CardTitle>
                                <CardDescription className="text-warm-600 dark:text-warm-300 mt-1 text-sm sm:text-base">
                                    Browse photos and videos from all tributes.
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2 bg-warm-100 dark:bg-warm-700/50 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-8 px-3 rounded-md text-xs sm:text-sm flex items-center gap-1.5",
                                        viewMode === "grid"
                                            ? "bg-white dark:bg-warm-600 shadow-sm text-warm-700 dark:text-white"
                                            : "bg-transparent text-warm-500 dark:text-warm-300 hover:text-warm-700 dark:hover:text-warm-100"
                                    )}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <GridIcon className="h-4 w-4" />
                                    Grid
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-8 px-3 rounded-md text-xs sm:text-sm flex items-center gap-1.5",
                                        viewMode === "list"
                                            ? "bg-white dark:bg-warm-600 shadow-sm text-warm-700 dark:text-white"
                                            : "bg-transparent text-warm-500 dark:text-warm-300 hover:text-warm-700 dark:hover:text-warm-100"
                                    )}
                                    onClick={() => setViewMode("list")}
                                >
                                    <LayoutGridIcon className="h-4 w-4" /> {/* Using LayoutGrid for list icon often implies rows */}
                                    List
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-5 sm:pt-6">
                        {loading ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-10 w-48 rounded-md bg-warm-200 dark:bg-warm-700" />
                                </div>
                                <div className={cn("gap-3 sm:gap-4", viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "flex flex-col space-y-3")}>
                                    {renderSkeletons()}
                                </div>
                            </div>
                        ) : error ? (
                            renderErrorState()
                        ) : !hasAnyMedia ? (
                            renderEmptyState()
                        ) : (
                            <div className="space-y-6">
                                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                                    <div className="flex items-center justify-start mb-4 sm:mb-5 border-b border-warm-200 dark:border-warm-700/50 pb-3">
                                        <TabsList className="bg-warm-100 dark:bg-warm-700/50 p-1 rounded-lg">
                                            {[
                                                { value: "all", label: `All (${allMediaItems.length})`, icon: null },
                                                { value: "images", label: `Images (${imagesToDisplay.length})`, icon: ImageIcon },
                                                { value: "videos", label: `Videos (${videosToDisplay.length})`, icon: VideoIcon },
                                            ].map(tab => (
                                                <TabsTrigger
                                                    key={tab.value}
                                                    value={tab.value}
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-warm-600 data-[state=active]:text-warm-700 dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-warm-500 dark:text-warm-300 px-3 py-1.5 text-xs sm:text-sm rounded-md flex items-center gap-1.5"
                                                >
                                                    {tab.icon && <tab.icon className="h-4 w-4" />}
                                                    {tab.label}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>

                                    <TabsContent value="all" className="space-y-6 sm:space-y-8 mt-2">
                                        {imagesToDisplay.length > 0 && (
                                            <div className="space-y-3 sm:space-y-4">
                                                <h3 className="text-lg sm:text-xl font-semibold text-warm-800 dark:text-warm-100 flex items-center">
                                                    <ImageIcon className="h-5 w-5 mr-2 text-warm-600 dark:text-warm-400" />
                                                    Images
                                                </h3>
                                                {renderMediaGridOrList(imagesToDisplay)}
                                            </div>
                                        )}
                                        {videosToDisplay.length > 0 && (
                                            <div className="space-y-3 sm:space-y-4">
                                                <h3 className="text-lg sm:text-xl font-semibold text-warm-800 dark:text-warm-100 flex items-center">
                                                    <VideoIcon className="h-5 w-5 mr-2 text-warm-600 dark:text-warm-400" />
                                                    Videos
                                                </h3>
                                                {renderMediaGridOrList(videosToDisplay)}
                                            </div>
                                        )}
                                        {imagesToDisplay.length === 0 && videosToDisplay.length === 0 && (
                                            <div className="text-center py-8 text-warm-600 dark:text-warm-300">No media items to display in this category.</div>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="images" className="mt-2">
                                        {imagesToDisplay.length > 0 ? renderMediaGridOrList(imagesToDisplay) : <div className="text-center py-8 text-warm-600 dark:text-warm-300">No images available.</div>}
                                    </TabsContent>
                                    <TabsContent value="videos" className="mt-2">
                                        {videosToDisplay.length > 0 ? renderMediaGridOrList(videosToDisplay) : <div className="text-center py-8 text-warm-600 dark:text-warm-300">No videos available.</div>}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selectedMedia} onOpenChange={closeLightbox}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-transparent border-none flex flex-col sm:flex-row shadow-2xl rounded-lg">
                    {selectedMedia && (
                        <>
                            <div className="relative flex-grow h-3/5 sm:h-full flex items-center justify-center bg-black/90 backdrop-blur-sm p-1 sm:p-2 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none">
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-white/70 hover:text-white hover:bg-white/10 z-[60] sm:hidden" onClick={closeLightbox} aria-label="Close lightbox"><XIcon className="h-6 w-6" /></Button>
                                <Button variant="ghost" size="icon" className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 z-50 rounded-full p-2" onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }} aria-label="Previous"><ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" /></Button>
                                <Button variant="ghost" size="icon" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 z-50 rounded-full p-2" onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }} aria-label="Next"><ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" /></Button>

                                {selectedMedia.type === "image" ? (
                                    <img src={`${assetServer}/images/gallery/${selectedMedia.url}`} alt={`Preview of ${selectedMedia.tribute.title}`} className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <video controls autoPlay className="max-h-full max-w-full object-contain">
                                        <source src={`${assetServer}/images/gallery/${selectedMedia.url}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>

                            <div className="w-full sm:w-72 md:w-80 lg:w-96 bg-white dark:bg-warm-800 p-4 sm:p-5 overflow-y-auto flex-shrink-0 h-2/5 sm:h-full rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none relative">
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-warm-500 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-700 z-[60] hidden sm:flex" onClick={closeLightbox} aria-label="Close lightbox"><XIcon className="h-5 w-5" /></Button>

                                <div className="pr-8 sm:pr-0">
                                    <p className="text-xs text-warm-500 dark:text-warm-400 uppercase tracking-wider mb-0.5">Tribute</p>
                                    <h3 className="text-lg sm:text-xl font-semibold text-warm-800 dark:text-warm-100 mb-1" title={selectedMedia.tribute.title}>
                                        {selectedMedia.tribute.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-warm-600 dark:text-warm-300 mb-4" title={`${selectedMedia.tribute.firstName} ${selectedMedia.tribute.lastName}`.trim()}>
                                        {`${selectedMedia.tribute.firstName} ${selectedMedia.tribute.lastName}`.trim() || "In Loving Memory"}
                                    </p>
                                </div>

                                <div className="space-y-3.5 text-xs sm:text-sm border-t border-warm-200 dark:border-warm-700/50 pt-4">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-warm-700 dark:text-warm-200">Filename:</span>
                                        <p className="text-warm-500 dark:text-warm-400 break-all text-right ml-2">{selectedMedia.url.split('/').pop()}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-warm-700 dark:text-warm-200">Type:</span>
                                        <p className="text-warm-500 dark:text-warm-400 capitalize">{selectedMedia.type}</p>
                                    </div>
                                    {selectedMedia.tribute.dob && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-warm-700 dark:text-warm-200">Born:</span>
                                            <p className="text-warm-500 dark:text-warm-400">
                                                {new Date(selectedMedia.tribute.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    )}
                                    {selectedMedia.tribute.dod && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-warm-700 dark:text-warm-200">Passed:</span>
                                            <p className="text-warm-500 dark:text-warm-400">
                                                {new Date(selectedMedia.tribute.dod).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2.5 pt-5 mt-5 border-t border-warm-200 dark:border-warm-700/50">
                                    {selectedMedia.tribute.theme && selectedMedia.tribute.id && (
                                        <Button asChild variant="outline" className="w-full text-warm-700 dark:text-warm-200 border-warm-300 dark:border-warm-600 hover:bg-warm-100 dark:hover:bg-warm-700">
                                            <a href={`/${selectedMedia.tribute.theme}/${selectedMedia.tribute.id}/${generateSlug(selectedMedia.tribute.title)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                                View Full Tribute
                                                <ExternalLinkIcon className="h-4 w-4 ml-2" />
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        className="w-full bg-warm-600 hover:bg-warm-700 text-white dark:bg-warm-500 dark:hover:bg-warm-600"
                                        onClick={(e) => { e.stopPropagation(); window.open(`${assetServer}/images/gallery/${selectedMedia.url}`, "_blank"); }}
                                    >
                                        <DownloadIcon className="h-4 w-4 mr-2" />
                                        Download Media
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
