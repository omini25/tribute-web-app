"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Eye, ChevronDown, ChevronUp, Palette, Layout } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { server } from "@/server.js";
import ThemePreviewModal from "@/components/ThemePreviewModal";

// Import images
import SerenityImg from "../../assets/Landing/images/2948b129-4e43-47d4-b0f5-2b4db8eec2e3.png"
import ClassicImg from "../../assets/Landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png"
import VibrantImg from "../../assets/Landing/images/5e5bc4bb-31c3-4994-b66c-d53a887a3447.png"
// Re-using existing images for new themes as placeholders
import ModernImg from "../../assets/Landing/images/5e5bc4bb-31c3-4994-b66c-d53a887a3447.png"
import CelestialImg from "../../assets/Landing/images/2948b129-4e43-47d4-b0f5-2b4db8eec2e3.png"

const themeImages = {
    serenity: SerenityImg,
    classic: ClassicImg,
    vibrant: VibrantImg,
    modern: ModernImg,
    celestial: CelestialImg,
};

// Plan definitions that match the backend allowed_plans
const plans = [
    {
        id: "free",
        name: "Free Plan",
        description: "Start simple, honour sincerely. Limited features and duration.",
        price: {}, // N0
        features: [
            { name: "2 Tributes", included: "2" },
            { name: "Photo Gallery (Up to 20 photos)", included: "Up to 20" },
            { name: "Videos (Up to 3 videos)", included: "Up to 3" },
            { name: "Audio Uploads", included: true },
            { name: "Basic Customisation", included: true },
            { name: "Share Memories", included: true },
            { name: "Event Posts (Up to 3 events)", included: "Up to 3" },
            { name: "Visitor Guestbook", included: true },
            { name: "Timeline of Events, Family Members, Milestones", included: true },
            { name: "Themes", included: "Free Themes" },
            { name: "Tribute Duration", included: "N/A" },
            { name: "Donation Collection", included: false },
            { name: "RSVPs for Events", included: false },
            { name: "Technical Support", included: false },
            { name: "Privacy Controls & Background Music", included: false },
            { name: "Custom User Roles & Custom Domain", included: false },
        ],
    },
    {
        id: "premium",
        name: "Premium Plan",
        description: "Full flexibility and ongoing support with unlimited features.",
        popular: true,
        price: { monthly: 1000 }, // ₦1,000/month
        features: [
            { name: "Tributes", included: "3" },
            { name: "Unlimited Photos, Videos, & Audio Uploads", included: true },
            { name: "Donation Collection Enabled", included: true },
            { name: "Privacy Controls & Background Music", included: true },
            { name: "Guestbook Moderation + RSVPs", included: true },
            { name: "Priority Technical Support", included: true },
            { name: "Unlimited Event Posts", included: true },
            { name: "Basic Customisation & Premium Themes", included: true },
            { name: "Tribute Duration", included: "Monthly Subscription" },
            { name: "Custom User Roles", included: true },
            { name: "Custom Domain", included: false },
        ],
    },
    {
        id: "one_time",
        name: "One-Time Plan",
        description: "Temporary tribute with all premium features, valid for 30 days.",
        price: { oneTime: 1500 }, // ₦1,500 once
        features: [
            { name: "Tribute valid for 30 days", included: "1" },
            { name: "Unlimited Media Uploads", included: true },
            { name: "Donation Collection Enabled", included: true },
            { name: "All Premium Design Tools & Themes", included: true },
            { name: "Guestbook + RSVP Support", included: true },
            { name: "Privacy Settings Included", included: true },
            { name: "Technical Support", included: true },
            { name: "Tribute Duration", included: "30 days only" },
            { name: "Custom User Roles & Custom Domain", included: false },
        ],
    },
    {
        id: "lifetime",
        name: "Lifetime Plan",
        description: "A tribute that lasts forever with a one-time payment.",
        price: { oneTime: 15000 }, // ₦15,000 once
        features: [
            { name: "Tribute that Never Expires", included: "1" },
            { name: "Unlimited Media + All Features", included: true },
            { name: "Donation Collection Enabled", included: true },
            { name: "Guestbook, Privacy, RSVP, Music", included: true },
            { name: "Custom User Roles", included: true },
            { name: "One-time payment, lifelong presence", included: true },
            { name: "Premium Themes & Priority Support", included: true },
            { name: "Custom Domain", included: false },
        ],
    },
];

const FeatureItem = ({ included, name }) => {
    let icon = null;
    let text = name;
    let className = "text-foreground";

    if (included === true) {
        icon = <Check className="min-w-[20px] w-5 h-5 text-green-500" />;
    } else if (included === false) {
        icon = <X className="min-w-[20px] w-5 h-5 text-red-500" />;
        className = "text-muted-foreground";
    } else if (typeof included === 'string') {
        icon = <Check className="min-w-[20px] w-5 h-5 text-green-500" />;
        text = `${name}: ${included}`;
    }

    return (
        <div className="flex items-center space-x-2 py-1.5">
            {icon}
            <span className={className}>{text}</span>
        </div>
    );
};

export default function PlanSelection({ onSubmit }) {
    const [selectedPlanId, setSelectedPlanId] = useState(() => {
        const savedData = localStorage.getItem("signupFormData");
        return savedData ? JSON.parse(savedData).plan : null;
    });

    const [billingPeriod, setBillingPeriod] = useState("monthly");
    const [selectedThemeId, setSelectedThemeId] = useState(null);
    const [previewTheme, setPreviewTheme] = useState(null);
    const [expandedFeatures, setExpandedFeatures] = useState({});
    const [allThemes, setAllThemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${server}/themes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const themesData = await response.json();
                const themesFromBackend = themesData.data || [];

                // Map backend themes to include images and normalize data
                const themesWithImages = themesFromBackend.map(theme => ({
                    id: theme.id,
                    name: theme.name,
                    description: theme.description || "A beautiful memorial theme",
                    allowed_plans: theme.allowed_plans || ['free'],
                    colors: theme.colors || {
                        primary: '#1f2937',
                        background: '#f9fafb',
                        card: '#ffffff',
                        text: '#374151',
                        accent: '#4f46e5'
                    },
                    layout_type: theme.layout_type || 'single',
                    image: themeImages[theme.id] || themeImages.serenity, // Fallback image
                    is_active: theme.is_active !== false
                }));

                setAllThemes(themesWithImages.filter(theme => theme.is_active));
            } catch (error) {
                console.error("Failed to fetch themes:", error);
                toast.error("Could not load themes. Please try again later.");
                // Fallback to default themes if API fails
                setAllThemes(getDefaultThemes());
            } finally {
                setLoading(false);
            }
        };

        fetchThemes();
    }, []);

    const selectedPlan = useMemo(() =>
            plans.find(p => p.id === selectedPlanId) || null,
        [selectedPlanId]);

    // Filter themes based on selected plan's allowed_plans
    const availableThemes = useMemo(() => {
        if (!selectedPlanId) return [];
        return allThemes.filter(theme =>
            theme.allowed_plans.includes(selectedPlanId)
        );
    }, [selectedPlanId, allThemes]);

    const handlePlanChange = (planId) => {
        setSelectedPlanId(planId);

        // Reset theme selection if current selection is not available in new plan
        if (selectedThemeId) {
            const newAvailableThemes = allThemes.filter(theme =>
                theme.allowed_plans.includes(planId)
            );
            const isCurrentThemeAvailable = newAvailableThemes.some(theme => theme.id === selectedThemeId);
            if (!isCurrentThemeAvailable) {
                setSelectedThemeId(null);
            }
        }

        const existingData = JSON.parse(localStorage.getItem("signupFormData") || "{}");
        localStorage.setItem(
            "signupFormData",
            JSON.stringify({
                ...existingData,
                plan: planId,
            }),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPlanId || !selectedThemeId) {
            toast.error("Please select a plan and a theme.");
            return;
        }

        const selectedPlanObj = plans.find((plan) => plan.id === selectedPlanId);
        let amount = 0;

        if (selectedPlanObj) {
            if (selectedPlanObj.price.monthly) {
                amount = selectedPlanObj.price.monthly;
            } else if (selectedPlanObj.price.oneTime) {
                amount = selectedPlanObj.price.oneTime;
            }
        }

        onSubmit({
            plan: selectedPlanId,
            theme: selectedThemeId,
            amount: amount,
            billingPeriod: selectedPlanObj.price.monthly ? billingPeriod : undefined,
        });

        localStorage.removeItem("signupFormData");
    };

    const handlePreview = (theme) => {
        setPreviewTheme(theme);
    };

    const isThemeSelectable = (theme) => {
        if (!selectedPlanId) return false;
        return theme.allowed_plans.includes(selectedPlanId);
    };

    const getPriceDisplay = (plan) => {
        const formatNaira = (amount) => {
            return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
        };

        if (plan.price.oneTime) {
            return `${formatNaira(plan.price.oneTime)} (one-time)`;
        }
        if (plan.price.monthly) {
            return `${formatNaira(plan.price.monthly)}/month`;
        }
        return "₦0 (Free)";
    };

    const toggleFeatures = (planId) => {
        setExpandedFeatures((prev) => ({
            ...prev,
            [planId]: !prev[planId],
        }));
    };

    // Get default themes for fallback
    const getDefaultThemes = () => [
        {
            id: "minimalist",
            name: "Minimalist",
            description: "Clean and simple design with elegant typography",
            allowed_plans: ['free', 'premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#1f2937',
                background: '#f9fafb',
                card: '#ffffff',
                text: '#374151',
                accent: '#4f46e5'
            },
            layout_type: 'single',
            image: themeImages.serenity
        },
        {
            id: "classic",
            name: "Classic",
            description: "Traditional design with warm, comforting colors",
            allowed_plans: ['free', 'premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#7c2d12',
                background: '#fef7ed',
                card: '#ffffff',
                text: '#431407',
                accent: '#ea580c'
            },
            layout_type: 'single',
            image: themeImages.classic
        },
        {
            id: "modern",
            name: "Modern",
            description: "Contemporary design with bold colors and layout",
            allowed_plans: ['premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#1e40af',
                background: '#eff6ff',
                card: '#ffffff',
                text: '#1e3a8a',
                accent: '#3b82f6'
            },
            layout_type: 'tabs',
            image: themeImages.modern
        },
        {
            id: "vibrant",
            name: "Vibrant",
            description: "Colorful and energetic design celebrating life",
            allowed_plans: ['premium', 'one_time', 'lifetime'],
            colors: {
                primary: '#7c3aed',
                background: '#faf5ff',
                card: '#ffffff',
                text: '#5b21b6',
                accent: '#8b5cf6'
            },
            layout_type: 'single',
            image: themeImages.vibrant
        },
        {
            id: "celestial",
            name: "Celestial",
            description: "Elegant design with celestial motifs and dark theme",
            allowed_plans: ['lifetime'],
            colors: {
                primary: '#1e1b4b',
                background: '#0f172a',
                card: '#1e293b',
                text: '#e2e8f0',
                accent: '#6366f1'
            },
            layout_type: 'single',
            image: themeImages.celestial
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcd34d] mx-auto"></div>
                    <p className="mt-4 text-[#4a5568]">Loading plans and themes...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 w-full max-w-7xl mx-auto px-4 py-8 sm:py-12">
            <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-serif text-[#2a3342]">Select Your Plan and Theme</h2>
                <p className="text-base text-[#4a5568] max-w-2xl mx-auto">
                    Choose the perfect plan and theme to honour your loved one's memory. Theme availability depends on your selected plan.
                </p>
            </div>

            <section className="space-y-6">
                <h3 className="text-2xl font-serif text-[#2a3342]">Choose a Plan</h3>
                <RadioGroup
                    value={selectedPlanId}
                    onValueChange={handlePlanChange}
                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {plans.map((plan) => {
                        const initialFeatures = plan.features.slice(0, 5);
                        const extraFeatures = plan.features.slice(5);
                        const showViewMore = extraFeatures.length > 0;
                        const isExpanded = expandedFeatures[plan.id];

                        return (
                            <div key={plan.id} className="w-full">
                                <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                                <Label htmlFor={plan.id} className="block cursor-pointer h-full">
                                    <Card
                                        className={`h-full transition-all duration-300 ${
                                            selectedPlanId === plan.id
                                                ? "border-[#fcd34d] ring-2 ring-[#fcd34d] shadow-lg"
                                                : "hover:border-[#fcd34d]/50 hover:shadow-md"
                                        } ${plan.popular ? "relative" : ""}`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 right-4 bg-[#fcd34d] text-white text-xs px-3 py-1 rounded-full">
                                                Popular
                                            </div>
                                        )}
                                        <CardHeader className="space-y-2">
                                            <CardTitle className="text-xl text-[#2a3342]">{plan.name}</CardTitle>
                                            <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                                            <div className="pt-2">
                                                <span className="text-2xl font-bold text-[#2a3342]">{getPriceDisplay(plan)}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-1">
                                            {initialFeatures.map((feature, index) => (
                                                <FeatureItem key={index} {...feature} />
                                            ))}

                                            {isExpanded &&
                                                extraFeatures.map((feature, index) => <FeatureItem key={`extra-${index}`} {...feature} />)}
                                        </CardContent>

                                        {showViewMore && (
                                            <CardFooter className="pt-0 pb-4">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full text-[#fcd34d] hover:text-[#645a52] hover:bg-[#f5f0ea]"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFeatures(plan.id);
                                                    }}
                                                >
                                                    {isExpanded ? (
                                                        <span className="flex items-center">
                                                          View Less <ChevronUp className="ml-1 h-4 w-4" />
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                          View More <ChevronDown className="ml-1 h-4 w-4" />
                                                        </span>
                                                    )}
                                                </Button>
                                            </CardFooter>
                                        )}
                                    </Card>
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-serif text-[#2a3342]">Select a Theme</h3>
                    {selectedPlan && (
                        <div className="text-sm text-[#4a5568]">
                            {availableThemes.length} theme{availableThemes.length !== 1 ? 's' : ''} available for {selectedPlan.name}
                        </div>
                    )}
                </div>

                {!selectedPlanId ? (
                    <div className="text-center py-12 bg-[#f8f4f0] rounded-lg">
                        <Palette className="h-12 w-12 text-[#fcd34d] mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-[#2a3342] mb-2">Select a Plan First</h4>
                        <p className="text-[#4a5568]">Please choose a plan above to see available themes</p>
                    </div>
                ) : availableThemes.length === 0 ? (
                    <div className="text-center py-12 bg-[#f8f4f0] rounded-lg">
                        <Palette className="h-12 w-12 text-[#fcd34d] mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-[#2a3342] mb-2">No Themes Available</h4>
                        <p className="text-[#4a5568]">No themes are available for the selected plan. Please select a different plan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableThemes.map((theme) => {
                            const isSelected = selectedThemeId === theme.id;

                            return (
                                <div key={theme.id}>
                                    <Card
                                        className={`transition-all cursor-pointer ${
                                            isSelected
                                                ? "ring-2 ring-[#fcd34d] shadow-md"
                                                : "hover:border-[#fcd34d]/50 hover:shadow-sm"
                                        }`}
                                        onClick={() => setSelectedThemeId(theme.id)}
                                    >
                                        <div className="aspect-video relative group overflow-hidden rounded-t-lg">
                                            <img
                                                src={theme.image}
                                                alt={theme.name}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handlePreview(theme);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Preview
                                                </Button>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-3 left-3 bg-[#fcd34d] text-white rounded-full p-1">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-[#2a3342]">{theme.name}</h4>
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {theme.layout_type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>

                                            {/* Color Palette Preview */}
                                            <div className="flex space-x-1 mb-2">
                                                {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-6 h-6 rounded border flex-1"
                                                        style={{ backgroundColor: color }}
                                                        title={color}
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-[#4a5568]">
                                                <div className="flex items-center">
                                                    <Layout className="h-3 w-3 mr-1" />
                                                    {theme.layout_type === 'tabs' ? 'Tabbed Layout' : 'Single Page'}
                                                </div>
                                                <div className="flex items-center">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Click to select
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {selectedPlan && availableThemes.length > 0 && (
                <div className="bg-[#f8f4f0] p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Palette className="h-5 w-5 text-[#fcd34d] mr-2" />
                        <h3 className="text-xl font-medium text-[#2a3342]">Theme Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4a5568]">
                        <div>
                            <p><strong>Selected Plan:</strong> {selectedPlan.name}</p>
                            <p><strong>Available Themes:</strong> {availableThemes.length}</p>
                        </div>
                        <div>
                            <p><strong>Selected Theme:</strong> {selectedThemeId ? allThemes.find(t => t.id === selectedThemeId)?.name : 'None'}</p>
                            <p><strong>Layout Type:</strong> {selectedThemeId ? allThemes.find(t => t.id === selectedThemeId)?.layout_type : 'N/A'}</p>
                        </div>
                    </div>
                    <p className="text-sm text-[#4a5568] mt-3">
                        You can always change your theme later in the tribute settings. Higher-tier plans unlock more premium themes.
                    </p>
                </div>
            )}

            <div className="pt-6">
                <Button
                    type="submit"
                    className={`
                        w-full max-w-md mx-auto block
                        bg-[#fcd34d] hover:bg-[#e6b52f] active:bg-[#d4a01c]
                        text-black font-medium
                        text-lg
                        rounded-lg
                        transition-all duration-200
                        shadow-md hover:shadow-lg
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#fcd34d]
                        focus:outline-none focus:ring-2 focus:ring-[#fcd34d] focus:ring-offset-2
                    `}
                    disabled={!selectedPlanId || !selectedThemeId}
                >
                    {selectedPlanId === "free" ? "Complete Signup" : "Proceed to Payment"}
                </Button>
            </div>

            {previewTheme && (
                <ThemePreviewModal theme={previewTheme} onClose={() => setPreviewTheme(null)} />
            )}
        </form>
    );
}