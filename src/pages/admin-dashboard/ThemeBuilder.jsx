import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    GripVertical,
    Eye,
    EyeOff,
    Palette,
    Layout,
    Type,
    Image,
    Save,
    Copy,
    Trash2,
    Plus,
    Settings,
    Move,
    Columns,
    Square,
    FileText,
    Link,
    CheckSquare,
    Circle,
    TextCursorInput,
    Users,
    Calendar,
    MapPin,
    Clock,
    Heart,
    Camera,
    MessageCircle,
    Star,
    Flower,
    Mountain,
    Sunset,
    Info
} from 'lucide-react';
import {server} from "@/server.js";

// Enhanced available sections with types and icons
const AVAILABLE_SECTIONS = [
    {
        id: 'hero',
        name: 'Hero Banner',
        icon: Image,
        description: 'Main banner with name and photo',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'about',
        name: 'About/Biography',
        icon: FileText,
        description: 'Life story and biography',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'birth',
        name: 'Birth Details',
        icon: Circle,
        description: 'Birth date and location',
        defaultWidth: 'half',
        canCustomize: true
    },
    {
        id: 'death',
        name: 'Death Details',
        icon: Circle,
        description: 'Death date and location',
        defaultWidth: 'half',
        canCustomize: true
    },
    {
        id: 'family',
        name: 'Family Tree',
        icon: Users,
        description: 'Family relationships',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'milestones',
        name: 'Milestones',
        icon: CheckSquare,
        description: 'Life achievements',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'memories',
        name: 'Memories',
        icon: MessageCircle,
        description: 'Shared memories and stories',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'gallery',
        name: 'Gallery',
        icon: Camera,
        description: 'Photos and videos',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'events',
        name: 'Events',
        icon: Calendar,
        description: 'Memorial events and services',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'contribute',
        name: 'Contribute Form',
        icon: TextCursorInput,
        description: 'Form for sharing memories',
        defaultWidth: 'full',
        canCustomize: true
    },
    {
        id: 'donation',
        name: 'Donation',
        icon: Heart,
        description: 'Donation information',
        defaultWidth: 'full',
        canCustomize: true
    },
];

// Plan options
const PLAN_OPTIONS = [
    { id: 'free', name: 'Free', color: 'bg-green-100 text-green-800' },
    { id: 'premium', name: 'Premium', color: 'bg-blue-100 text-blue-800' },
    { id: 'one_time', name: 'One Time', color: 'bg-purple-100 text-purple-800' },
    { id: 'lifetime', name: 'Lifetime', color: 'bg-amber-100 text-amber-800' },
    { id: 'custom', name: 'Custom', color: 'bg-gray-100 text-gray-800' },
];

// Custom field types
const CUSTOM_FIELD_TYPES = [
    { id: 'text', name: 'Text', icon: FileText, description: 'Simple text content' },
    { id: 'radio', name: 'Radio Buttons', icon: Circle, description: 'Single choice options' },
    { id: 'checkbox', name: 'Checkboxes', icon: CheckSquare, description: 'Multiple choice options' },
    { id: 'link', name: 'Link', icon: Link, description: 'External or internal link' },
    { id: 'input', name: 'Input Field', icon: TextCursorInput, description: 'Text input field' },
];

// Banner style options
const BANNER_STYLES = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Simple centered layout',
        icon: Sunset,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        overlay: 'rgba(0,0,0,0.3)'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple design',
        icon: Mountain,
        background: '#f8fafc',
        textColor: '#1e293b',
        overlay: 'rgba(255,255,255,0.1)'
    },
    {
        id: 'elegant',
        name: 'Elegant',
        description: 'Sophisticated dark theme',
        icon: Star,
        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
        textColor: '#ffffff',
        overlay: 'rgba(0,0,0,0.4)'
    },
    {
        id: 'natural',
        name: 'Natural',
        description: 'Earthy green tones',
        icon: Flower,
        background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        textColor: '#ffffff',
        overlay: 'rgba(0,0,0,0.2)'
    },
    {
        id: 'warm',
        name: 'Warm',
        description: 'Warm comforting colors',
        icon: Sunset,
        background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
        textColor: '#ffffff',
        overlay: 'rgba(0,0,0,0.2)'
    }
];

// Theme templates with enhanced structure
const THEME_TEMPLATES = {
    minimalist: {
        name: 'Minimalist',
        layoutType: 'single',
        allowedPlans: ['free', 'premium', 'one_time', 'lifetime', 'custom'],
        colors: {
            primary: '#1f2937',
            background: '#f9fafb',
            card: '#ffffff',
            text: '#374151',
            accent: '#4f46e5'
        },
        bannerStyle: 'classic',
        layout: [
            { id: 'hero', title: 'In Loving Memory', width: 'full' },
            { id: 'about', title: 'Biography', width: 'full' },
            { id: 'birth', title: 'Birth', width: 'half' },
            { id: 'death', title: 'Death', width: 'half' },
            { id: 'family', title: 'Family', width: 'full' }
        ]
    },
    modern: {
        name: 'Modern',
        layoutType: 'tabs',
        allowedPlans: ['free', 'premium', 'one_time', 'lifetime', 'custom'],
        colors: {
            primary: '#dc2626',
            background: 'linear-gradient(to bottom right, #f1f5f9, #fecdd3)',
            card: '#ffffff',
            text: '#1e293b',
            accent: '#dc2626'
        },
        bannerStyle: 'elegant',
        layout: [
            { id: 'hero', title: 'Hero Banner', width: 'full' },
            { id: 'about', title: 'Life Story', width: 'full' },
            { id: 'gallery', title: 'Gallery', width: 'full' }
        ]
    }
};

// Custom section modal component
const CustomSectionModal = ({ isOpen, onClose, onAdd, section = null }) => {
    const [formData, setFormData] = useState({
        name: section?.name || '',
        type: section?.type || 'text',
        content: section?.content || '',
        options: section?.options || [''],
        width: section?.width || 'full',
    });

    const handleAddOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleRemoveOption = (index) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        const customSection = {
            id: section?.id || `custom_${Date.now()}`,
            type: 'custom',
            name: formData.name,
            customType: formData.type,
            content: formData.content,
            options: formData.type === 'radio' || formData.type === 'checkbox' ? formData.options : [],
            width: formData.width,
            title: formData.name
        };

        onAdd(customSection);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                <CardHeader>
                    <CardTitle>{section ? 'Edit Custom Section' : 'Add Custom Section'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Section Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter section name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Field Type</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CUSTOM_FIELD_TYPES.map(type => (
                                    <SelectItem key={type.id} value={type.id}>
                                        <div className="flex items-center gap-2">
                                            <type.icon className="w-4 h-4" />
                                            {type.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {(formData.type === 'text' || formData.type === 'input') && (
                        <div className="space-y-2">
                            <Label>{formData.type === 'text' ? 'Content' : 'Placeholder Text'}</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder={formData.type === 'text' ? 'Enter content...' : 'Enter placeholder text...'}
                                rows={4}
                            />
                        </div>
                    )}

                    {(formData.type === 'radio' || formData.type === 'checkbox') && (
                        <div className="space-y-2">
                            <Label>Options</Label>
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                    />
                                    {formData.options.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveOption(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={handleAddOption}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                            </Button>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Width</Label>
                        <Select value={formData.width} onValueChange={(value) => setFormData(prev => ({ ...prev, width: value }))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full">Full Width</SelectItem>
                                <SelectItem value="half">Half Width</SelectItem>
                                <SelectItem value="third">One Third</SelectItem>
                                <SelectItem value="twoThirds">Two Thirds</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardContent className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
                        {section ? 'Update' : 'Add'} Section
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

// Enhanced draggable section component with fixed drag and drop
const DraggableSection = ({ section, index, moveSection, onEdit, onRemove, isInLayout = false }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'section',
        item: { id: section.id, index, section, isInLayout },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: 'section',
        hover: (item) => {
            if (item.index !== index && isInLayout && item.isInLayout) {
                moveSection(item.index, index);
                item.index = index;
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const SectionIcon = section.icon || FileText;
    const isCustom = section.type === 'custom';

    return (
        <div
            ref={isInLayout ? drop : null}
            className={`relative group p-3 rounded-lg border-2 transition-all ${
                isDragging ? 'opacity-50 bg-gray-100 border-dashed' : 'bg-white border-solid'
            } ${isOver && isInLayout ? 'border-blue-400 bg-blue-50' : 'border-gray-200'} ${
                isInLayout ? 'cursor-move' : 'cursor-grab'
            }`}
        >
            <div ref={drag} className="flex items-center gap-3">
                <div className="cursor-grab">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                </div>

                <SectionIcon className="h-4 w-4 text-gray-600" />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {section.title || section.name}
            </span>
                        {isCustom && (
                            <Badge variant="outline" className="text-xs">
                                Custom
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">
                            {section.width}
                        </Badge>
                    </div>
                </div>

                {isInLayout && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onEdit(section)}
                        >
                            <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => onRemove(section.id)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Section editor component
const SectionEditor = ({ section, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({
        title: section.title || section.name,
        width: section.width || 'full',
        content: section.content || '',
        options: section.options || ['']
    });

    const handleSubmit = () => {
        onUpdate({
            ...section,
            ...formData
        });
        onClose();
    };

    return (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Edit Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter section title"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Width</Label>
                    <Select value={formData.width} onValueChange={(value) => setFormData(prev => ({ ...prev, width: value }))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full">Full Width</SelectItem>
                            <SelectItem value="half">Half Width</SelectItem>
                            <SelectItem value="third">One Third</SelectItem>
                            <SelectItem value="twoThirds">Two Thirds</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {section.type === 'custom' && section.customType === 'text' && (
                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            rows={6}
                            placeholder="Enter section content..."
                        />
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Update Section
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Banner Settings Component with Placeholder Content
const BannerSettings = ({ bannerStyle, setBannerStyle }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Banner Settings</CardTitle>
                <CardDescription>Choose a banner style. Users will fill in their own content when using this theme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Banner Style Selection */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">Banner Style</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {BANNER_STYLES.map((style) => (
                            <div
                                key={style.id}
                                className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    bannerStyle === style.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setBannerStyle(style.id)}
                            >
                                <div
                                    className="w-full h-20 rounded-md mb-3 flex items-center justify-center"
                                    style={{ background: style.background }}
                                >
                                    <style.icon className="w-6 h-6" style={{ color: style.textColor }} />
                                </div>
                                <span className="font-medium text-sm">{style.name}</span>
                                <p className="text-xs text-gray-600 mt-1">{style.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Banner Content Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Info className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-900">Banner Content</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Users will be able to fill in their own memorial details including name, dates, photos, and personalized messages when they use this theme template.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Layout Settings Component
const LayoutSettings = ({ layoutType, setLayoutType, allowedPlans, setAllowedPlans }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Layout Type Selection */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">Layout Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                layoutType === 'single'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setLayoutType('single')}
                        >
                            <Square className="w-8 h-8 mb-2" />
                            <span className="font-medium">Single Page</span>
                            <p className="text-sm text-gray-600 text-center mt-1">All content on one scrollable page</p>
                        </div>
                        <div
                            className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                layoutType === 'tabs'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setLayoutType('tabs')}
                        >
                            <Columns className="w-8 h-8 mb-2" />
                            <span className="font-medium">Tabbed Layout</span>
                            <p className="text-sm text-gray-600 text-center mt-1">Content organized in tabs</p>
                        </div>
                    </div>
                </div>

                {/* Allowed Plans */}
                <div className="space-y-3">
                    <Label className="text-base font-medium">Allowed Plans</Label>
                    <div className="space-y-2">
                        {PLAN_OPTIONS.map(plan => (
                            <div key={plan.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                                <Checkbox
                                    id={`layout-plan-${plan.id}`}
                                    checked={allowedPlans.includes(plan.id)}
                                    onCheckedChange={(checked) => {
                                        setAllowedPlans(prev =>
                                            checked
                                                ? [...prev, plan.id]
                                                : prev.filter(p => p !== plan.id)
                                        );
                                    }}
                                />
                                <Label htmlFor={`layout-plan-${plan.id}`} className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{plan.name}</span>
                                        <Badge className={plan.color}>
                                            {plan.name}
                                        </Badge>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced Preview Component without top navigation and with placeholder content
const ThemePreview = ({ theme, layout, colors, layoutType, currentLayout, bannerStyle }) => {
    const renderSectionPreview = (section) => {
        const sectionInfo = AVAILABLE_SECTIONS.find(s => s.id === section.id) || section;
        const SectionIcon = sectionInfo.icon || FileText;

        const getWidthClass = (width) => {
            switch (width) {
                case 'half': return 'w-1/2';
                case 'third': return 'w-1/3';
                case 'twoThirds': return 'w-2/3';
                default: return 'w-full';
            }
        };

        return (
            <div
                key={section.id}
                className={`${getWidthClass(section.width)} p-2`}
            >
                <div
                    className="p-4 rounded-lg border h-24 flex flex-col justify-between"
                    style={{
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: `${colors.primary}20`
                    }}
                >
                    <div className="flex items-center gap-2">
                        <SectionIcon className="w-4 h-4" style={{ color: colors.primary }} />
                        <span className="text-sm font-medium truncate" style={{ color: colors.primary }}>
              {section.title || section.name}
            </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                        {sectionInfo.description}
                    </div>
                    <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs capitalize">
                            {section.width}
                        </Badge>
                        {section.type === 'custom' && (
                            <Badge variant="secondary" className="text-xs">
                                Custom
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getBannerStyle = () => {
        const style = BANNER_STYLES.find(s => s.id === bannerStyle) || BANNER_STYLES[0];
        return {
            background: style.background,
            color: style.textColor,
            overlay: style.overlay
        };
    };

    const bannerStyleConfig = getBannerStyle();

    return (
        <div
            className="min-h-screen rounded-lg border-2 p-6"
            style={{
                background: colors.background,
                color: colors.text,
                borderColor: `${colors.primary}20`
            }}
        >
            {/* Layout Type Indicator */}
            <div className="text-center mb-6">
                <Badge variant="outline" className="mb-2">
                    {layoutType === 'single' ? 'Single Page Layout' : 'Tabbed Layout'}
                </Badge>
            </div>

            {/* Hero Section with customizable banner and placeholder content */}
            {currentLayout.find(s => s.id === 'hero') && (
                <div
                    className="h-64 rounded-lg mb-8 flex items-center justify-center p-6 relative overflow-hidden"
                    style={{ background: bannerStyleConfig.background }}
                >
                    {/* Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: bannerStyleConfig.overlay }}
                    />

                    {/* Banner Content with Placeholders */}
                    <div className="text-center relative z-10 max-w-2xl mx-auto" style={{ color: bannerStyleConfig.color }}>
                        <h1 className="text-3xl font-bold mb-2">In Loving Memory</h1>
                        <h2 className="text-2xl font-semibold mb-2">[Person's Full Name]</h2>
                        <p className="text-lg opacity-90 mb-3">[Birth Year] - [Passing Year]</p>
                        <p className="text-sm italic opacity-80 max-w-md mx-auto">
                            "A meaningful quote or message will appear here"
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Layout */}
            <div className={`${layoutType === 'tabs' ? 'bg-white/80 rounded-lg p-4' : ''}`}>
                {layoutType === 'tabs' && (
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {['Story', 'Gallery', 'Family', 'Memories'].map(tab => (
                            <Button
                                key={tab}
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.primary
                                }}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Sections Grid */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {currentLayout.map(renderSectionPreview)}
                </div>

                {/* Layout Info */}
                <div className="text-center p-4 rounded-lg bg-gray-50/50">
                    <p className="text-sm text-gray-600">
                        This preview shows the <strong>{layoutType} layout</strong> with{' '}
                        <strong>{currentLayout.length} sections</strong> arranged in the configured order.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Users will fill in actual memorial content when using this theme.
                    </p>
                </div>
            </div>

            {/* Footer Preview */}
            <div
                className="mt-8 pt-6 border-t text-center text-sm"
                style={{ borderColor: `${colors.primary}20` }}
            >
                <p style={{ color: colors.text }}>
                    © {new Date().getFullYear()} {theme} Memorial Theme. All rights reserved.
                </p>
            </div>
        </div>
    );
};

// Save Theme Function
const saveTheme = async (themeData) => {
    try {
        const csrfTokenEl = document.querySelector('meta[name="csrf-token"]');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (csrfTokenEl) {
            headers['X-CSRF-TOKEN'] = csrfTokenEl.getAttribute('content');
        }

        const response = await fetch(`${server}/themes`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(themeData)
        });

        if (!response.ok) {
            throw new Error('Failed to save theme');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving theme:', error);
        throw error;
    }
};

const ThemeBuilderInternal = ({ setView, themeToEdit = null }) => {
    const [themeName, setThemeName] = useState('My Custom Theme');
    const [activeTab, setActiveTab] = useState('layout');
    const [currentLayout, setCurrentLayout] = useState(THEME_TEMPLATES.minimalist.layout);
    const [colors, setColors] = useState(THEME_TEMPLATES.minimalist.colors);
    const [layoutType, setLayoutType] = useState('single');
    const [allowedPlans, setAllowedPlans] = useState(['free', 'premium', 'one_time', 'lifetime', 'custom']);
    const [isLivePreview, setIsLivePreview] = useState(true);
    const [customSectionModal, setCustomSectionModal] = useState({ open: false, section: null });
    const [editingSection, setEditingSection] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // New state for banner customization
    const [bannerStyle, setBannerStyle] = useState('classic');

    useEffect(() => {
        if (themeToEdit) {
            setThemeName(themeToEdit.name);
            setCurrentLayout(themeToEdit.layout || []);
            setColors(themeToEdit.colors || THEME_TEMPLATES.minimalist.colors);
            setLayoutType(themeToEdit.layout_type || 'single');
            setAllowedPlans(themeToEdit.allowed_plans || []);
            setBannerStyle(themeToEdit.banner_style || 'classic');
        }
    }, [themeToEdit]);

    const [{ isOverLayout, canDropLayout }, dropLayout] = useDrop(() => ({
        accept: 'section',
        drop: (item) => {
            if (!item.isInLayout) {
                addSection(item.section);
            }
        },
        canDrop: (item) => {
            const isAvailable = !item.isInLayout;
            const notInLayout = !currentLayout.find(s => s.id === item.id);
            return isAvailable && notInLayout;
        },
        collect: (monitor) => ({
            isOverLayout: monitor.isOver(),
            canDropLayout: monitor.canDrop(),
        }),
    }));

    // Move sections in layout - FIXED DRAG AND DROP
    const moveSection = useCallback((fromIndex, toIndex) => {
        setCurrentLayout(prev => {
            const newLayout = [...prev];
            const [movedItem] = newLayout.splice(fromIndex, 1);
            newLayout.splice(toIndex, 0, movedItem);
            return newLayout;
        });
    }, []);

    // Add section to layout
    const addSection = (section) => {
        const sectionConfig = {
            ...section,
            title: section.title || section.name,
            width: section.width || 'full'
        };

        setCurrentLayout(prev => [...prev, sectionConfig]);
    };

    // Remove section from layout
    const removeSection = (sectionId) => {
        setCurrentLayout(prev => prev.filter(section => section.id !== sectionId));
    };

    // Update section
    const updateSection = (updatedSection) => {
        setCurrentLayout(prev =>
            prev.map(section =>
                section.id === updatedSection.id ? updatedSection : section
            )
        );
    };

    // Add custom section
    const handleAddCustomSection = (customSection) => {
        addSection(customSection);
    };

    // Apply template
    const applyTemplate = (templateKey) => {
        const template = THEME_TEMPLATES[templateKey];
        setColors(template.colors);
        setCurrentLayout(template.layout);
        setLayoutType(template.layoutType);
        setAllowedPlans(template.allowedPlans);
        setThemeName(template.name);
        setBannerStyle(template.bannerStyle || 'classic');
    };

    // Handle color change
    const handleColorChange = (colorKey, value) => {
        setColors(prev => ({
            ...prev,
            [colorKey]: value
        }));
    };

    // Handle save theme
    const handleSaveTheme = async () => {
        setIsSaving(true);
        try {
            const themeData = {
                name: themeName,
                layout: currentLayout,
                colors: colors,
                layout_type: layoutType,
                allowed_plans: allowedPlans,
                banner_style: bannerStyle,
                is_active: true,
                is_template: true // Mark as template for users to customize
            };

            await saveTheme(themeData);

            // Show success message or redirect
            alert('Theme saved successfully!');
            setView('list'); // Redirect back to themes list
        } catch (error) {
            alert('Error saving theme. Please try again.');
            console.error('Save theme error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Available sections (not in current layout)
    const availableSections = AVAILABLE_SECTIONS.filter(
        section => !currentLayout.find(s => s.id === section.id)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Theme Builder</h1>
                        <p className="text-gray-600">Create and customize tribute themes</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setView('list')}>
                            Back to Themes
                        </Button>
                        <Button
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={handleSaveTheme}
                            disabled={isSaving}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Theme'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Left Sidebar - Templates & Sections */}
                    <div className="space-y-6">
                        {/* Theme Templates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Templates</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {Object.entries(THEME_TEMPLATES).map(([key, template]) => (
                                    <Button
                                        key={key}
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => applyTemplate(key)}
                                    >
                                        {template.name}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Available Sections */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Available Sections</CardTitle>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCustomSectionModal({ open: true, section: null })}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Custom
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-96">
                                    <div className="space-y-2">
                                        {availableSections.map((section, index) => (
                                            <DraggableSection
                                                key={section.id}
                                                section={section}
                                                index={index}
                                                moveSection={moveSection}
                                                onEdit={() => addSection(section)}
                                                onRemove={removeSection}
                                                isInLayout={false}
                                            />
                                        ))}
                                        {availableSections.length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-4">
                                                All sections are in use
                                            </p>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content - Builder & Preview */}
                    <div className="xl:col-span-3">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Theme Builder</CardTitle>
                                        <CardDescription>
                                            Drag and drop sections to build your theme template
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={themeName}
                                            onChange={(e) => setThemeName(e.target.value)}
                                            className="w-48"
                                            placeholder="Theme name"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsLivePreview(!isLivePreview)}
                                        >
                                            {isLivePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="layout" className="flex items-center gap-2">
                                            <Layout className="w-4 h-4" />
                                            Layout
                                        </TabsTrigger>
                                        <TabsTrigger value="banner" className="flex items-center gap-2">
                                            <Image className="w-4 h-4" />
                                            Banner
                                        </TabsTrigger>
                                        <TabsTrigger value="settings" className="flex items-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </TabsTrigger>
                                        <TabsTrigger value="preview" className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Layout Tab */}
                                    <TabsContent value="layout" className="space-y-4">
                                        {editingSection ? (
                                            <SectionEditor
                                                section={editingSection}
                                                onUpdate={updateSection}
                                                onClose={() => setEditingSection(null)}
                                            />
                                        ) : (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Current Layout</CardTitle>
                                                    <CardDescription>
                                                        Drag to reorder sections, click settings to customize each section
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-0">
                                                    <div
                                                        ref={dropLayout}
                                                        className={`p-4 rounded-b-lg transition-colors ${
                                                            isOverLayout && canDropLayout ? 'bg-blue-50' : ''
                                                        }`}
                                                    >
                                                        <div className="space-y-4 min-h-[100px]">
                                                            {currentLayout.map((section, index) => {
                                                                const sectionInfo = AVAILABLE_SECTIONS.find(s => s.id === section.id) || section;
                                                                return (
                                                                    <DraggableSection
                                                                        key={section.id}
                                                                        section={{ ...sectionInfo, ...section }}
                                                                        index={index}
                                                                        moveSection={moveSection}
                                                                        onEdit={setEditingSection}
                                                                        onRemove={removeSection}
                                                                        isInLayout={true}
                                                                    />
                                                                );
                                                            })}
                                                            {currentLayout.length === 0 && (
                                                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                                                    <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                                    <p className="text-gray-500 mb-2">No sections added yet</p>
                                                                    <p className="text-sm text-gray-400">
                                                                        Drag sections from the left or create custom sections
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    {/* Banner Tab */}
                                    <TabsContent value="banner" className="space-y-6">
                                        <BannerSettings
                                            bannerStyle={bannerStyle}
                                            setBannerStyle={setBannerStyle}
                                        />
                                    </TabsContent>

                                    {/* Settings Tab */}
                                    <TabsContent value="settings" className="space-y-6">
                                        <LayoutSettings
                                            layoutType={layoutType}
                                            setLayoutType={setLayoutType}
                                            allowedPlans={allowedPlans}
                                            setAllowedPlans={setAllowedPlans}
                                        />

                                        {/* Style Settings */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Style Settings</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="primary-color">Primary Color</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="primary-color"
                                                                type="color"
                                                                value={colors.primary}
                                                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                                                className="w-16 h-10"
                                                            />
                                                            <Input
                                                                value={colors.primary}
                                                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                                                placeholder="#000000"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="accent-color">Accent Color</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="accent-color"
                                                                type="color"
                                                                value={colors.accent}
                                                                onChange={(e) => handleColorChange('accent', e.target.value)}
                                                                className="w-16 h-10"
                                                            />
                                                            <Input
                                                                value={colors.accent}
                                                                onChange={(e) => handleColorChange('accent', e.target.value)}
                                                                placeholder="#000000"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="background-color">Background</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="background-color"
                                                                type="color"
                                                                value={typeof colors.background === 'string' && !colors.background.includes('gradient') ? colors.background : '#ffffff'}
                                                                onChange={(e) => handleColorChange('background', e.target.value)}
                                                                className="w-16 h-10"
                                                            />
                                                            <Input
                                                                value={colors.background}
                                                                onChange={(e) => handleColorChange('background', e.target.value)}
                                                                placeholder="#ffffff or gradient"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="text-color">Text Color</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="text-color"
                                                                type="color"
                                                                value={colors.text}
                                                                onChange={(e) => handleColorChange('text', e.target.value)}
                                                                className="w-16 h-10"
                                                            />
                                                            <Input
                                                                value={colors.text}
                                                                onChange={(e) => handleColorChange('text', e.target.value)}
                                                                placeholder="#000000"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Color Presets */}
                                                <div className="mt-6">
                                                    <Label className="mb-2 block">Color Presets</Label>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {Object.entries(THEME_TEMPLATES).map(([key, template]) => (
                                                            <Button
                                                                key={key}
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setColors(template.colors);
                                                                    setLayoutType(template.layoutType);
                                                                    setAllowedPlans(template.allowedPlans);
                                                                    setBannerStyle(template.bannerStyle || 'classic');
                                                                }}
                                                                className="text-xs"
                                                            >
                                                                {template.name}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Preview Tab */}
                                    <TabsContent value="preview">
                                        <ScrollArea className="h-[600px]">
                                            <ThemePreview
                                                theme={themeName}
                                                layout={currentLayout}
                                                colors={colors}
                                                layoutType={layoutType}
                                                currentLayout={currentLayout}
                                                bannerStyle={bannerStyle}
                                            />
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Custom Section Modal */}
            <CustomSectionModal
                isOpen={customSectionModal.open}
                onClose={() => setCustomSectionModal({ open: false, section: null })}
                onAdd={handleAddCustomSection}
                section={customSectionModal.section}
            />
        </div>
    );
};

const ThemeBuilder = (props) => (
    <DndProvider backend={HTML5Backend}>
        <ThemeBuilderInternal {...props} />
    </DndProvider>
);

export default ThemeBuilder;