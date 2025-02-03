import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout";
import { server } from "@/server.js";

export default function Gallery() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    const user = JSON.parse(localStorage.getItem("user")); // Parse the user object

    useEffect(() => {
        if (user && user.id) {
            setLoading(true);
            setError(null);

            axios
                .get(`${server}/${user.id}/media`)
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
            <div className="container mx-auto p-6 max-w-6xl">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">Gallery</h1>

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
                {!loading && !error && media.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {media.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 shadow-md rounded-lg overflow-hidden"
                            >
                                {item.type === "image" ? (
                                    <img
                                        src={item.url}
                                        alt={item.title || "Media"}
                                        className="w-full h-48 object-cover mb-2 rounded-md"
                                    />
                                ) : (
                                    <video
                                        controls
                                        className="w-full h-48 object-cover mb-2 rounded-md"
                                    >
                                        <source src={item.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <p className="text-gray-700 font-semibold truncate">{item.title}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Media State */}
                {!loading && !error && media.length === 0 && (
                    <div className="flex flex-col justify-center items-center h-64">
                        <p className="text-gray-600 text-center">
                            No media available in your gallery.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}