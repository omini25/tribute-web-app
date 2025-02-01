import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
    {
        id: "basic",
        name: "Basic",
        price: "₦9.99/month",
        features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
        id: "standard",
        name: "Standard",
        price: "₦19.99/month",
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    },
    {
        id: "premium",
        name: "Premium",
        price: "₦29.99/month",
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6", "Feature 7"],
    },
]

const themes = [
    {
        id: "classic",
        name: "Classic",
        image: "/images/classic-theme.jpg", // Path to your image
    },
    {
        id: "modern",
        name: "Modern",
        image: "/images/modern-theme.jpg",  // Path to your image
    },
    {
        id: "nature",
        name: "Nature",
        image: "/images/nature-theme.jpg", // Path to your image
    },
];

export default function PlanSelection({ onSubmit }) {
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [selectedTheme, setSelectedTheme] = useState(null)

    const handleSubmit = e => {
        e.preventDefault()
        if (!selectedPlan || !selectedTheme) {
            alert("Please select a plan and theme")
            return
        }
        onSubmit({ plan: selectedPlan, theme: selectedTheme })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-2xl font-semibold">Select Plan and Theme</h2>

            <div>
                <h3 className="mb-4 text-lg font-medium">Choose a Plan</h3>
                <RadioGroup onValueChange={setSelectedPlan} required>
                    <div className="grid gap-4 md:grid-cols-3">
                        {plans.map(plan => (
                            <Card key={plan.id} className="border-primary shadow-lg"> {/* Added Card components */}
                                <CardHeader> {/* Added CardHeader */}
                                    <CardTitle>{plan.name}</CardTitle> {/* Added title */}
                                    <CardDescription>
                                        {plan.price}
                                    </CardDescription> {/* Added price */}
                                </CardHeader>
                                <CardContent className="pt-2 space-y-1"> {/* Added CardContent */}

                                    <RadioGroupItem value={plan.id} id={plan.id} className="sr-only peer" />
                                    <Label htmlFor={plan.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground">
                                        <Check className="w-4 h-4" />
                                        <div className="grid gap-1">
                                            {plan.features.map((feature, index) => (
                                                <p key={index} className="text-sm">
                                                    {feature}
                                                </p>
                                            ))}
                                        </div>
                                    </Label>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </RadioGroup>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-medium">Choose a Theme</h3>
                <RadioGroup onValueChange={setSelectedTheme} required>
                    <div className="grid gap-4 md:grid-cols-3">
                        {themes.map((theme) => (
                            <Card key={theme.id}>
                                <CardContent className="relative pt-6 group">
                                    <RadioGroupItem
                                        value={theme.id}
                                        id={theme.id}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={theme.id}
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4  peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary relative group"
                                    >
                                        <div className="w-full h-40 overflow-hidden rounded-md mb-4">
                                            <img
                                                src={theme.image}
                                                alt={theme.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <span className="text-lg font-semibold">{theme.name}</span>

                                    </Label>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
                Proceed to Payment
            </Button>
        </form>
    )
}
