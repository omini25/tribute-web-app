import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import axios from 'axios';
import { server } from "@/server.js";
import { assetServer} from "@/assetServer.js";
import {Plus} from "lucide-react";

export function TributeCard({ variant = "solid", onClick }) {
    const [title, setTitle] = useState("TRIBUTE");
    const [image, setImage] = useState("/placeholder.svg");
    const [id, setId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [tributes, setTributes] = useState([]);

   useEffect(() => {
       axios.get(`${server}/tribute/title/image/${user.id}`)
           .then(response => {
               const tributes = response.data; // Get all tributes from the array
               setTributes(tributes); // Assuming you have a state to store all tributes
           })
           .catch(error => {
               console.error('Error fetching tribute data:', error);
           });
   }, []);

    console.log("TributeCard", title, image, id);



    if (variant === "dashed") {
        return (
            <Link to="/dashboard/create-tribute">
                <Card
                    className="w-64 h-64 border-2 border-dashed border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create New Tribute
                </Card>
            </Link>
        );
    }

    return (
        <div className="tribute-container flex flex-row flex-wrap">
            {tributes.map(tribute => (
                <Link key={tribute.id} to={`/dashboard/memories-overview/${tribute.id}`}>
                    <Card
                        className="w-64 h-64 flex items-center justify-center bg-blue-50 relative m-2"
                        style={{ backgroundImage: `url(${assetServer}/images/people/${tribute.image})`, backgroundSize: 'cover' }}
                    >
                        <span className="text-primary font-medium absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                            {tribute.title || "TRIBUTE"}
                        </span>
                    </Card>
                </Link>
            ))}
        </div>
    );
}