import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout";
import { server } from "@/server.js";
import { assetServer } from "@/assetServer.js";
import {CardDescription, CardHeader, CardTitle, CardContent} from "@/components/ui/card.jsx";

export default function Gallery() {
    const [media, setMedia] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user && user.id) {
            setLoading(true);
            setError(null);

            axios
                .get(`${server}/memories/all/user/${user.id}`)
                .then((response) => {
                    setMedia(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching media:", error);
                    setError("No media found.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user?.id]);

    return (
        <div>
            <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
                <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                        Gallery
                    </CardTitle>
                    <CardDescription className="text-warm-600">
                        Gallery, Images and Videos
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-600">Loading media...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Media Display */}
                    {!loading && !error && (media.images || media.videos) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {media.images && JSON.parse(media.images).map((image, imgIndex) => (
                                <a
                                    key={imgIndex}
                                    href={`${assetServer}/images/gallery/${image}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={`${assetServer}/images/gallery/${image}`}
                                        alt={image}
                                        className="w-full h-48 object-cover mb-2 rounded-md"
                                    />
                                </a>
                            ))}
                            {media.videos && JSON.parse(media.videos).map((video, vidIndex) => (
                                <video
                                    key={vidIndex}
                                    controls
                                    className="w-full h-48 object-cover mb-2 rounded-md"
                                >
                                    <source src={`${assetServer}/images/gallery/${video}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ))}
                        </div>
                    )}

                    {/* No Media State */}
                    {!loading && !error && !media.images && !media.videos && (
                        <div className="flex flex-col justify-center items-center h-64">
                            <p className="text-gray-600 text-center">
                                No media available in your gallery.
                            </p>
                        </div>
                    )}

                </CardContent>


            </div>
        </div>
    );
}