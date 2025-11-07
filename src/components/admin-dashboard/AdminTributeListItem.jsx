// src/components/admin-dashboard/AdminTributeListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Trash2, Lock, Unlock, Calendar, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {  assetServer } from "@/assetServer.js"; // Assuming assetServer is exported from server.js or a dedicated assetServer.js
import { server } from "@/server.js"
import PropTypes from 'prop-types';
import { format } from 'date-fns';


const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
};

const generateSlug = (title) => {
    if (!title) return 'tribute';
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export function AdminTributeListItem({ tribute, onEdit, onDeleteRequest }) {
    const formattedDate = tribute.created_at
        ? format(new Date(tribute.created_at), "MMM dd, yyyy")
        : "No date"

    const tributeImageUrl = tribute.image
        ? `${assetServer}/images/people/${tribute.image}`
        : "/placeholder.svg?height=60&width=60&text=Img";

    const creatorAvatarUrl = tribute.user?.avatar
        ? `${assetServer}/images/avatars/${tribute.user.avatar}`
        : null;

    return (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <img
                    src={tributeImageUrl}
                    alt={tribute.title || "Tribute"}
                    className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <Link
                        to={`/${tribute.theme}/${tribute.id}/${generateSlug(tribute.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1"
                    >
                        <h4 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-primary transition-colors truncate" title={tribute.title || "Untitled Tribute"}>
                            {tribute.title || "Untitled Tribute"}
                        </h4>
                        <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    {tribute.user && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Avatar className="h-4 w-4 border">
                                <AvatarImage src={creatorAvatarUrl} alt={tribute.user.name} />
                                <AvatarFallback className="bg-slate-200 text-slate-700 text-[8px]">
                                    {getInitials(tribute.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span>{tribute.user.name || "Unknown Creator"}</span>
                        </div>
                    )}
                    <div className="flex items-center text-slate-500 text-xs mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Created {formattedDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                <Badge
                    variant={tribute.status === 'active' ? 'success' : tribute.status === 'draft' ? 'secondary' : 'destructive'}
                    className="text-xs px-1.5 sm:px-2 py-0.5 hidden md:inline-flex items-center"
                >
                    {tribute.status === 'active' ? 'Published' : tribute.status === 'draft' ? 'Draft' : 'Inactive'}
                </Badge>
                <Badge
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm text-xs px-1.5 sm:px-2 py-0.5 flex items-center gap-1 hidden md:inline-flex"
                >
                    {tribute.is_public === 0 ? (
                        <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-600" />
                    ) : (
                        <Unlock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-600" />
                    )}
                    <span className="text-slate-700 hidden lg:inline">{tribute.is_public === 0 ? "Private" : "Public"}</span>
                </Badge>
                <Button
                    variant="ghost"
                    size="icon-sm" // Custom size or use sm and adjust padding if needed
                    className="text-slate-600 hover:text-primary hover:bg-primary/10 p-1.5 sm:p-2"
                    onClick={() => onEdit(tribute.id)}
                    title="Edit Tribute"
                >
                    <Edit className="h-4 w-4 sm:h-4 sm:w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-slate-600 hover:text-red-600 hover:bg-red-500/10 p-1.5 sm:p-2"
                    onClick={() => onDeleteRequest(tribute.id)}
                    title="Delete Tribute"
                >
                    <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" />
                </Button>
            </div>
        </div>
    );
}

AdminTributeListItem.propTypes = {
    tribute: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string,
        image: PropTypes.string,
        created_at: PropTypes.string,
        status: PropTypes.string.isRequired,
        is_public: PropTypes.number.isRequired,
        theme: PropTypes.string,
        user: PropTypes.shape({
            name: PropTypes.string,
            avatar: PropTypes.string,
        }),
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDeleteRequest: PropTypes.func.isRequired,
};