"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card" // Added CardContent
import { Calendar, Edit, Eye, Lock, Unlock, UserCircle } from "lucide-react" // Added UserCircle
import { formatDistanceToNow } from "date-fns"
import PropTypes from 'prop-types'
import { assetServer } from "@/assetServer.js"
// useNavigate is not used in this version, but kept if you plan to use it elsewhere
// import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Added Avatar components
import { format } from "date-fns"

export function TributeCard({ tribute, onView, onEdit }) { // onView is not used in this version, but kept for prop consistency
    // const navigate = useNavigate() // Not used directly in this card's actions
    const generateSlug = (tribute) => {
        let nameForSlug = tribute.title || '';
        if (tribute.first_name && tribute.last_name) {
            nameForSlug = `${tribute.first_name} ${tribute.last_name}`;
        }
        return nameForSlug.toLowerCase().replace(/\s+/g, '-');
    };

    const tributeSlug = generateSlug(tribute);

    const formattedDate = tribute.created_at
        ? format(new Date(tribute.created_at), "MMM dd, yyyy")
        : "No date"

    const tributeImageUrl = tribute.image
        ? `${assetServer}/images/people/${tribute.image}`
        : "/placeholder.svg" // Generic placeholder

    const creatorAvatarUrl = tribute.creator?.avatar
        ? `${assetServer}/images/avatars/${tribute.creator.avatar}` // Assuming avatars are in a different subfolder
        : null // No avatar placeholder, will use fallback

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="relative group">
                <div className="aspect-[16/10] overflow-hidden"> {/* Aspect ratio for consistent image height */}
                    <img
                        src={tributeImageUrl}
                        alt={tribute.title || "Tribute Image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge
                        variant={tribute.status === 'active' ? 'success' : tribute.status === 'draft' ? 'secondary' : 'destructive'}
                        className="shadow-md text-xs px-2.5 py-1" // Slightly smaller badge
                    >
                        {tribute.status === 'active' ? 'Published' : tribute.status === 'draft' ? 'Draft' : 'Inactive'}
                    </Badge>
                    <Badge
                        variant="outline"
                        className="bg-white/90 backdrop-blur-sm shadow-md text-xs px-2.5 py-1 flex items-center gap-1"
                    >
                        {tribute.is_public === 0 ? (
                            <>
                                <Lock className="h-3 w-3 text-slate-600" />
                                <span className="text-slate-700">Private</span>
                            </>
                        ) : (
                            <>
                                <Unlock className="h-3 w-3 text-green-600" />
                                <span className="text-slate-700">Public</span>
                            </>
                        )}
                    </Badge>
                </div>
                {/* Optional: Gradient overlay if needed, but can be cleaner without if text is well-placed below */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /> */}
            </div>

            <CardContent className="p-5 flex-grow"> {/* Increased padding */}
                <h3 className="text-lg font-semibold text-slate-800 mb-1.5 leading-tight hover:text-primary transition-colors">
                    {tribute.title || "Untitled Tribute"}
                </h3>

                {tribute.creator && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                        <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                            <AvatarImage src={creatorAvatarUrl} alt={tribute.creator.name} />
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                                {getInitials(tribute.creator.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span>By {tribute.creator.name || "Unknown Creator"}</span>
                    </div>
                )}

                <div className="flex items-center text-slate-500 text-xs">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>Created {formattedDate}</span>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-colors"
                    onClick={() => window.open(`/tribute/${tributeSlug}`, '_blank')} // Link to the public tribute page with a slug
                >
                    <Eye className="h-4 w-4 mr-1.5" />
                    View
                </Button>
                <Button
                    variant="default" // Changed to default for primary action
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={() => onEdit(tribute.id)}
                >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Edit
                </Button>
            </CardFooter>
        </Card>
    )
}

TributeCard.propTypes = {
    tribute: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Allow number for ID
        title: PropTypes.string.isRequired,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        image: PropTypes.string,
        created_at: PropTypes.string,
        status: PropTypes.string.isRequired,
        // visibility: PropTypes.string.isRequired, // This was in old props, but is_public is used
        is_public: PropTypes.number.isRequired, // 0 for private, 1 for public
        theme: PropTypes.string, // Added theme for the view URL
        creator: PropTypes.shape({ // Added creator details
            name: PropTypes.string,
            avatar: PropTypes.string, // Path to avatar image
        }),
    }).isRequired,
    onView: PropTypes.func, // onView is not directly used by a button in this version, can be optional
    onEdit: PropTypes.func.isRequired,
}