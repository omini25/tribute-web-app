import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import {toast} from "react-hot-toast";
import {server} from "@/server.js";

export default function Preview() {
    const { id } = useParams();
    const [tribute, setTribute] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTributeDetails();
    }, [id]);

    const fetchTributeDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${server}/tribute/details/${id}`);
            const data = await response.json();
            setTribute(data);
        } catch (error) {
            toast.error("Error fetching tribute details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Oval height={80} width={80} color="blue" />
            </div>
        );
    }

    if (!tribute) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">

            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-medium text-gray-600">{tribute.title}</h1>
                    <p className="text-sm text-gray-400">PREVIEW</p>
                    <div className="mt-4">
                        <h2 className="text-blue-500 font-medium">{`${tribute.first_name} ${tribute.last_name}`}</h2>
                        <p className="text-sm text-gray-500">{tribute.country_lived}</p>
                        <p className="text-sm text-blue-400">{tribute.link}</p>
                    </div>
                </div>
                <div className="w-24 h-24 bg-blue-100 rounded-lg" />
            </div>

            {/* Quote Section */}
            <div className="mb-12 space-y-4">
                <blockquote className="text-xl text-gray-600 italic">
                    "{tribute.quote}"
                </blockquote>
                <p className="text-sm text-gray-500">{tribute.date_of_death}</p>
            </div>

            {/* Description */}
            <div className="mb-12">
                <p className="text-gray-600">
                    {tribute.description}
                </p>
            </div>

            {/* Milestones */}
            <section className="mb-16">
                <h3 className="text-2xl text-blue-500 mb-6">
                    {tribute.milestones_title}
                </h3>
                <p className="text-gray-600 mb-8">
                    {tribute.milestones_description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    {tribute.stats && tribute.stats.map((stat, index) => (
                        <Card key={index} className={`text-center p-6 ${stat.highlight ? 'bg-blue-500 text-white' : ''}`}>
                            <CardContent className="space-y-2">
                                <p className="text-4xl font-bold">{stat.value}</p>
                                <p className="text-sm">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {tribute.profile && tribute.profiles.map((profile, index) => (
                        <Card key={index} className="bg-blue-50 p-4">
                            <CardContent className="flex items-center justify-center min-h-[100px]">
                                <span className="text-blue-500">{profile.name}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Latest News */}
            <section className="mb-16">
                <h4 className="text-sm text-blue-500 uppercase mb-4">Latest News</h4>
                {tribute.new && tribute.news.map((newsItem, index) => (
                    <Card key={index} className="mb-8">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-6">
                                <h5 className="text-blue-500 mb-4">{newsItem.title}</h5>
                                <p className="text-gray-600 text-sm mb-4">{newsItem.content}</p>
                                <div className="flex items-center gap-4">
                                    <Heart className="w-4 h-4 text-blue-500" />
                                    <Users className="w-4 h-4 text-blue-500" />
                                </div>
                            </div>
                            <div className="bg-blue-100 min-h-[200px]" />
                        </div>
                    </Card>
                ))}
            </section>

            {/* Testimonial */}
            <section className="mb-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 min-h-[200px]" />
                    <Card className="bg-blue-100 p-6">
                        <CardContent className="flex flex-col items-center text-center">
                            <Avatar className="w-12 h-12 mb-4">
                                <AvatarFallback>
                                    <User className="w-6 h-6" />
                                </AvatarFallback>
                            </Avatar>
                            <h5 className="font-medium mb-2">Name Surname</h5>
                            <p className="text-sm text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between mt-16">
                <Link to={`/dashboard/memories/music-theme/${id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                        MUSIC THEME
                    </Button>
                </Link>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-between mt-10">
                <Button className="bg-blue-500 hover:bg-blue-600">
                    SAVE
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                    SAVE AND SHARE
                </Button>
            </div>
        </div>
    );
}