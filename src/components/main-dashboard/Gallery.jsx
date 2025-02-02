import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout";
import {server} from "@/server.js";

export default function Gallery() {
    const [media, setMedia] = useState([]);
    const user = localStorage.getItem("user");

    useEffect(() => {
        if (user.id) {
            axios.get(`${server}/${user.id}/media`)
                .then(response => {
                    setMedia(response.data);
                })
                .catch(error => {
                    console.error("Error fetching media:", error);
                });
        }
    }, [user.id]);

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div>
                <h1 className="mb-4 text-2xl font-bold">Gallery</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {media.map((item, index) => (
                        <div key={index} className="bg-white p-4 shadow-md rounded">
                            {item.type === "image" ? (
                                <img src={item.url} alt={item.title} className="w-full h-auto" />
                            ) : (
                                <video controls className="w-full h-auto">
                                    <source src={item.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <p className="mt-2 text-gray-700">{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}