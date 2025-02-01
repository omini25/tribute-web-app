import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import {toast} from "react-hot-toast";
import {server} from "@/server.js";
import axios from "axios";

export default function MemoriesMusicTheme() {
    const { id } = useParams();
    const [tribute, setTribute] = useState({
        music_option: false,
        defaultMusic: false,
        theme: '',
        music: null
    });
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("TRIBUTE")

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"))
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        try {
            const response = await fetch(`${server}/tribute/details/${id}`);
            const data = await response.json();
            setTribute({
                music_option: data.no_music,
                defaultMusic: data.default_music,
                theme: data.theme || '',
                music: null 
            });
        } catch (error) {
            console.error("Error fetching tribute details:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTribute({ ...tribute, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setTribute({ ...tribute, [name]: checked });
    };

    const handleFileChange = (e) => {
        setTribute({ ...tribute, music: e.target.files[0] });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('no_music', tribute.music_option);
        formData.append('default_music', tribute.defaultMusic);
        formData.append('theme', tribute.theme);
        if (tribute.music) {
            formData.append('music_file', tribute.music);
        }

        try {
            const response = await fetch(`/tributes/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                toast.success("Tribute updated successfully!");
            } else {
                toast.error(result.message || "Failed to update tribute.");
            }
        } catch (error) {
            toast.error("Failed to update tribute.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-medium text-gray-600">{title}</h1>
                <h2 className="text-2xl text-gray-500">THEME AND MUSIC</h2>
            </div>

            {/* Music Options */}
            <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="music_option"
                        name="music_option"
                        checked={tribute.music_option}
                        onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="music_option" className="text-blue-500">
                        No Music
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="defaultMusic"
                        name="defaultMusic"
                        checked={tribute.defaultMusic}
                        onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="defaultMusic" className="text-blue-500">
                        Default Music
                    </Label>
                </div>
            </div>

            {/* Upload Music Button */}
            <div className="mb-12">
                <Button
                    variant="outline"
                    className="h-16 w-full md:w-auto border-2 border-dashed border-blue-300 text-blue-500 hover:bg-blue-50"
                >
                    <Upload className="w-4 h-4 mr-2"/>
                    <input type="file" onChange={handleFileChange} accept="audio/*" />
                </Button>
            </div>

            {/* Theme Selection */}
            <div className="space-y-6 mb-12">
                <h3 className="text-xl text-gray-500">SELECT THEME</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Theme Card 1 */}
                    <Card
                        className={`overflow-hidden relative ${tribute.theme === 'Warm' ? 'border-2 border-blue-500' : ''}`}
                        onClick={() => setTribute({ ...tribute, theme: 'Warm' })}
                        style={{ backgroundColor: '#FFA07A' }} // Warm color
                    >
                        {tribute.theme === 'Warm' && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-lg">Selected</span>
                            </div>
                        )}
                        <CardHeader className="bg-blue-100 p-4">
                            <div className="space-y-1">
                                <h4 className="text-blue-500">Warm</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-square bg-blue-50">
                                <img src="/path/to/warm-image.jpg" alt="Warm" className="w-full h-full object-cover" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Theme Card 2 */}
                    <Card
                        className={`overflow-hidden relative ${tribute.theme === 'Cool' ? 'border-2 border-blue-500' : ''}`}
                        onClick={() => setTribute({ ...tribute, theme: 'Cool' })}
                        style={{ backgroundColor: '#00BFFF' }} // Cool color
                    >
                        {tribute.theme === 'Cool' && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-lg">Selected</span>
                            </div>
                        )}
                        <CardHeader className="bg-blue-100 p-4">
                            <div className="space-y-1">
                                <h4 className="text-blue-500">Cool</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-square bg-blue-50">
                                <img src="/path/to/cool-image.jpg" alt="Cool" className="w-full h-full object-cover" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Theme Card 3 */}
                    <Card
                        className={`overflow-hidden relative ${tribute.theme === 'Autumn' ? 'border-2 border-orange-500' : ''}`}
                        onClick={() => setTribute({ ...tribute, theme: 'Autumn' })}
                        style={{ backgroundColor: '#FF7F50' }} // Autumn color
                    >
                        {tribute.theme === 'Autumn' && (
                            <div className="absolute inset-0 bg-orange-500 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-lg">Selected</span>
                            </div>
                        )}
                        <CardHeader className="bg-orange-100 p-4">
                            <div className="space-y-1">
                                <h4 className="text-blue-500">Autumn</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-square bg-blue-50">
                                <img src="/path/to/autumn-image.jpg" alt="Autumn" className="w-full h-full object-cover" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-8">
                <Button
                    onClick={handleSubmit}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]"
                >
                    {loading ? <Oval height={24} width={24} color="white" /> : "Save"}
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-16">
                <Link to={`/dashboard/memories/donations/${id}`}>
                    <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]">
                        Donations
                    </Button>
                </Link>
                <Link to={`/dashboard/preview/${id}`}>
                    <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 min-w-[120px]">
                        Preview
                    </Button>
                </Link>
            </div>
        </div>
    );
}