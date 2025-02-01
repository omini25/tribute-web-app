import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout.jsx";
import { TributeCard } from "@/components/dashboard/TributeCard.jsx";
import { Post } from "@/components/dashboard/Posts.jsx";
import axios from 'axios';
import { server } from "@/server.js";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { message: 'You need to be logged in to access the dashboard.' } });
        } else {
            axios.get(`${server}/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setPosts(response.data.posts);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    setLoading(false);
                });
        }
    }, [navigate]);

    return (
        <>
            <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
            <div className="mb-8">
                <div className="flex gap-4">
                    <TributeCard variant="dashed" />
                    <TributeCard />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {loading ? (
                    <p>Loading posts...</p>
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <Post
                            key={post.id}
                            name={post.name}
                            time={post.time}
                            content={post.content}
                            likes={post.likes}
                        />
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>
        </>
    );
}