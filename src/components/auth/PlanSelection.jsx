import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Check, X, Eye } from "lucide-react"
import Warm from "../../assets/Landing/images/2948b129-4e43-47d4-b0f5-2b4db8eec2e3.png"
import Cool from "../../assets/Landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png"
import Autumn from "../../assets/Landing/images/5e5bc4bb-31c3-4994-b66c-d53a887a3447.png"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";

const plans = [
    {
        id: "basic",
        name: "Basic",
        price: 9.99,
        features: [
            { name: "1 Memorial Page", included: true },
            { name: "Basic Customization", included: true },
            { name: "Photo Gallery (20 photos)", included: true },
            { name: "Visitor Comments", included: false },
            { name: "Video Support", included: false }
        ]
    },
    {
        id: "standard",
        name: "Standard",
        price: 19.99,
        features: [
            { name: "3 Memorial Pages", included: true },
            { name: "Advanced Customization", included: true },
            { name: "Photo Gallery (100 photos)", included: true },
            { name: "Visitor Comments", included: true },
            { name: "Video Support (1 video)", included: true }
        ]
    },
    {
        id: "premium",
        name: "Premium",
        price: 29.99,
        features: [
            { name: "Unlimited Memorial Pages", included: true },
            { name: "Full Customization", included: true },
            { name: "Unlimited Photo Gallery", included: true },
            { name: "Visitor Comments", included: true },
            { name: "Unlimited Video Support", included: true }
        ]
    }
]

const themes = [
    { id: 1, name: "Warm", color: "#FFA07A", image: Warm, title: "Warm" },
    { id: 2, name: "Cool", color: "#00BFFF", image: Cool, title: "Cool" },
    { id: 3, name: "Autumn", color: "#FF7F50", image: Autumn, title: "Autumn" }
]

const FeatureItem = ({ included, name }) => (
    <div className="flex items-center space-x-2">
        {included ? (
            <Check className="min-w-[20px] w-5 h-5 text-green-500" />
        ) : (
            <X className="min-w-[20px] w-5 h-5 text-red-500" />
        )}
        <span className={included ? "text-foreground" : "text-muted-foreground"}>
      {name}
    </span>
    </div>
)

export default function PlanSelection({ onSubmit }) {
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [selectedTheme, setSelectedTheme] = useState(null)
    const [previewTheme, setPreviewTheme] = useState(null)

    const handleSubmit = e => {
        e.preventDefault()
        if (!selectedPlan || !selectedTheme) {
            alert("Please select a plan and theme")
            return
        }
        const selectedPlanObj = plans.find(plan => plan.id === selectedPlan);
        const amount = selectedPlanObj ? selectedPlanObj.price : 0;
        onSubmit({ plan: selectedPlan, theme: selectedTheme, amount: amount })
    }

    const handlePreview = theme => {
        setPreviewTheme(theme)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 w-full max-w-7xl mx-auto px-4 py-6 sm:py-8"
        >
            {/* Header Section */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">
                    Select Your Plan and Theme
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                    Choose the perfect plan and theme to honor your loved one's memory.
                </p>
            </div>

            {/* Plans Section */}
            <section className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold">Choose a Plan</h3>
                <RadioGroup
                    onValueChange={setSelectedPlan}
                    required
                    className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {plans.map(plan => (
                        <div key={plan.id} className="w-full">
                            <RadioGroupItem
                                value={plan.id}
                                id={plan.id}
                                className="peer sr-only"
                            />
                            <Label htmlFor={plan.id} className="block cursor-pointer h-full">
                                <Card
                                    className={`h-full transition-all duration-300 ${
                                        selectedPlan === plan.id
                                            ? "border-primary ring-2 ring-primary"
                                            : "hover:border-primary/50"
                                    }`}
                                >
                                    <CardHeader className="space-y-1">
                                        <CardTitle className="text-lg sm:text-xl">
                                            {plan.name}
                                        </CardTitle>
                                        <CardDescription>
                                          <span className="text-xl sm:text-2xl font-bold">
                                            ₦{plan.price}/monthly
                                          </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <FeatureItem key={index} {...feature} />
                                        ))}
                                    </CardContent>
                                </Card>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </section>

            {/* Themes Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-warm-700">Select Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themes.map(theme => (
                        <Card
                            key={theme.id} // Changed from theme.name to theme.id
                           className={`cursor-pointer transition-all ${
                                selectedTheme === theme.name ? "ring-2 ring-warm-500" : ""
                            }`}
                            onClick={() => setSelectedTheme(theme.name)}
                        >
                            <div
                                className="aspect-video relative group"
                                style={{ backgroundColor: theme.color }}
                            >
                                <img
                                    src={theme.image || "/placeholder.svg"}
                                    alt={theme.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        onClick={e => {
                                            e.preventDefault()
                                            handlePreview({
                                                id: theme.id,
                                                name: theme.name,
                                                title: theme.title,
                                                url: `/${theme.name}/${theme.id}/${theme.title}`
                                            })
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-warm-700">{theme.name}</h4>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <Button type="submit" className="w-full max-w-md mx-auto block">
                    Proceed to Payment
                </Button>
            </div>

            {/* Theme Preview Modal */}
            {previewTheme && (
                <ThemePreviewModal
                    isOpen={!!previewTheme}
                    onClose={() => setPreviewTheme(null)}
                    theme={previewTheme}
                />
            )}
        </form>
    )
}

const ThemePreviewModal = ({ theme, onClose }) => {
    if (!theme) return null

    return (
        <Dialog open={!!theme} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-6xl h-[90vh] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        {theme.name} Theme Preview
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 flex-1 h-full">
                    <iframe
                        src={theme.url}
                        title={`${theme.name} Preview`}
                        className="w-full h-[calc(90vh-8rem)] border-0 rounded-lg"
                    />
                </div>
                <DialogClose asChild>
                    <Button variant="outline">Close Preview</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}