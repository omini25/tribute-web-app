import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Edit, Eye, Lock, Unlock, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import PropTypes from 'prop-types'
import { assetServer } from "@/assetServer.js"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

export function AdminTributeCard({ tribute, onEdit, onDeleteRequest }) { // Added onDeleteRequest prop
    const formattedDate = tribute.created_at
        ? format(new Date(tribute.created_at), "MMM dd, yyyy")
        : "No date"

    const tributeImageUrl = tribute.image
        ? `${assetServer}/images/people/${tribute.image}`
        : "/placeholder.svg"

    const creatorAvatarUrl = tribute.user?.avatar
        ? `${assetServer}/images/avatars/${tribute.user.avatar}`
        : null

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    // Helper to generate a URL-friendly slug
    const generateSlug = (tribute) => {
        let nameForSlug = tribute.title || 'tribute';
        if (tribute.first_name && tribute.last_name) {
            nameForSlug = `${tribute.first_name} ${tribute.last_name}`;
        }
        return nameForSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

    const tributeSlug = generateSlug(tribute);

    return (
        <Card className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="relative group">
                <div className="aspect-[16/10] overflow-hidden">
                    <img
                        src={tributeImageUrl}
                        alt={tribute.title || "Tribute Image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge
                        variant={tribute.status === 'active' ? 'success' : tribute.status === 'draft' ? 'secondary' : 'destructive'}
                        className="shadow-md text-xs px-2.5 py-1"
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
            </div>

            <CardContent className="p-5 flex-grow">
                <h3 className="text-lg font-semibold text-slate-800 mb-1.5 leading-tight hover:text-primary transition-colors">
                    {tribute.title || "Untitled Tribute"}
                </h3>

                {tribute.user && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                        <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                            <AvatarImage src={creatorAvatarUrl} alt={tribute.user.name} />
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                                {getInitials(tribute.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        {/* Displaying user name and email on separate lines or with better distinction */}
                        <div>
                            <span className="block font-medium">{tribute.user.name || "Unknown Creator"}</span>
                            <span className="block text-xs text-slate-500">{tribute.user.email || "No email"}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center text-slate-500 text-xs">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>Created {formattedDate}</span>
                </div>
            </CardContent>

            <CardFooter className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border-t border-slate-200">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-colors w-full"
                    onClick={() => window.open(`/tribute/${tributeSlug}`, '_blank')}
                >
                    <Eye className="h-4 w-4 md:mr-1.5" /> {/* Hide text on very small screens if needed */}
                    <span className="hidden md:inline">View</span>
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full"
                    onClick={() => onEdit(tribute.id)}
                >
                    <Edit className="h-4 w-4 md:mr-1.5" />
                    <span className="hidden md:inline">Edit</span>
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full" // Ensure it takes full width of its grid cell
                    onClick={() => onDeleteRequest(tribute.id)}
                >
                    <Trash2 className="h-4 w-4 md:mr-1.5" />
                    <span className="hidden md:inline">Delete</span>
                </Button>
            </CardFooter>
        </Card>
    )
}

AdminTributeCard.propTypes = {
    tribute: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        image: PropTypes.string,
        created_at: PropTypes.string,
        status: PropTypes.string.isRequired,
        is_public: PropTypes.number.isRequired,
        theme: PropTypes.string,
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            avatar: PropTypes.string,
        }),
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDeleteRequest: PropTypes.func.isRequired,
}