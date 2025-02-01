import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import axios from 'axios';
import { server } from "@/server.js";

export function TributeCard({ variant = "solid", onClick }) {
    const [title, setTitle] = useState("TRIBUTE");
    const [image, setImage] = useState("/placeholder.svg");
    const [id, setId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`${server}/tribute/title/image/${user.id}`)
            .then(response => {
                const { title, image, id } = response.data;
                console.log(response.data);
                setTitle(title || "TRIBUTE");
                setImage(image || "/placeholder.svg");
                setId(id);
            })
            .catch(error => {
                console.error('Error fetching tribute data:', error);
            });
    }, []);


    if (variant === "dashed") {
        return (
            <Link to="/dashboard/create-tribute">
                <Card
                    className="w-64 h-64 border-2 border-dashed border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                >
                    <span className="text-blue-500 font-medium">CREATE TRIBUTE</span>
                </Card>
            </Link>
        );
    }

    return (
        <Link to={`/dashboard/memories-overview/${id}`}>  {/* Link to memories overview with ID */}
            <Card
                className="w-64 h-64 flex items-center justify-center bg-blue-50 relative" // Added relative for image positioning
                style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}
            >
                <span className="text-primary font-medium absolute inset-0 flex items-center justify-center bg-black/50 text-white"> {/* Added styling for title overlay */}
                    {title}
                </span>
            </Card>
        </Link>
    );
}