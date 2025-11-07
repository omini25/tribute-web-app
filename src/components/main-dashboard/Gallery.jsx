import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { server } from '../../server';
import { Image as ImageIcon, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(null);

    const userData = useMemo(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    }, []);

    const apiClient = useMemo(() => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return axios.create({
            baseURL: server,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
    }, []);

    const fetchGallery = async () => {
        if (!apiClient || !userData?.id) {
            setError("You must be logged in to view the gallery.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/memories/all/user/${userData.id}`);
            // Ensure we are setting an array to the gallery state
            const galleryData = response.data.data || response.data;
            setGallery(Array.isArray(galleryData) ? galleryData : []);
        } catch (err) {
            console.error("Failed to fetch gallery:", err);
            setError("Failed to load gallery images. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [apiClient, userData?.id]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleUpload(files);
        }
    };

    const handleUpload = async (files) => {
        if (!apiClient || !userData?.id) {
            setUploadError("You must be logged in to upload images.");
            return;
        }
        setUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images[]', file);
        });

        try {
            await apiClient.post(`/memories/all/user/${userData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
            fetchGallery();
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadError(err.response?.data?.message || "An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId) => {
        if (!apiClient || !window.confirm("Are you sure you want to delete this image?")) {
            return;
        }
        try {
            await apiClient.delete(`/gallery/${imageId}`);
            setGallery(gallery.filter(image => image.id !== imageId));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete image. Please try again.");
        }
    };

    const renderEmptyState = () => (
        <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-800">No Images in Gallery</h3>
            {/*<p className="mt-1 text-sm text-slate-500">Upload the first image to get started.</p>*/}
            {/*<div className="mt-6">*/}
            {/*    <Button onClick={() => document.getElementById('file-upload').click()}>*/}
            {/*        <Upload className="h-4 w-4 mr-2" />*/}
            {/*        Upload Images*/}
            {/*    </Button>*/}
            {/*</div>*/}
        </div>
    );

    return (
        <div className="p-4 sm:p-6">
            <Card className="bg-white shadow-sm border-slate-200">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Photo Gallery</h2>
                            <p className="text-sm text-slate-500 mt-1">A collection of cherished moments.</p>
                        </div>
                        {/*<div className="mt-4 sm:mt-0">*/}
                        {/*    <input*/}
                        {/*        type="file"*/}
                        {/*        id="file-upload"*/}
                        {/*        multiple*/}
                        {/*        accept="image/*"*/}
                        {/*        className="hidden"*/}
                        {/*        onChange={handleFileChange}*/}
                        {/*        disabled={uploading}*/}
                        {/*    />*/}
                        {/*    <Button */}
                        {/*        onClick={() => document.getElementById('file-upload').click()}*/}
                        {/*        disabled={uploading}*/}
                        {/*        className="w-full sm:w-auto"*/}
                        {/*    >*/}
                        {/*        {uploading ? (*/}
                        {/*            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>*/}
                        {/*        ) : (*/}
                        {/*            <><Upload className="h-4 w-4 mr-2" /> Upload Images</>*/}
                        {/*        )}*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>

                    {uploading && (
                        <div className="mb-4 p-4 border rounded-lg bg-slate-50">
                            <p className="text-sm font-medium text-slate-700 mb-2">Upload in progress...</p>
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-xs text-slate-500 mt-1 text-center">{uploadProgress}%</p>
                        </div>
                    )}

                    {uploadError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{uploadError}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-square bg-slate-200 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : gallery.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gallery.map((image) => (
                                <div key={image.id} className="relative group aspect-square">
                                    <img 
                                        src={image.image_url} 
                                        alt="Gallery item" 
                                        className="w-full h-full object-cover rounded-lg shadow-md"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100"
                                            onClick={() => handleDelete(image.id)}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Gallery;
