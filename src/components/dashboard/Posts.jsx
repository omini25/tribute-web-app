import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added for comment input
import { Heart, MessageSquare, Share, Send } from "lucide-react"; // Added Send for comment button
import { formatDistanceToNow, parseISO } from "date-fns";
import PropTypes from 'prop-types';

// Define assetServer or import it from your configuration
// For example: const assetServer = "https://yourdomain.com/assets";
// If your image URLs are already absolute, you might not need this.
const assetServer = ""; // Placeholder: Replace with your actual asset server URL or ensure full URLs are passed

export function Post({ postData }) {
    // Destructure with default values to prevent errors if postData is incomplete
    const {
        id: postId, // Unique ID for the post, crucial for backend interactions
        name = "Anonymous",
        avatarUrl, // URL for the author's avatar
        time,
        content = "No content.",
        image, // Image for the post itself
        likesCount: initialLikes = 0,
        comments: initialComments = [],
        userHasLiked: initialUserHasLiked = false,
    } = postData || {};

    const [likes, setLikes] = useState(initialLikes);
    const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState(false);

    // Effect to update state if props change (e.g., parent component re-fetches data)
    useEffect(() => {
        setLikes(initialLikes);
        setUserHasLiked(initialUserHasLiked);
        setComments(initialComments);
    }, [initialLikes, initialUserHasLiked, initialComments, postId]);


    const getInitials = (nameStr) => {
        if (!nameStr || typeof nameStr !== 'string') return "??";
        return nameStr
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const formattedTime = time ? formatDistanceToNow(parseISO(time), { addSuffix: true }) : 'Recently';

    // Construct image URLs safely
    const postAuthorAvatarUrl = avatarUrl ? (assetServer ? `${assetServer}/images/avatars/${avatarUrl}` : avatarUrl) : null;
    const postImageUrl = image ? (assetServer ? `${assetServer}/images/memories/${image}` : image) : "/placeholder.svg";


    const handleLike = async () => {
        // Optimistic update
        const newLikeStatus = !userHasLiked;
        const newLikesCount = newLikeStatus ? likes + 1 : likes - 1;
        setUserHasLiked(newLikeStatus);
        setLikes(newLikesCount);

        try {
            // Replace with your actual API endpoint and method
            // For Laravel, ensure you handle CSRF token if not using API tokens like Sanctum
            const response = await fetch(`/api/posts/${postId}/like`, { // Ensure this matches your Laravel route
                method: newLikeStatus ? 'POST' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'), // For web routes
                    // 'Authorization': `Bearer ${your_auth_token}`, // For Sanctum/API tokens
                },
            });
            if (!response.ok) {
                // Revert optimistic update on failure
                setUserHasLiked(!newLikeStatus);
                setLikes(newLikeStatus ? newLikesCount - 1 : newLikesCount + 1);
                console.error("Failed to update like status", await response.text());
            }
            // Optionally, you can fetch the updated likes count from the response if your API returns it
            // const data = await response.json();
            // setLikes(data.likes_count);
        } catch (error) {
            // Revert optimistic update on failure
            setUserHasLiked(!newLikeStatus);
            setLikes(newLikeStatus ? newLikesCount - 1 : newLikesCount + 1);
            console.error("Error liking post:", error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        const tempCommentId = `temp-${Date.now()}`;
        const optimisticComment = {
            id: tempCommentId,
            user: "You", // Replace with actual logged-in user's name from your auth context
            userAvatarUrl: null, // Replace with actual logged-in user's avatar
            text: newComment.trim(),
            isOptimistic: true,
        };

        setComments(prevComments => [...prevComments, optimisticComment]);
        setNewComment("");

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, { // Ensure this matches your Laravel route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    // 'Authorization': `Bearer ${your_auth_token}`,
                },
                body: JSON.stringify({ text: optimisticComment.text }),
            });

            if (response.ok) {
                const savedComment = await response.json();
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === tempCommentId ? { ...savedComment, isOptimistic: false } : comment
                    )
                );
            } else {
                setComments(prevComments => prevComments.filter(comment => comment.id !== tempCommentId));
                console.error("Failed to add comment", await response.text());
            }
        } catch (error) {
            setComments(prevComments => prevComments.filter(comment => comment.id !== tempCommentId));
            console.error("Error adding comment:", error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Post by ${name}`,
                text: `Check out this post: ${content.substring(0, 100)}...`,
                url: window.location.href, // Or a specific permalink to the post
            })
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            alert('Sharing is not supported on this browser. You can implement a custom share modal here.');
        }
    };

    if (!postData || !postId) {
        return <div className="p-4 text-red-500">Error: Post data is incomplete or missing.</div>;
    }

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-6">
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-[#e5e0d9]">
                    <AvatarImage src={postAuthorAvatarUrl} alt={name} />
                    <AvatarFallback className="bg-[#f0ece6] text-[#fcd34d]">{getInitials(name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-medium text-[#2a3342]">{name}</h4>
                            <p className="text-xs text-[#4a5568]">{formattedTime}</p>
                        </div>
                    </div>

                    <div className="mt-2">
                        <p className="text-[#4a5568] whitespace-pre-line">{content}</p>
                    </div>

                    {image && (
                        <div className="mt-3 rounded-md overflow-hidden border border-[#e5e0d9]">
                            <img src={postImageUrl} alt="Post attachment" className="w-full h-auto object-cover" />
                        </div>
                    )}

                    <div className="flex items-center gap-x-1 sm:gap-x-2 mt-4 pt-3 border-t border-[#e5e0d9]">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`text-[#4a5568] hover:text-[#fcd34d] hover:bg-[#f5f0ea] ${userHasLiked ? 'text-[#fcd34d]' : ''}`}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${userHasLiked ? 'fill-current text-[#fcd34d]' : ''}`} />
                            {likes}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowComments(!showComments)}
                            className="text-[#4a5568] hover:text-[#fcd34d] hover:bg-[#f5f0ea]"
                        >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comment'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="text-[#4a5568] hover:text-[#fcd34d] hover:bg-[#f5f0ea]"
                        >
                            <Share className="h-4 w-4 mr-1" />
                            Share
                        </Button>
                    </div>

                    {showComments && (
                        <div className="mt-4 pt-3 border-t border-[#e5e0d9]">
                            <h5 className="text-sm font-medium text-[#2a3342] mb-3">Comments</h5>
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {comments.length > 0 ? (
                                    comments.map(comment => (
                                        <div key={comment.id} className={`flex items-start gap-2 text-sm p-2 rounded ${comment.isOptimistic ? 'opacity-70' : ''}`}>
                                            <Avatar className="h-8 w-8 border border-[#e5e0d9]">
                                                <AvatarImage src={comment.userAvatarUrl ? (assetServer ? `${assetServer}/images/avatars/${comment.userAvatarUrl}` : comment.userAvatarUrl) : null} alt={comment.user} />
                                                <AvatarFallback className="bg-[#f0ece6] text-xs text-[#fcd34d]">{getInitials(comment.user)}</AvatarFallback>
                                            </Avatar>
                                            <div className="bg-[#f8f4f0] p-2 rounded-md flex-1">
                                                <span className="font-semibold text-[#2a3342]">{comment.user}</span>
                                                <p className="text-[#4a5568] whitespace-pre-line">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-[#4a5568]">No comments yet. Be the first to comment!</p>
                                )}
                            </div>
                            <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                                <Input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-grow text-sm border-[#e5e0d9] focus:border-[#fcd34d]"
                                />
                                <Button type="submit" size="icon" className="bg-[#fcd34d] hover:bg-[#eab308] text-white flex-shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Post.propTypes = {
    postData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        avatarUrl: PropTypes.string,
        time: PropTypes.string,
        content: PropTypes.string,
        image: PropTypes.string,
        likesCount: PropTypes.number,
        comments: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            user: PropTypes.string.isRequired,
            userAvatarUrl: PropTypes.string,
            text: PropTypes.string.isRequired,
        })),
        userHasLiked: PropTypes.bool,
    }).isRequired,
};