import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Image,
    FileText,
    Users,
    Calendar,
    Camera,
    MessageCircle,
    Heart,
    MapPin,
    Clock,
    CheckSquare,
    Circle,
    TextCursorInput,
    Layout,
    Palette,
    Eye,
    Share,
    Download,
    Edit
} from 'lucide-react';
import {server} from "@/server.js";

// Map section IDs to icons
const SECTION_ICONS = {
    hero: Image,
    about: FileText,
    birth: Circle,
    death: Circle,
    family: Users,
    milestones: CheckSquare,
    memories: MessageCircle,
    gallery: Camera,
    events: Calendar,
    contribute: TextCursorInput,
    donation: Heart
};

const TributeTheme = () => {
    const { tributeId } = useParams();
    const [theme, setTheme] = useState(null);
    const [tributeData, setTributeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('preview');

    useEffect(() => {
        const fetchThemeData = async () => {
            try {
                const response = await fetch(`${server}/tributes/${tributeId}/theme`);
                if (!response.ok) {
                    throw new Error('Failed to fetch theme data');
                }
                const data = await response.json();
                setTheme(data.theme);
                setTributeData(data.tribute);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchThemeData();
    }, [tributeId]);

    const getSectionIcon = (sectionId) => {
        const IconComponent = SECTION_ICONS[sectionId] || FileText;
        return <IconComponent className="w-4 h-4" />;
    };

    const getWidthClass = (width) => {
        switch (width) {
            case 'half': return 'w-1/2';
            case 'third': return 'w-1/3';
            case 'twoThirds': return 'w-2/3';
            default: return 'w-full';
        }
    };

    const renderSectionPreview = (section) => {
        const sectionData = tributeData?.sections?.[section.id] || {};

        return (
            <div key={section.id} className={`${getWidthClass(section.width)} p-2`}>
                <Card
                    className="h-32 transition-all hover:shadow-md"
                    style={{
                        backgroundColor: theme.colors.card,
                        borderColor: `${theme.colors.primary}20`
                    }}
                >
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-2">
                            {getSectionIcon(section.id)}
                            <h3
                                className="font-medium text-sm"
                                style={{ color: theme.colors.primary }}
                            >
                                {section.title || section.name}
                            </h3>
                        </div>

                        <div className="text-xs text-gray-500 truncate">
                            {sectionData.content || section.description || 'Content will appear here'}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <Badge
                                variant="outline"
                                className="text-xs capitalize"
                                style={{
                                    borderColor: theme.colors.accent,
                                    color: theme.colors.accent
                                }}
                            >
                                {section.width}
                            </Badge>
                            {section.type === 'custom' && (
                                <Badge variant="secondary" className="text-xs">
                                    Custom
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderBanner = () => {
        if (!theme.layout.find(section => section.id === 'hero')) return null;

        const bannerData = tributeData?.sections?.hero || {};
        const bannerStyle = theme.banner_style || 'classic';

        const getBannerStyle = () => {
            const styles = {
                classic: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.3)'
                },
                minimal: {
                    background: '#f8fafc',
                    textColor: '#1e293b',
                    overlay: 'rgba(255,255,255,0.1)'
                },
                elegant: {
                    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.4)'
                },
                natural: {
                    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.2)'
                },
                warm: {
                    background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                    textColor: '#ffffff',
                    overlay: 'rgba(0,0,0,0.2)'
                }
            };
            return styles[bannerStyle] || styles.classic;
        };

        const bannerStyleConfig = getBannerStyle();

        return (
            <div
                className="h-80 rounded-lg mb-8 flex items-center justify-center p-6 relative overflow-hidden"
                style={{ background: bannerStyleConfig.background }}
            >
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: bannerStyleConfig.overlay }}
                />

                <div className="text-center relative z-10 max-w-4xl mx-auto" style={{ color: bannerStyleConfig.textColor }}>
                    <h1 className="text-4xl font-bold mb-4">{bannerData.mainTitle || 'In Loving Memory'}</h1>
                    <h2 className="text-3xl font-semibold mb-3">{bannerData.personName || tributeData?.deceased_name || 'Person\'s Name'}</h2>
                    <p className="text-xl opacity-90 mb-4">
                        {bannerData.dates || `${tributeData?.birth_date || 'Birth'} - ${tributeData?.death_date || 'Passing'}`}
                    </p>
                    {bannerData.quote && (
                        <p className="text-lg italic opacity-80 max-w-2xl mx-auto">
                            "{bannerData.quote}"
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const renderThemePreview = () => (
        <div
            className="min-h-screen rounded-lg border-2 p-6"
            style={{
                background: theme.colors.background,
                color: theme.colors.text,
                borderColor: `${theme.colors.primary}20`
            }}
        >
            {/* Layout Type Indicator */}
            <div className="text-center mb-6">
                <Badge
                    variant="outline"
                    className="mb-2"
                    style={{
                        borderColor: theme.colors.accent,
                        color: theme.colors.accent
                    }}
                >
                    {theme.layout_type === 'single' ? 'Single Page Layout' : 'Tabbed Layout'}
                </Badge>
                <h2 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
                    {tributeData?.title || 'Memorial Tribute'}
                </h2>
            </div>

            {/* Hero Banner */}
            {renderBanner()}

            {/* Main Content Layout */}
            <div className={`${theme.layout_type === 'tabs' ? 'bg-white/80 rounded-lg p-4' : ''}`}>
                {theme.layout_type === 'tabs' && (
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {theme.layout.map((section, index) => (
                            <Button
                                key={section.id}
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap"
                                style={{
                                    borderColor: theme.colors.primary,
                                    color: theme.colors.primary
                                }}
                            >
                                {section.title || section.name}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Sections Grid */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {theme.layout.map(renderSectionPreview)}
                </div>
            </div>

            {/* Footer */}
            <div
                className="mt-8 pt-6 border-t text-center text-sm"
                style={{ borderColor: `${theme.colors.primary}20` }}
            >
                <p style={{ color: theme.colors.text }}>
                    Created with {theme.name} Theme • {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );

    const renderThemeDetails = () => (
        <div className="space-y-6">
            {/* Theme Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Theme Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Theme Name</label>
                            <p className="font-medium">{theme.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Layout Type</label>
                            <p className="font-medium capitalize">{theme.layout_type}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Banner Style</label>
                            <p className="font-medium capitalize">{theme.banner_style}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Allowed Plans</label>
                            <div className="flex gap-1 flex-wrap">
                                {theme.allowed_plans?.map(plan => (
                                    <Badge key={plan} variant="secondary" className="text-xs">
                                        {plan}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card>
                <CardHeader>
                    <CardTitle>Color Scheme</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(theme.colors).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded border"
                                    style={{ backgroundColor: value }}
                                />
                                <div>
                                    <p className="text-sm font-medium capitalize">{key}</p>
                                    <p className="text-xs text-gray-500">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Layout Sections */}
            <Card>
                <CardHeader>
                    <CardTitle>Layout Sections</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {theme.layout.map((section, index) => (
                            <div
                                key={section.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    {getSectionIcon(section.id)}
                                    <div>
                                        <p className="font-medium">{section.title || section.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {section.description || `Custom ${section.type} section`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="capitalize">
                                        {section.width}
                                    </Badge>
                                    {section.type === 'custom' && (
                                        <Badge variant="secondary">Custom</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tribute Information */}
            {tributeData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Tribute Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Deceased Name</label>
                                <p className="font-medium">{tributeData.deceased_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Birth Date</label>
                                <p className="font-medium">{tributeData.birth_date || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Death Date</label>
                                <p className="font-medium">{tributeData.death_date || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Created By</label>
                                <p className="font-medium">{tributeData.creator_name || 'Unknown'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading theme...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Error</div>
                    <p className="text-gray-600">{error}</p>
                    <Button className="mt-4" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!theme) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-gray-500 text-xl mb-4">No Theme Found</div>
                    <p className="text-gray-600">No theme has been selected for this tribute.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {tributeData?.title || 'Memorial Tribute'}
                        </h1>
                        <p className="text-gray-600">
                            Viewing theme: <span className="font-medium">{theme.name}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button>
                            <Edit className="w-4 h-4 mr-2" />
                            Customize
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                        </TabsTrigger>
                        <TabsTrigger value="details" className="flex items-center gap-2">
                            <Layout className="w-4 h-4" />
                            Details
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="mt-6">
                        <Card>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[800px]">
                                    {renderThemePreview()}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details" className="mt-6">
                        <ScrollArea className="h-[800px]">
                            {renderThemeDetails()}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default TributeTheme;