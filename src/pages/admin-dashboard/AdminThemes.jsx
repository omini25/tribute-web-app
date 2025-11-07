import React, { useState, useEffect } from 'react';
import ThemeBuilder from './ThemeBuilder';
import ThemeEditor from './ThemeEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Loader2 } from 'lucide-react';
import {server} from "@/server.js";

const AdminThemes = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'edit'
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const response = await fetch(`${server}/themes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                // Check if the themes array is directly in the response or nested under 'data'
                if (Array.isArray(result)) {
                    setThemes(result);
                } else if (result && typeof result === 'object' && Array.isArray(result.data)) {
                    // If the backend returns an object like { success: true, data: [...] }
                    setThemes(result.data);
                } else {
                    // Default to an empty array if data is not in an expected format
                    console.warn('API returned unexpected data format for themes:', result);
                    setThemes([]);
                }
            } catch (err) {
                setError('Failed to fetch themes.');
                console.error('Error fetching themes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchThemes();
    }, []);

    const handleEdit = (themeId) => {
        setSelectedTheme(themeId);
        setView('edit');
    };

    if (view === 'create') {
        return <ThemeBuilder setView={setView} />;
    }

    if (view === 'edit') {
        return <ThemeEditor themeId={selectedTheme} setView={setView} />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8 bg-white shadow-lg rounded-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-3xl font-bold text-gray-800">Theme Manager</CardTitle>
                            <CardDescription className="text-gray-500">Create, edit, and manage tribute themes.</CardDescription>
                        </div>
                        <Button onClick={() => setView('create')} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                            <Plus className="h-5 w-5 mr-2" />
                            Create New Theme
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {loading && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {themes.map((theme) => (
                        <Card key={theme.name} className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-gray-700">{theme.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 mb-4 rounded-md p-4 border" style={{ backgroundColor: theme.colors?.background || '#ffffff' }}>
                                    <div className="h-full flex flex-col justify-between">
                                        <p style={{ color: theme.colors?.text || '#000000' }}>Primary Text</p>
                                        <div className="flex justify-end">
                                            <div className="w-1/2 h-8 rounded" style={{ backgroundColor: theme.colors?.primary || '#f4b400' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={() => handleEdit(theme.id)}
                                        variant="outline"
                                        className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminThemes;